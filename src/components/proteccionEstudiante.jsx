import { Navigate } from "react-router-dom";

export default function ProtectedRouteEsudiante({ children }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login-practicas" replace />;
  }

  return children;
}