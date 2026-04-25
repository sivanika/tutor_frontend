export default function Features() {
  const features = [
    {
      icon: "🎓",
      title: "Verified Professors",
      desc: "Learn from certified educators with proven teaching skills and academic credentials.",
      color: "var(--primary)",
    },
    {
      icon: "💻",
      title: "Virtual Classroom",
      desc: "Live video, screen share, collaborative whiteboard & session recordings.",
      color: "var(--accent)",
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      desc: "Monitor performance, view analytics, and measure your improvement over time.",
      color: "var(--primary)",
    },
    {
      icon: "🗓️",
      title: "Flexible Scheduling",
      desc: "Book sessions at times that fit your schedule — morning, evening, or weekend.",
      color: "var(--primary)",
    },
    {
      icon: "🔐",
      title: "Secure Payments",
      desc: "Fully encrypted transactions for worry-free, hassle-free payments.",
      color: "var(--accent)",
    },
    {
      icon: "🌍",
      title: "Learn Anywhere",
      desc: "Access live and recorded classes from mobile, tablet, or desktop worldwide.",
      color: "var(--primary)",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-28 bg-white dark:bg-[var(--surface)] overflow-hidden transition-colors duration-500"
    >
      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[var(--primary)]/06 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[var(--accent)]/06 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="text-center mb-16 px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-3">
            Why TutorHours?
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] dark:text-white mb-4">
            Everything You Need to{" "}
            <span className="grad-text">Succeed</span>
          </h2>
          <p className="text-[var(--text-muted)] dark:text-[var(--accent)] max-w-2xl mx-auto text-lg">
            A complete learning ecosystem — secure, interactive, and built for modern education.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="
                group relative p-8 rounded-2xl overflow-hidden
                bg-[var(--surface-alt)] dark:bg-[var(--surface-alt)]
                border border-[var(--primary)]/10 dark:border-[var(--primary)]/20
                shadow-sm dark:shadow-[var(--primary)]/05
                hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--primary)]/10
                transition-all duration-300
              "
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at top left, ${f.color}10, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="relative w-14 h-14 flex items-center justify-center text-2xl rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
              >
                {f.icon}
              </div>

              <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)] dark:text-white relative">
                {f.title}
              </h3>
              <p className="text-[var(--text-muted)] dark:text-[var(--accent)] text-sm leading-relaxed relative">
                {f.desc}
              </p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: `linear-gradient(90deg, ${f.color}, var(--primary))` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
