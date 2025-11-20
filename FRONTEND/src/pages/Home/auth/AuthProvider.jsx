import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../../config/axios";
import { useNavigate } from "react-router";

// 1️⃣ Create the Auth Context
const AuthContext = createContext();

// 2️⃣ AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/user/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data.user))
        .catch(() => logout());
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password,role) => {
    const res = await api.post("/auth/login", { email, password, role: role.toUpperCase() });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user || res.data); // depends on your backend
    navigate(role === "agent" ? "/agent-dashboard" : "/buyer-dashboard");
  };

 // Signup
const signUp = async (data) => {
  try {
    const res = await api.post("/auth/signup", data); // data must include role

    console.log("Signup response:", res.data);

    if (res.data.success === false || !res.data.token) {
      throw new Error(res.data.message || "Signup failed. Try again later.");
    }

    if (res.data.token) localStorage.setItem("token", res.data.token);

    return res.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};


  // Forgot password
  const forgotPassword = async (email) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data.message;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, forgotPassword, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3️⃣ Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
