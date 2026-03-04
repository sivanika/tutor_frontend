export default function Stats() {
  const stats = [
    { value: "5,000+", label: "Verified Professors", icon: "🎓", color: "#6A11CB" },
    { value: "120+", label: "Subjects Available", icon: "📚", color: "#FF4E9B" },
    { value: "50,000+", label: "Sessions Completed", icon: "🎯", color: "#2575FC" },
    { value: "98%", label: "Satisfaction Rate", icon: "⭐", color: "#FF4E9B" },
  ];

  return (
    <section className="relative py-20 bg-[#f5f3ff] dark:bg-[#0f0720] overflow-hidden transition-colors duration-500">

      {/* Subtle gradient blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#6A11CB]/08 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#2575FC]/08 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section label */}
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-[#6A11CB] dark:text-[#a78bfa] mb-10">
          Platform at a glance
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="
                group relative text-center
                p-8 rounded-2xl overflow-hidden
                bg-white dark:bg-[#160d2e]
                border border-[#6A11CB]/12 dark:border-[#6A11CB]/25
                shadow-md dark:shadow-[#6A11CB]/10
                hover:-translate-y-2 hover:shadow-xl hover:shadow-[#6A11CB]/15
                transition-all duration-300
              "
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${s.color}, #2575FC)` }}
              />

              <div className="text-3xl mb-3">{s.icon}</div>
              <h2 className="text-3xl md:text-4xl font-black text-[#1a0e33] dark:text-white mb-1">
                {s.value}
              </h2>
              <p className="text-sm text-[#6b7280] dark:text-[#a78bfa] tracking-wide font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
