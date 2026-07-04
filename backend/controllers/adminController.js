const Complaint = require("../models/Complaint");
const MealRating = require("../models/MealRating");
const User = require("../models/User");


// Approve or reject a complaint
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body; // "approved" | "rejected"

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;
    await complaint.save();

    res.json({ message: `Complaint ${status}`, complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("student", "name email roomNumber");
    res.json({ complaints });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all meal ratings
exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await MealRating.find().populate("student", "name email roomNumber");
    res.json({ ratings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a rating
exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const rating = await MealRating.findByIdAndDelete(ratingId);
    if (!rating) return res.status(404).json({ message: "Rating not found" });

    res.json({ message: "Rating deleted", rating });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json({ students });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update student info
exports.updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updates = req.body;

    const student = await User.findByIdAndUpdate(studentId, updates, { new: true }).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student updated", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
