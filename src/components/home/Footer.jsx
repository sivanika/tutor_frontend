import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const footerLinks = {
  Platform: ["Find Tutors", "Become a Tutor", "Pricing", "Dashboard"],
  Resources: ["Blog", "Help Center", "Guides", "Community"],
  Company: ["About Us", "Careers", "Privacy Policy", "Terms"],
};

export default function Footer() {
  return (
    <footer className="
      relative
      bg-[#0f0720] dark:bg-[#0a0418]
      border-t border-[#6A11CB]/20
      pt-16 pb-8 mt-0 overflow-hidden
    ">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-80 rounded-full bg-[#6A11CB]/08 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-5 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl grad-bg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#6A11CB]/30">
                T
              </div>
              <span className="text-xl font-extrabold">
                <span className="grad-text">Tutor</span>
                <span className="text-white">Hours</span>
              </span>
            </div>

            <p className="text-[#a78bfa] text-sm leading-relaxed max-w-xs">
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
                    bg-[#6A11CB]/20 border border-[#6A11CB]/30
                    text-[#a78bfa]
                    hover:bg-[#6A11CB] hover:text-white hover:border-[#6A11CB]
                    hover:scale-110 hover:shadow-lg hover:shadow-[#6A11CB]/30
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
              <h3 className="font-semibold mb-5 text-white text-sm uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#a78bfa] hover:text-[#FF4E9B] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#6A11CB]/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#a78bfa]/60">
            © {new Date().getFullYear()} TutorHours. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-[#a78bfa]/60">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            All systems operational
          </div>
          <div className="flex gap-2">
            <span className="text-xs px-3 py-1 rounded-full border border-[#6A11CB]/30 text-[#a78bfa]">Privacy</span>
            <span className="text-xs px-3 py-1 rounded-full border border-[#6A11CB]/30 text-[#a78bfa]">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
