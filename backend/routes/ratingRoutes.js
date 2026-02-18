const express = require("express");
const { submitRating, getRatings } = require("../controllers/ratingController");
const {authMiddleware} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/submit", authMiddleware, submitRating);
router.get("/", authMiddleware, getRatings);

module.exports = router;
