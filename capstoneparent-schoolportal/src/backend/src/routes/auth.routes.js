const express = require("express");
const { body, param } = require("express-validator");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validation");
const { authenticate } = require("../middlewares/auth");

const multer = require("multer");
const upload = multer({ dest: process.env.UPLOAD_PATH || "uploads/" });

const router = express.Router();

// Register (supports combined parent account + registration)
router.post(
  "/register",
  upload.array("attachments", 10),
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("fname").notEmpty().trim(),
    body("lname").notEmpty().trim(),
    body("contact_num").notEmpty(),
    body("address").notEmpty(),
    // optional role (default Parent when student_ids provided)
    body("role")
      .optional()
      .isIn([
        "Parent",
        "Librarian",
        "Teacher",
        "Admin",
        "Principal",
        "Vice_Principal",
      ]),
    // parent-specific fields
    body("student_ids").optional().isArray({ min: 1 }),
    body("student_ids.*").optional().isInt(),
  ],
  validate,
  authController.register,
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
    body("deviceToken").optional().isString().isLength({ min: 10 }),
  ],
  validate,
  authController.login,
);

// Send OTP (general purpose / email verification)
router.post(
  "/send-otp",
  [body("email").isEmail().normalizeEmail()],
  validate,
  authController.sendOTP,
);

// Verify OTP
router.post(
  "/verify-otp",
  [
    body("email").isEmail().normalizeEmail(),
    body("otpCode").isLength({ min: 6, max: 6 }),
  ],
  validate,
  authController.verifyOTP,
);

// alias endpoints for email verification clarity
router.post(
  "/send-email-otp",
  [body("email").isEmail().normalizeEmail()],
  validate,
  authController.sendOTP,
);

router.post(
  "/verify-email-otp",
  [
    body("email").isEmail().normalizeEmail(),
    body("otpCode").isLength({ min: 6, max: 6 }),
  ],
  validate,
  authController.verifyOTP,
);

// Logout
router.post("/logout", authenticate, authController.logout);

// Trusted devices management
router.get("/trusted-devices", authenticate, authController.getTrustedDevices);
router.delete(
  "/trusted-devices/:id",
  authenticate,
  param("id").isInt(),
  validate,
  authController.removeTrustedDevice,
);

// Get current user
router.get("/me", authenticate, authController.getCurrentUser);

module.exports = router;
