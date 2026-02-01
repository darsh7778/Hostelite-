const Meal = require("../models/Meal");

// WARDEN → create/update today meal
exports.saveTodayMeal = async (req, res) => {
  try {
    const { breakfast, lunch, dinner } = req.body;

    const today = new Date().toISOString().split("T")[0];

    const meal = await Meal.findOneAndUpdate(
      { date: today },
      {
        breakfast,
        lunch,
        dinner,
        updatedBy: req.user._id,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Meal updated successfully",
      meal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save meal" });
  }
};

// STUDENT → get today meal
exports.getTodayMeal = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const meal = await Meal.findOne({ date: today });

    res.status(200).json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch meal" });
  }
};
