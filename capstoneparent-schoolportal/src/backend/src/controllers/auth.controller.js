const authService = require("../services/auth.service");
const parentsService = require("../services/parents.service");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const authController = {
  /**
   * POST /register
   * Validates data and sends a verification OTP. Does NOT write to the DB yet.
   */
  async register(req, res, next) {
    try {
      const files = req.files || [];
      const userData = req.body;

      if (userData.student_ids && !userData.role) {
        userData.role = "Parent";
      }

      const result = await authService.initiateRegistration(userData, files);

      res.status(200).json({ message: result.message });
    } catch (error) {
      if (error.message === "User with this email already exists") {
        return res.status(409).json({ message: error.message });
      }
      if (error.message.startsWith("A verification email was already sent")) {
        return res.status(409).json({ message: error.message });
      }
      if (error.message === "Failed to send OTP email") {
        return res.status(502).json({ message: error.message });
      }
      next(error);
    }
  },

  /**
   * POST /verify-registration-otp
   * Verifies the OTP and finalises account creation (status: Inactive).
   */
  async verifyRegistrationOTP(req, res, next) {
    try {
      const { email, otpCode } = req.body;
      const result = await authService.verifyRegistrationOTP(
        email,
        otpCode,
        parentsService,
      );

      res.status(201).json({
        message: result.message,
        data: {
          user: result.user,
          deviceToken: result.deviceToken,
        },
      });
    } catch (error) {
      if (error.message.startsWith("No pending registration found")) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Invalid or expired OTP") {
        return res.status(401).json({ message: error.message });
      }
      if (error.message === "One or more students not found") {
        return res.status(404).json({ message: error.message });
      }
      if (
        error.message === "Parent already has an active or pending registration"
      ) {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  },

  /**
   * POST /login
   *
   * Two possible outcomes:
   *   1. Trusted device supplied → JWT issued immediately, cookie set.
   *   2. Unknown/missing device  → { requiresOTP: true } returned.
   *      Client must call POST /send-otp then POST /verify-otp to complete login.
   */
  async login(req, res, next) {
    try {
      const { email, password, deviceToken } = req.body;
      const result = await authService.login(email, password, deviceToken);

      if (result.requiresOTP) {
        return res.status(200).json({
          message: "OTP required. Please check your email.",
          data: { requiresOTP: true },
        });
      }

      res.cookie("token", result.token, COOKIE_OPTIONS);
      res.status(200).json({ message: "Login successful", data: result });
    } catch (error) {
      if (error.message === "Invalid email or password") {
        return res.status(401).json({ message: error.message });
      }
      if (error.message.startsWith("Account is inactive")) {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  },

  async sendOTP(req, res, next) {
    try {
      const { email } = req.body;
      await authService.sendOTP(email);
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Failed to send OTP email") {
        return res.status(502).json({ message: error.message });
      }
      next(error);
    }
  },

  /**
   * POST /verify-otp
   * Completes the OTP challenge after an untrusted-device login.
   * Issues a JWT, sets the auth cookie, and returns the new raw deviceToken
   * for the client to store and supply on future logins.
   */
  async verifyOTP(req, res, next) {
    try {
      const { email, otpCode } = req.body;
      const result = await authService.verifyOTP(email, otpCode);

      res.cookie("token", result.token, COOKIE_OPTIONS);
      res.status(200).json({
        message: "OTP verified successfully",
        data: {
          token: result.token,
          user: result.user,
          deviceToken: result.deviceToken,
        },
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Invalid or expired OTP") {
        return res.status(401).json({ message: error.message });
      }
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  },

  async getCurrentUser(req, res, next) {
    try {
      res.status(200).json({ data: req.user });
    } catch (error) {
      next(error);
    }
  },

  async getTrustedDevices(req, res, next) {
    try {
      const devices = await authService.getTrustedDevices(req.user.user_id);
      res.status(200).json({ data: devices });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },

  async removeTrustedDevice(req, res, next) {
    try {
      const tdId = parseInt(req.params.id, 10);
      await authService.removeTrustedDevice(req.user.user_id, tdId);
      res.status(200).json({ message: "Trusted device removed" });
    } catch (error) {
      if (error.message === "Trusted device not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },
};

module.exports = authController;
