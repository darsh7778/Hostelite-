const User = require("../models/User");

// Logged-in user profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Admin: get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Admin: update user details including role and roomNumber
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, roomNumber } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update only the fields that are sent
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (roomNumber !== undefined) user.roomNumber = roomNumber; // important: allow empty string too

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update user" });
  }
};

// Admin: delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Get user profile by ID (admin)
const getUserByIdWithProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

module.exports = {
  getMyProfile,
  getAllUsers,
  updateUser,
  deleteUser,
    getUserByIdWithProfile,
};
