import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PLANS = [
    {
        id: "free_trial",
        name: "Free Trial",
        price: "₹0",
        period: "for 7 days",
        color: "#6A11CB",
        gradient: "linear-gradient(135deg, #6A11CB, #2575FC)",
        shadow: "rgba(106,17,203,0.25)",
        features: [
            "Access to limited tutors",
            "2 demo sessions",
            "Basic dashboard",
            "Community support",
        ],
        badge: null,
        cta: "Start Free Trial →",
    },
    {
        id: "premium",
        name: "Premium",
        price: "₹99",
        period: "/month",
        color: "#FF4E9B",
        gradient: "linear-gradient(135deg, #FF4E9B, #6A11CB)",
        shadow: "rgba(255,78,155,0.3)",
        features: [
            "Unlimited sessions",
            "All verified professors",
            "Priority booking",
            "Session recordings",
            "Analytics & progress tracking",
        ],
        badge: "Most Popular",
        cta: "Pay ₹99 Securely →",
    },
    {
        id: "pay_per_session",
        name: "Pay Per Session",
        price: "18%",
        period: " commission",
        color: "#2575FC",
        gradient: "linear-gradient(135deg, #2575FC, #6A11CB)",
        shadow: "rgba(37,117,252,0.25)",
        features: [
            "No monthly fee",
            "Book anytime",
            "All tutors access",
            "Pay only when you learn",
            "Flexible payments",
        ],
        badge: null,
        cta: "Activate Free →",
    },
];

export default function PaymentStep() {
    const navigate = useNavigate();
    const [hoveredPlan, setHoveredPlan] = useState(null);

    const handlePlanClick = (planId) => {
        // Navigate to the full dedicated payment page
        navigate(`/payment?plan=${planId}&returnTo=student`);
    };

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#FF4E9B] mb-2">
                    Final Step
                </p>
                <h2 className="text-3xl font-black text-[#1a0e33] mb-2">
                    Choose Your{" "}
                    <span style={{
                        background: "linear-gradient(135deg, #6A11CB, #FF4E9B)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        Plan
                    </span>
                </h2>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Select a plan and you'll be taken to our secure payment page.
                    UPI, Card, Net Banking and Wallets accepted.
                </p>
            </div>

            {/* Plan Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {PLANS.map((plan) => {
                    const isHovered = hoveredPlan === plan.id;
                    return (
                        <div
                            key={plan.id}
                            onClick={() => handlePlanClick(plan.id)}
                            onMouseEnter={() => setHoveredPlan(plan.id)}
                            onMouseLeave={() => setHoveredPlan(null)}
                            className="relative flex flex-col rounded-2xl cursor-pointer border-2 overflow-hidden transition-all duration-300 group"
                            style={{
                                borderColor: isHovered ? plan.color : "#e2e8f0",
                                transform: isHovered ? "translateY(-6px)" : "translateY(0px)",
                                boxShadow: isHovered ? `0 16px 40px ${plan.shadow}` : "0 2px 12px rgba(0,0,0,0.06)",
                                background: isHovered
                                    ? `linear-gradient(160deg, #f9f6ff, #fff0f7)`
                                    : "white",
                            }}
                        >
                            {/* Gradient top strip */}
                            <div
                                className="h-1.5 w-full flex-shrink-0"
                                style={{ background: plan.gradient }}
                            />

                            {/* Badge */}
                            {plan.badge && (
                                <div
                                    className="absolute top-4 right-4 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                                    style={{ background: plan.gradient }}
                                >
                                    {plan.badge}
                                </div>
                            )}

                            <div className="p-7 flex flex-col flex-1">
                                {/* Plan name */}
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: plan.color }}>
                                    {plan.name}
                                </p>

                                {/* Price */}
                                <div className="mb-5">
                                    <span className="text-4xl font-black text-[#1a0e33]">{plan.price}</span>
                                    <span className="text-sm text-slate-400 ml-1">{plan.period}</span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-2.5 flex-1 mb-6">
                                    {plan.features.map((f, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                                            <span
                                                className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[8px] font-black text-white"
                                                style={{ background: plan.color }}
                                            >
                                                ✓
                                            </span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA button */}
                                <div
                                    className="w-full py-3 rounded-xl font-bold text-white text-sm text-center transition-all duration-200"
                                    style={{
                                        background: plan.gradient,
                                        boxShadow: isHovered ? `0 6px 20px ${plan.shadow}` : "none",
                                        transform: isHovered ? "scale(1.02)" : "scale(1)",
                                    }}
                                >
                                    {plan.cta}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Payment method icons row */}
            <div className="flex flex-col items-center gap-3">
                <p className="text-xs text-slate-400 font-medium">Accepted payment methods</p>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    {[
                        { label: "UPI", color: "#5F259F", icon: "⚡" },
                        { label: "GPay", color: "#4285F4", icon: "G" },
                        { label: "PhonePe", color: "#5F259F", icon: "P" },
                        { label: "Paytm", color: "#00BAF2", icon: "T" },
                        { label: "VISA", color: "#1A1F71", icon: "V" },
                        { label: "MC", color: "#EB001B", icon: "M" },
                        { label: "RuPay", color: "#1B4E9B", icon: "R" },
                        { label: "NetBanking", color: "#22409A", icon: "🏦" },
                    ].map((m) => (
                        <div
                            key={m.label}
                            className="h-7 min-w-[2.5rem] px-2 rounded-lg flex items-center justify-center text-white font-black text-[9px] tracking-tight"
                            style={{ background: m.color }}
                            title={m.label}
                        >
                            {m.icon}
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-slate-400">
                    🔒 256-bit SSL encrypted · Powered by{" "}
                    <span className="font-black text-[#3395FF]">Razorpay</span>
                </p>
            </div>
        </div>
    );
}
