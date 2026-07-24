import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import { FiCheck, FiZap } from "react-icons/fi";

const PLAN_COLORS = [
  { from: "#3B82F6", to: "#06B6D4", glow: "rgba(59,130,246,0.3)" },
  { from: "#8B5CF6", to: "#3B82F6", glow: "rgba(139,92,246,0.4)" },
  { from: "#06B6D4", to: "#10B981", glow: "rgba(6,182,212,0.3)" },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const audience = user?.role || "student";
    API.get(`/subscriptions/plans?targetAudience=${audience}`)
      .then((res) => {
        const enhanced = res.data.map((p, i) => {
          const isPremium = p.price > 10000 || p.name.toLowerCase().includes("premium");
          const isFree = p.price === 0;
          const palette = PLAN_COLORS[i % PLAN_COLORS.length];

          return {
            ...p,
            planId: p._id,
            displayPrice: isFree ? "Free" : `₹${p.price / 100}`,
            displayPeriod: p.period === "monthly" ? "/month" : `/${p.period}`,
            highlight: isPremium,
            palette,
            features: [
              p.maxSessions === null ? "Unlimited live sessions" : `Up to ${p.maxSessions} session bookings`,
              p.maxProfileViews === null ? "View all professor profiles" : `View ${p.maxProfileViews} professor profiles`,
              p.priorityBooking ? "Priority session scheduling" : "Standard scheduling access",
              "Secure dashboard access",
              "AI tutor & doubt solver",
              "Community & tech support",
            ],
          };
        });
        setPlans(enhanced);
      })
      .catch((err) => console.error("Failed to load plans:", err));
  }, []);

  const handleGetStarted = (planId) => {
    if (user) {
      navigate(`/payment?plan=${planId}&returnTo=${user.role}`);
    } else {
      navigate(`/register?plan=${planId}`);
    }
  };

  return (
    <section
      id="pricing"
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--section-bg)" }}
    >
      {/* Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] orb-blue opacity-15" />

      {/* Top glow divider */}
      <div className="absolute top-0 left-0 right-0 h-px glow-divider" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="text-center mb-14 px-6">
          <div className="section-pill mx-auto w-fit mb-4">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
            Simple &amp;{" "}
            <span className="grad-text">Transparent Plans</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            Choose the perfect plan for your learning goals — no hidden fees, cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative transition-all duration-300 ${plan.highlight ? "md:scale-105 md:-mt-2" : ""}`}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg z-20 whitespace-nowrap"
                  style={{ background: `linear-gradient(135deg, ${plan.palette.from}, ${plan.palette.to})`, boxShadow: `0 4px 20px ${plan.palette.glow}` }}
                >
                  <FiZap size={10} /> Most Popular
                </div>
              )}

              {/* Card */}
              <div
                className="relative flex flex-col rounded-3xl overflow-hidden h-full transition-all duration-350 hover:-translate-y-1"
                style={{
                  background: plan.highlight
                    ? `linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.06))`
                    : "var(--card-bg)",
                  border: plan.highlight
                    ? `1px solid rgba(139,92,246,0.25)`
                    : "1px solid var(--card-border)",
                  backdropFilter: "blur(16px)",
                  boxShadow: plan.highlight ? `0 0 60px ${plan.palette.glow.replace('0.4', '0.12')}` : "none",
                }}
              >
                {/* Top gradient strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: `linear-gradient(90deg, ${plan.palette.from}, ${plan.palette.to})` }}
                />

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${plan.palette.glow.replace('0.3', '0.06')}, transparent 60%)` }}
                />

                <div className="relative flex flex-col p-7 h-full">
                  {/* Plan name */}
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-3 mt-2"
                    style={{ color: plan.palette.from }}
                  >
                    {plan.name}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-black text-[var(--text-primary)]">{plan.displayPrice}</span>
                    <span className="text-sm text-[var(--text-light)] ml-1.5">{plan.displayPeriod}</span>
                  </div>

                  {/* Divider */}
                  <div className="h-px mb-6" style={{ background: `linear-gradient(90deg, transparent, ${plan.palette.from}30, transparent)` }} />

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                        <span
                          className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] text-white font-bold"
                          style={{ background: `linear-gradient(135deg, ${plan.palette.from}, ${plan.palette.to})` }}
                        >
                          <FiCheck size={9} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleGetStarted(plan.planId)}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${plan.palette.from}, ${plan.palette.to})`,
                      boxShadow: plan.highlight
                        ? `0 8px 30px ${plan.palette.glow}`
                        : `0 4px 16px ${plan.palette.from}25`,
                    }}
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust line */}
        <p className="text-center text-[var(--text-light)] text-sm mt-10">
          No credit card required • Free 7-day trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
