const express = require("express");
const adminController = require("../controllers/adminController");
const {authMiddleware} = require("../middleware/authMiddleware");

const router = express.Router();

// Make sure only admin or warden can access
const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "warden") {
    return res.status(403).json({ message: "Forbidden: Admins or Wardens only" });
  }
  next();
};

// COMPLAINT ROUTES 
router.get("/complaints", authMiddleware, checkAdmin, adminController.getAllComplaints);
router.put("/complaints/:complaintId", authMiddleware, checkAdmin, adminController.updateComplaintStatus);

// RATINGS ROUTES
router.get("/ratings", authMiddleware, checkAdmin, adminController.getAllRatings);
router.delete("/ratings/:ratingId", authMiddleware, checkAdmin, adminController.deleteRating);

// PAYMENTS ROUTES
router.get("/payments", authMiddleware, checkAdmin, adminController.getAllPayments);
router.put("/payments/:paymentId", authMiddleware, checkAdmin, adminController.updatePaymentStatus);

// STUDENTS ROUTES
router.get("/students", authMiddleware, checkAdmin, adminController.getAllStudents);
router.put("/students/:studentId", authMiddleware, checkAdmin, adminController.updateStudent);

module.exports = router;
