const crypto = require("crypto");

// Generate a 6-digit OTP
const generateOTP = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

// Hash the OTP
const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// Verify the OTP
const verifyOTP = (otp, hashedOTP) => {
  return hashOTP(otp) === hashedOTP;
};

// Check if OTP is expired
const isOTPExpired = (expiresAt) => {
  return Date.now() > new Date(expiresAt).getTime();
};

// Generate OTP expiry time (default: 10 minutes)
const generateOTPExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
  isOTPExpired,
  generateOTPExpiry,
};