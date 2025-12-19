import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../Home/auth/AuthProvider";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, "admin");
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info(
      "Please contact tech support at support@example.com to reset your password."
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8ec] to-[#ffe3c2]">
      <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-8">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-gray-900 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-gray-900 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-orange-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-semibold py-3 rounded-md shadow-lg hover:bg-orange-700 transition-all disabled:opacity-50"
          >
            {loading ? "Logging In..." : "Log In as Admin"}
          </button>
        </form>

        <p className="text-sm text-gray-800 text-center mt-6">
          Forgot your password?{" "}
          <button
            onClick={handleForgotPassword}
            className="text-orange-600 font-semibold hover:underline"
          >
            Speak to tech support
          </button>
        </p>
      </div>
    </div>
  );
}
