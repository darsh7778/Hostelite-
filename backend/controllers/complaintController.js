const Complaint = require("../models/Complaint");

// ==============================
// STUDENT: Submit Complaint
// ==============================
exports.submitComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newComplaint = new Complaint({
      student: req.user._id, // from authMiddleware
      title,
      description,
      status: "pending",
    });

    await newComplaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET Complaints (Role Based)
// ==============================
exports.getComplaints = async (req, res) => {
  try {
    let complaints;

    // STUDENT → only own complaints
    if (req.user.role === "student") {
      complaints = await Complaint.find({ student: req.user._id })
        .populate("student", "name email")
        .sort({ createdAt: -1 });
    }

    // WARDEN / ADMIN → all complaints
    else if (req.user.role === "warden" || req.user.role === "admin") {
      complaints = await Complaint.find()
        .populate("student", "name email")
        .sort({ createdAt: -1 });
    }

    else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Server error" });
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

    complaint.status = status;
    await complaint.save();

    res.json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
};