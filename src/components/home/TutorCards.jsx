export default function TutorCards() {
  const tutors = [
    { name: "Dr. Sarah Johnson", subject: "Mathematics", rating: "4.7", sessions: 430, color: "#6A11CB" },
    { name: "Prof. Michael Chen", subject: "Computer Science", rating: "5.0", sessions: 812, color: "#FF4E9B" },
    { name: "Dr. Elena Rodriguez", subject: "Languages", rating: "4.9", sessions: 620, color: "#2575FC" },
  ];

  return (
    <section className="py-20 bg-[#f5f3ff] dark:bg-[#0f0720] transition-colors duration-500 overflow-hidden relative">

      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#6A11CB]/06 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#FF4E9B]/05 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="text-center mb-12 px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#6A11CB] dark:text-[#a78bfa] mb-2">
            Our educators
          </p>
          <h2 className="text-4xl font-black text-[#1a0e33] dark:text-white">
            Recommended <span className="grad-text">Tutors</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {tutors.map((t, i) => (
            <div
              key={i}
              className="
                group relative p-7 rounded-2xl overflow-hidden
                bg-white dark:bg-[#160d2e]
                border border-[#6A11CB]/10 dark:border-[#6A11CB]/20
                shadow-md dark:shadow-[#6A11CB]/05
                hover:-translate-y-2 hover:shadow-xl hover:shadow-[#6A11CB]/15
                transition-all duration-300
              "
            >
              {/* Gradient top border */}
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                style={{ background: `linear-gradient(135deg, ${t.color}, #2575FC)` }}
              />

              {/* Avatar */}
              <div
                className="w-16 h-16 mb-5 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${t.color}, #2575FC)`, boxShadow: `0 8px 20px ${t.color}40` }}
              >
                {t.name.charAt(0)}
              </div>

              <h3 className="text-lg font-bold text-[#1a0e33] dark:text-white">{t.name}</h3>
              <p className="text-[#6b7280] dark:text-[#a78bfa] text-sm mt-1">{t.subject}</p>

              {/* Stats row */}
              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm font-semibold" style={{ color: t.color }}>
                  ★ {t.rating}
                </span>
                <span className="text-xs text-[#6b7280] dark:text-[#a78bfa]">
                  {t.sessions} sessions
                </span>
              </div>

              <button
                className="
                  mt-5 w-full py-2.5 rounded-xl font-semibold text-sm text-white
                  transition-all duration-300
                  hover:scale-105 hover:shadow-lg
                "
                style={{
                  background: `linear-gradient(135deg, ${t.color}, #2575FC)`,
                  boxShadow: `0 4px 16px ${t.color}30`,
                }}
              >
                View Profile →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
