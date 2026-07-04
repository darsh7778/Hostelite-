const express = require("express");
const { 
  submitRating, 
  getStudentRatings, 
  getAllRatings, 
  getRatingStats 
} = require("../controllers/ratingController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Student routes
router.post("/submit", authMiddleware, submitRating);
router.get("/my-ratings", authMiddleware, getStudentRatings);

// Warden/Admin routes
router.get("/all", authMiddleware, getAllRatings);
router.get("/stats", authMiddleware, getRatingStats);

module.exports = router;
