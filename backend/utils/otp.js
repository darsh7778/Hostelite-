const crypto = require('crypto');

/**
 * Generate a secure 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP using SHA-256
 * @param {string} otp - Plain text OTP
 * @returns {Promise<string>} Hashed OTP
 */
const hashOTP = async (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Verify OTP against hashed value
 * @param {string} plainOTP - Plain text OTP from user
 * @param {string} hashedOTP - Hashed OTP from database
 * @returns {Promise<boolean>} True if OTP matches

 */
const verifyOTP = async (plainOTP, hashedOTP) => {
  const hashedPlainOTP = await hashOTP(plainOTP);
  return hashedPlainOTP === hashedOTP;
};

/**
 * Check if OTP has expired
 * @param {Date} expiresAt - Expiry date
 * @returns {boolean} True if expired
 */
const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

/**
 * Generate OTP expiry time
 * @param {number} minutes - Minutes until expiry
 * @returns {Date} Expiry date
 */
const generateOTPExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
  isOTPExpired,
  generateOTPExpiry
};
