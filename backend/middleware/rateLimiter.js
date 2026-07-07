const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for registration OTP requests
 * Limits to 3 requests per 15 minutes per IP
 */
const registerOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: 'Too many registration OTP requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for resend OTP requests
 * Limits to 3 requests per 15 minutes per IP
 */
const resendOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: 'Too many resend OTP requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for verify OTP requests
 * Limits to 10 requests per 15 minutes per IP
 */
const verifyOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many verify OTP attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for forgot password requests
 * Limits to 3 requests per 15 minutes per IP
 */
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: 'Too many password reset requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for reset password requests
 * Limits to 5 requests per 15 minutes per IP
 */
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many reset password attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for login requests
 * Limits to 5 requests per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  registerOTPLimiter,
  resendOTPLimiter,
  verifyOTPLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  loginLimiter,
};
