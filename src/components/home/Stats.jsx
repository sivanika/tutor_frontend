import { useEffect, useRef, useState } from "react";
import { FiUsers, FiBook, FiUserCheck, FiTarget } from "react-icons/fi";

function CountUp({ target, suffix = "", duration = 2000 }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 0)}K` : value}{suffix}
    </span>
  );
}

const stats = [
  {
    value: 20000,
    suffix: "+",
    label: "Students Enrolled",
    sub: "Across 50+ countries",
    icon: <FiUsers />,
    color: "#06B6D4",
    glow: "rgba(6,182,212,0.3)",
  },
  {
    value: 500,
    suffix: "+",
    label: "Live Courses",
    sub: "In 8 major subjects",
    icon: <FiBook />,
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    value: 120,
    suffix: "+",
    label: "Verified Professors",
    sub: "PhD & expert tutors",
    icon: <FiUserCheck />,
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.3)",
  },
  {
    value: 98,
    suffix: "%",
    label: "Success Rate",
    sub: "Student satisfaction",
    icon: <FiTarget />,
    color: "#10B981",
    glow: "rgba(16,185,129,0.3)",
  },
];

export default function Stats() {
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: "var(--section-bg-alt)" }}>
      {/* Glow divider top */}
      <div className="absolute top-0 left-0 right-0 h-px glow-divider" />

      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 -translate-y-1/2 orb-cyan opacity-20 dark:opacity-40" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 -translate-y-1/2 orb-purple opacity-15 dark:opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section label */}
        <div className="text-center mb-12">
          <div className="section-pill mx-auto w-fit mb-4">Platform at a Glance</div>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)]">
            Numbers That{" "}
            <span className="grad-text">Speak for Themselves</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="group relative text-center p-6 sm:p-8 rounded-3xl overflow-hidden transition-all duration-400 hover:-translate-y-2 cursor-default"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Hover glow background */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(ellipse at center, ${s.glow.replace('0.3', '0.08')}, transparent 70%)` }}
              />

              {/* Top gradient bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }}
              />

              {/* Icon */}
              <div
                className="relative w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-2xl text-xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}30`,
                  color: s.color,
                  boxShadow: `0 0 20px ${s.color}20`,
                }}
              >
                {s.icon}
              </div>

              {/* Value */}
              <div
                className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 transition-all duration-300"
                style={{ color: s.color, textShadow: `0 0 30px ${s.glow}` }}
              >
                <CountUp target={s.value} suffix={s.suffix} />
              </div>

              <p className="text-sm font-bold text-[var(--text-primary)] mb-1">{s.label}</p>
              <p className="text-xs text-[var(--text-muted)] font-medium">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Glow divider bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px glow-divider" />
    </section>
  );
}
