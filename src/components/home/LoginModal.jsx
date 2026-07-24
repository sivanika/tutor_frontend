import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiEye, FiEyeOff, FiX, FiLock, FiMail } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

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

      if (user.role === "admin") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        setError("Admin accounts must use the admin portal to login.");
        return;
      }

      onClose();

      if (user.role === "professor") {
        if (!user.profileCompleted) return navigate("/professor/onboarding");
        if (!user.isVerified) return navigate("/verification-pending");
        return navigate("/professor/dashboard");
      }

      if (user.role === "student") {
        if (!user.profileCompleted) return navigate("/student/onboarding");
        return navigate("/student/dashboard");
      }
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
      const user = await googleLogin(credentialResponse.credential);
      
      onClose();

      if (user.role === "professor") {
        if (!user.profileCompleted) return navigate("/professor/onboarding");
        if (!user.isVerified) return navigate("/verification-pending");
        return navigate("/professor/dashboard");
      }

      if (user.role === "student") {
        if (!user.profileCompleted) return navigate("/student/onboarding");
        return navigate("/student/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Google Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--overlay-bg)] backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-md p-8 rounded-3xl
          border border-[var(--card-border)] shadow-2xl
          animate-slideUp space-y-5 overflow-hidden
          bg-[var(--modal-bg)]
        "
      >
        {/* Glow orbs */}
        <div className="absolute -top-20 -left-20 w-48 h-48 orb-blue opacity-30 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 orb-purple opacity-30 pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--surface-alt)] hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center transition border border-[var(--border)] z-10"
        >
          <FiX size={18} />
        </button>

        {/* Title */}
        <div className="text-center pt-2 relative z-10">
          <h2 className="text-3xl font-black text-[var(--text-primary)]">Welcome Back</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Log in to your VishidhAcademy account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-xs text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="relative z-10">
          <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-3.5 text-[var(--text-light)]" size={16} />
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full py-3 pl-11 pr-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-soft)] text-[var(--text-primary)] placeholder:text-[var(--text-light)] text-sm outline-none focus:border-[var(--accent)]/50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="relative z-10">
          <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Password</label>
          <div className="relative">
            <FiLock className="absolute left-4 top-3.5 text-[var(--text-light)]" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full py-3 pl-11 pr-12 rounded-xl bg-[var(--input-bg)] border border-[var(--border-soft)] text-[var(--text-primary)] placeholder:text-[var(--text-light)] text-sm outline-none focus:border-[var(--accent)]/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-[var(--text-light)] hover:text-[var(--text-primary)] transition"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div className="text-right relative z-10">
          <Link
            to="/forgot-password"
            onClick={onClose}
            className="text-xs text-[var(--accent)] font-semibold hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="
            w-full py-3.5 rounded-xl font-bold text-sm text-white
            bg-gradient-to-r from-[var(--secondary)] via-[var(--accent)] to-[var(--glow)]
            shadow-lg shadow-[var(--accent)]/25
            hover:shadow-[var(--accent)]/50 hover:scale-[1.02]
            transition-all duration-200 disabled:opacity-60 relative z-10
          "
        >
          {loading ? "Logging in..." : "Login →"}
        </button>

        <div className="flex flex-col items-center gap-4 relative z-10 pt-1">
          <div className="flex items-center w-full gap-3">
            <div className="h-px bg-[var(--border)] flex-1" />
            <span className="text-[10px] text-[var(--text-light)] font-bold uppercase tracking-widest">OR</span>
            <div className="h-px bg-[var(--border)] flex-1" />
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

        {/* Switch to register */}
        <p className="text-xs text-center text-[var(--text-muted)] relative z-10 pt-1">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-[var(--accent)] hover:underline"
          >
            Sign Up Free
          </button>
        </p>
      </form>
    </div>
  );
}
