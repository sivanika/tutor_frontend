import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RegisterProfessor() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register("", email, password, "professor");
      // Store plan for onboarding reference
      if (plan) sessionStorage.setItem("selectedPlan", plan);
      navigate("/professor/onboarding");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
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
      "
    >
      <form
        onSubmit={submit}
        className="
          w-full max-w-md p-6 md:p-8 rounded-2xl space-y-5
          bg-white/95 dark:bg-[var(--surface)]/95
          backdrop-blur-2xl
          border border-white/50 dark:border-[var(--primary)]/20
          shadow-2xl shadow-black/20
          animate-[popup_.5s_ease]
        "
      >
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Professor Registration
          </h2>
          <p className="text-sm text-gray-500 dark:text-[var(--accent)] mt-1">Create your professor account</p>

          {/* Plan badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold">
            <span>💡</span>
            List free · Earn with 18% commission model
          </div>
        </div>

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
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Terms & Privacy consent */}
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer flex-shrink-0"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
          />
          <span className="text-xs text-gray-600 dark:text-[var(--accent)]/70 leading-relaxed">
            I agree to the{" "}
            <Link to="/terms" target="_blank" className="text-[var(--primary)] underline hover:text-[var(--primary)]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" target="_blank" className="text-[var(--primary)] underline hover:text-[var(--primary)]">
              Privacy Policy
            </Link>
          </span>
        </label>

        {/* Continue Button */}
        <button
          disabled={loading || !agreed}
          className="
            w-full py-3 rounded-lg font-semibold
            bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]
            text-white
            hover:shadow-lg hover:shadow-[var(--primary)]/30
            transition-all duration-200
            active:scale-95
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Creating account...
            </>
          ) : (
            "Continue →"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-gray-400 dark:text-[var(--accent)]/40 text-sm">
          <div className="flex-1 h-px bg-gray-200 dark:bg-[var(--primary)]/20" />
          OR
          <div className="flex-1 h-px bg-gray-200 dark:bg-[var(--primary)]/20" />
        </div>

        {/* Google Button (UI only) */}
        <button
          type="button"
          className="
            w-full py-3 rounded-lg font-medium
            bg-white dark:bg-[var(--surface)] text-gray-700 dark:text-white
            border border-gray-200 dark:border-[var(--primary)]/20
            hover:bg-gray-50 dark:hover:bg-[#1a1035]
            transition
          "
        >
          Sign in with Google
        </button>

        {/* Login redirect */}
        <p className="text-center text-sm text-gray-500 dark:text-[var(--accent)]/70">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-semibold text-[var(--primary)] dark:text-[var(--accent)] hover:underline"
          >
            Login
          </span>
        </p>
      </form>

      {/* animation */}
      <style>
        {`
          @keyframes popup {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.96);
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
