import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const user = await login(email, password);

      // Block admin from regular login — must use /admin/login
      if (user.role === "admin") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        setError("Admin accounts must use the admin portal to login.");
        return;
      }

      // ===== FINAL REDIRECT LOGIC =====
      if (user.role === "professor") {
        if (!user.profileCompleted) {
          return navigate("/professor/onboarding");
        }
        if (!user.isVerified) {
          return navigate("/verification-pending");
        }
        return navigate("/professor/dashboard");
      }

      if (user.role === "student") {
        if (!user.profileCompleted) {
          return navigate("/student/onboarding");
        }
        return navigate("/student/dashboard");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-6
        bg-gradient-to-br from-[#6A11CB] via-[#4B34C9] to-[#2575FC]
        transition-colors duration-500
      "
    >
      {/* Card */}
      <form
        onSubmit={submit}
        className="
          w-full max-w-md p-8 rounded-2xl

          bg-white/95
          backdrop-blur-2xl

          border border-white/50
          shadow-2xl shadow-black/20

          animate-[fadeIn_.5s_ease]

          space-y-5
        "
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 -mt-3">Log in to TutorHours</p>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 text-center animate-[fadeIn_.3s_ease]">
            {error}
          </div>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="
            w-full p-3 rounded-lg
            bg-gray-50
            border border-gray-200
            text-gray-800
            focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/40
            transition
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="
              w-full p-3 rounded-lg pr-12
              bg-gray-50
              border border-gray-200
              text-gray-800
              focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/40
              transition
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute right-3 top-3
              text-gray-400 hover:text-gray-700
            "
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Forgot */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-[#6A11CB] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="
            w-full py-3 rounded-lg font-semibold
            bg-gradient-to-r from-[#6A11CB] to-[#2575FC]
            text-white
            hover:shadow-lg hover:shadow-[#6A11CB]/30
            transition-all duration-200
            active:scale-95
            disabled:opacity-60
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <p className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-[#6A11CB] hover:underline">
            Register
          </Link>
        </p>
        <Link to="/" className="block text-sm text-center text-gray-500 hover:text-[#6A11CB] hover:underline">
          Back to Home
        </Link>
      </form>
    </div>
  );
}

export default Login;
