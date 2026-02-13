const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validation");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("fname").notEmpty().trim(),
    body("lname").notEmpty().trim(),
    body("contact_num").notEmpty(),
    body("address").notEmpty(),
  ],
  validate,
  authController.register,
);

// Login
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  validate,
  authController.login,
);

// Send OTP
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

// Logout
router.post("/logout", authenticate, authController.logout);

// Get current user
router.get("/me", authenticate, authController.getCurrentUser);

module.exports = router;
