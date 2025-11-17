// src/config/api.js
import axios from "axios";

// Automatically choose API base URL
// Use VITE_API_BASE_URL (local) for development
// Use VITE_API_URL (hosted) for production
const BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL // e.g., http://localhost:5000/api
  : import.meta.env.VITE_API_URL;      // e.g., https://real-view-estate.onrender.com/api

// Axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token automatically if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Optional export for BASE_URL (for images/uploads)
export { BASE_URL };
