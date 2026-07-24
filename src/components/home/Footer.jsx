import { useState } from "react";
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiSend } from "react-icons/fi";

const footerLinks = {
  Platform: [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "Live Classes", to: "/live-classes" },
    { label: "Features", to: "/features" },
    { label: "Pricing", to: "/pricing" },
  ],
  Resources: [
    { label: "About Us", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "FAQ", to: "/faq" },
    { label: "Careers", to: "/careers" },
    { label: "Contact Us", to: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Refund Policy", to: "/refund-policy" },
    { label: "All Policies", to: "/legal" },
  ],
};

const socials = [
  { Icon: FaFacebookF, href: "#", label: "Facebook" },
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaInstagram, href: "#", label: "Instagram" },
  { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  { Icon: FaYoutube, href: "#", label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer
      className="relative overflow-hidden border-t border-[var(--border)]"
      style={{ background: "var(--section-bg-alt)" }}
    >
      {/* Top aurora glow divider */}
      <div className="absolute top-0 left-0 right-0 h-px glow-divider" />

      {/* Background orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-80 rounded-full opacity-15" style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.3), transparent 70%)", filter: "blur(60px)" }} />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        <div
          className="rounded-3xl p-6 sm:p-10 mb-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, #0d1e3d 0%, #060e1c 100%)",
            border: "1px solid rgba(6,182,212,0.35)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 12px 40px rgba(5,8,22,0.25)",
          }}
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Stay in the loop 🚀</h3>
            <p className="text-white/70 text-sm">New courses, professor spotlights, and study tips — weekly.</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto sm:min-w-[340px]">
            {submitted ? (
              <div className="flex-1 py-3 px-4 rounded-xl text-center text-sm text-[var(--accent)] font-semibold" style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)" }}>
                ✓ You're subscribed!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-light)] bg-[var(--input-bg)] border border-[var(--border-soft)] outline-none focus:border-[var(--accent)]/50 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="shrink-0 px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 4px 20px rgba(6,182,212,0.3)" }}
                >
                  <FiSend size={14} /> Subscribe
                </button>
              </>
            )}
          </form>
        </div>

        {/* Main footer grid */}
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-white p-2.5 rounded-2xl shadow-md">
                <img
                  src="/logos/vishidh-logo-1024x512.webp"
                  alt="VishidhAcademy"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs mb-6">
              Connecting students with verified professors through modern virtual classrooms
              and personalized AI-powered learning experiences.
            </p>


            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="
                    w-9 h-9 rounded-xl flex items-center justify-center text-sm
                    bg-[var(--surface-alt)] border border-[var(--border-soft)] text-[var(--text-muted)]
                    hover:bg-[var(--accent)]/15 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]
                    hover:scale-110 hover:shadow-lg
                    transition-all duration-200
                  "
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold mb-5 text-[var(--text-primary)] text-xs uppercase tracking-widest">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-light)]">
            © {new Date().getFullYear()} VishidhAcademy. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-light)]">
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            All systems operational
          </div>
          <div className="flex gap-2">
            <Link to="/privacy" className="text-xs px-3 py-1 rounded-full border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs px-3 py-1 rounded-full border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
