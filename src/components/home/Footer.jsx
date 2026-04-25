import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const footerLinks = {
  Platform: [
    { label: "Find Tutors", to: "/" },
    { label: "Become a Tutor", to: "/register/professor" },
    { label: "Pricing", to: "/pricing" },
    { label: "Careers", to: "/careers" },
  ],
  Resources: [
    { label: "About Us", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "FAQ", to: "/faq" },
    { label: "Contact Us", to: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Refund Policy", to: "/refund-policy" },
    { label: "All Policies", to: "/legal" },
  ],
};

export default function Footer() {
  return (
    <footer className="
      relative
      bg-[var(--surface)] dark:bg-[var(--surface)]
      border-t border-[var(--primary)]/20
      pt-16 pb-8 mt-0 overflow-hidden
    ">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-80 rounded-full bg-[var(--primary)]/08 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-5 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl grad-bg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[var(--primary)]/30">
                T
              </div>
              <span className="text-xl font-extrabold">
                <span className="grad-text">Tutor</span>
                <span className="text-slate-900 dark:text-white">Hours</span>
              </span>
            </div>

            <p className="text-[var(--accent)] text-sm leading-relaxed max-w-xs">
              Connecting students with verified professors through modern
              virtual classrooms and personalized learning experiences.
            </p>

            {/* Socials */}
            <div className="flex gap-3 mt-6">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <button
                  key={i}
                  className="
                    w-9 h-9 rounded-xl
                    flex items-center justify-center
                    bg-[var(--primary)]/20 border border-[var(--primary)]/30
                    text-[var(--accent)]
                    hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]
                    hover:scale-110 hover:shadow-lg hover:shadow-[var(--primary)]/30
                    transition-all duration-200
                  "
                >
                  <Icon className="text-sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-5 text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => {
                  const isObj = typeof link === "object";
                  return (
                    <li key={isObj ? link.label : link}>
                      {isObj ? (
                        <Link
                          to={link.to}
                          className="text-sm text-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href="#"
                          className="text-sm text-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200"
                        >
                          {link}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--primary)]/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--accent)]/60">
            © {new Date().getFullYear()} TutorHours. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-[var(--accent)]/60">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            All systems operational
          </div>
          <div className="flex gap-2">
            <Link to="/privacy" className="text-xs px-3 py-1 rounded-full border border-[var(--primary)]/30 text-[var(--accent)] hover:text-white hover:border-[var(--primary)] transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs px-3 py-1 rounded-full border border-[var(--primary)]/30 text-[var(--accent)] hover:text-white hover:border-[var(--primary)] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
