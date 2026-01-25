const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    ref: "User"
  },
  studentName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  date: {
    type: Date,
    default: Date.now
  },
  razorpayOrderId: {
    type: String,
    sparse: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  razorpaySignature: {
    type: String,
    sparse: true
  },
  month: {
    type: String,
    required: false
  },
  description: {
    type: String,
    default: "Hostel Fee Payment"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);
