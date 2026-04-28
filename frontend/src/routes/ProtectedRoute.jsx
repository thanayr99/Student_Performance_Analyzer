import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, role: currentRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && role !== currentRole) {
    const redirect = currentRole === "ADMIN" ? "/admin" : currentRole === "TEACHER" ? "/teacher" : "/student";
    return <Navigate to={redirect} replace />;
  }

  return children;
}
