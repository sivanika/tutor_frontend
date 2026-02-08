import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="
      relative overflow-hidden

      bg-slate-50
      dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black

      text-slate-900 dark:text-slate-100
      transition-colors duration-500
      "
    >
      {/* subtle background shapes (executive style) */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-slate-300/30 dark:bg-slate-800/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-slate-400/20 dark:bg-slate-700/30 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 py-28 relative z-10 grid md:grid-cols-2 gap-12 items-center">

        {/* ================= LEFT ================= */}
        <div className="space-y-8">

          {/* Badge */}
          <span className="
            px-4 py-1 rounded-full text-sm
            bg-slate-200 text-slate-700
            dark:bg-slate-800 dark:text-slate-300
          ">
            🚀 Next Generation Learning Platform
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Learn Smarter.
            <br />
            Teach Better.
            <br />
            <span className="text-slate-600 dark:text-slate-400">
              Grow Faster.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
            Connect students with verified professors through live virtual
            classrooms, progress tracking, and personalized learning experiences.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">

            {/* Primary */}
            <button
              onClick={() => navigate("/register")}
              className="
                px-8 py-3 rounded-xl font-semibold

                bg-slate-900 text-white
                dark:bg-white dark:text-black

                hover:opacity-90
                shadow-md
                transition
              "
            >
              Get Started Free
            </button>

            {/* Secondary */}
            <button
              onClick={() => navigate("/login")}
              className="
                px-8 py-3 rounded-xl

                border border-slate-300
                dark:border-slate-700

                hover:bg-slate-200
                dark:hover:bg-slate-800

                transition
              "
            >
              Login
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-6 text-sm text-slate-600 dark:text-slate-400">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">10K+</p>
              <p>Students</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">500+</p>
              <p>Professors</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">99%</p>
              <p>Success Rate</p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT CARD ================= */}
        <div className="relative">

          <div
            className="
              p-8 rounded-2xl space-y-6

              bg-white
              dark:bg-slate-900/80

              border border-slate-200
              dark:border-slate-800

              backdrop-blur-xl
              shadow-lg dark:shadow-black/30
            "
          >
            <h3 className="text-xl font-semibold">
              📚 Upcoming Sessions
            </h3>

            <div className="space-y-4 text-sm">

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                <p className="font-semibold">Mathematics</p>
                <p className="text-slate-500 dark:text-slate-400">Today • 6:00 PM</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                <p className="font-semibold">Physics</p>
                <p className="text-slate-500 dark:text-slate-400">Tomorrow • 4:00 PM</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                <p className="font-semibold">Programming</p>
                <p className="text-slate-500 dark:text-slate-400">Friday • 5:30 PM</p>
              </div>
            </div>
          </div>

          {/* subtle badge */}
          <div className="
            absolute -bottom-6 -left-6
            bg-slate-900 text-white
            dark:bg-white dark:text-black
            px-5 py-2 rounded-full
            shadow-md
          ">
            ⭐ Trusted by 10,000+ learners
          </div>
        </div>
      </div>
    </section>
  );
}
