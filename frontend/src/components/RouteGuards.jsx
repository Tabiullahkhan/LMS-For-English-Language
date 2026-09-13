import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps any route that requires the visitor to be logged in (student or admin)
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // avoid flashing a redirect before we've checked localStorage
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Wraps any route that requires the visitor to be an admin specifically
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};
