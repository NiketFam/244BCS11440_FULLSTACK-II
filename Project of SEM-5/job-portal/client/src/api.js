import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Attach the token (if present) as "Authorization: Bearer <token>"
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errorMessage = (err) =>
  err.response?.data?.message || err.message || "Something went wrong. Please try again.";

export const getAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const backendBase = API_URL.replace(/\/api\/?$/, "");
  return `${backendBase}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default api;
