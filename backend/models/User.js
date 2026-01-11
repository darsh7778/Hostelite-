const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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

    roomNumber: {
      type: String,
      default: null,
    },

    hostelName: {
      type: String,
      default: "Hostelite",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
