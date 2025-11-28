import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../../../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/user/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data.user || res.data))
        .catch(() => logout());
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password, role) => {
    const res = await api.post("/auth/login", { email, password, role: role.toUpperCase() });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user || res.data);
    navigate(role === "agent" ? "/agent-dashboard" : "/buyer-dashboard");
  };

  // Signup
  const signUp = async (data) => {
    const res = await api.post("/auth/signup", data);
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
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

export const useAuth = () => useContext(AuthContext);
