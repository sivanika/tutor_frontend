import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

/* ─────────────────────────────────────────────────────────────
   PLAN DEFINITIONS  (same as home page Pricing.jsx)
───────────────────────────────────────────────────────────── */
const PLANS = {
    free_trial: {
        id: "free_trial",
        name: "Free Trial",
        tagline: "Try before you commit",
        price: 0,
        displayPrice: "₹0",
        period: "7 days",
        color: "#6A11CB",
        gradient: "linear-gradient(135deg, #6A11CB, #2575FC)",
        features: [
            "Access to limited tutors",
            "2 demo sessions",
            "Basic dashboard",
            "Community support",
        ],
        requiresPayment: false,
    },
    premium: {
        id: "premium",
        name: "Premium",
        tagline: "Best for serious learners",
        price: 9900, // paise
        displayPrice: "₹99",
        period: "/month",
        color: "#FF4E9B",
        gradient: "linear-gradient(135deg, #FF4E9B, #6A11CB)",
        features: [
            "Unlimited sessions",
            "All verified professors",
            "Priority booking",
            "Session recordings",
            "Analytics & progress tracking",
        ],
        requiresPayment: true,
        badge: "Most Popular",
    },
    pay_per_session: {
        id: "pay_per_session",
        name: "Pay Per Session",
        tagline: "Flexible, pay as you go",
        price: 0,
        displayPrice: "18%",
        period: " commission",
        color: "#2575FC",
        gradient: "linear-gradient(135deg, #2575FC, #6A11CB)",
        features: [
            "No monthly fee",
            "Book anytime",
            "All tutors access",
            "Pay only when you learn",
            "Flexible payments",
        ],
        requiresPayment: false,
    },
};

/* ─────────────────────────────────────────────────────────────
   PAYMENT METHOD ICONS
───────────────────────────────────────────────────────────── */
const PaymentMethods = [
    {
        id: "upi",
        label: "UPI",
        icons: [
            { name: "GPay", color: "#4285F4", text: "G" },
            { name: "PhonePe", color: "#5F259F", text: "P" },
            { name: "Paytm", color: "#00BAF2", text: "T" },
            { name: "BHIM", color: "#2468B0", text: "B" },
        ],
        description: "Pay instantly using any UPI app",
        razorpay: true,
    },
    {
        id: "card",
        label: "Credit / Debit Card",
        icons: [
            { name: "Visa", color: "#1A1F71", text: "VISA" },
            { name: "Mastercard", color: "#EB001B", text: "MC" },
            { name: "RuPay", color: "#1B4E9B", text: "RP" },
        ],
        description: "All major credit and debit cards accepted",
        razorpay: true,
    },
    {
        id: "netbanking",
        label: "Net Banking",
        icons: [
            { name: "SBI", color: "#22409A", text: "SBI" },
            { name: "HDFC", color: "#004C8F", text: "HDFC" },
            { name: "ICICI", color: "#B02A2A", text: "ICICI" },
            { name: "Axis", color: "#97144D", text: "Axis" },
        ],
        description: "50+ banks supported",
        razorpay: true,
    },
    {
        id: "wallet",
        label: "Wallets",
        icons: [
            { name: "Paytm", color: "#00BAF2", text: "P" },
            { name: "Mobikwik", color: "#1DACE8", text: "M" },
            { name: "Airtel", color: "#E40000", text: "A" },
        ],
        description: "Paytm, Mobikwik, Airtel Money & more",
        razorpay: true,
    },
];

/* ─────────────────────────────────────────────────────────────
   LOAD RAZORPAY SCRIPT
───────────────────────────────────────────────────────────── */
const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function PaymentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const planId = searchParams.get("plan") || "premium";
    const returnTo = searchParams.get("returnTo") || "student";
    const plan = PLANS[planId] || PLANS.premium;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [paymentId, setPaymentId] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    /* ── Get user info from localStorage for prefill ── */
    const getUserInfo = () => {
        try {
            const stored = JSON.parse(localStorage.getItem("userInfo"));
            return stored?.user || {};
        } catch {
            return {};
        }
    };

    /* ── Activate free plan ── */
    const activateFreePlan = async () => {
        setLoading(true);
        setError("");
        try {
            await API.post("/payment/activate-free", { plan: plan.id });
            setSuccess(true);
            setTimeout(() => redirectAfterPayment(), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Activation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    /* ── Open Razorpay checkout for paid plan ── */
    const openRazorpayCheckout = async () => {
        setLoading(true);
        setError("");

        try {
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                setError("Payment gateway failed to load. Please check your internet connection.");
                setLoading(false);
                return;
            }

            /* Create server-side order */
            const { data } = await API.post("/payment/create-order", { plan: plan.id });
            const userInfo = getUserInfo();

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "TutorHours",
                description: `${plan.name} Plan — ${plan.period}`,
                image: "https://i.ibb.co/your-logo.png", // Optional logo URL
                order_id: data.orderId,

                /* ── Prefill user data ── */
                prefill: {
                    name: userInfo.name || "",
                    email: userInfo.email || "",
                    contact: userInfo.phone || "",
                },

                /* ── Show all payment methods ── */
                config: {
                    display: {
                        blocks: {
                            banks: {
                                name: "Pay via UPI & Netbanking",
                                instruments: [
                                    { method: "upi" },
                                    { method: "netbanking" },
                                ],
                            },
                            cards: {
                                name: "Pay via Cards",
                                instruments: [{ method: "card" }],
                            },
                            wallets: {
                                name: "Pay via Wallets",
                                instruments: [{ method: "wallet" }],
                            },
                        },
                        sequence: ["block.banks", "block.cards", "block.wallets"],
                        preferences: { show_default_blocks: true },
                    },
                },

                theme: {
                    color: plan.color,
                    backdrop_color: "rgba(26,14,51,0.7)",
                    hide_topbar: false,
                },

                /* ── Payment success handler ── */
                handler: async (response) => {
                    try {
                        const verifyRes = await API.post("/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan: plan.id,
                        });

                        if (verifyRes.data.success) {
                            setPaymentId(response.razorpay_payment_id);
                            setSuccess(true);
                            setLoading(false);
                            setTimeout(() => redirectAfterPayment(), 3000);
                        }
                    } catch {
                        setError("Payment verification failed. Please contact support with your payment ID.");
                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    },
                    escape: true,
                    animation: true,
                },
            };

            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", (resp) => {
                setError(
                    `Payment failed: ${resp.error.description} (Code: ${resp.error.code})`
                );
                setLoading(false);
            });

            rzp.open();
        } catch (err) {
            if (err.response?.status === 400 && err.response?.data?.free) {
                // Server said it's a free plan
                setSuccess(true);
                setTimeout(() => redirectAfterPayment(), 2000);
            } else {
                setError(err.response?.data?.message || "Failed to initiate payment. Please try again.");
                setLoading(false);
            }
        }
    };

    const handleProceed = () => {
        if (plan.requiresPayment) {
            openRazorpayCheckout();
        } else {
            activateFreePlan();
        }
    };

    const redirectAfterPayment = () => {
        if (returnTo === "professor") {
            navigate("/verification-pending");
        } else {
            navigate("/student/dashboard");
        }
    };

    /* ─────────────── SUCCESS SCREEN ─────────────── */
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0720] via-[#1a0e33] to-[#0d1b4b] p-6">
                <div className="text-center space-y-6 max-w-md mx-auto">
                    {/* Animated checkmark */}
                    <div className="relative mx-auto w-28 h-28">
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl"
                            style={{
                                background: plan.gradient,
                                boxShadow: `0 0 60px ${plan.color}60`,
                                animation: "successPop 0.6s ease",
                            }}
                        >
                            ✅
                        </div>
                        <div
                            className="absolute inset-0 rounded-full animate-ping opacity-25"
                            style={{ background: plan.gradient }}
                        />
                    </div>

                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-[#a78bfa] text-lg">
                            {plan.name} plan is now active 🎉
                        </p>
                        {paymentId && (
                            <p className="text-[#6b7280] text-xs mt-2 font-mono">
                                Payment ID: {paymentId}
                            </p>
                        )}
                    </div>

                    <div
                        className="p-5 rounded-2xl border border-white/10 text-left space-y-2"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                        {plan.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-[#d4caff]">
                                <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                    style={{ background: plan.gradient }}
                                >
                                    ✓
                                </span>
                                {f}
                            </div>
                        ))}
                    </div>

                    <p className="text-[#6b7280] text-sm animate-pulse">
                        {returnTo === "professor"
                            ? "Redirecting to verification page..."
                            : "Redirecting to your dashboard..."}
                    </p>
                </div>

                <style>{`
          @keyframes successPop {
            0% { transform: scale(0); opacity: 0; }
            70% { transform: scale(1.15); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
            </div>
        );
    }

    /* ─────────────── PAYMENT PAGE ─────────────── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0720] via-[#1a0e33] to-[#0d1b4b] flex flex-col">

            {/* ── TOP NAVBAR ── */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#a78bfa] hover:text-white transition-colors text-sm"
                >
                    ← Back
                </button>
                <span className="text-white font-bold tracking-wider text-sm">
                    🎓 TutorHours
                </span>
                <div className="flex items-center gap-2 text-[#a78bfa] text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Secure Checkout
                </div>
            </nav>

            <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 grid lg:grid-cols-2 gap-10 items-start">

                {/* ──────────────────────────────────────
            LEFT: PLAN SUMMARY
        ────────────────────────────────────── */}
                <div className="space-y-6">

                    {/* Plan card */}
                    <div
                        className="relative p-8 rounded-3xl border border-white/10 overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}
                    >
                        {/* Gradient glow top */}
                        <div
                            className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl"
                            style={{ background: plan.gradient }}
                        />

                        {plan.badge && (
                            <div
                                className="inline-block mb-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white"
                                style={{ background: plan.gradient }}
                            >
                                {plan.badge}
                            </div>
                        )}

                        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: plan.color }}>
                            {plan.name}
                        </p>
                        <p className="text-[#a78bfa] text-sm mb-4">{plan.tagline}</p>

                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-black text-white">{plan.displayPrice}</span>
                            <span className="text-[#a78bfa] text-sm">{plan.period}</span>
                        </div>

                        <div className="space-y-3">
                            {plan.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-[#d4caff]">
                                    <span
                                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                        style={{ background: plan.gradient }}
                                    >
                                        ✓
                                    </span>
                                    {f}
                                </div>
                            ))}
                        </div>

                        {/* Billing note */}
                        <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center text-sm">
                            <span className="text-[#6b7280]">
                                {plan.requiresPayment ? "Billed monthly · Cancel anytime" : "No payment required"}
                            </span>
                            <span className="text-white font-bold">
                                {plan.displayPrice}
                                {plan.requiresPayment ? "/mo" : ""}
                            </span>
                        </div>
                    </div>

                    {/* Security badges */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: "🔒", label: "256-bit SSL" },
                            { icon: "🛡️", label: "PCI-DSS Secure" },
                            { icon: "✅", label: "RBI Compliant" },
                        ].map((b) => (
                            <div
                                key={b.label}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/10 text-center"
                                style={{ background: "rgba(255,255,255,0.03)" }}
                            >
                                <span className="text-xl">{b.icon}</span>
                                <span className="text-[10px] text-[#a78bfa] font-semibold">{b.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Powered by */}
                    <div className="flex items-center justify-center gap-3 text-[#6b7280] text-xs">
                        <span>Payments secured by</span>
                        <span className="font-black text-[#3395FF] text-sm tracking-tight">razorpay</span>
                    </div>
                </div>

                {/* ──────────────────────────────────────
            RIGHT: PAYMENT METHODS + CTA
        ────────────────────────────────────── */}
                <div className="space-y-5">

                    <div>
                        <h1 className="text-2xl font-black text-white mb-1">
                            {plan.requiresPayment ? "Choose Payment Method" : "Activate Your Plan"}
                        </h1>
                        <p className="text-[#a78bfa] text-sm">
                            {plan.requiresPayment
                                ? "Razorpay will show all available methods after you click Pay"
                                : "Your plan is free — click below to activate instantly"}
                        </p>
                    </div>

                    {/* Payment method preview cards */}
                    {plan.requiresPayment && (
                        <div className="space-y-3">
                            {PaymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 transition-all hover:border-white/20"
                                    style={{ background: "rgba(255,255,255,0.04)" }}
                                >
                                    {/* Method icons */}
                                    <div className="flex gap-1.5 flex-shrink-0">
                                        {method.icons.map((icon) => (
                                            <div
                                                key={icon.name}
                                                className="h-7 min-w-[2rem] px-1.5 rounded-md flex items-center justify-center text-white font-black text-[9px] tracking-tight"
                                                style={{ background: icon.color }}
                                                title={icon.name}
                                            >
                                                {icon.text}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Method info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-semibold">{method.label}</p>
                                        <p className="text-[#6b7280] text-xs truncate">{method.description}</p>
                                    </div>

                                    {/* Checkmark */}
                                    <div
                                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                                        style={{ background: "linear-gradient(135deg, #6A11CB, #2575FC)" }}
                                    >
                                        ✓
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Free plan visual */}
                    {!plan.requiresPayment && (
                        <div
                            className="p-6 rounded-2xl border border-white/10 text-center space-y-3"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                        >
                            <div className="text-4xl">🆓</div>
                            <p className="text-white font-bold">No Credit Card Required</p>
                            <p className="text-[#a78bfa] text-sm">
                                {plan.id === "free_trial"
                                    ? "Start your 7-day free trial immediately — no payment info needed."
                                    : "Activate now for free. You only pay 18% when you complete a session."}
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* ORDER SUMMARY ROW (for paid plans) */}
                    {plan.requiresPayment && (
                        <div
                            className="p-4 rounded-2xl border border-white/10"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                        >
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-[#a78bfa]">{plan.name} Plan</span>
                                <span className="text-white font-semibold">{plan.displayPrice}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-[#a78bfa]">Platform fee</span>
                                <span className="text-green-400 font-semibold">₹0</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-[#a78bfa]">GST (18%)</span>
                                <span className="text-white font-semibold">Included</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                <span className="text-white font-bold">Total Due Today</span>
                                <span className="text-white font-black text-lg">{plan.displayPrice}</span>
                            </div>
                        </div>
                    )}

                    {/* ──── MAIN PAY / ACTIVATE BUTTON ──── */}
                    <button
                        onClick={handleProceed}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl font-black text-white text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
                        style={{
                            background: plan.gradient,
                            boxShadow: `0 8px 32px ${plan.color}50`,
                        }}
                    >
                        {/* Shimmer animation */}
                        {!loading && (
                            <div
                                className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity"
                                style={{
                                    background: "linear-gradient(90deg, transparent, white, transparent)",
                                    animation: "shimmer 2s infinite",
                                }}
                            />
                        )}

                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                {plan.requiresPayment ? "Opening Razorpay..." : "Activating..."}
                            </span>
                        ) : plan.requiresPayment ? (
                            <span>🔒 Pay {plan.displayPrice} Securely →</span>
                        ) : (
                            <span>✅ Activate {plan.name} — Free →</span>
                        )}
                    </button>

                    {plan.requiresPayment && (
                        <p className="text-center text-[#6b7280] text-xs leading-relaxed">
                            Clicking the button opens Razorpay's secure checkout where you can pay via{" "}
                            <span className="text-[#a78bfa]">UPI, Card, Net Banking or Wallet</span>.
                            <br />Money is transferred directly to TutorHours' verified account.
                        </p>
                    )}

                    {/* Cancel link */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-[#6b7280] text-xs hover:text-[#a78bfa] transition-colors"
                        >
                            Cancel and go back
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
}
