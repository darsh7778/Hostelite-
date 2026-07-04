import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/StudentMeals.css";

const StudentMeals = () => {
  const [meal, setMeal] = useState(null);
  const [time, setTime] = useState(new Date());
  const [today, setToday] = useState(getTodayDate());
  const [ratings, setRatings] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [comments, setComments] = useState({ breakfast: "", lunch: "", dinner: "" });
  const [submitted, setSubmitted] = useState({ breakfast: false, lunch: false, dinner: false });
  const [loading, setLoading] = useState({ breakfast: false, lunch: false, dinner: false });

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

  const fetchRatings = async () => {
    try {
      const res = await API.get(`/ratings/my-ratings?date=${today}`);
      const userRatings = res.data;
      
      const ratingMap = { breakfast: 0, lunch: 0, dinner: 0 };
      const commentMap = { breakfast: "", lunch: "", dinner: "" };
      const submittedMap = { breakfast: false, lunch: false, dinner: false };

      userRatings.forEach((rating) => {
        ratingMap[rating.mealType] = rating.rating;
        commentMap[rating.mealType] = rating.comment || "";
        submittedMap[rating.mealType] = true;
      });

      setRatings(ratingMap);
      setComments(commentMap);
      setSubmitted(submittedMap);
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
    }
  };

  const handleRatingSubmit = async (mealType) => {
    if (ratings[mealType] === 0) {
      alert("Please select a rating before submitting");
      return;
    }

    setLoading((prev) => ({ ...prev, [mealType]: true }));

    try {
      await API.post("/ratings/submit", {
        mealType,
        rating: ratings[mealType],
        comment: comments[mealType],
      });

      setSubmitted((prev) => ({ ...prev, [mealType]: true }));
      alert(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} rating submitted successfully!`);
    } catch (error) {
      console.error("Failed to submit rating:", error);
      alert("Failed to submit rating. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [mealType]: false }));
    }
  };

  const renderStars = (mealType) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= ratings[mealType] ? "filled" : ""}`}
        onClick={() => !submitted[mealType] && setRatings((prev) => ({ ...prev, [mealType]: star }))}
      >
        ★
      </span>
    ));
  };

  // FETCH MEAL
  useEffect(() => {
    fetchMeal();
    fetchRatings();
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
        setRatings({ breakfast: 0, lunch: 0, dinner: 0 });
        setComments({ breakfast: "", lunch: "", dinner: "" });
        setSubmitted({ breakfast: false, lunch: false, dinner: false });
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => {
          fetchMeal();
          fetchRatings();
        }, 0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [today]);

  return (
    <div className="student-meals">
      <h2>Today's Meal</h2>

      <p className="date-time">
        ⏰ {time.toLocaleTimeString()} | 📅 {today}
      </p>

      {!meal ? (
        <p className="empty">Meal not updated yet</p>
      ) : (
        <div className="meal-list">
          {["breakfast", "lunch", "dinner"].map((mealType) => (
            <div key={mealType} className="meal-item">
              <div className="meal-info">
                <span className="meal-label">
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}:
                </span>
                <span className="meal-value">{meal[mealType] || "Not decided"}</span>
              </div>
              
              {meal[mealType] && (
                <div className="rating-section">
                  <div className="stars">{renderStars(mealType)}</div>
                  
                  {!submitted[mealType] && (
                    <>
                      <textarea
                        className="rating-comment"
                        placeholder="Add a comment (optional)"
                        value={comments[mealType]}
                        onChange={(e) =>
                          setComments((prev) => ({ ...prev, [mealType]: e.target.value }))
                        }
                        rows="2"
                      />
                      <button
                        className="submit-rating-btn"
                        onClick={() => handleRatingSubmit(mealType)}
                        disabled={loading[mealType]}
                      >
                        {loading[mealType] ? "Submitting..." : "Submit Rating"}
                      </button>
                    </>
                  )}
                  
                  {submitted[mealType] && (
                    <span className="rating-submitted">✓ Rated {ratings[mealType]}/5</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMeals;
