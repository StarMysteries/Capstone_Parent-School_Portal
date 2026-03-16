const rateLimit = require("express-rate-limit");

/**
 * Custom handler — returns JSON instead of plain text.
 */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    error: "Too many requests. Please try again later.",
    retryAfter: Math.ceil(res.getHeader("Retry-After")),
  });
};

// ─── Auth ────────────────────────────────────────────────────────────────────

/** Login, OTP verify — brute-force protection */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/** OTP send — prevents email flooding */
const otpSendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/** Account registration */
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/** Forgot / reset password */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// ─── General API ─────────────────────────────────────────────────────────────

/** Blanket limit on all /api routes */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Write operations (POST / PUT / PATCH / DELETE) on resource routes.
 * Tighter than globalLimiter to throttle bulk mutations.
 */
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * File upload routes — parent registration, announcements with attachments.
 * Tight: uploading large files repeatedly is expensive.
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Grade / attendance updates — allows teachers to enter many records but
 * still caps runaway automated writes.
 */
const gradeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Read-heavy listing endpoints.
 * Relaxed but capped to prevent scraping.
 */
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

module.exports = {
  globalLimiter,
  authLimiter,
  otpSendLimiter,
  registrationLimiter,
  passwordResetLimiter,
  writeLimiter,
  uploadLimiter,
  gradeLimiter,
  readLimiter,
};
