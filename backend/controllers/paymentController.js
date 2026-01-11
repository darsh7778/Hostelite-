const Payment = require("../models/Payment");

exports.payHostelFee = async (req, res) => {
  try {
    const { amount, month } = req.body;

    if (!amount || !month) {
      return res.status(400).json({ message: "Amount and month are required" });
    }

    const newPayment = new Payment({
      student: req.user._id,
      amount,
      month,
    });

    await newPayment.save();

    res.status(201).json({ message: "Payment successful", payment: newPayment });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all payments of logged-in user
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user._id });
    res.json({ payments });
  } catch (error) {
    console.error("Get Payments Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
