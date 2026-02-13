const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { hashPassword, comparePassword, generateOTP, generateDeviceToken } = require('../utils/hashUtil');
const { sendOTPEmail } = require('../utils/emailUtil');

const authService = {
  async register(userData) {
    const { email, password, fname, lname, contact_num, address } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fname,
        lname,
        contact_num,
        address
      },
      select: {
        user_id: true,
        email: true,
        fname: true,
        lname: true,
        contact_num: true,
        address: true,
        account_status: true,
        created_at: true
      }
    });

    return user;
  },

  async login(email, password, deviceToken) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: true
      }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if account is active
    if (user.account_status === 'Inactive') {
      throw new Error('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Handle trusted device
    if (deviceToken) {
      await prisma.userTrustedDevice.upsert({
        where: { device_token: deviceToken },
        update: { last_used_at: new Date() },
        create: {
          user_id: user.user_id,
          device_token: deviceToken,
          last_used_at: new Date()
        }
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword
    };
  },

  async sendOTP(email) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await prisma.userOTPCode.create({
      data: {
        user_id: user.user_id,
        otp_code: otpCode,
        expires_at: expiresAt
      }
    });

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otpCode);
    
    if (!emailSent) {
      throw new Error('Failed to send OTP email');
    }

    return true;
  },

  async verifyOTP(email, otpCode) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Find valid OTP
    const otp = await prisma.userOTPCode.findFirst({
      where: {
        user_id: user.user_id,
        otp_code: otpCode,
        used: false,
        expires_at: {
          gt: new Date()
        }
      }
    });

    if (!otp) {
      throw new Error('Invalid or expired OTP');
    }

    // Mark OTP as used
    await prisma.userOTPCode.update({
      where: { otp_id: otp.otp_id },
      data: { used: true }
    });

    // Generate device token
    const deviceToken = generateDeviceToken();

    // Save trusted device
    await prisma.userTrustedDevice.create({
      data: {
        user_id: user.user_id,
        device_token: deviceToken,
        last_used_at: new Date()
      }
    });

    return {
      deviceToken,
      message: 'OTP verified successfully'
    };
  }
};

module.exports = authService;