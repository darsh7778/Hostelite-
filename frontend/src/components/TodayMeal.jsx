import { useEffect, useState } from "react";
import API from "../services/api";

export default function TodayMeal() {
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    API.get("/meals/today").then((res) => setMeal(res.data));
  }, []);

  if (!meal) return <p>No meal updated yet</p>;

  return (
    <div className="today-meal-card">
      <h3>Today’s Meal</h3>
      <p><b>Breakfast:</b> {meal.breakfast}</p>
      <p><b>Lunch:</b> {meal.lunch}</p>
      <p><b>Dinner:</b> {meal.dinner}</p>
    </div>
  );
}
