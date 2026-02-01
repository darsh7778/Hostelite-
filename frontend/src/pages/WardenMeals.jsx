import { useEffect, useState } from "react";
import API from "../services/api";

const WardenMeals = () => {
  const [meals, setMeals] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const [time, setTime] = useState(new Date());
  const [today, setToday] = useState(getTodayDate());

  function getTodayDate() {
    return new Date().toISOString().split("T")[0];
  }

  // LIVE CLOCK + AUTO RESET
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      const newDate = getTodayDate();
      if (newDate !== today) {
        setToday(newDate);
        setMeals({ breakfast: "", lunch: "", dinner: "" });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [today]);

  const handleChange = (e) => {
    setMeals({ ...meals, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await API.post("/meals", meals);
      alert(res.data.message);
    } catch (err) {
      alert("Failed to update meal");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Update Today's Meal</h2>

      <p className="mb-4 text-gray-600">
        ⏰ {time.toLocaleTimeString()} | 📅 {today}
      </p>

      <input
        name="breakfast"
        value={meals.breakfast}
        placeholder="Breakfast"
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <input
        name="lunch"
        value={meals.lunch}
        placeholder="Lunch"
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <input
        name="dinner"
        value={meals.dinner}
        placeholder="Dinner"
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Meal
      </button>
    </div>
  );
};

export default WardenMeals;
