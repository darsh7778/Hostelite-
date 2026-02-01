const express = require("express");
const {
  submitComplaint,
  getComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, submitComplaint);
router.get("/", authMiddleware, getComplaints);
router.put("/:id", authMiddleware, updateComplaintStatus);

module.exports = router;
