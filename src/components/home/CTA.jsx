import { useNavigate } from "react-router-dom";
import { FiStar, FiBook } from "react-icons/fi";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--section-bg)" }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[500px] rounded-full opacity-20 animate-float3" style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.4) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      {/* Top glow divider */}
      <div className="absolute top-0 left-0 right-0 h-px glow-divider" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          className="relative overflow-hidden rounded-3xl p-5 sm:p-10 md:p-16 text-center shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #0d1e3d 0%, #060e1c 100%)",
            border: "1px solid rgba(6,182,212,0.35)",
            backdropFilter: "blur(30px)",
            boxShadow: "0 20px 50px rgba(5,8,22,0.3)",
          }}
        >
          {/* Inner decorative orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 orb-purple opacity-40" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 orb-cyan opacity-30" />

          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }}
          />

          <div className="relative z-10">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs sm:text-sm text-white font-medium mb-6 sm:mb-8 backdrop-blur-sm">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              Start your journey today — it's free
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-white mb-4 sm:mb-5 leading-tight">
              Ready to Transform
              <br />
              <span className="grad-text">Your Learning?</span>
            </h2>

            <p className="text-white/80 text-sm sm:text-lg mb-6 sm:mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of students &amp; professors on VishidhAcademy —
              the smarter, AI-powered way to learn and teach.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full">
              <button
                onClick={() => navigate("/register")}
                className="
                  group w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base text-white
                  transition-all duration-300 hover:scale-105 btn-ripple
                  relative overflow-hidden flex items-center justify-center
                "
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                  boxShadow: "0 0 40px rgba(6,182,212,0.4), 0 8px 30px rgba(59,130,246,0.3)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FiStar size={16} /> Get Started Free →
                </span>
              </button>

              <button
                onClick={() => navigate("/live-classes")}
                className="
                  w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base text-white
                  bg-white/06 border border-white/12 backdrop-blur-sm
                  hover:bg-white/12 hover:border-[var(--accent)]/30 hover:scale-105
                  transition-all duration-300 flex items-center justify-center
                "
              >
                <span className="flex items-center gap-2">
                  <FiBook size={16} /> Explore Classes
                </span>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs sm:text-sm text-white/60">
              <span>No credit card required</span>
              <span className="hidden sm:inline">•</span>
              <span>Free 7-day trial</span>
              <span className="hidden sm:inline">•</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
