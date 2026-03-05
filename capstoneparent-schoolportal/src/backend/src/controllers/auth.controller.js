const authService = require("../services/auth.service");
const parentsService = require("../services/parents.service");

const authController = {
  async register(req, res, next) {
    try {
      const files = req.files || [];
      const userData = req.body;

      if (userData.student_ids && !userData.role) {
        userData.role = "Parent";
      }

      const result = await authService.register(userData);

      if (userData.role === "Parent" && userData.student_ids) {
        const parentId = result.user_id;
        let file_ids;
        if (files.length > 0) {
          const created = await parentsService.createFiles(files, parentId);
          file_ids = created.map((f) => f.file_id);
        }
        await parentsService.submitRegistration({
          parent_id: parentId,
          student_ids: userData.student_ids,
          file_ids,
        });
      }

      res.status(201).json({
        message:
          "User registered successfully. A verification OTP has been sent to your email.",
        data: result,
      });
    } catch (error) {
      if (error.message === "User with this email already exists") {
        return res.status(409).json({ message: error.message });
      }
      if (error.message === "One or more students not found") {
        return res.status(404).json({ message: error.message });
      }
      if (
        error.message === "Parent already has an active or pending registration"
      ) {
        return res.status(409).json({ message: error.message });
      }
      if (error.message === "Failed to send OTP email") {
        return res.status(502).json({ message: error.message });
      }
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password, deviceToken } = req.body;
      const result = await authService.login(email, password, deviceToken);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      if (error.message === "Invalid email or password") {
        return res.status(401).json({ message: error.message });
      }
      if (error.message === "Account is inactive") {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  },

  async sendOTP(req, res, next) {
    try {
      const { email } = req.body;
      await authService.sendOTP(email);

      res.status(200).json({
        message: "OTP sent successfully",
      });
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

  async verifyOTP(req, res, next) {
    try {
      const { email, otpCode } = req.body;
      const result = await authService.verifyOTP(email, otpCode);

      res.status(200).json({
        message: "OTP verified successfully",
        data: result,
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
      res.status(200).json({
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  },

  async getCurrentUser(req, res, next) {
    try {
      const user = req.user;
      res.status(200).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTrustedDevices(req, res, next) {
    try {
      const userId = req.user.user_id;
      const devices = await authService.getTrustedDevices(userId);

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
      const userId = req.user.user_id;
      const tdId = parseInt(req.params.id, 10);
      await authService.removeTrustedDevice(userId, tdId);

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
