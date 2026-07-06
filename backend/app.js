const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  // Add your Vercel frontend URL here after deployment
  // e.g., "https://your-project.vercel.app"
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/rooms", require("./routes/room.routes"));
app.use("/api/system-settings", require("./routes/systemSettings.routes"));
app.use("/api/meals", require("./routes/mealRoutes"));
app.use("/api/profile", require("./routes/userProfileRoutes"));
app.use("/api/imagekit", require("./routes/imagekitRoutes"));

// Health check
app.get("/", (req, res) => res.send("Hostelite Backend Running"));

module.exports = app;
