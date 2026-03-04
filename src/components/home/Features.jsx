export default function Features() {
  const features = [
    {
      icon: "🎓",
      title: "Verified Professors",
      desc: "Learn from certified educators with proven teaching skills and academic credentials.",
      color: "#6A11CB",
    },
    {
      icon: "💻",
      title: "Virtual Classroom",
      desc: "Live video, screen share, collaborative whiteboard & session recordings.",
      color: "#FF4E9B",
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      desc: "Monitor performance, view analytics, and measure your improvement over time.",
      color: "#2575FC",
    },
    {
      icon: "🗓️",
      title: "Flexible Scheduling",
      desc: "Book sessions at times that fit your schedule — morning, evening, or weekend.",
      color: "#6A11CB",
    },
    {
      icon: "🔐",
      title: "Secure Payments",
      desc: "Fully encrypted transactions for worry-free, hassle-free payments.",
      color: "#FF4E9B",
    },
    {
      icon: "🌍",
      title: "Learn Anywhere",
      desc: "Access live and recorded classes from mobile, tablet, or desktop worldwide.",
      color: "#2575FC",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-28 bg-white dark:bg-[#0f0720] overflow-hidden transition-colors duration-500"
    >
      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#6A11CB]/06 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#FF4E9B]/06 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="text-center mb-16 px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF4E9B] mb-3">
            Why TutorHours?
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-[#1a0e33] dark:text-white mb-4">
            Everything You Need to{" "}
            <span className="grad-text">Succeed</span>
          </h2>
          <p className="text-[#6b7280] dark:text-[#a78bfa] max-w-2xl mx-auto text-lg">
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
                bg-[#f5f3ff] dark:bg-[#160d2e]
                border border-[#6A11CB]/10 dark:border-[#6A11CB]/20
                shadow-sm dark:shadow-[#6A11CB]/05
                hover:-translate-y-2 hover:shadow-xl hover:shadow-[#6A11CB]/10
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

              <h3 className="text-lg font-bold mb-2 text-[#1a0e33] dark:text-white relative">
                {f.title}
              </h3>
              <p className="text-[#6b7280] dark:text-[#a78bfa] text-sm leading-relaxed relative">
                {f.desc}
              </p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: `linear-gradient(90deg, ${f.color}, #2575FC)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
