import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = (planId) => {
    if (user) {
      // Already logged in — go directly to payment page with the plan
      navigate(`/payment?plan=${planId}&returnTo=${user.role}`);
    } else {
      // Not logged in — send to register and pass plan as param
      navigate(`/register?plan=${planId}`);
    }
  };

  const plans = [
    {
      planId: "free_trial",
      name: "Free Trial",
      price: "₹0",
      period: "/7 days",
      highlight: false,
      color: "#6A11CB",
      features: [
        "Access to limited tutors",
        "2 demo sessions",
        "Basic dashboard",
        "Community support",
      ],
    },
    {
      planId: "premium",
      name: "Premium",
      price: "₹99",
      period: "/month",
      highlight: true,
      color: "#FF4E9B",
      features: [
        "Unlimited sessions",
        "All verified professors",
        "Priority booking",
        "Session recordings",
        "Analytics & progress tracking",
      ],
    },
    {
      planId: "pay_per_session",
      name: "Pay Per Session",
      price: "18%",
      period: " commission",
      highlight: false,
      color: "#2575FC",
      features: [
        "No monthly fee",
        "Book anytime",
        "All tutors access",
        "Pay only when you learn",
        "Flexible payments",
      ],
    },
  ];


  return (
    <section
      id="pricing"
      className="relative py-28 bg-white dark:bg-[#0f0720] overflow-hidden transition-colors duration-500"
    >
      {/* Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#6A11CB]/05 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="text-center mb-16 px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF4E9B] mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-black text-[#1a0e33] dark:text-white mb-4">
            Simple &amp;{" "}
            <span className="grad-text">Transparent</span>
          </h2>
          <p className="text-[#6b7280] dark:text-[#a78bfa] max-w-xl mx-auto">
            Choose the perfect plan that matches your learning style and budget.
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`
                relative flex flex-col p-8 rounded-3xl overflow-hidden
                border transition-all duration-300
                hover:-translate-y-2
                ${plan.highlight
                  ? "bg-[#f5f3ff] dark:bg-[#160d2e] border-[#6A11CB]/30 dark:border-[#6A11CB]/40 shadow-2xl shadow-[#6A11CB]/20 scale-105"
                  : "bg-white dark:bg-[#160d2e] border-[#6A11CB]/10 dark:border-[#6A11CB]/20 shadow-md hover:shadow-xl hover:shadow-[#6A11CB]/10"
                }
              `}
            >
              {/* Top gradient strip */}
              <div
                className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl"
                style={{ background: `linear-gradient(135deg, ${plan.color}, #2575FC)` }}
              />

              {/* Popular badge */}
              {plan.highlight && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-lg"
                  style={{ background: "linear-gradient(135deg, #FF4E9B, #6A11CB)" }}
                >
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: plan.color }}>
                {plan.name}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-black text-[#1a0e33] dark:text-white">{plan.price}</span>
                <span className="text-sm text-[#6b7280] dark:text-[#a78bfa] ml-1">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#1a0e33] dark:text-[#d4caff]">
                    <span
                      className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] text-white font-bold"
                      style={{ background: plan.color }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleGetStarted(plan.planId)}
                className={`
                  w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300
                  hover:scale-105 hover:shadow-lg
                  ${plan.highlight ? "text-white shadow-lg" : "text-white"}
                `}
                style={{
                  background: plan.highlight
                    ? "linear-gradient(135deg, #FF4E9B, #6A11CB)"
                    : `linear-gradient(135deg, ${plan.color}, #2575FC)`,
                  boxShadow: plan.highlight ? "0 8px 24px rgba(255,78,155,0.35)" : `0 4px 16px ${plan.color}30`,
                }}
              >
                Get Started →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
