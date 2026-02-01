const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ================= AUTH BASIC =================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "warden", "admin"],
      default: "student",
    },

    // ================= HOSTEL =================
    roomNumber: {
      type: String,
      default: null,
    },

    hostelName: {
      type: String,
      default: "Hostelite",
    },

    // ================= PROFILE STATUS =================
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // ================= PERSONAL DETAILS =================
    fatherName: {
      type: String,
      trim: true,
    },

    motherName: {
      type: String,
      trim: true,
    },

    mobile: {
      type: String,
    },

    permanentAddress: {
      type: String,
    },

    // ================= DOCUMENTS =================
    photo: {
      type: String, // Cloudinary / local URL
    },

    aadharFront: {
      type: String,
    },

    aadharBack: {
      type: String,
    },

    // ================= STUDENT ONLY =================
    collegeName: {
      type: String,
    },

    course: {
      type: String,
    },

    // ================= EMPLOYEE / WARDEN =================
    companyName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
