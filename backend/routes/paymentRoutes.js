const express = require("express");
const { payHostelFee, getPayments } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware"); 

const router = express.Router();

router.post("/pay", authMiddleware, payHostelFee);

// GET all payments for logged-in user
router.get("/", authMiddleware, getPayments);

module.exports = router; 