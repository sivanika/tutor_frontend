import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center grad-bg">

      {/* ── Decorative orbs ── */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#FF4E9B]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-[#2575FC]/25 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-[#6A11CB]/30 blur-[100px] pointer-events-none" />

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)", backgroundSize: "48px 48px" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 relative z-10 grid md:grid-cols-2 gap-16 items-center w-full">

        {/* ── LEFT ── */}
        <div className="space-y-8 animate-slideUp">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm text-sm text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-[#FF4E9B] animate-pulse" />
            🚀 Next-Generation Learning Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-white">
            Learn{" "}
            <span className="relative inline-block">
              Smarter.
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#FF4E9B] rounded-full opacity-80" />
            </span>
            <br />
            Teach{" "}
            <span className="text-[#FF4E9B]">Better.</span>
            <br />
            <span className="text-white/80">Grow Faster.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
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
                bg-[#FF4E9B] hover:bg-[#e8408a]
                shadow-2xl shadow-[#FF4E9B]/40
                hover:scale-105 hover:shadow-[#FF4E9B]/50
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
                px-8 py-4 rounded-2xl font-bold text-base text-white
                bg-white/15 border border-white/30 backdrop-blur-sm
                hover:bg-white/25 hover:scale-105
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
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-sm text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — Floating Card ── */}
        <div className="relative hidden md:block">

          {/* Glow ring */}
          <div className="absolute inset-0 rounded-3xl bg-[#FF4E9B]/10 blur-3xl scale-110" />

          {/* Main card */}
          <div className="relative glass rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">📚 Upcoming Sessions</h3>
              <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full">Live</span>
            </div>

            <div className="space-y-4">
              {[
                { subject: "Mathematics", time: "Today • 6:00 PM", icon: "📐", color: "#FF4E9B" },
                { subject: "Physics", time: "Tomorrow • 4:00 PM", icon: "⚛️", color: "#a78bfa" },
                { subject: "Programming", time: "Friday • 5:30 PM", icon: "💻", color: "#2575FC" },
              ].map((s) => (
                <div
                  key={s.subject}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/08 border border-white/10 hover:bg-white/12 transition-all duration-200"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{s.subject}</p>
                    <p className="text-white/50 text-xs mt-0.5">{s.time}</p>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Join button inside card */}
            <button
              onClick={() => navigate("/register")}
              className="w-full py-3 rounded-xl grad-bg text-white font-semibold text-sm shadow-lg shadow-[#6A11CB]/30 hover:opacity-90 transition"
            >
              Join a Session →
            </button>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-5 -left-6 bg-[#FF4E9B] text-white px-5 py-2.5 rounded-full shadow-xl shadow-[#FF4E9B]/40 text-sm font-semibold whitespace-nowrap">
            ⭐ Trusted by 10,000+ learners
          </div>
        </div>
      </div>
    </section>
  );
}
