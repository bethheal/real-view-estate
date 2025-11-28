import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

// ------------------- PASSWORD STRENGTH CHECKER -------------------
const getPasswordStrength = (password) => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  if (strength <= 2) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (strength === 3 || strength === 4)
    return { level: 2, label: "Medium", color: "bg-yellow-500" };
  if (strength === 5)
    return { level: 3, label: "Strong", color: "bg-green-600" };
};

export default function SignupPage() {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("buyer");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------- SIGNUP HANDLER -------------------
  const handleSignup = async (e) => {
    e.preventDefault();

  const backendPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!backendPasswordRegex.test(formData.password)) {
  toast.error(
    "Password must include uppercase, lowercase, number, and special character."
  );
  return;
}


    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await signUp({ ...formData, role: role.toUpperCase() });

      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Try again later.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8ec] to-[#ffe3c2]">
      <div className="bg-white/40 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-[#ed7d31] mb-8">
          Create Your Account
        </h2>

        {/* Role Selector */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white/40 rounded-full shadow-inner overflow-hidden">
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`px-5 py-2 font-semibold transition-all ${
                role === "buyer"
                  ? "bg-[#ed7d31] text-white"
                  : "text-gray-700 hover:text-[#ed7d31]"
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole("agent")}
              className={`px-5 py-2 font-semibold transition-all ${
                role === "agent"
                  ? "bg-[#ed7d31] text-white"
                  : "text-gray-700 hover:text-[#ed7d31]"
              }`}
            >
              Agent
            </button>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border text-gray-700 border-gray-300/60 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#ed7d31]"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border text-gray-700 border-gray-300/60 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#ed7d31]"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border text-gray-700 border-gray-300/60 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#ed7d31]"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border text-gray-700 border-gray-300/60 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#ed7d31]"
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

          {/* Password Strength Meter */}
          {formData.password && (
            <div className="mt-2">
              {/* Strength Bar */}
              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    getPasswordStrength(formData.password).color
                  }`}
                  style={{
                    width:
                      getPasswordStrength(formData.password).level === 1
                        ? "33%"
                        : getPasswordStrength(formData.password).level === 2
                        ? "66%"
                        : "100%",
                  }}
                ></div>
              </div>

              {/* Strength Label */}
              <p
                className={`text-sm font-medium mt-1 ${
                  getPasswordStrength(formData.password).color.replace(
                    "bg",
                    "text"
                  )
                }`}
              >
                {getPasswordStrength(formData.password).label} Password
              </p>
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border text-gray-700 border-gray-300/60 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#ed7d31]"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-3 text-gray-500 hover:text-[#ed7d31]"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ed7d31] text-white font-semibold py-3 rounded-md shadow-lg hover:bg-[#d96b1f] transition-all disabled:opacity-50"
          >
            {loading
              ? "Signing Up..."
              : `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        <p className="text-sm text-gray-700 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#ed7d31] font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
