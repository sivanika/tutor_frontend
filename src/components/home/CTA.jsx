import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 bg-[#f5f3ff] dark:bg-[#0f0720] overflow-hidden transition-colors duration-500">

      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[#6A11CB]/10 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="
          relative overflow-hidden
          rounded-3xl p-12 md:p-16 text-center
          grad-bg
          shadow-2xl shadow-[#6A11CB]/40
        ">
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#FF4E9B]/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "48px 48px" }}
          />

          <div className="relative z-10">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-sm text-white font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FF4E9B] animate-pulse" />
              Start your journey today
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Transform
              <br />
              Your Learning?
            </h2>

            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of students &amp; professors on TutorHours — the smarter way to learn.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="
                  px-10 py-4 rounded-2xl font-bold text-base
                  bg-[#FF4E9B] text-white
                  shadow-xl shadow-[#FF4E9B]/40
                  hover:bg-[#e8408a] hover:scale-105 hover:shadow-2xl hover:shadow-[#FF4E9B]/50
                  transition-all duration-300
                "
              >
                Get Started Free →
              </button>
              <button
                onClick={() => navigate("/login")}
                className="
                  px-10 py-4 rounded-2xl font-bold text-base
                  bg-white/15 text-white border border-white/30
                  hover:bg-white/25 hover:scale-105
                  backdrop-blur-sm transition-all duration-300
                "
              >
                Login
              </button>
            </div>

            {/* Trust line */}
            <p className="mt-8 text-white/40 text-sm">
              No credit card required • Free 7-day trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
