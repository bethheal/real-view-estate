import axios from "axios";

// Automatically choose API base URL
const BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL     // http://localhost:5000
  : import.meta.env.VITE_API_URL;         // https://real-view-estate.onrender.com

// Axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/api`,             // FIXED: use BASE_URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token automatically if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
