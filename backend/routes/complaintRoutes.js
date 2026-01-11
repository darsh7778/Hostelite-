const express = require("express");
const { submitComplaint, getComplaints } = require("../controllers/complaintController");
const authMiddleware = require("../middleware/authMiddleware"); 

const router = express.Router();

// POST complaint
router.post("/", authMiddleware, submitComplaint);

// GET all complaints for this user (optional)
router.get("/", authMiddleware, getComplaints);

module.exports = router;
