const MealRating = require("../models/MealRating");

exports.submitRating = async (req, res) => {
  try {
    const { breakfast, lunch, dinner } = req.body;

    if (!breakfast || !lunch || !dinner) {
      return res.status(400).json({
        message: "All meal ratings are required",
      });
    }

    const newRating = new MealRating({
      student: req.user._id,
      breakfast,
      lunch,
      dinner,
    });

    await newRating.save();

    res.status(201).json({
      message: "Meal rating submitted successfully",
      rating: newRating,
    });
  } catch (error) {
    console.error("Rating Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL RATINGS (for Warden/Admin)
exports.getRatings = async (req, res) => {
  try {
    const ratings = await MealRating.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};
