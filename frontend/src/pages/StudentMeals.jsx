import { useEffect, useState } from "react";
import API from "../services/api";

const StudentMeals = () => {
  const [meal, setMeal] = useState(null);
  const [time, setTime] = useState(new Date());
  const [today, setToday] = useState(getTodayDate());

  function getTodayDate() {
    return new Date().toISOString().split("T")[0];
  }

  const fetchMeal = async () => {
    try {
      const res = await API.get("/meals/today");
      setMeal(res.data);
    } catch {
      setMeal(null);
    }
  };

  // FETCH MEAL
  useEffect(() => {
    fetchMeal();
  }, []);

  // CLOCK + AUTO RESET
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      const newDate = getTodayDate();
      if (newDate !== today) {
        setToday(newDate);
        setMeal(null);
        fetchMeal();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [today]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Today's Meal</h2>

      <p className="mb-4 text-gray-600">
        ⏰ {time.toLocaleTimeString()} | 📅 {today}
      </p>

      {!meal ? (
        <p>Meal not updated yet</p>
      ) : (
        <>
          <p>🍳 Breakfast: {meal.breakfast || "Not decided"}</p>
          <p>🍛 Lunch: {meal.lunch || "Not decided"}</p>
          <p>🍽 Dinner: {meal.dinner || "Not decided"}</p>
        </>
      )}
    </div>
  );
};

export default StudentMeals;
