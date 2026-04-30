import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";


function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = (user) => {
    if (user.role === "admin") {
      localStorage.removeItem("userInfo");
      setError("Admin accounts must use the admin portal to login.");
      return;
    }

    if (user.role === "professor") {
      if (!user.profileCompleted) return navigate("/professor/onboarding");
      if (!user.isVerified) return navigate("/verification-pending");
      return navigate("/professor/dashboard");
    }

    if (user.role === "student") {
      if (!user.profileCompleted) return navigate("/student/onboarding");
      return navigate("/student/dashboard");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const user = await login(email, password);
      handleAuthSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");
      // Note: role is not passed here because user must already exist
      // or if they are new, they should register first to choose a role.
      // However, the backend needs a role for NEW users.
      // In Login, we assume they have an account. If they don't, 
      // the backend will return 400 "Role is required for new users".
      const user = await googleLogin(credentialResponse.credential);
      handleAuthSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || "Google Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-6
        bg-gradient-to-br from-[var(--primary)] via-[#4B34C9] to-[var(--primary)]
        dark:from-[#0f0720] dark:via-[#130a2e] dark:to-[#0a0418]
        transition-colors duration-500
      "
    >
      {/* Card */}
      <form
        onSubmit={submit}
        className="
          w-full max-w-md p-6 md:p-8 rounded-2xl
          bg-white/95 dark:bg-[var(--surface)]/95
          backdrop-blur-2xl

          border border-white/50 dark:border-[var(--primary)]/20
          shadow-2xl shadow-black/20

          animate-[fadeIn_.5s_ease]

          space-y-5
        "
      >
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-[var(--accent)] -mt-3">Log in to TutorHours</p>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-600 dark:text-red-400 text-center animate-[fadeIn_.3s_ease]">
            {error}
          </div>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="
            w-full p-3 rounded-lg
            bg-gray-50 dark:bg-[var(--surface)]
            border border-gray-200 dark:border-[var(--primary)]/20
            text-gray-800 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-[var(--accent)]/50
            focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40
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
              bg-gray-50 dark:bg-[var(--surface)]
              border border-gray-200 dark:border-[var(--primary)]/20
              text-gray-800 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-[var(--accent)]/50
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40
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
              text-gray-400 hover:text-gray-700 dark:hover:text-white
            "
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}

          </button>
        </div>

        {/* Forgot */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="
            w-full py-3 rounded-lg font-semibold
            bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]
            text-white
            hover:shadow-lg hover:shadow-[var(--primary)]/30
            transition-all duration-200
            active:scale-95
            disabled:opacity-60
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center w-full gap-4">
            <div className="h-px bg-gray-200 dark:bg-[var(--primary)]/20 flex-1" />
            <span className="text-xs text-gray-400 uppercase">OR</span>
            <div className="h-px bg-gray-200 dark:bg-[var(--primary)]/20 flex-1" />
          </div>

          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login failed")}
              theme="outline"
              size="large"
              shape="pill"
            />
          </div>
        </div>

        {/* Register */}
        <p className="text-sm text-center text-gray-500 dark:text-[var(--accent)]/70">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-[var(--primary)] dark:text-[var(--accent)] hover:underline">
            Register
          </Link>
        </p>
        <Link to="/" className="block text-sm text-center text-gray-500 dark:text-[var(--accent)]/60 hover:text-[var(--primary)] dark:hover:text-white hover:underline">
          Back to Home
        </Link>
      </form>
    </div>
  );
}

export default Login;
