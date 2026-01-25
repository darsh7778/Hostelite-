import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Complaint from "./pages/Complaint";
import MealRating from "./pages/MealRating";
import WardenComplaints from "./pages/WardenComplaints";
import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";
import StudentPayment from "./pages/StudentPayment";
import AdvancePayment from "./pages/AdvancePayment";
import RazorpayPayment from "./pages/RazorpayPayment";
import UpiPayment from "./pages/UpiPayment";
import DebitCardPayment from "./pages/DebitCardPayment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* STUDENT */}
          <Route
            path="/complaints"
            element={
              <ProtectedRoute role="student">
                <Complaint />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ratings"
            element={
              <ProtectedRoute role="student">
                <MealRating />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute role="student">
                <StudentPayment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/advance-payment"
            element={
              <ProtectedRoute role="student">
                <AdvancePayment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/razorpay-payment"
            element={
              <ProtectedRoute role="student">
                <RazorpayPayment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upi-payment"
            element={
              <ProtectedRoute role="student">
                <UpiPayment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/debit-card-payment"
            element={
              <ProtectedRoute role="student">
                <DebitCardPayment />
              </ProtectedRoute>
            }
          />

          {/* WARDEN */}
          <Route
            path="/warden/complaints"
            element={
              <ProtectedRoute role="warden">
                <WardenComplaints />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute role="admin">
                <AdminPayments />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}