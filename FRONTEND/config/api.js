import axios from "axios";

// Use VITE_API_BASE_URL for local dev, VITE_API_URL for production
const BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL   // e.g., http://localhost:5000
  : import.meta.env.VITE_API_URL;       // e.g., https://real-view-estate.onrender.com

// Create Axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/api`,           // points to /api routes
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,                // IMPORTANT for cookies/auth
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
