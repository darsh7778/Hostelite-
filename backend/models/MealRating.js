const mongoose = require("mongoose");

const mealRatingSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, default: Date.now },
        breakfast: { type: Number, min: 1, max: 5, required: true },
        lunch: { type: Number, min: 1, max: 5, required: true },
        dinner: { type: Number, min: 1, max: 5, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("MealRating", mealRatingSchema);
