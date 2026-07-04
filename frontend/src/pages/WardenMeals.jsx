import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/WardenMeals.css";

const WardenMeals = () => {
  const navigate = useNavigate();

  const [meals, setMeals] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const [time, setTime] = useState(new Date());
  const [today, setToday] = useState(getTodayDate());
  const [ratingStats, setRatingStats] = useState(null);
  const [allRatings, setAllRatings] = useState([]);
  const [showRatings, setShowRatings] = useState(false);

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

  // Fetch rating stats
  const fetchRatingStats = async () => {
    try {
      const res = await API.get(`/ratings/stats?date=${today}`);
      setRatingStats(res.data);
    } catch (error) {
      console.error("Failed to fetch rating stats:", error);
    }
  };

  // Fetch all ratings
  const fetchAllRatings = async () => {
    try {
      const res = await API.get(`/ratings/all?date=${today}`);
      setAllRatings(res.data);
    } catch (error) {
      console.error("Failed to fetch all ratings:", error);
    }
  };

  useEffect(() => {
    fetchRatingStats();
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

  const handleBack = () => {
    navigate(-1);
  };

  const toggleRatings = () => {
    setShowRatings(!showRatings);
    if (!showRatings) {
      fetchAllRatings();
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="warden-meals">
      <button className="back-btn" onClick={handleBack}>
        ← Back
      </button>

      <h2>Update Today's Meal</h2>

      <p className="date-time">
        {time.toLocaleTimeString()} | {today}
      </p>

      <div className="meal-inputs">
        <input
          name="breakfast"
          value={meals.breakfast}
          placeholder="Breakfast"
          onChange={handleChange}
        />

        <input
          name="lunch"
          value={meals.lunch}
          placeholder="Lunch"
          onChange={handleChange}
        />

        <input
          name="dinner"
          value={meals.dinner}
          placeholder="Dinner"
          onChange={handleChange}
        />

        <button className="save-btn" onClick={handleSave}>
          Save Meal
        </button>
      </div>

      {/* Rating Stats Section */}
      <div className="rating-section">
        <div className="rating-header">
          <h3>Meal Ratings</h3>
          <button className="toggle-ratings-btn" onClick={toggleRatings}>
            {showRatings ? "Hide Details" : "View Details"}
          </button>
        </div>

        {ratingStats && (
          <div className="rating-stats">
            {["breakfast", "lunch", "dinner"].map((mealType) => (
              <div key={mealType} className="stat-card">
                <h4>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                <div className="stat-value">
                  <span className="average">{ratingStats[mealType].average}</span>
                  <span className="out-of">/5</span>
                </div>
                <p className="stat-count">{ratingStats[mealType].count} ratings</p>
              </div>
            ))}
          </div>
        )}

        {showRatings && allRatings.length > 0 && (
          <div className="all-ratings">
            <h4>All Student Ratings</h4>
            {allRatings.map((rating) => (
              <div key={rating._id} className="rating-card">
                <div className="rating-header-info">
                  <span className="student-name">{rating.student?.name || "Unknown"}</span>
                  <span className="meal-type-badge">
                    {rating.mealType.charAt(0).toUpperCase() + rating.mealType.slice(1)}
                  </span>
                </div>
                <div className="rating-stars">{renderStars(rating.rating)}</div>
                {rating.comment && <p className="rating-comment">{rating.comment}</p>}
                <p className="rating-time">
                  {new Date(rating.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {showRatings && allRatings.length === 0 && (
          <p className="no-ratings">No ratings submitted for today</p>
        )}
      </div>
    </div>
  );
};

export default WardenMeals;
