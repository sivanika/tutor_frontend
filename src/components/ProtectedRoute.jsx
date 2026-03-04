import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    // If trying to access admin route, redirect to admin login
    if (role === "admin") {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (role && userInfo.user.role !== role) {
    // If admin route but wrong role, redirect to admin login
    if (role === "admin") {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
