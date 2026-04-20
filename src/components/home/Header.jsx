import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function Header() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Body scroll lock when modal is open
  useEffect(() => {
    document.body.style.overflow = (showLogin || showRegister) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showLogin, showRegister]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const navLinks = ["Features", "Pricing", "Testimonials", "Contact"];

  return (
    <>
      <header
        className={`
        sticky top-0 z-50
        transition-all duration-500
        ${scrolled
            ? "backdrop-blur-2xl bg-white/85 dark:bg-[#0f0720]/90 shadow-lg shadow-[#6A11CB]/10"
            : "backdrop-blur-sm bg-white/60 dark:bg-transparent"
          }
        border-b border-[#6A11CB]/10 dark:border-[#6A11CB]/20
      `}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="
            w-9 h-9 rounded-xl grad-bg
            flex items-center justify-center text-white font-bold text-lg
            shadow-lg shadow-[#6A11CB]/30
            group-hover:scale-110 transition-transform duration-300
          ">
              T
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="grad-text">Tutor</span>
              <span className="text-slate-800 dark:text-white">Hours</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="
                text-sm font-medium text-slate-600 dark:text-slate-300
                hover:text-[#6A11CB] dark:hover:text-[#FF4E9B]
                transition-colors duration-200 relative
                after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5
                after:bg-[#6A11CB] dark:after:bg-[#FF4E9B]
                after:transition-all after:duration-300
                hover:after:w-full
              "
              >
                {item}
              </a>
            ))}
            <Link
              to="/careers"
              className="
              text-sm font-medium text-slate-600 dark:text-slate-300
              hover:text-[#FF4E9B] dark:hover:text-[#FF4E9B]
              transition-colors duration-200 relative
              after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5
              after:bg-[#FF4E9B]
              after:transition-all after:duration-300
              hover:after:w-full
            "
            >
              Careers
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="
              w-10 h-10 rounded-xl
              bg-[#f5f3ff] dark:bg-[#6A11CB]/20
              text-[#6A11CB] dark:text-[#a78bfa]
              hover:scale-105 hover:shadow-md
              transition-all duration-200
              flex items-center justify-center text-lg
            "
            >
              {dark ? "🌙" : "☀️"}
            </button>

            {/* Login */}
            <button
              onClick={() => { setShowLogin(true); setMenuOpen(false); }}
              className="
              hidden sm:block
              px-5 py-2 rounded-xl text-sm font-semibold
              border-2 border-[#6A11CB]/30 dark:border-[#6A11CB]/50
              text-[#6A11CB] dark:text-[#a78bfa]
              hover:border-[#6A11CB] hover:bg-[#6A11CB]/5
              dark:hover:bg-[#6A11CB]/15
              transition-all duration-200
            "
            >
              Login
            </button>

            {/* Sign Up */}
            <button
              onClick={() => { setShowRegister(true); setMenuOpen(false); }}
              className="
              hidden sm:block
              px-5 py-2 rounded-xl text-sm font-semibold text-white
              grad-bg
              shadow-lg shadow-[#6A11CB]/30
              hover:shadow-xl hover:shadow-[#6A11CB]/40
              hover:scale-105
              transition-all duration-200
            "
            >
              Sign Up Free
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`w-6 h-0.5 bg-[#6A11CB] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-6 h-0.5 bg-[#6A11CB] transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`w-6 h-0.5 bg-[#6A11CB] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-5 pt-2 bg-white dark:bg-[#0f0720] border-t border-[#6A11CB]/10 animate-slideUp">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-slate-700 dark:text-slate-300 hover:text-[#6A11CB] font-medium border-b border-[#6A11CB]/08 dark:border-[#6A11CB]/10"
              >
                {item}
              </a>
            ))}
            <Link
              to="/careers"
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-slate-700 dark:text-slate-300 hover:text-[#FF4E9B] font-medium border-b border-[#6A11CB]/08 dark:border-[#6A11CB]/10"
            >
              Careers
            </Link>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setShowLogin(true); setMenuOpen(false); }} className="flex-1 py-2.5 rounded-xl border-2 border-[#6A11CB]/30 text-[#6A11CB] font-semibold text-sm">Login</button>
              <button onClick={() => { setShowRegister(true); setMenuOpen(false); }} className="flex-1 py-2.5 rounded-xl grad-bg text-white font-semibold text-sm shadow-lg shadow-[#6A11CB]/30">Sign Up</button>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
    </>
  );
}
