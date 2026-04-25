import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center soft-bg">
      {/* ── Banner Image Background ── */}
      <div className="absolute inset-0 z-0 opacity-[0.08] dark:opacity-20 pointer-events-none">
        <img 
          src="/academic_hero_banner.png" 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── Decorative orbs ── */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/15 dark:bg-[var(--primary)]/25 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-[var(--primary)]/20 dark:bg-[var(--primary)]/30 blur-[100px] pointer-events-none" />

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{ backgroundImage: "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)", backgroundSize: "48px 48px" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-36 relative z-10 grid md:grid-cols-2 gap-12 md:gap-16 items-center w-full">

        {/* ── LEFT ── */}
        <div className="space-y-8 animate-slideUp">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 dark:bg-white/15 border border-[var(--primary)]/20 dark:border-white/25 backdrop-blur-sm text-sm text-[var(--primary)] dark:text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] dark:bg-[var(--accent)] animate-pulse" />
            🚀 Next-Generation Learning Platform
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] md:leading-[1.05] tracking-tight text-slate-900 dark:text-white">
            Learn{" "}
            <span className="relative inline-block">
              Smarter.
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-[var(--primary)] dark:bg-[var(--accent)] rounded-full opacity-80" />
            </span>
            <br />
            Teach{" "}
            <span className="text-[var(--primary)] dark:text-[var(--accent)]">Better.</span>
            <br />
            <span className="text-slate-600 dark:text-white/80">Grow Faster.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-white/70 max-w-xl leading-relaxed">
            Connect with verified professors through live virtual classrooms,
            progress tracking, and personalized learning experiences —
            anywhere, anytime.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate("/register")}
              className="
                group relative px-8 py-4 rounded-2xl font-bold text-base text-white overflow-hidden
                bg-[var(--primary)] hover:bg-[var(--primary)]/90
                shadow-2xl shadow-[var(--primary)]/40
                hover:scale-105 hover:shadow-[var(--primary)]/50
                transition-all duration-300
              "
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button
              onClick={() => navigate("/login")}
              className="
                px-8 py-4 rounded-2xl font-bold text-base text-slate-700 dark:text-white
                bg-[var(--primary)]/10 dark:bg-white/15 border border-[var(--primary)]/20 dark:border-white/30 backdrop-blur-sm
                hover:bg-[var(--primary)]/20 dark:hover:bg-white/25 hover:scale-105
                transition-all duration-300
              "
            >
              Login →
            </button>
          </div>

          {/* Mini stats */}
          <div className="flex flex-wrap gap-8 pt-4">
            {[
              { value: "10K+", label: "Students" },
              { value: "500+", label: "Professors" },
              { value: "99%", label: "Success Rate" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-sm text-slate-500 dark:text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — Floating Card ── */}
        <div className="relative hidden md:block">

          {/* Glow ring */}
          <div className="absolute inset-0 rounded-3xl bg-[var(--primary)]/10 dark:bg-[var(--accent)]/10 blur-3xl scale-110" />

          {/* Main card */}
          <div className="relative glass rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">📚 Upcoming Sessions</h3>
              <span className="text-xs text-[var(--primary)] dark:text-white/50 bg-[var(--primary)]/10 dark:bg-white/10 px-3 py-1 rounded-full">Live</span>
            </div>

            <div className="space-y-4">
              {[
                { subject: "Mathematics", time: "Today • 6:00 PM", icon: "📐", color: "var(--primary)" },
                { subject: "Physics", time: "Tomorrow • 4:00 PM", icon: "⚛️", color: "var(--primary)" },
                { subject: "Programming", time: "Friday • 5:30 PM", icon: "💻", color: "var(--accent)" },
              ].map((s) => (
                <div
                  key={s.subject}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-white/08 border border-slate-200 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/12 transition-all duration-200"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{s.subject}</p>
                    <p className="text-slate-500 dark:text-white/50 text-xs mt-0.5">{s.time}</p>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Join button inside card */}
            <button
              onClick={() => navigate("/register")}
              className="w-full py-3 rounded-xl grad-bg text-white font-semibold text-sm shadow-lg shadow-[var(--primary)]/30 hover:opacity-90 transition"
            >
              Join a Session →
            </button>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-5 -left-6 bg-[var(--primary)] dark:bg-[var(--accent)] text-white px-5 py-2.5 rounded-full shadow-xl shadow-[var(--primary)]/40 dark:shadow-[var(--accent)]/40 text-sm font-semibold whitespace-nowrap">
            ⭐ Trusted by 10,000+ learners
          </div>
        </div>
      </div>
    </section>
  );
}
