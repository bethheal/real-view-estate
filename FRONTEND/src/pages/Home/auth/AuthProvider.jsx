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
    const role = localStorage.getItem("role");

    if (!token || !role) {
      setLoading(false);
      return;
    }

    const profileUrl =
      role === "ADMIN" ? "/admin/profile" : "/user/profile";

    api
      .get(profileUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser({ ...(res.data.user || res.data), role });
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  // 🔑 SINGLE LOGIN FUNCTION
  const login = async (email, password, role) => {
    const isAdmin = role === "admin";

    const url = isAdmin ? "/auth/admin/login" : "/auth/login";

    const res = await api.post(url, {
      email,
      password,
      role: role.toUpperCase(),
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", role.toUpperCase());

    setUser({ ...(res.data.user || res.data), role: role.toUpperCase() });

    // Redirects
    if (isAdmin) navigate("/admin/dashboard");
    else if (role === "agent") navigate("/agent-dashboard");
    else navigate("/buyer-dashboard");
  };

  const signUp = async (data) => {
    const res = await api.post("/auth/signup", data);
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
  };

  const forgotPassword = async (email) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data.message;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signUp, forgotPassword, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
