import {
  FiUserCheck, FiMonitor, FiCpu, FiVideo,
  FiCalendar, FiCompass, FiDollarSign, FiShield
} from "react-icons/fi";

const reasons = [
  {
    icon: <FiUserCheck />,
    title: "Verified Expert Professors",
    desc: "Every educator is verified for credentials, teaching experience, and subject expertise.",
    color: "#3B82F6",
    size: "normal",
  },
  {
    icon: <FiMonitor />,
    title: "Live, Personalized Sessions",
    desc: "Real-time interaction — not pre-recorded. Get answers instantly, learn at your pace.",
    color: "#06B6D4",
    size: "large",
  },
  {
    icon: <FiCpu />,
    title: "AI-Powered Progress Insights",
    desc: "Smart analytics track your weak areas and suggest exactly what to study next.",
    color: "#8B5CF6",
    size: "normal",
  },
  {
    icon: <FiVideo />,
    title: "Lifetime Recording Access",
    desc: "Never lose a lesson. Rewatch any session forever — available immediately after class.",
    color: "#F59E0B",
    size: "normal",
  },
  {
    icon: <FiCalendar />,
    title: "Flexible Booking Anytime",
    desc: "Schedule sessions morning, evening, or weekends — around your life, not the other way.",
    color: "#10B981",
    size: "normal",
  },
  {
    icon: <FiCompass />,
    title: "Career & Academic Guidance",
    desc: "Get expert advice on career paths, college applications, and academic planning.",
    color: "#F472B6",
    size: "normal",
  },
  {
    icon: <FiDollarSign />,
    title: "Transparent Pricing",
    desc: "Clear, upfront pricing with no hidden fees. Pay only for what you need.",
    color: "#34D399",
    size: "normal",
  },
  {
    icon: <FiShield />,
    title: "Secure & Easy Platform",
    desc: "Bank-grade security, intuitive UI, and 24/7 support — learning without friction.",
    color: "#A78BFA",
    size: "normal",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--section-bg-alt)" }}
    >
      {/* Orbs */}
      <div className="absolute -top-20 right-0 w-96 h-96 orb-purple opacity-20 dark:opacity-35" />
      <div className="absolute bottom-0 left-0 w-80 h-80 orb-cyan opacity-15 dark:opacity-25" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="section-pill mx-auto w-fit mb-4">Why Choose Us</div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
            Built for{" "}
            <span className="grad-text">Real Results</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-lg">
            VishidhAcademy isn't just another EdTech platform — it's your personal academic co-pilot.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Large card — Live Personalized Sessions — span 2 cols */}
          <div
            className="group col-span-1 sm:col-span-2 relative p-8 rounded-3xl overflow-hidden cursor-default transition-all duration-350 hover:-translate-y-1"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(6,182,212,0.08), transparent 65%)" }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: "linear-gradient(90deg, transparent, #06B6D4, transparent)" }}
            />

            <div
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300"
              style={{
                background: "rgba(6,182,212,0.12)",
                border: "1px solid rgba(6,182,212,0.25)",
                color: "#06B6D4",
                boxShadow: "0 0 24px rgba(6,182,212,0.2)",
              }}
            >
              {reasons[1].icon}
            </div>
            <h3 className="relative text-xl font-bold text-[var(--text-primary)] mb-3">{reasons[1].title}</h3>
            <p className="relative text-[var(--text-muted)] leading-relaxed max-w-md">{reasons[1].desc}</p>

            {/* Live badge */}
            <div className="relative mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}>
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              <span className="text-xs font-semibold text-[#06B6D4]">Live sessions happening now</span>
            </div>
          </div>

          {/* Remaining cards (skip index 1) */}
          {[0, 2, 3, 4, 5, 6, 7].map((idx) => {
            const r = reasons[idx];
            return (
              <div
                key={idx}
                className="group relative p-5 sm:p-6 rounded-3xl overflow-hidden cursor-default transition-all duration-350 hover:-translate-y-1"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `radial-gradient(ellipse at 30% 30%, ${r.color}10, transparent 65%)` }}
                />
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${r.color}, transparent)` }}
                />

                <div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `${r.color}15`,
                    border: `1px solid ${r.color}30`,
                    color: r.color,
                    boxShadow: `0 0 16px ${r.color}20`,
                  }}
                >
                  {r.icon}
                </div>
                <h3 className="relative text-sm font-bold text-[var(--text-primary)] mb-2">{r.title}</h3>
                <p className="relative text-[var(--text-muted)] text-xs leading-relaxed">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
