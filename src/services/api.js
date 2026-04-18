import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Auto-logout on 401 (expired / invalid token)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth data
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      // Define public paths that shouldn't auto-redirect
      const isPublicPath = [
        "/login",
        "/",
        "/register",
        "/register/student",
        "/register/professor",
        "/forgot-password",
        "/admin/login"
      ].includes(window.location.pathname) || window.location.pathname.startsWith("/reset-password") || window.location.pathname.startsWith("/tutor/");

      // Redirect to login (hard reload clears all component state)
      if (!isPublicPath) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
