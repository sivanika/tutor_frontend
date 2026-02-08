import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="
        relative
        bg-gradient-to-br
        from-indigo-50 to-purple-100
        dark:from-slate-900 dark:to-slate-950
        border-t border-gray-200 dark:border-slate-800
        pt-16 pb-8 mt-20
      "
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* GRID */}
        <div className="grid md:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              ProfessorOn
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Connecting students with verified professors through modern
              virtual classrooms and flexible learning experiences.
            </p>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="
                      w-9 h-9 rounded-full
                      flex items-center justify-center
                      bg-white dark:bg-slate-800
                      shadow hover:scale-110 transition
                      cursor-pointer
                    "
                  >
                    <Icon className="text-indigo-600 dark:text-indigo-400 text-sm" />
                  </div>
                )
              )}
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Platform
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="hover:text-indigo-600 cursor-pointer">
                Find Tutors
              </li>
              <li className="hover:text-indigo-600 cursor-pointer">
                Become Tutor
              </li>
              <li className="hover:text-indigo-600 cursor-pointer">
                Pricing
              </li>
              <li className="hover:text-indigo-600 cursor-pointer">
                Dashboard
              </li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Resources
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="hover:text-indigo-600 cursor-pointer">Blog</li>
              <li className="hover:text-indigo-600 cursor-pointer">Help Center</li>
              <li className="hover:text-indigo-600 cursor-pointer">Guides</li>
              <li className="hover:text-indigo-600 cursor-pointer">
                Community
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>📧 support@professoron.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Chennai, India</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="
            border-t border-gray-200 dark:border-slate-800
            mt-12 pt-6
            text-center text-sm
            text-gray-500 dark:text-gray-400
          "
        >
          © {new Date().getFullYear()} ProfessorOn. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
