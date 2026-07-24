import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { FiMoon, FiSun, FiLogOut, FiLayout, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(true);
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
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // check initial state on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "professor") return "/professor/dashboard";
    return "/student/dashboard";
  };

  const links = [
    { label: "Home", path: "/" },
    { label: "Courses", path: "/courses" },
    { label: "Live Classes", path: "/live-classes" },
    { label: "About Us", path: "/about" },
    { label: "Features", path: "/features" },
    { label: "Pricing", path: "/pricing" },
    { label: "Blog", path: "/blog" },
    { label: "FAQ", path: "/faq" },
    { label: "Careers", path: "/careers" },
    { label: "Contact", path: "/contact" },
  ];

  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `
      relative text-sm font-medium transition-all duration-200
      ${isActive
        ? "text-[var(--accent)] font-semibold"
        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}
      after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full
      after:bg-gradient-to-r after:from-[var(--accent)] after:to-[var(--glow)]
      after:transition-all after:duration-300
      ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
    `;
  };

  return (
    <>
      <header
        className={`
          fixed inset-x-0 top-0 w-full z-50 transition-all duration-500
          ${scrolled
            ? "backdrop-blur-2xl bg-[var(--bg)]/90 dark:bg-[#050816]/90 shadow-xl shadow-black/20 dark:shadow-black/40 border-b border-[var(--border)] py-2.5 lg:py-3"
            : "bg-transparent border-b border-transparent shadow-none py-3.5 lg:py-4"}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group z-10 flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-[var(--accent)]/20 blur-md group-hover:blur-lg transition-all duration-300" />
              <img
                src="/logos/vishidh-logo-768x384.webp"
                alt="VishidhAcademy"
                className="relative h-9 sm:h-11 md:h-13 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-5 xl:gap-7 px-4">
            {links.map((item) => (
              <Link key={item.label} to={item.path} className={navLinkClass(item.path)}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="
                w-9 h-9 rounded-xl
                bg-[var(--surface-alt)] border border-[var(--border)]
                text-[var(--text-muted)] hover:text-[var(--accent)]
                hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30
                hover:scale-105
                transition-all duration-200
                flex items-center justify-center text-base
              "
            >
              {dark ? <FiSun /> : <FiMoon />}
            </button>

            {user ? (
              <>
                {/* Dashboard Button */}
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="
                    hidden sm:flex items-center gap-1.5
                    px-4 py-2 rounded-xl text-sm font-semibold text-white
                    bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)]
                    shadow-lg shadow-[var(--accent)]/20
                    hover:shadow-[var(--accent)]/40 hover:scale-105
                    transition-all duration-200
                  "
                >
                  <FiLayout size={14} /> Dashboard
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="
                    hidden sm:flex items-center gap-1.5
                    px-4 py-2 rounded-xl text-sm font-semibold
                    border border-red-500/25 text-red-400
                    hover:bg-red-500/10 hover:border-red-500/50
                    transition-all duration-200
                  "
                >
                  <FiLogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <button
                  onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                  className="
                    hidden sm:block
                    px-4 py-2 rounded-xl text-sm font-semibold
                    border border-[var(--border-soft)] text-[var(--text-muted)]
                    hover:border-[var(--accent)]/50 hover:text-[var(--accent)]
                    hover:bg-[var(--accent)]/05
                    transition-all duration-200
                  "
                >
                  Login
                </button>

                {/* Sign Up — glowing CTA */}
                <button
                  onClick={() => { setShowRegister(true); setMenuOpen(false); }}
                  className="
                    hidden sm:flex items-center gap-1.5
                    px-5 py-2 rounded-xl text-sm font-bold text-white
                    bg-gradient-to-r from-[var(--secondary)] via-[var(--accent)] to-[var(--glow)]
                    shadow-lg shadow-[var(--accent)]/30
                    hover:shadow-[var(--accent)]/60 hover:scale-105
                    transition-all duration-300
                    btn-ripple relative overflow-hidden
                  "
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    ✦ Sign Up Free
                  </span>
                </button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-9 h-9 rounded-xl border border-[var(--card-border)] bg-[var(--surface-alt)] flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 transition-all duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden px-4 sm:px-6 pb-5 pt-3 bg-[var(--bg)]/95 backdrop-blur-2xl border-t border-[var(--border)] animate-slideUp">
            <div className="flex flex-col gap-1">
              {links.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                      ${isActive
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--text-primary)]"}
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--border)]">
              {user ? (
                <>
                  <button
                    onClick={() => { navigate(getDashboardPath()); setMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] text-white font-semibold text-sm shadow-lg"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl border border-red-500/25 text-red-400 font-semibold text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl border border-[var(--border-soft)] text-[var(--text-muted)] font-semibold text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setShowRegister(true); setMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] text-white font-bold text-sm shadow-lg shadow-[var(--accent)]/30"
                  >
                    Sign Up Free
                  </button>
                </>
              )}
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
