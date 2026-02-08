import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  /* -----------------------------
     Dark Mode Setup
  ----------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header
      className="
        sticky top-0 z-50
        backdrop-blur-2xl

        bg-white/80
        dark:bg-slate-950/80

        border-b border-slate-200 dark:border-slate-800
        shadow-md dark:shadow-black/30

        transition-colors duration-500
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* ---------------- Logo ---------------- */}
        <Link
          to="/"
          className="
            text-2xl font-bold
            text-slate-800 dark:text-slate-100
            tracking-tight
          "
        >
          🎓 ProfessorOn
        </Link>

        {/* ---------------- Nav Links ---------------- */}
        <nav className="hidden md:flex space-x-8 font-medium">
          {["Features", "Pricing", "Reviews", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="
                text-slate-600 dark:text-slate-300
                hover:text-black dark:hover:text-white
                transition
              "
            >
              {item}
            </a>
          ))}
        </nav>

        {/* ---------------- Right Buttons ---------------- */}
        <div className="flex items-center space-x-3">

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="
              w-10 h-10 rounded-xl
              bg-slate-200 dark:bg-slate-800
              text-slate-700 dark:text-slate-200
              hover:scale-105
              transition
            "
          >
            {dark ? "🌙" : "☀️"}
          </button>

          {/* Login */}
          <button
            onClick={() => navigate("/login")}
            className="
              px-5 py-2 rounded-xl
              border border-slate-300 dark:border-slate-700
              text-slate-700 dark:text-slate-200
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
          >
            Login
          </button>

          {/* Register */}
          <button
            onClick={() => navigate("/register")}
            className="
              px-5 py-2 rounded-xl
              bg-slate-900 text-white
              dark:bg-white dark:text-black
              hover:opacity-90
              shadow-md
              transition
            "
          >
            Sign Up
          </button>

        </div>
      </div>
    </header>
  );
}
