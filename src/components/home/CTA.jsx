export default function CTA() {
  return (
    <section
      className="
        py-24 text-center
        bg-slate-50
        dark:bg-gradient-to-b dark:from-slate-900 dark:to-black
        transition-colors duration-500
      "
    >
      <div
        className="
          max-w-4xl mx-auto px-6 py-14
          rounded-2xl

          bg-white
          dark:bg-slate-900/80

          border border-slate-200 dark:border-slate-800
          shadow-md dark:shadow-black/30
          backdrop-blur-xl
        "
      >
        {/* Heading */}
        <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
          Ready to Transform Your Learning?
        </h2>

        {/* Sub text */}
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Join students & professors on ProfessorOn
        </p>

        {/* Button */}
        <button
          className="
            px-8 py-3 rounded-lg font-semibold

            bg-slate-900 text-white
            dark:bg-slate-800

            hover:bg-slate-700
            dark:hover:bg-slate-700

            shadow-md
            transition-all duration-300
          "
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
