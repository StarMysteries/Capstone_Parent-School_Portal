const jwt = require("jsonwebtoken");
const prisma = require("../config/database");
const {
  hashPassword,
  comparePassword,
  generateOTP,
  generateDeviceToken,
  hashDeviceToken,
} = require("../utils/hashUtil");
const { sendOTPEmail } = require("../utils/emailUtil");

// Temporary store for pending registrations (keyed by email, TTL = 10 min)
const pendingRegistrations = new Map();

const PENDING_TTL_MS = 10 * 60 * 1000; // 10 minutes

function storePendingRegistration(email, data) {
  pendingRegistrations.set(email, {
    ...data,
    expiresAt: Date.now() + PENDING_TTL_MS,
  });
}

function getPendingRegistration(email) {
  const entry = pendingRegistrations.get(email);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    pendingRegistrations.delete(email);
    return null;
  }
  return entry;
}

function clearPendingRegistration(email) {
  pendingRegistrations.delete(email);
}

/** Sign a JWT for a given user */
function signToken(user) {
  return jwt.sign(
    { userId: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" },
  );
}

const authService = {
  /**
   * Step 1 of registration: validate uniqueness, persist files if any,
   * store data temporarily, and send a verification OTP.
   * The user record is NOT written to the DB yet.
   */
  async initiateRegistration(userData, files = []) {
    const {
      email,
      password,
      fname,
      lname,
      contact_num,
      address,
      role,
      student_ids,
    } = userData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    if (getPendingRegistration(email)) {
      throw new Error(
        "A verification email was already sent. Please check your inbox.",
      );
    }

    const hashedPassword = await hashPassword(password);

    storePendingRegistration(email, {
      email,
      hashedPassword,
      fname,
      lname,
      contact_num,
      address,
      role: role || (student_ids ? "Parent" : undefined),
      student_ids,
      filePaths: files.map((f) => ({
        originalname: f.originalname,
        path: f.path,
        mimetype: f.mimetype,
        size: f.size,
      })),
    });

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + PENDING_TTL_MS);

    storePendingRegistration(email, {
      ...getPendingRegistration(email),
      otpCode,
      otpExpiresAt: expiresAt.getTime(),
    });

    const emailSent = await sendOTPEmail(email, otpCode);
    if (!emailSent) {
      clearPendingRegistration(email);
      throw new Error("Failed to send OTP email");
    }

    return {
      message:
        "Verification OTP sent. Please verify your email to complete registration.",
    };
  },

  /**
   * Step 2 of registration: verify OTP then finalise account creation.
   *
   * DB write order is dictated by FK constraints — every step depends on the
   * row created by the step before it:
   *
   *   1. prisma.user.create
   *        → User row exists; its user_id can now be used as a FK.
   *
   *   2. prisma.userRole_Model.create  (if a role was supplied)
   *        → user_id FK satisfied by step 1.
   *
   *   3. parentsService.createFiles(pending.filePaths, user.user_id)
   *        → Uploads each file to Supabase Storage, receives a permanent
   *          public URL, and writes a File row with:
   *            file_path  = public URL   (readable immediately, no signing)
   *            uploaded_by = user.user_id (FK → User — satisfied by step 1)
   *        → Returns the created File rows including their file_ids.
   *
   *   4. parentsService.submitRegistration({ parent_id, student_ids, file_ids })
   *        → Creates ParentRegistration  (parent_id FK → User — step 1)
   *        → Creates ParentChildFile rows (file_id FK → File — step 3,
   *                                        pr_id FK → ParentRegistration — same tx)
   *
   *   5. prisma.userTrustedDevice.create
   *        → user_id FK → User — step 1.
   *
   * Returns the RAW deviceToken to the client; only the hash is stored in DB.
   */
  async verifyRegistrationOTP(email, otpCode, parentsService) {
    const pending = getPendingRegistration(email);
    if (!pending) {
      throw new Error(
        "No pending registration found or it has expired. Please register again.",
      );
    }

    if (Date.now() > pending.otpExpiresAt) {
      clearPendingRegistration(email);
      throw new Error("Invalid or expired OTP");
    }

    if (pending.otpCode !== otpCode) {
      throw new Error("Invalid or expired OTP");
    }

    // Clear the pending entry immediately after the OTP is accepted.
    // This must happen BEFORE any DB writes so that a second submission of
    // the same OTP (e.g. double-click, network retry) finds no pending entry
    // and gets a "No pending registration found" error instead of racing into
    // prisma.user.create and hitting a unique constraint violation (P2002).
    clearPendingRegistration(email);

    // Guard: if a previous attempt already created the user (e.g. the DB
    // write succeeded but the response was lost), return a clear error instead
    // of letting Prisma throw a cryptic unique constraint failure.
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email already registered. Please log in instead.");
    }

    const user = await prisma.user.create({
      data: {
        email: pending.email,
        password: pending.hashedPassword,
        fname: pending.fname,
        lname: pending.lname,
        contact_num: pending.contact_num,
        address: pending.address,
        account_status: "Inactive",
      },
      select: {
        user_id: true,
        email: true,
        fname: true,
        lname: true,
        contact_num: true,
        address: true,
        account_status: true,
        created_at: true,
      },
    });

    if (pending.role) {
      await prisma.userRole_Model.create({
        data: { user_id: user.user_id, role: pending.role },
      });
    }

    if (pending.role === "Parent" && pending.student_ids && parentsService) {
      let file_ids;
      if (pending.filePaths.length > 0) {
        const created = await parentsService.createFiles(
          pending.filePaths,
          user.user_id,
        );
        file_ids = created.map((f) => f.file_id);
      }
      await parentsService.submitRegistration({
        parent_id: user.user_id,
        student_ids: pending.student_ids,
        file_ids,
      });
    }

    clearPendingRegistration(email); // already called above — kept as no-op safety net

    // Generate raw token for client; store only the hash in DB
    const rawToken = generateDeviceToken();
    await prisma.userTrustedDevice.create({
      data: {
        user_id: user.user_id,
        device_token: hashDeviceToken(rawToken),
        last_used_at: new Date(),
      },
    });

    return {
      user,
      deviceToken: rawToken,
      message:
        "Email verified. Your account has been created and is pending activation by an administrator.",
    };
  },

  /**
   * Login flow:
   *   - Always validate email + password first.
   *   - If a deviceToken is supplied and matches a trusted device in the DB,
   *     issue a JWT immediately (trusted device bypass).
   *   - Otherwise return { requiresOTP: true } — the client must complete
   *     the OTP challenge via POST /send-otp then POST /verify-otp.
   */
  async login(email, password, deviceToken) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.account_status === "Inactive") {
      throw new Error(
        "Account is inactive. Please wait for an administrator to activate your account.",
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Check for a matching trusted device
    if (deviceToken) {
      const hashedToken = hashDeviceToken(deviceToken);
      const trustedDevice = await prisma.userTrustedDevice.findFirst({
        where: { user_id: user.user_id, device_token: hashedToken },
      });

      if (trustedDevice) {
        // Refresh last_used_at
        await prisma.userTrustedDevice.update({
          where: { td_id: trustedDevice.td_id },
          data: { last_used_at: new Date() },
        });

        const token = signToken(user);
        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
      }
    }

    // No valid trusted device — caller must complete OTP
    return { requiresOTP: true };
  },

  async sendOTP(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.userOTPCode.create({
      data: { user_id: user.user_id, otp_code: otpCode, expires_at: expiresAt },
    });

    const emailSent = await sendOTPEmail(email, otpCode);
    if (!emailSent) {
      throw new Error("Failed to send OTP email");
    }

    return true;
  },

  /**
   * Verify OTP, issue a JWT, and register a new trusted device.
   * Returns the RAW deviceToken to the client; the hash is stored in DB.
   */
  async verifyOTP(email, otpCode) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const otp = await prisma.userOTPCode.findFirst({
      where: {
        user_id: user.user_id,
        otp_code: otpCode,
        used: false,
        expires_at: { gt: new Date() },
      },
    });
    if (!otp) {
      throw new Error("Invalid or expired OTP");
    }

    await prisma.userOTPCode.update({
      where: { otp_id: otp.otp_id },
      data: { used: true },
    });

    // Register this device as trusted
    const rawToken = generateDeviceToken();
    await prisma.userTrustedDevice.create({
      data: {
        user_id: user.user_id,
        device_token: hashDeviceToken(rawToken),
        last_used_at: new Date(),
      },
    });

    const token = signToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword, deviceToken: rawToken };
  },

  /**
   * ✅ FIX: Removed redundant prisma.user.findUnique check.
   *
   * This method is only reachable via the `authenticate` middleware, which
   * already verifies the token, confirms the user exists in the DB, and
   * attaches the full user object to req.user. A second DB round-trip here
   * to check the same thing is wasteful and adds no safety.
   */
  async getTrustedDevices(userId) {
    return prisma.userTrustedDevice.findMany({
      where: { user_id: userId },
      orderBy: { last_used_at: "desc" },
    });
  },

  /**
   * ✅ FIX: Removed redundant prisma.user.findUnique check (same reason as above).
   *
   * The device ownership check (`user_id: userId` in the where clause) already
   * implicitly guarantees we only touch devices belonging to the authenticated
   * user. The prior explicit user lookup added nothing.
   */
  async removeTrustedDevice(userId, tdId) {
    const device = await prisma.userTrustedDevice.findFirst({
      where: { td_id: tdId, user_id: userId },
    });
    if (!device) throw new Error("Trusted device not found");

    await prisma.userTrustedDevice.delete({
      where: { td_id: tdId, user_id: userId },
    });
    return true;
  },
};

module.exports = authService;
