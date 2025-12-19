// src/config/axios.js
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || // local takes priority
  import.meta.env.VITE_API_URL ||      // fallback to remote
  "http://localhost:5000";             // final fallback

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
});

// axios.js
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("agentToken") ||
      localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
export default api;
