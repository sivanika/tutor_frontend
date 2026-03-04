import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiShield, FiLock, FiMail, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            const user = await login(email, password);

            // Only allow admin role
            if (user.role !== "admin") {
                // Clear auth state immediately
                localStorage.removeItem("userInfo");
                localStorage.removeItem("token");
                setError("Access denied. This login is for administrators only.");
                return;
            }

            navigate("/admin/dashboard");
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
        bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]
        transition-colors duration-500
      "
        >
            {/* Floating decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-red-500/5 blur-3xl" />
                <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/3 blur-3xl" />
            </div>

            <form
                onSubmit={submit}
                className="
          relative z-10
          w-full max-w-md p-8 rounded-2xl

          bg-[#1a1a2e]/90
          backdrop-blur-2xl

          border border-white/10
          shadow-2xl shadow-black/40

          animate-[fadeIn_.5s_ease]

          space-y-5
        "
            >
                {/* Shield Icon */}
                <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <FiShield size={28} className="text-white" />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">
                        Admin Portal
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Authorized personnel only
                    </p>
                </div>

                {/* Security warning bar */}
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                    <FiLock size={14} className="text-red-400 shrink-0" />
                    <p className="text-xs text-red-300/80">
                        This is a restricted access area. Unauthorized access attempts are logged.
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400 text-center animate-[fadeIn_.3s_ease]">
                        {error}
                    </div>
                )}

                {/* Email */}
                <div className="relative">
                    <FiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="email"
                        placeholder="Admin email"
                        className="
              w-full p-3 pl-11 rounded-lg
              bg-white/5
              border border-white/10
              text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40
              transition
            "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Password */}
                <div className="relative">
                    <FiLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="
              w-full p-3 pl-11 pr-12 rounded-lg
              bg-white/5
              border border-white/10
              text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40
              transition
            "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                </div>

                {/* Login Button */}
                <button
                    disabled={loading}
                    className="
            w-full py-3 rounded-lg font-semibold
            bg-gradient-to-r from-red-600 to-orange-500
            text-white
            hover:shadow-lg hover:shadow-red-500/20
            transition-all duration-200
            active:scale-95
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Authenticating...
                        </>
                    ) : (
                        <>
                            <FiShield size={16} />
                            Access Admin Panel
                        </>
                    )}
                </button>

                {/* Back to main site link */}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition mt-2"
                >
                    <FiArrowLeft size={14} />
                    Back to main site
                </button>
            </form>
        </div>
    );
}

export default AdminLogin;
