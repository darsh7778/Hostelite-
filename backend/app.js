const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Trust proxy for rate limiting (required for Render/deployment)
app.set('trust proxy', true);

// Middleware

const allowedOrigins = [
  "http://localhost:5173",          // Local frontend
  "http://localhost:5174",          // Alternative local port
  "http://localhost:3000",          // Alternative local port
  "https://hostelite-xi.vercel.app", // Your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Temporarily allow all origins for debugging
      return callback(null, true);
    },
    credentials: true,
  })
);
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
