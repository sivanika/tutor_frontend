import {
  FiMonitor, FiCpu, FiTrendingUp, FiCheckSquare,
  FiAward, FiVideo, FiMessageSquare, FiCalendar,
} from "react-icons/fi";

const features = [
  {
    icon: <FiMonitor />,
    title: "Live 1:1 & Group Classes",
    desc: "Interactive virtual classrooms with verified professors — live video, whiteboard, and screen sharing.",
    color: "#3B82F6",
    size: "large",
  },
  {
    icon: <FiCpu />,
    title: "AI Personal Tutor",
    desc: "Instant doubt resolution powered by AI — get answers, hints, and explanations 24/7.",
    color: "#8B5CF6",
    size: "normal",
  },
  {
    icon: <FiTrendingUp />,
    title: "Progress Dashboard",
    desc: "Track your growth with detailed analytics, weekly reports, and performance insights.",
    color: "#06B6D4",
    size: "normal",
  },
  {
    icon: <FiCheckSquare />,
    title: "Interactive Quizzes",
    desc: "Reinforced learning through adaptive quizzes and practice exercises after each session.",
    color: "#10B981",
    size: "normal",
  },
  {
    icon: <FiAward />,
    title: "Verified Certificates",
    desc: "Earn shareable certificates upon course completion — recognized by institutions worldwide.",
    color: "#F59E0B",
    size: "normal",
  },
  {
    icon: <FiVideo />,
    title: "Recorded Session Access",
    desc: "Re-watch any past session anytime — lifetime access to all your recordings.",
    color: "#F472B6",
    size: "normal",
  },
  {
    icon: <FiMessageSquare />,
    title: "Community Discussions",
    desc: "Connect with peers, share notes, and learn together in subject-specific forums.",
    color: "#A78BFA",
    size: "normal",
  },
  {
    icon: <FiCalendar />,
    title: "Flexible Scheduling",
    desc: "Book sessions at any time that fits your lifestyle — morning, evening, or weekends.",
    color: "#34D399",
    size: "normal",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--section-bg-alt)" }}
    >
      {/* Orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 orb-purple opacity-20 dark:opacity-40" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 orb-cyan opacity-15 dark:opacity-30" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14 px-4 sm:px-6">
          <div className="section-pill mx-auto w-fit mb-3 sm:mb-4">Why VishidhAcademy?</div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-3 sm:mb-4">
            Everything You Need to{" "}
            <span className="grad-text">Succeed</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-sm sm:text-lg">
            A complete AI-powered learning ecosystem — secure, interactive, and built for modern education.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Large feature card — span 2 cols on sm+ */}
          <div
            className="group relative sm:col-span-2 p-5 sm:p-8 rounded-3xl overflow-hidden cursor-default transition-all duration-350 hover:-translate-y-1"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Gradient bg on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(ellipse at 20% 50%, ${features[0].color}12, transparent 60%)` }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(90deg, transparent, ${features[0].color}, transparent)` }}
            />

            <div
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300"
              style={{
                background: `${features[0].color}15`,
                border: `1px solid ${features[0].color}30`,
                color: features[0].color,
                boxShadow: `0 0 24px ${features[0].color}25`,
              }}
            >
              {features[0].icon}
            </div>
            <h3 className="relative text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3">{features[0].title}</h3>
            <p className="relative text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">{features[0].desc}</p>

            {/* Live indicators */}
            <div className="relative flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
              {["Video Call", "Whiteboard", "Screen Share"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 sm:px-3 py-1 rounded-full font-medium"
                  style={{
                    background: `${features[0].color}12`,
                    border: `1px solid ${features[0].color}25`,
                    color: features[0].color,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Regular feature cards */}
          {features.slice(1).map((f, i) => (
            <div
              key={i}
              className="group relative p-4 sm:p-6 rounded-3xl overflow-hidden cursor-default transition-all duration-350 hover:-translate-y-1"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(ellipse at 30% 30%, ${f.color}10, transparent 65%)` }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }}
              />

              <div
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: `${f.color}15`,
                  border: `1px solid ${f.color}30`,
                  color: f.color,
                  boxShadow: `0 0 20px ${f.color}20`,
                }}
              >
                {f.icon}
              </div>
              <h3 className="relative text-sm font-bold text-[var(--text-primary)] mb-1.5 sm:mb-2">{f.title}</h3>
              <p className="relative text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
