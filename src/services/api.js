import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://tutor-backend-vjpj.onrender.com/api",
});


// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});

export default API;
