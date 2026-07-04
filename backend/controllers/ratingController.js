const MealRating = require("../models/MealRating");

// Submit a single meal rating (breakfast, lunch, or dinner)
exports.submitRating = async (req, res) => {
  try {
    const { mealType, rating, comment } = req.body;
    const studentId = req.user.id;

    // Validate meal type
    const validMealTypes = ["breakfast", "lunch", "dinner"];
    if (!validMealTypes.includes(mealType)) {
      return res.status(400).json({
        message: "Invalid meal type. Must be breakfast, lunch, or dinner",
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if student already rated this meal type today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingRating = await MealRating.findOne({
      student: studentId,
      mealType,
      date: { $gte: today, $lt: tomorrow },
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment || "";
      await existingRating.save();

      return res.status(200).json({
        message: "Meal rating updated successfully",
        rating: existingRating,
      });
    }

    // Create new rating
    const newRating = new MealRating({
      student: studentId,
      mealType,
      rating,
      comment: comment || "",
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

// Get student's own ratings
exports.getStudentRatings = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { date } = req.query;

    const query = { student: studentId };
    
    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    const ratings = await MealRating.find(query).sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error("Get Student Ratings Error:", error);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};

// GET ALL RATINGS (for Warden/Admin)
exports.getAllRatings = async (req, res) => {
  try {
    const { date, mealType } = req.query;
    const query = {};

    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    if (mealType) {
      query.mealType = mealType;
    }

    const ratings = await MealRating.find(query)
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error("Get All Ratings Error:", error);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};

// Get rating statistics for warden dashboard
exports.getRatingStats = async (req, res) => {
  try {
    const { date } = req.query;
    const query = {};

    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    const ratings = await MealRating.find(query);

    // Calculate stats for each meal type
    const stats = {
      breakfast: { count: 0, average: 0, ratings: [] },
      lunch: { count: 0, average: 0, ratings: [] },
      dinner: { count: 0, average: 0, ratings: [] },
    };

    ratings.forEach((rating) => {
      if (stats[rating.mealType]) {
        stats[rating.mealType].count++;
        stats[rating.mealType].ratings.push(rating.rating);
      }
    });

    // Calculate averages
    Object.keys(stats).forEach((mealType) => {
      if (stats[mealType].count > 0) {
        const sum = stats[mealType].ratings.reduce((a, b) => a + b, 0);
        stats[mealType].average = (sum / stats[mealType].count).toFixed(1);
      }
    });

    res.json(stats);
  } catch (error) {
    console.error("Get Rating Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch rating statistics" });
  }
};
