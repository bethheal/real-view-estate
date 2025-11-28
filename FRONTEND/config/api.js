import axios from "axios";

const BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL
  : import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${BASE_URL}/api`, // Axios calls /api routes
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
