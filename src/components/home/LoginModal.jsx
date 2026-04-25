import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginModal({ onClose, onSwitchToRegister }) {
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

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <form
                onSubmit={submit}
                onClick={(e) => e.stopPropagation()}
                className="
          relative w-full max-w-md p-8 rounded-2xl
          bg-white/95 dark:bg-[var(--surface)]/95 backdrop-blur-2xl
          border border-white/50 dark:border-[var(--primary)]/20
          shadow-2xl shadow-black/20
          animate-[modalIn_.3s_ease] space-y-5
        "
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-[var(--surface)] hover:bg-gray-200 dark:hover:bg-[var(--primary)]/20 flex items-center justify-center text-gray-500 dark:text-[var(--accent)] hover:text-gray-800 dark:hover:text-white transition"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Welcome Back</h2>
                <p className="text-center text-sm text-gray-500 dark:text-[var(--accent)] -mt-3">Log in to TutorHours</p>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-600 dark:text-red-400 text-center">
                        {error}
                    </div>
                )}

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full p-3 rounded-lg bg-gray-50 dark:bg-[var(--surface)] border border-gray-200 dark:border-[var(--primary)]/20 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {/* Password */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full p-3 rounded-lg pr-12 bg-gray-50 dark:bg-[var(--surface)] border border-gray-200 dark:border-[var(--primary)]/20 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 transition"
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

                {/* Forgot */}
                <div className="text-right">
                    <Link
                        to="/forgot-password"
                        onClick={onClose}
                        className="text-sm text-[var(--primary)] hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Submit */}
                <button
                    disabled={loading}
                    className="
            w-full py-3 rounded-lg font-semibold
            bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]
            text-white
            hover:shadow-lg hover:shadow-[var(--primary)]/30
            transition-all duration-200 active:scale-95
            disabled:opacity-60
          "
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* Switch to register */}
                <p className="text-sm text-center text-gray-500 dark:text-[var(--accent)]/70">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="font-medium text-[var(--primary)] dark:text-[var(--accent)] hover:underline"
                    >
                        Register
                    </button>
                </p>
            </form>

            <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
}
