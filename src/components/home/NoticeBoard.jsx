export default function NoticeBoard() {
  const notices = [
    {
      title: "System Maintenance",
      text: "Platform will be unavailable Sunday 2AM – 6AM.",
      urgent: true,
      icon: "⚠️",
    },
    {
      title: "New Feature: Group Sessions",
      text: "Now students can learn together with exclusive discounts.",
      icon: "🚀",
    },
    {
      title: "Tutor of the Month",
      text: "Congratulations Dr. Sarah Johnson! 🎉",
      icon: "🏆",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 transition-colors duration-500">
      <div className="
        rounded-3xl p-8 md:p-10
        bg-[#f5f3ff] dark:bg-[#160d2e]
        border border-[#6A11CB]/12 dark:border-[#6A11CB]/25
        shadow-lg dark:shadow-[#6A11CB]/10
      ">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl grad-bg flex items-center justify-center text-white text-xl shadow-lg shadow-[#6A11CB]/30">
            📢
          </div>
          <h2 className="text-xl font-bold text-[#1a0e33] dark:text-white tracking-tight">
            Announcements
          </h2>
          <span className="ml-auto text-xs text-[#6A11CB] dark:text-[#a78bfa] bg-[#6A11CB]/10 px-3 py-1 rounded-full font-medium">
            Latest
          </span>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {notices.map((n, i) => (
            <div
              key={i}
              className={`
                group relative p-5 rounded-2xl border overflow-hidden
                transition-all duration-300 hover:-translate-y-1
                ${n.urgent
                  ? "bg-[#FF4E9B]/08 border-[#FF4E9B]/25 dark:bg-[#FF4E9B]/05 dark:border-[#FF4E9B]/20"
                  : "bg-white dark:bg-[#0f0720] border-[#6A11CB]/10 dark:border-[#6A11CB]/20"
                }
                hover:shadow-xl hover:shadow-[#6A11CB]/10
              `}
            >
              {/* Glow on urgent */}
              {n.urgent && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF4E9B]/10 rounded-full blur-2xl pointer-events-none" />
              )}

              <div className="text-2xl mb-3">{n.icon}</div>
              <h3 className={`font-bold mb-1.5 text-sm ${n.urgent ? "text-[#FF4E9B]" : "text-[#1a0e33] dark:text-white"}`}>
                {n.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#6b7280] dark:text-[#a78bfa]">
                {n.text}
              </p>
              {n.urgent && (
                <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-[#FF4E9B] bg-[#FF4E9B]/10 px-2 py-0.5 rounded-full">
                  Priority
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
