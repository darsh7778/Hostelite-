const mongoose = require("mongoose");

const mealRatingSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, default: Date.now },
        mealType: { 
            type: String, 
            enum: ["breakfast", "lunch", "dinner"], 
            required: true 
        },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, default: "" },
    },
    { timestamps: true }
);

// Ensure a student can only rate a specific meal type once per day
mealRatingSchema.index({ student: 1, date: 1, mealType: 1 }, { unique: true });

module.exports = mongoose.model("MealRating", mealRatingSchema);
