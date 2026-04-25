import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const links = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Features", path: "/features" },
    { label: "Pricing", path: "/pricing" },
    { label: "Blog", path: "/blog" },
    { label: "FAQ", path: "/faq" },
    { label: "Careers", path: "/careers" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`
        sticky top-0 z-50
        transition-all duration-500
        ${scrolled
            ? "backdrop-blur-2xl bg-white/85 dark:bg-[var(--surface)]/90 shadow-lg shadow-[var(--primary)]/10"
            : "backdrop-blur-sm bg-white/60 dark:bg-transparent"
          }
        border-b border-[var(--primary)]/10 dark:border-[var(--primary)]/20
      `}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="
            w-9 h-9 rounded-xl grad-bg
            flex items-center justify-center text-white font-bold text-lg
            shadow-lg shadow-[var(--primary)]/30
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
          <nav className="hidden lg:flex items-center gap-6">
            {links.map((item) => {
              const isActive = location.pathname === item.path;
              return item.isHash ? (
                <a
                  key={item.label}
                  href={item.path}
                  className={`
                    text-sm font-medium transition-colors duration-200 relative
                    ${isActive 
                      ? "text-[var(--primary)] dark:text-[var(--accent)]" 
                      : "text-slate-600 dark:text-slate-100 hover:text-[var(--primary)] dark:hover:text-[var(--accent)]"}
                    after:absolute after:-bottom-1 after:left-0 after:h-0.5
                    after:bg-[var(--primary)] dark:after:bg-[var(--accent)]
                    after:transition-all after:duration-300
                    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
                  `}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`
                    text-sm font-medium transition-colors duration-200 relative
                    ${isActive 
                      ? "text-[var(--primary)] dark:text-[var(--accent)]" 
                      : "text-slate-600 dark:text-slate-100 hover:text-[var(--primary)] dark:hover:text-[var(--accent)]"}
                    after:absolute after:-bottom-1 after:left-0 after:h-0.5
                    after:bg-[var(--primary)] dark:after:bg-[var(--accent)]
                    after:transition-all after:duration-300
                    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="
              w-10 h-10 rounded-xl
              bg-[var(--surface-alt)] dark:bg-[var(--primary)]/20
              text-[var(--primary)] dark:text-[var(--accent)]
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
              border-2 border-[var(--primary)]/30 dark:border-[var(--primary)]/50
              text-[var(--primary)] dark:text-[var(--accent)]
              hover:border-[var(--primary)] hover:bg-[var(--primary)]/5
              dark:hover:bg-[var(--primary)]/15
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
              shadow-lg shadow-[var(--primary)]/30
              hover:shadow-xl hover:shadow-[var(--primary)]/40
              hover:scale-105
              transition-all duration-200
            "
            >
              Sign Up Free
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`w-6 h-0.5 bg-[var(--primary)] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-6 h-0.5 bg-[var(--primary)] transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`w-6 h-0.5 bg-[var(--primary)] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden px-6 pb-5 pt-2 bg-white dark:bg-[var(--surface)] border-t border-[var(--primary)]/10 animate-slideUp">
            {links.map((item) => {
              const isActive = location.pathname === item.path;
              return item.isHash ? (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    block py-3 font-medium border-b border-[var(--primary)]/08 dark:border-[var(--primary)]/10
                    ${isActive 
                      ? "text-[var(--primary)] dark:text-[var(--accent)]" 
                      : "text-slate-700 dark:text-slate-100 hover:text-[var(--primary)]"}
                  `}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    block py-3 font-medium border-b border-[var(--primary)]/08 dark:border-[var(--primary)]/10
                    ${isActive 
                      ? "text-[var(--primary)] dark:text-[var(--accent)]" 
                      : "text-slate-700 dark:text-slate-100 hover:text-[var(--primary)]"}
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setShowLogin(true); setMenuOpen(false); }} className="flex-1 py-2.5 rounded-xl border-2 border-[var(--primary)]/30 text-[var(--primary)] font-semibold text-sm">Login</button>
              <button onClick={() => { setShowRegister(true); setMenuOpen(false); }} className="flex-1 py-2.5 rounded-xl grad-bg text-white font-semibold text-sm shadow-lg shadow-[var(--primary)]/30">Sign Up</button>
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
