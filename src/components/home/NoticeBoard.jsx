export default function NoticeBoard() {
  const notices = [
    {
      title: "System Maintenance",
      text: "Platform will be unavailable Sunday 2AM – 6AM.",
      urgent: true,
    },
    {
      title: "New Feature: Group Sessions",
      text: "Now students can learn together with discounts.",
    },
    {
      title: "Tutor of the Month",
      text: "Congrats Dr. Sarah Johnson 🎉",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 mt-20 transition-colors duration-500">
      <div
        className="
          rounded-2xl p-8

          bg-white
          dark:bg-slate-900/90

          border border-slate-200 dark:border-slate-800
          shadow-md dark:shadow-black/30

          text-slate-800 dark:text-slate-200
        "
      >
        {/* Heading */}
        <h2 className="text-xl font-semibold mb-6 tracking-wide text-slate-900 dark:text-white">
          📢 Announcements
        </h2>

        {/* Notices */}
        <div className="grid md:grid-cols-3 gap-6">
          {notices.map((n, i) => (
            <div
              key={i}
              className={`
                p-5 rounded-xl border transition-all duration-300

                ${
                  n.urgent
                    ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }

                hover:-translate-y-1 hover:shadow-lg
              `}
            >
              <h3 className="font-semibold mb-2">
                {n.title}
              </h3>

              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {n.text}
              </p>

              {n.urgent && (
                <span className="text-xs mt-3 inline-block font-medium text-slate-500 dark:text-slate-400">
                  • Priority
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
