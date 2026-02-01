const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  saveTodayMeal,
  getTodayMeal,
} = require("../controllers/mealController");

// Warden
router.post("/", authMiddleware, saveTodayMeal);

// Student
router.get("/today", authMiddleware, getTodayMeal);

module.exports = router;
