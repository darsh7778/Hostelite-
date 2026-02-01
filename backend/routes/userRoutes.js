const express = require("express");
const {
  getMyProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserByIdWithProfile,
} = require("../controllers/userController"); // ✅ correct import
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

console.log("authMiddleware:", authMiddleware);
console.log("roleMiddleware:", roleMiddleware);
console.log("roleMiddleware(['admin']):", roleMiddleware(["admin"]));

const router = express.Router();

// -------------------- ROUTES --------------------

// Get logged-in user's profile
router.get("/me", authMiddleware, getMyProfile);

// Get all users (admin only)
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllUsers);

// Get single user by ID with profile (admin only)
router.get("/:id/profile", authMiddleware, roleMiddleware(["admin"]), getUserByIdWithProfile);

// Update user role (admin only)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateUserRole);

// Delete user (admin only)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

module.exports = router;
