const bcrypt = require("bcrypt");
const crypto = require("crypto");

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password with hashed password
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a cryptographically random device token.
 * Returns the RAW token — send this to the client.
 * Always store only the hash (see hashDeviceToken) in the DB.
 */
const generateDeviceToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash a device token with SHA-256 for safe DB storage.
 * If the DB is ever compromised, raw tokens still cannot be recovered.
 */
const hashDeviceToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Generate OTP code
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  hashPassword,
  comparePassword,
  generateDeviceToken,
  hashDeviceToken,
  generateOTP,
};
