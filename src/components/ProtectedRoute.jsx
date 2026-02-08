import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  if (role && userInfo.user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
