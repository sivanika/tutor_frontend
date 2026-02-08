export default function TutorCards() {
  const tutors = [
    { name: "Dr. Sarah Johnson", subject: "Mathematics", rating: "4.7" },
    { name: "Prof. Michael Chen", subject: "Computer Science", rating: "5.0" },
    { name: "Dr. Elena Rodriguez", subject: "Languages", rating: "4.9" },
  ];

  return (
    <section
      className="
        py-20
        bg-slate-50
        dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-950 dark:to-black
        transition-colors duration-500
      "
    >
      {/* Heading */}
      <h2 className="text-center text-3xl font-bold mb-12 text-slate-800 dark:text-slate-100">
        Recommended Tutors
      </h2>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {tutors.map((t, i) => (
          <div
            key={i}
            className="
              p-7 rounded-2xl

              bg-white
              dark:bg-slate-900/80

              border border-slate-200 dark:border-slate-800
              shadow-md dark:shadow-black/30

              backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
            "
          >
            {/* Avatar */}
            <div
              className="
                w-14 h-14 mb-5
                rounded-full
                flex items-center justify-center
                font-semibold

                bg-slate-200 dark:bg-slate-800
                text-slate-700 dark:text-white
              "
            >
              {t.name.charAt(0)}
            </div>

            {/* Name */}
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {t.name}
            </h3>

            {/* Subject */}
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              {t.subject}
            </p>

            {/* Rating */}
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              ★ {t.rating} Rating
            </p>

            {/* Button */}
            <button
              className="
                mt-5 w-full py-2.5 rounded-lg
                bg-slate-900 text-white
                hover:bg-black

                dark:bg-slate-800 dark:hover:bg-slate-700

                transition
              "
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
