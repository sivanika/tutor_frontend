import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const submit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const { data } = await API.post("/auth/login", { email, password });

    const { token, user } = data;

    // ⭐ FIX HERE — store as userInfo
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        token,
        user,
      })
    );

    // ===== navigation logic =====
    if (!user.profileCompleted) {
      // if (user.role === "professor") return navigate("/professor/dashboard");
      // if (user.role === "student") return navigate("/student/onboarding");
    }

    if (user.role === "admin") return navigate("/admin/dashboard");

    if (user.role === "professor") {
      if (!user.isVerified) return navigate("/verification-pending");
      return navigate("/professor/dashboard");
    }

    if (user.role === "student") return navigate("/student/dashboard");

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-6

        bg-slate-100
        dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black

        transition-colors duration-500
      "
    >
      {/* Card */}
      <form
        onSubmit={submit}
        className="
          w-full max-w-md p-8 rounded-2xl

          bg-white/90 dark:bg-slate-900/80
          backdrop-blur-2xl

          border border-slate-200 dark:border-slate-800
          shadow-xl dark:shadow-black/40

          animate-[fadeIn_.5s_ease]

          space-y-5
        "
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">
          Welcome Back
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
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
              bg-slate-50 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-slate-500
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
              text-slate-500 hover:text-slate-800
              dark:hover:text-white
            "
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Forgot */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="
            w-full py-3 rounded-lg font-semibold

            bg-slate-900 text-white
            hover:bg-black

            dark:bg-slate-100 dark:text-black
            dark:hover:bg-white

            transition-all duration-200
            active:scale-95
            disabled:opacity-60
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <p className="text-sm text-center text-slate-600 dark:text-slate-400">
          Don’t have an account?{" "}
          <Link to="/register" className="font-medium hover:underline">
            Register
          </Link>
        </p>
        <Link to="/" className="block text-sm text-center text-slate-600 dark:text-slate-400 hover:underline">
          Back to Home
        </Link>
      </form>

      {/* animation style */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(25px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Login;
