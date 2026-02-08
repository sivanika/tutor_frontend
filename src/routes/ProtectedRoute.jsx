import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

export default function ProtectedRoute({ children, role }) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
