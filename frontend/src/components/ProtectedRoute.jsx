import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
    const { isAuthenticated, loading, user } = useAuth();

    console.log("ProtectedRoute - Loading:", loading);
    console.log("ProtectedRoute - Authenticated:", isAuthenticated);
    console.log("ProtectedRoute - User:", user);
    console.log("ProtectedRoute - Required Role:", role);

    if (loading) return <p>Loading...</p>;

    if (!isAuthenticated) {
        console.log("ProtectedRoute - Redirecting to login");
        return <Navigate to="/" />;
    }

    // role check
    if (role && user?.role !== role) {
        console.log("ProtectedRoute - Role mismatch, redirecting to dashboard");
        return <Navigate to="/dashboard" />;
    }

    console.log("ProtectedRoute - Access granted");
    return children;
}
