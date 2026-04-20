import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const audience = user?.role || "student";
    API.get(`/subscriptions/plans?targetAudience=${audience}`)
      .then(res => {
        const enhanced = res.data.map((p) => {
          // Identify plan tiers by price or name 
          const isPremium = p.price > 10000 || p.name.toLowerCase().includes("premium");
          const isFree = p.price === 0;

          // Assign gradient and color statically for UI matching
          const color = isPremium ? "#FF4E9B" : (isFree ? "#6A11CB" : "#2575FC");
          
          return {
            ...p,
            planId: p._id,
            displayPrice: isFree ? "Free" : `₹${p.price / 100}`,
            displayPeriod: p.period === "monthly" ? "/month" : `/${p.period}`,
            highlight: isPremium,
            color,
            features: [
              p.maxSessions === null ? "Unlimited live sessions" : `Up to ${p.maxSessions} session bookings`,
              p.maxProfileViews === null ? "View all professor profiles" : `View ${p.maxProfileViews} verified professor profiles`,
              p.priorityBooking ? "Priority session scheduling" : "Standard scheduling access",
              "Secure dashboard access",
              "Community and tech support"
            ]
          };
        });
        setPlans(enhanced);
      })
      .catch((err) => {
        console.error("Failed to load plans:", err);
      });
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
                  ? "bg-[#f5f3ff] dark:bg-[#160d2e] border-[#6A11CB]/30 dark:border-[#6A11CB]/40 shadow-2xl shadow-[#6A11CB]/20 md:scale-105"
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
                <span className="text-5xl font-black text-[#1a0e33] dark:text-white">{plan.displayPrice}</span>
                <span className="text-sm text-[#6b7280] dark:text-[#a78bfa] ml-1">{plan.displayPeriod}</span>
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
