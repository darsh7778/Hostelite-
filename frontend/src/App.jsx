import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Complaint from "./pages/Complaint";
import WardenComplaints from "./pages/WardenComplaints";
import AdminUsers from "./pages/AdminUsers";
import WardenMeals from "./pages/WardenMeals";
import StudentMeals from "./pages/StudentMeals";
import UnderConstruction from "./components/UnderConstruction";
import SystemSettings from "./pages/SystemSettings";
import ForgotPassword from "./pages/ForgotPassword";
import StudentProfile from "./pages/StudentProfile";
import AdminStudentProfile from "./pages/AdminStudentProfile";

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
            path="/warden/meals"
            element={
              <ProtectedRoute role="warden">
                <WardenMeals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/meals"
            element={
              <ProtectedRoute role="student">
                <StudentMeals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/under-construction"
            element={
              <ProtectedRoute role="admin">
                <UnderConstruction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/system-settings"
            element={
              <ProtectedRoute role="admin">
                <SystemSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute role="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/student/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminStudentProfile />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
