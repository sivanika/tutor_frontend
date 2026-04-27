import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import socket from "../../services/socket";
import { toast } from "react-hot-toast";
import { FiCheckCircle, FiCheck, FiLock, FiShield, FiAlertCircle, FiBookOpen, FiZap, FiAward, FiBriefcase } from "react-icons/fi";



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
   ENRICH RAW PLAN FROM DB WITH UI FIELDS
───────────────────────────────────────────────────────────── */
function enrichPlan(found) {
    const isFree = found.price === 0;
    const isPro = found.price > 10000; // Rs 499 is 49900 paise
    const isPremium = found.price > 0 && !isPro;

    let features = [
        "View professor profiles",
        "Community & tech support",
        "Full dashboard access",
    ];

    if (isFree) {
        features = [
            "Up to 2 session bookings",
            "View 5 professor profiles",
            ...features
        ];
    } else if (isPremium) {
        features = [
            "Up to 10 session bookings",
            "View 30 professor profiles",
            "Priority booking access",
            ...features
        ];
    } else if (isPro) {
        features = [
            "Unlimited session bookings",
            "Unlimited profile views",
            "VIP Priority booking",
            "Direct student support",
            ...features
        ];
    }

    return {
        ...found,
        planId: found._id,
        displayPrice: isFree ? "₹0" : `₹${found.price / 100}`,
        period: found.period === "monthly" ? "/month" : `/${found.period}`,
        color: isPro ? "var(--accent)" : isPremium ? "var(--primary)" : "var(--primary)",
        gradient: isPro
            ? "linear-gradient(135deg, var(--accent), var(--primary))"
            : isPremium
            ? "linear-gradient(135deg, var(--primary), var(--primary))"
            : "linear-gradient(135deg, var(--primary), var(--primary))",
        tagline: found.description || found.name,
        requiresPayment: !isFree,
        badge: isPro ? "Professional" : isPremium ? "Most Popular" : "Starter",
        features,
    };
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function PaymentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const planParam = searchParams.get("plan");

    const [allPlans, setAllPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plansLoading, setPlansLoading] = useState(true);

    // Checkout state
    const [step, setStep] = useState("select"); // "select" | "checkout"
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [paymentId, setPaymentId] = useState("");

    /* ── Load all plans on mount ── */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const audience = user?.role || "student";
        API.get(`/subscriptions/plans?targetAudience=${audience}`)
            .then((res) => {
                const enriched = res.data
                    .filter((p) => p.isActive)
                    .map(enrichPlan);
                setAllPlans(enriched);

                // Pre-select plan from URL param
                let preSelected = null;
                if (planParam) {
                    preSelected = enriched.find((p) => p._id === planParam);
                    if (!preSelected)
                        preSelected = enriched.find(
                            (p) =>
                                p.name.toLowerCase().replace(/\s/g, "_") === planParam
                        );
                }
                // Default to first paid plan if none matched
                if (!preSelected)
                    preSelected =
                        enriched.find((p) => p.requiresPayment) || enriched[0];
                setSelectedPlan(preSelected);
            })
            .catch(() => {})
            .finally(() => setPlansLoading(false));
    }, [planParam]);

    /* ── Realtime: Listen for payment confirmation ── */
    useEffect(() => {
        const onPaymentVerified = (data) => {
            console.log("⚡ Realtime Payment Verified:", data);
            if (data.success) {
                setPaymentId(data.paymentId);
                setSuccess(true);
                setLoading(false);
                toast.success("Payment confirmed! Welcome aboard professor.");

                setTimeout(() => redirectAfterPayment(), 3000);
            }
        };

        socket.on("payment_verified", onPaymentVerified);
        
        // Ensure socket is connected if not already
        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off("payment_verified", onPaymentVerified);
        };
    }, []);

    /* ── Get user info for Razorpay prefill ── */
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
            await API.post("/payment/activate-free", { planId: selectedPlan.planId });
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

            const { data } = await API.post("/payment/create-order", {
                planId: selectedPlan.planId,
            });
            const userInfo = getUserInfo();

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "TutorHours",
                description: `${selectedPlan.name} Plan — ${selectedPlan.period}`,
                order_id: data.orderId,
                prefill: {
                    name: userInfo.name || "",
                    email: userInfo.email || "",
                    contact: userInfo.phone || "",
                },
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
                    color: selectedPlan.color,
                    backdrop_color: "rgba(26,14,51,0.7)",
                    hide_topbar: false,
                },
                handler: async (response) => {
                    try {
                        const verifyRes = await API.post("/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: selectedPlan.planId,
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
                    ondismiss: () => setLoading(false),
                    escape: true,
                    animation: true,
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (resp) => {
                setError(`Payment failed: ${resp.error.description} (Code: ${resp.error.code})`);
                setLoading(false);
            });
            rzp.open();
        } catch (err) {
            if (err.response?.status === 400 && err.response?.data?.free) {
                setSuccess(true);
                setTimeout(() => redirectAfterPayment(), 2000);
            } else {
                setError(err.response?.data?.message || "Failed to initiate payment. Please try again.");
                setLoading(false);
            }
        }
    };

    const handleProceed = () => {
        if (selectedPlan.requiresPayment) {
            openRazorpayCheckout();
        } else {
            activateFreePlan();
        }
    };

    const redirectAfterPayment = () => {
        navigate("/student/dashboard");
    };

    /* ─────────── LOADING SKELETON ─────────── */
    if (plansLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0720] via-[var(--text-primary)] to-[#0d1b4b]">
                <div className="animate-spin w-10 h-10 rounded-full border-4 border-white/30 border-t-white" />
            </div>
        );
    }

    /* ─────────── SUCCESS SCREEN ─────────── */
    if (success && selectedPlan) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0720] via-[var(--text-primary)] to-[#0d1b4b] p-6">
                <div className="text-center space-y-6 max-w-md mx-auto">
                    <div className="relative mx-auto w-28 h-28">
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl"
                            style={{
                                background: selectedPlan.gradient,
                                boxShadow: `0 0 60px ${selectedPlan.color}60`,
                                animation: "successPop 0.6s ease",
                            }}
                        >
                            <FiCheckCircle />

                        </div>
                        <div
                            className="absolute inset-0 rounded-full animate-ping opacity-25"
                            style={{ background: selectedPlan.gradient }}
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-[var(--accent)] text-lg">
                            {selectedPlan.name} plan is now active

                        </p>
                        {paymentId && (
                            <p className="text-[var(--text-muted)] text-xs mt-2 font-mono">
                                Payment ID: {paymentId}
                            </p>
                        )}
                    </div>
                    <div
                        className="p-5 rounded-2xl border border-white/10 text-left space-y-2"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                        {selectedPlan.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-[#d4caff]">
                                <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                    style={{ background: selectedPlan.gradient }}
                                >
                                    <FiCheck />

                                </span>
                                {f}
                            </div>
                        ))}
                    </div>
                    <p className="text-[var(--text-muted)] text-sm animate-pulse">
                        Redirecting to your dashboard...
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

    /* ─────────── PLAN SELECTION STEP ─────────── */
    if (step === "select") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f0720] via-[var(--text-primary)] to-[#0d1b4b] flex flex-col">

                {/* NAV */}
                <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[var(--accent)] hover:text-white transition-colors text-sm"
                    >
                        ← Back
                    </button>
                    <span className="text-white font-bold tracking-wider text-sm">
                        <FiBookOpen className="inline-block mr-2" /> TutorHours

                    </span>
                    <div className="flex items-center gap-2 text-[var(--accent)] text-xs">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Secure Checkout
                    </div>
                </nav>

                <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                            Choose Your Plan
                        </h1>
                        <p className="text-[var(--accent)] text-sm">
                            Select the plan that fits you best. You can upgrade anytime.
                        </p>
                    </div>

                    {/* PLAN CARDS */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                        {allPlans.map((plan) => {
                            const isSelected = selectedPlan?._id === plan._id;
                            return (
                                <div
                                    key={plan._id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className="relative cursor-pointer rounded-3xl border-2 p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                                    style={{
                                        background: isSelected
                                            ? "rgba(106,17,203,0.18)"
                                            : "rgba(255,255,255,0.04)",
                                        borderColor: isSelected ? plan.color : "rgba(255,255,255,0.10)",
                                        boxShadow: isSelected ? `0 0 32px ${plan.color}40` : "none",
                                        backdropFilter: "blur(20px)",
                                    }}
                                >
                                    {/* Top gradient bar */}
                                    <div
                                        className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
                                        style={{ background: plan.gradient }}
                                    />

                                    {/* Badge */}
                                    {plan.badge && (
                                        <div
                                            className="inline-block self-start mb-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white"
                                            style={{ background: plan.gradient }}
                                        >
                                            {plan.badge}
                                        </div>
                                    )}

                                    {/* Plan name */}
                                    <p
                                        className="text-xs font-bold uppercase tracking-widest mb-1"
                                        style={{ color: plan.color }}
                                    >
                                        {plan.name}
                                    </p>
                                    <p className="text-[var(--accent)] text-xs mb-4 leading-relaxed">
                                        {plan.tagline}
                                    </p>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-1 mb-5">
                                        <span className="text-4xl font-black text-white">
                                            {plan.displayPrice}
                                        </span>
                                        <span className="text-[var(--accent)] text-sm">{plan.period}</span>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2 flex-1">
                                        {plan.features.map((f, i) => (
                                            <div key={i} className="flex items-start gap-2.5 text-xs text-[#d4caff]">
                                                <span
                                                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 mt-0.5"
                                                    style={{ background: plan.gradient }}
                                                >
                                                    <FiCheck />

                                                </span>
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Select indicator */}
                                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-[var(--text-muted)] text-xs">
                                            {plan.requiresPayment ? "Billed monthly" : "Free forever"}
                                        </span>
                                        <div
                                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                                            style={{
                                                borderColor: isSelected ? plan.color : "rgba(255,255,255,0.2)",
                                                background: isSelected ? plan.gradient : "transparent",
                                            }}
                                        >
                                            {isSelected && (
                                                <FiCheck className="text-white text-[10px] font-black" />

                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* PROCEED BUTTON */}
                    {selectedPlan && (
                        <div className="max-w-sm mx-auto space-y-4">
                            <button
                                onClick={() => setStep("checkout")}
                                className="w-full py-4 rounded-2xl font-black text-white text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden"
                                style={{
                                    background: selectedPlan.gradient,
                                    boxShadow: `0 8px 32px ${selectedPlan.color}50`,
                                }}
                            >
                                Continue with {selectedPlan.name} →
                            </button>
                            <p className="text-center text-[var(--text-muted)] text-xs">
                                Selected: <span className="text-[var(--accent)] font-semibold">{selectedPlan.name}</span>
                                {selectedPlan.requiresPayment
                                    ? ` — ${selectedPlan.displayPrice}${selectedPlan.period}`
                                    : " — Free"}
                            </p>
                        </div>
                    )}
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

    /* ─────────── CHECKOUT STEP ─────────── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0720] via-[var(--text-primary)] to-[#0d1b4b] flex flex-col">

            {/* NAV */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <button
                    onClick={() => { setStep("select"); setError(""); }}
                    className="flex items-center gap-2 text-[var(--accent)] hover:text-white transition-colors text-sm"
                >
                    ← Change Plan
                </button>
                <span className="text-white font-bold tracking-wider text-sm">
                    <FiBookOpen className="inline-block mr-2" /> TutorHours

                </span>
                <div className="flex items-center gap-2 text-[var(--accent)] text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Secure Checkout
                </div>
            </nav>

            <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 grid lg:grid-cols-2 gap-10 items-start">

                {/* LEFT: PLAN SUMMARY */}
                <div className="space-y-6">
                    <div
                        className="relative p-8 rounded-3xl border border-white/10 overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}
                    >
                        <div
                            className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl"
                            style={{ background: selectedPlan.gradient }}
                        />

                        {selectedPlan.badge && (
                            <div
                                className="inline-block mb-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white"
                                style={{ background: selectedPlan.gradient }}
                            >
                                {selectedPlan.badge}
                            </div>
                        )}

                        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: selectedPlan.color }}>
                            {selectedPlan.name}
                        </p>
                        <p className="text-[var(--accent)] text-sm mb-4">{selectedPlan.tagline}</p>

                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-black text-white">{selectedPlan.displayPrice}</span>
                            <span className="text-[var(--accent)] text-sm">{selectedPlan.period}</span>
                        </div>

                        <div className="space-y-3">
                            {selectedPlan.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-[#d4caff]">
                                    <span
                                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                        style={{ background: selectedPlan.gradient }}
                                    >
                                        <FiCheck />

                                    </span>
                                    {f}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center text-sm">
                            <span className="text-[var(--text-muted)]">
                                {selectedPlan.requiresPayment ? "Billed monthly · Cancel anytime" : "No payment required"}
                            </span>
                            <span className="text-white font-bold">
                                {selectedPlan.displayPrice}{selectedPlan.requiresPayment ? "/mo" : ""}
                            </span>
                        </div>
                    </div>

                    {/* Security badges */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: <FiLock />, label: "256-bit SSL" },
                            { icon: <FiShield />, label: "PCI-DSS Secure" },
                            { icon: <FiAward />, label: "RBI Compliant" },

                        ].map((b) => (
                            <div
                                key={b.label}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/10 text-center"
                                style={{ background: "rgba(255,255,255,0.03)" }}
                            >
                                <span className="text-xl">{b.icon}</span>
                                <span className="text-[10px] text-[var(--accent)] font-semibold">{b.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-3 text-[var(--text-muted)] text-xs">
                        <span>Payments secured by</span>
                        <span className="font-black text-[#3395FF] text-sm tracking-tight">razorpay</span>
                    </div>
                </div>

                {/* RIGHT: PAYMENT METHODS + CTA */}
                <div className="space-y-5">
                    <div>
                        <h1 className="text-2xl font-black text-white mb-1">
                            {selectedPlan.requiresPayment ? "Choose Payment Method" : "Activate Your Plan"}
                        </h1>
                        <p className="text-[var(--accent)] text-sm">
                            {selectedPlan.requiresPayment
                                ? "Razorpay will show all available methods after you click Pay"
                                : "Your plan is free — click below to activate instantly"}
                        </p>
                    </div>

                    {/* Payment method preview */}
                    {selectedPlan.requiresPayment && (
                        <div className="space-y-3">
                            {PaymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 transition-all hover:border-white/20"
                                    style={{ background: "rgba(255,255,255,0.04)" }}
                                >
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
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-semibold">{method.label}</p>
                                        <p className="text-[var(--text-muted)] text-xs truncate">{method.description}</p>
                                    </div>
                                    <div
                                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                                        style={{ background: "linear-gradient(135deg, var(--primary), var(--primary))" }}
                                    >
                                        <FiCheck />

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Free plan visual */}
                    {!selectedPlan.requiresPayment && (
                        <div
                            className="p-6 rounded-2xl border border-white/10 text-center space-y-3"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                        >
                            <div className="text-6xl animate-bounce text-[var(--accent)]"><FiAward /></div>

                            <p className="text-white font-bold">No Credit Card Required</p>
                            <p className="text-[var(--accent)] text-sm">
                                Activate now for free. Upgrade to access more features anytime.
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            <FiAlertCircle className="inline-block mr-2" /> {error}

                        </div>
                    )}

                    {/* Order summary */}
                    {selectedPlan.requiresPayment && (
                        <div
                            className="p-4 rounded-2xl border border-white/10"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                        >
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-[var(--accent)]">{selectedPlan.name} Plan</span>
                                <span className="text-white font-semibold">{selectedPlan.displayPrice}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-[var(--accent)]">Platform fee</span>
                                <span className="text-green-400 font-semibold">₹0</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-[var(--accent)]">GST (18%)</span>
                                <span className="text-white font-semibold">Included</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                <span className="text-white font-bold">Total Due Today</span>
                                <span className="text-white font-black text-lg">{selectedPlan.displayPrice}</span>
                            </div>
                        </div>
                    )}

                    {/* PAY / ACTIVATE BUTTON */}
                    <button
                        onClick={handleProceed}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl font-black text-white text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
                        style={{
                            background: selectedPlan.gradient,
                            boxShadow: `0 8px 32px ${selectedPlan.color}50`,
                        }}
                    >
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
                                {selectedPlan.requiresPayment ? "Opening Razorpay..." : "Activating..."}
                            </span>
                        ) : selectedPlan.requiresPayment ? (
                            <span><FiLock className="inline-block mr-2" /> Pay {selectedPlan.displayPrice} Securely →</span>

                        ) : (
                            <span><FiCheckCircle className="inline-block mr-2" /> Activate {selectedPlan.name} — Free →</span>

                        )}
                    </button>

                    {selectedPlan.requiresPayment && (
                        <p className="text-center text-[var(--text-muted)] text-xs leading-relaxed">
                            Clicking the button opens Razorpay's secure checkout where you can pay via{" "}
                            <span className="text-[var(--accent)]">UPI, Card, Net Banking or Wallet</span>.
                            <br />Money is transferred directly to TutorHours' verified account.
                        </p>
                    )}

                    <div className="text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-[var(--text-muted)] text-xs hover:text-[var(--accent)] transition-colors"
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
