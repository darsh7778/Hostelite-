const Complaint = require("../models/Complaint");
const User = require("../models/User");

// ==============================
// STUDENT: Submit Complaint
// ==============================
exports.submitComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        message: "Complaint description must be at least 10 characters long",
      });
    }

    // Assign a warden automatically (first one for demo)
    const warden = await User.findOne({ role: "warden" });
    if (!warden) {
      return res.status(400).json({ message: "No warden available" });
    }

    const newComplaint = new Complaint({
      student: req.user._id,
      warden: warden._id,
      title: title.trim(),
      description: description.trim(),
      status: "pending",
    });

    await newComplaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ==============================
// GET Complaints (Role Based)
// ==============================
exports.getComplaints = async (req, res) => {
  try {
    const user = req.user;
    let complaints;

    if (user.role === "student") {
      complaints = await Complaint.find({ student: user._id })
        .populate("student", "name email")
        .populate("warden", "name")
        .sort({ createdAt: -1 });
    } else if (user.role === "warden") {
      complaints = await Complaint.find({ warden: user._id })
        .populate("student", "name email")
        .sort({ createdAt: -1 });
    } else if (user.role === "admin") {
      complaints = await Complaint.find()
        .populate("student", "name email")
        .populate("warden", "name")
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ==============================
// WARDEN / ADMIN: Update Status
// ==============================
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (req.user.role !== "warden" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Warden can only update their assigned complaints
    if (req.user.role === "warden" && !complaint.warden.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized for this complaint" });
    }

    complaint.status = status;
    await complaint.save();

    res.status(200).json({ message: "Complaint status updated", complaint });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
