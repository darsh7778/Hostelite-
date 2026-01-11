const User = require("../models/User");

// Get logged-in user profile
const getMyProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["student", "warden", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent admin from changing their own role
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update role", error: error.message });
  }
};

// DELETE USER (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

module.exports = { getMyProfile, getAllUsers, updateUserRole, deleteUser };