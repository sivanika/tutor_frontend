import { useNavigate } from "react-router-dom";
import { FiX, FiCheck, FiLock, FiZap, FiStar, FiUsers } from "react-icons/fi";

/* ─── USD → INR conversion (1 USD ≈ 84 INR) ─────────────────────────────── */
const USD_TO_INR = 84;

const PLANS = [
  {
    id: "free",
    tier: "FREE",
    icon: "🕐",
    name: "Free",
    priceINR: 0,
    priceUSD: 0,
    period: "/mo",
    profileLimit: "Up to 3 student profiles",
    badge: null,
    badgeColor: null,
    gradient: null,
    color: "#6b7280",
    features: [
      "Basic dashboard access",
      "Limited student visibility",
      "Public profile listing",
    ],
    disabledFeatures: ["Priority listing", "Analytics dashboard"],
    cta: "Current Plan",
    ctaDisabled: true,
  },
  {
    id: "standard",
    tier: "STANDARD",
    icon: "⭐",
    name: "Standard",
    priceINR: Math.round(4.99 * USD_TO_INR), // ₹419
    priceUSD: 4.99,
    period: "/mo",
    profileLimit: "Up to 15 student profiles",
    badge: "⭐ MOST POPULAR",
    badgeColor: "#c9a227",
    gradient: "linear-gradient(135deg, #c9a227, #f0c040)",
    color: "#c9a227",
    features: [
      "Extended student access",
      "Enhanced dashboard",
      "Better search visibility",
      "Enrollment analytics",
    ],
    disabledFeatures: ["Priority listing"],
    cta: "Upgrade Now →",
    ctaDisabled: false,
    planParam: "professor_standard",
  },
  {
    id: "ultimate",
    tier: "ULTIMATE",
    icon: "⚡",
    name: "Ultimate",
    priceINR: Math.round(12.99 * USD_TO_INR), // ₹1091
    priceUSD: 12.99,
    period: "/mo",
    profileLimit: "Up to 45 student profiles",
    badge: null,
    badgeColor: null,
    gradient: "linear-gradient(135deg, #FF4E9B, #6A11CB)",
    color: "#FF4E9B",
    features: [
      "Full dashboard access",
      "Maximum student reach",
      "Priority search listing",
      "Advanced analytics",
      "Featured profile badge",
    ],
    disabledFeatures: [],
    cta: "Go Ultimate →",
    ctaDisabled: false,
    planParam: "professor_ultimate",
  },
  {
    id: "commission",
    tier: "COMMISSION-BASED",
    icon: "💲",
    name: "Commission",
    priceINR: null,
    priceUSD: null,
    period: null,
    profileLimit: "Platform assigns students",
    badge: "🔥 FLEXIBLE",
    badgeColor: "#0d9488",
    gradient: "linear-gradient(135deg, #0d9488, #0891b2)",
    color: "#0d9488",
    features: [
      "Flexible earning model",
      "No subscription required",
      "Weekly or monthly payouts",
      "Platform-matched students",
      "Dedicated onboarding support",
    ],
    disabledFeatures: [],
    cta: "Apply Now →",
    ctaDisabled: false,
    planParam: "pay_per_session",
    noUpfront: true,
  },
];

export default function ProfessorUpgradeModal({ onClose }) {
  const navigate = useNavigate();

  const handleCTA = (plan) => {
    if (plan.ctaDisabled) return;
    onClose();
    if (plan.id === "commission") {
      navigate("/professor/apply");
    } else {
      navigate(`/professor/payment?plan=${plan.planParam}`);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl pointer-events-auto"
          style={{ background: "#0f0a1e" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <FiX size={18} />
          </button>

          {/* Header */}
          <div className="px-6 pt-8 pb-6 text-center border-b border-white/10">
            <p className="text-sm font-bold text-[#FF4E9B] uppercase tracking-widest mb-1">
              🎓 TutorHours — Professor Plans
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              Upgrade Your Plan
            </h2>
            {/* Toggle row (visual-only, monthly active) */}
            <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 text-sm mt-2">
              <span className="px-4 py-1.5 rounded-full font-bold text-white bg-[#FF4E9B]">
                Monthly
              </span>
              <span className="px-4 py-1.5 text-white/50 font-medium">
                Annual{" "}
                <span className="text-green-400 text-xs font-semibold">Save 20%</span>
              </span>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-2xl border transition-all duration-300"
                style={{
                  background:
                    plan.id === "standard"
                      ? "rgba(201,162,39,0.08)"
                      : plan.id === "ultimate"
                      ? "rgba(255,78,155,0.06)"
                      : plan.id === "commission"
                      ? "rgba(13,148,136,0.06)"
                      : "rgba(255,255,255,0.04)",
                  borderColor:
                    plan.id === "standard"
                      ? "rgba(201,162,39,0.35)"
                      : plan.id === "ultimate"
                      ? "rgba(255,78,155,0.25)"
                      : plan.id === "commission"
                      ? "rgba(13,148,136,0.25)"
                      : "rgba(255,255,255,0.10)",
                }}
              >
                {/* Top accent bar */}
                {plan.gradient && (
                  <div
                    className="h-1 rounded-t-2xl"
                    style={{ background: plan.gradient }}
                  />
                )}

                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black text-white whitespace-nowrap"
                    style={{ background: plan.badgeColor }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  {/* Icon + Tier */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{plan.icon}</span>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: plan.color }}
                    >
                      {plan.tier}
                    </p>
                  </div>

                  {/* Price */}
                  {plan.noUpfront ? (
                    <div className="mb-4">
                      <p
                        className="text-3xl font-black leading-tight"
                        style={{ color: plan.color }}
                      >
                        No upfront
                      </p>
                      <p className="text-white/40 text-xs mt-1">cost whatsoever</p>
                      <p className="text-white/40 text-xs">Earn weekly or monthly</p>
                    </div>
                  ) : (
                    <div className="mb-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-white/50 font-bold">₹</span>
                        <span className="text-4xl font-black text-white">
                          {plan.priceINR === 0 ? "0" : plan.priceINR?.toLocaleString("en-IN")}
                        </span>
                        <span className="text-white/40 text-sm">{plan.period}</span>
                      </div>
                      {plan.priceUSD > 0 && (
                        <p className="text-white/30 text-[10px] mt-0.5">
                          ≈ ${plan.priceUSD}{plan.period}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Profile limit pill */}
                  <div className="mb-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border"
                      style={{
                        background: plan.gradient
                          ? `${plan.color}15`
                          : "rgba(255,255,255,0.05)",
                        borderColor: plan.gradient
                          ? `${plan.color}30`
                          : "rgba(255,255,255,0.10)",
                        color: plan.gradient ? plan.color : "#9ca3af",
                      }}
                    >
                      <FiUsers size={11} />
                      {plan.profileLimit}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 flex-1">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                        <FiCheck
                          size={13}
                          className="mt-0.5 flex-shrink-0"
                          style={{ color: plan.color || "#6b7280" }}
                        />
                        {f}
                      </div>
                    ))}
                    {plan.disabledFeatures?.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/25">
                        <FiLock size={12} className="mt-0.5 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleCTA(plan)}
                    disabled={plan.ctaDisabled}
                    className="mt-5 w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-default disabled:hover:scale-100"
                    style={
                      plan.ctaDisabled
                        ? {
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.30)",
                            border: "1px solid rgba(255,255,255,0.10)",
                          }
                        : {
                            background: plan.gradient || `${plan.color}22`,
                            color: plan.gradient ? "#fff" : plan.color,
                            boxShadow: plan.gradient ? `0 6px 20px ${plan.color}40` : "none",
                            border: plan.gradient
                              ? "none"
                              : `1px solid ${plan.color}50`,
                          }
                    }
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 text-center">
            <p className="text-white/30 text-xs">
              Secure payments via{" "}
              <span className="font-black text-[#3395FF]">Razorpay</span> · GST
              (18%) included · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
