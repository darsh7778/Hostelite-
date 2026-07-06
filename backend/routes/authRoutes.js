const express = require("express");
const { registerUser, loginUser, resetPassword, forgotPassword, refreshToken, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
