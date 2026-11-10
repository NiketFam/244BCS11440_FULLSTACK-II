import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Only lets logged-in users (with the right role) see the page
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
