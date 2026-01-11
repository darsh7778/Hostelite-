const express = require("express");
const { getMyProfile, getAllUsers, updateUserRole, deleteUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Logged-in user profile
router.get("/me", authMiddleware, getMyProfile);

// Get all users (admin only)
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllUsers);

// Update user role (admin only)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateUserRole);

// DELETE user (admin only)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

module.exports = router;