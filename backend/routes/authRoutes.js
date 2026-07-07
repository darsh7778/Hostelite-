const express = require("express");
const { registerUser, loginUser, resetPassword, forgotPassword, refreshToken, logout, verifyOTP, resendOTP } = require("../controllers/authController");
const { registerOTPLimiter, resendOTPLimiter, verifyOTPLimiter, forgotPasswordLimiter, resetPasswordLimiter, loginLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", registerOTPLimiter, registerUser);
router.post("/verify-otp", verifyOTPLimiter, verifyOTP);
router.post("/resend-otp", resendOTPLimiter, resendOTP);
router.post("/login", loginLimiter, loginUser);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
