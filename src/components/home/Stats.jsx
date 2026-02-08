export default function Stats() {
  const stats = [
    { value: "5,000+", label: "Verified Professors" },
    { value: "120+", label: "Subjects" },
    { value: "50,000+", label: "Sessions" },
    { value: "98%", label: "Satisfaction" },
  ];

  return (
    <section
      className="
        py-20
        bg-slate-50
        dark:bg-gradient-to-b dark:from-slate-900 dark:to-black
        transition-colors duration-500
      "
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <div
            key={i}
            className="
              p-8 rounded-2xl

              bg-white
              dark:bg-slate-900/80

              border border-slate-200 dark:border-slate-800
              shadow-md dark:shadow-black/30

              backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
            "
          >
            {/* Value */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {s.value}
            </h2>

            {/* Label */}
            <p className="text-sm text-slate-600 dark:text-slate-400 tracking-wide">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
