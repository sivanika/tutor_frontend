export default function Stats() {
  const stats = [
    { value: "5,000+", label: "Verified Professors", icon: "🎓", color: "var(--primary)" },
    { value: "120+", label: "Subjects Available", icon: "📚", color: "var(--accent)" },
    { value: "50,000+", label: "Sessions Completed", icon: "🎯", color: "var(--primary)" },
    { value: "98%", label: "Satisfaction Rate", icon: "⭐", color: "var(--accent)" },
  ];

  return (
    <section className="relative py-20 bg-[var(--surface-alt)] dark:bg-[var(--surface)] overflow-hidden transition-colors duration-500">

      {/* Subtle gradient blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[var(--primary)]/08 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[var(--primary)]/08 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section label */}
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-[var(--primary)] dark:text-[var(--accent)] mb-10">
          Platform at a glance
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="
                group relative text-center
                p-8 rounded-2xl overflow-hidden
                bg-white dark:bg-[var(--surface-alt)]
                border border-[var(--primary)]/12 dark:border-[var(--primary)]/25
                shadow-md dark:shadow-[var(--primary)]/10
                hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--primary)]/15
                transition-all duration-300
              "
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${s.color}, var(--primary))` }}
              />

              <div className="text-3xl mb-3">{s.icon}</div>
              <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] dark:text-white mb-1">
                {s.value}
              </h2>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--accent)] tracking-wide font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
