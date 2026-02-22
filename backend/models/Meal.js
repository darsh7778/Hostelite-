const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    date: {
      type: String, 
      required: true,
      unique: true,
    },
    breakfast: {
      type: String,
      default: "",
    },
    lunch: {
      type: String,
      default: "",
    },
    dinner: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meal", mealSchema);
