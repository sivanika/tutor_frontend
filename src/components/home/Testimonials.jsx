import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "JEE Aspirant",
    outcome: "Cleared JEE Advanced 2025",
    subject: "Physics & Mathematics",
    text: "VishidhAcademy completely transformed how I study. The live sessions with my professor were game-changing — I went from struggling to scoring in the top 1%.",
    rating: 5,
    initial: "A",
    color: "#3B82F6",
  },
  {
    name: "Dr. Priya Sharma",
    role: "Economics Professor",
    outcome: "100+ students taught",
    subject: "Economics & Statistics",
    text: "As a professor, this platform gives me everything I need — a professional virtual classroom, scheduling tools, and serious students who want to learn.",
    rating: 5,
    initial: "P",
    color: "#8B5CF6",
  },
  {
    name: "Riya Thomas",
    role: "Computer Science Student",
    outcome: "Landed first dev internship",
    subject: "Programming & CS",
    text: "The AI tutor is incredible for doubt-solving at 2 AM before an exam. The recorded sessions mean I never miss a thing. Absolutely worth it.",
    rating: 5,
    initial: "R",
    color: "#06B6D4",
  },
  {
    name: "Sahil Kapoor",
    role: "NEET Student",
    outcome: "MBBS admission secured",
    subject: "Biology & Chemistry",
    text: "My Biology professor on VishidhAcademy helped me understand complex topics in ways my school never could. Grateful for this platform.",
    rating: 5,
    initial: "S",
    color: "#10B981",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (i) => {
    if (animating || i === index) return;
    setAnimating(true);
    setTimeout(() => {
      setIndex(i);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const t = setInterval(() => goTo((index + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [index]);

  const cur = testimonials[index];

  return (
    <section
      id="testimonials"
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--section-bg-alt)" }}
    >
      {/* Orbs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 orb-purple opacity-15 dark:opacity-30" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 orb-cyan opacity-12 dark:opacity-25" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
      />

      {/* Top glow divider */}
      <div className="absolute top-0 left-0 right-0 h-px glow-divider" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="section-pill mx-auto w-fit mb-3 sm:mb-4">Student Stories</div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-3 sm:mb-4">
            What Our{" "}
            <span className="grad-text">Learners Say</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base">Real outcomes from real students and professors worldwide.</p>
        </div>

        {/* Testimonial Card */}
        <div
          className="rounded-3xl p-5 sm:p-8 md:p-12 transition-all duration-300"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(12px) scale(0.98)" : "translateY(0) scale(1)",
            background: "var(--card-bg)",
            border: `1px solid ${cur.color}25`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 0 60px ${cur.color}08`,
          }}
        >
          {/* Top color accent */}
          <div className="h-0.5 w-full rounded-full mb-6 sm:mb-8" style={{ background: `linear-gradient(90deg, transparent, ${cur.color}, transparent)` }} />

          {/* Stars */}
          <div className="flex gap-1 mb-4 sm:mb-6">
            {[...Array(cur.rating)].map((_, i) => (
              <FiStar key={i} className="fill-current text-[#F59E0B]" size={16} />
            ))}
          </div>

          {/* Quote */}
          <p className="text-[var(--text-muted)] text-base sm:text-lg md:text-xl italic leading-relaxed mb-6 sm:mb-8">
            "{cur.text}"
          </p>

          {/* Author row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Avatar */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl text-white flex-shrink-0 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${cur.color}, ${cur.color}80)`,
                  boxShadow: `0 8px 24px ${cur.color}35`,
                }}
              >
                {cur.initial}
              </div>
              <div>
                <h4 className="font-bold text-[var(--text-primary)] text-sm sm:text-base">{cur.name}</h4>
                <p className="text-[var(--text-muted)] text-xs sm:text-sm">{cur.role}</p>
              </div>
            </div>

            <div className="text-left sm:text-right mt-1 sm:mt-0">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: `${cur.color}12`,
                  border: `1px solid ${cur.color}25`,
                  color: cur.color,
                }}
              >
                ✓ {cur.outcome}
              </div>
              <p className="text-[var(--text-light)] text-xs mt-1">{cur.subject}</p>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: index === i ? "32px" : "8px",
                height: "8px",
                background: index === i
                  ? `linear-gradient(90deg, ${testimonials[i].color}, ${testimonials[i].color}80)`
                  : "var(--border-soft)",
                boxShadow: index === i ? `0 0 12px ${testimonials[i].color}50` : "none",
              }}
            />
          ))}
        </div>

        {/* Surrounding mini previews */}
        <div className="flex justify-center gap-4 mt-8">
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300"
              style={{ opacity: i === index ? 1 : 0.35 }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}
              >
                {t.initial}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
