import PricingComponent from "../components/home/Pricing";
import FAQ from "../components/home/FAQ";
import { FiCheck } from "react-icons/fi";

export default function Pricing() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(42,77,110,0.3) 0%, transparent 65%), var(--hero-section)" }}>
        {/* Orbs */}
        <div className="absolute -top-20 left-1/4 w-96 h-96 orb-blue opacity-20 dark:opacity-30" />
        <div className="absolute top-1/2 right-0 w-80 h-80 orb-purple opacity-15 dark:opacity-20" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="section-pill mx-auto w-fit mb-6 animate-fadeIn">Simple &amp; Transparent</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[var(--text-primary)] leading-tight animate-slideUp">
            Plans for Every <br />
            <span className="grad-text">Learning Goal</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed animate-slideUp delay-200">
            Choose a plan that fits your needs. Whether you're a student looking for guidance or a professor looking to teach, we have a transparent pricing model for you.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 animate-slideUp delay-300">
            {["No hidden fees", "Cancel anytime", "7-day free trial", "Secure payments"].map((b) => (
              <span key={b} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <FiCheck size={13} className="text-[#06B6D4]" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Component */}
      <PricingComponent />

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}
