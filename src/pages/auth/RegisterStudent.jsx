import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function RegisterStudent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", {
        email,
        password,
        role: "student",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/student/onboarding");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
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
      <form
        onSubmit={submit}
        className="
          w-full max-w-md p-8 rounded-2xl space-y-5

          bg-white/90 dark:bg-slate-900/80
          backdrop-blur-2xl

          border border-slate-200 dark:border-slate-800
          shadow-xl dark:shadow-black/40

          animate-[popup_.5s_ease]
        "
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
          Student Registration
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

        {/* Continue Button */}
        <button
          className="
            w-full py-3 rounded-lg font-semibold

            bg-slate-900 text-white
            hover:bg-black

            dark:bg-slate-100 dark:text-black
            dark:hover:bg-white

            transition-all duration-200
            active:scale-95
          "
        >
          Continue
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700" />
          OR
          <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Google Button (UI only) */}
        <button
          type="button"
          className="
            w-full py-3 rounded-lg font-medium

            bg-white text-slate-800
            border border-slate-300
            hover:bg-slate-100

            dark:bg-slate-800 dark:text-white
            dark:border-slate-700
            dark:hover:bg-slate-700

            transition
          "
        >
          Sign in with Google
        </button>
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
