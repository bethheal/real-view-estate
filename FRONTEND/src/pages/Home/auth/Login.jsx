import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      if (role === "agent") navigate("/agent-dashboard");
      else navigate("/buyer-dashboard");
    } catch {
      toast.error("Invalid credentials, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8ec] to-[#ffe3c2]">
      <div className="bg-white/40 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-10 w-full max-w-md z-10">
        <h2 className="text-3xl font-extrabold text-center text-[#ed7d31] mb-8">Welcome Back</h2>

        {/* Role Selector */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white/40 rounded-full shadow-inner overflow-hidden">
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`px-5 py-2 font-semibold transition-all ${
                role === "buyer" ? "bg-[#ed7d31] text-white" : "text-gray-800 hover:text-[#ed7d31]"
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole("agent")}
              className={`px-5 py-2 font-semibold transition-all ${
                role === "agent" ? "bg-[#ed7d31] text-white" : "text-gray-700 hover:text-[#ed7d31]"
              }`}
            >
              Agent
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-gray-700 border border-gray-300/60 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#ed7d31]"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-gray-700 border border-gray-300/60 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#ed7d31]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-[#ed7d31]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ed7d31] text-white font-semibold py-3 rounded-md shadow-lg hover:bg-[#d96b1f] transition-all disabled:opacity-50"
          >
            {loading ? "Logging In..." : `Log In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        <p className="text-sm text-gray-700 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#ed7d31] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
