import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import socket from "../../services/socket";
import { toast } from "react-hot-toast";

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
    const isBasic = found.price === 49900;
    const isPremium = found.price === 99900;
    const isYearly = found.period === "yearly";

    let features = [
        "Enhanced profile visibility",
        "Unlimited session management",
        "Community & tech support",
    ];

    if (isBasic) {
        features = ["Basic instructor verification", "Standard profile listing", ...features];
    } else if (isPremium) {
        features = ["Premium verification badge", "Featured in search results", "Advanced student analytics", ...features];
    } else if (isYearly) {
        features = ["All Premium features", "Year-round maximum visibility", "Priority tech support", "Custom profile URL", ...features];
    }

    return {
        ...found,
        planId: found._id,
        displayPrice: `₹${found.price / 100}`,
        period: isYearly ? "/year" : "/month",
        color: isYearly ? "#f59e0b" : isPremium ? "#6366f1" : "#10b981",
        gradient: isYearly
            ? "linear-gradient(135deg, #f59e0b, #ef4444)"
            : isPremium
            ? "linear-gradient(135deg, #6366f1, #a855f7)"
            : "linear-gradient(135deg, #10b981, #3b82f6)",
        tagline: found.description || "Activate your professional tutor account",
        requiresPayment: true,
        badge: isYearly ? "Best Value" : isPremium ? "Recommended" : "Essential",
        features,
    };
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function ProfessorPaymentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [allPlans, setAllPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plansLoading, setPlansLoading] = useState(true);

    // Checkout state
    const [step, setStep] = useState("select");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [paymentId, setPaymentId] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        API.get("/subscriptions/plans?targetAudience=professor")
            .then((res) => {
                const enriched = res.data
                    .filter((p) => p.isActive)
                    .map(enrichPlan);
                setAllPlans(enriched);
                setSelectedPlan(enriched[0] || null);
            })
            .catch(() => {})
            .finally(() => setPlansLoading(false));
    }, []);

    /* ── Realtime: Listen for payment confirmation ── */
    useEffect(() => {
        const onPaymentVerified = (data) => {
            if (data.success) {
                setPaymentId(data.paymentId);
                setSuccess(true);
                setLoading(false);
                toast.success("Payment confirmed! Welcome aboard professor. 🎉");
                setTimeout(() => navigate("/verification-pending"), 3000);
            }
        };

        socket.on("payment_verified", onPaymentVerified);
        if (!socket.connected) socket.connect();
        return () => {
            socket.off("payment_verified", onPaymentVerified);
        };
    }, [navigate]);

    const getUserInfo = () => {
        try {
            return JSON.parse(localStorage.getItem("userInfo"))?.user || {};
        } catch { return {}; }
    };

    const handleProceed = async () => {
        if (!selectedPlan) return;
        setLoading(true);
        setError("");

        if (!selectedPlan.requiresPayment) {
            try {
                await API.post("/payment/activate-free", { planId: selectedPlan.planId });
                setSuccess(true);
                setTimeout(() => navigate("/verification-pending"), 2000);
            } catch (err) {
                setError(err.response?.data?.message || "Activation failed.");
            } finally { setLoading(false); }
            return;
        }

        try {
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error("Razorpay script failed to load.");

            const { data } = await API.post("/payment/create-order", {
                planId: selectedPlan.planId,
            });
            const userInfo = getUserInfo();

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "TutorHours Business",
                description: `Professor Registration — ${selectedPlan.name}`,
                order_id: data.orderId,
                prefill: {
                    name: userInfo.name || "",
                    email: userInfo.email || "",
                    contact: userInfo.phone || "",
                },
                theme: { color: "#6366f1" },
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
                            setTimeout(() => navigate("/verification-pending"), 3000);
                        }
                    } catch {
                        setError("Verification failed. Please contact support.");
                        setLoading(false);
                    }
                },
            };
            new window.Razorpay(options).open();
        } catch (err) {
            setError(err.message || "Failed to initiate payment.");
            setLoading(false);
        }
    };

    if (plansLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        </div>
    );

    if (success) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-center">
            <div className="space-y-4 max-w-sm">
                <div className="text-6xl animate-bounce">🏛️</div>
                <h1 className="text-3xl font-bold text-white">Payment Successful</h1>
                <p className="text-indigo-400">Your professor account is moving forward!</p>
                <p className="text-slate-500 text-sm">Redirecting to verification status...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Nav */}
            <nav className="p-6 border-b border-white/5 flex justify-between items-center">
                <div className="text-xl font-black tracking-tighter">
                    TUTOR<span className="text-indigo-500">HOURS</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-bold border border-indigo-500/20">Pro</span>
                </div>
                <button onClick={() => navigate("/professor/dashboard")} className="text-sm text-slate-400 hover:text-white transition">Back to Dashboard</button>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold mb-4">Activate Instructor Account</h1>
                    <p className="text-slate-400 max-w-md mx-auto">Complete your professional registration to start teaching students globally.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Plans */}
                    <div className="space-y-4">
                        {allPlans.map((plan) => (
                            <div
                                key={plan._id}
                                onClick={() => setSelectedPlan(plan)}
                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                                    selectedPlan?._id === plan._id 
                                    ? "border-indigo-500 bg-indigo-500/5" 
                                    : "border-white/5 bg-white/5 hover:border-white/10"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{plan.name}</h3>
                                        <p className="text-xs text-slate-400">{plan.tagline}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black">{plan.displayPrice}</div>
                                        <div className="text-[10px] uppercase text-slate-500 font-bold">{plan.period}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {plan.features.slice(0, 3).map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                                            <span className="text-indigo-500">✦</span> {f}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Box */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl sticky top-8">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Plan</span>
                                <span>{selectedPlan?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Setup Fee</span>
                                <span className="text-green-400">Waived</span>
                            </div>
                            <div className="border-t border-white/5 pt-4 flex justify-between font-bold text-lg">
                                <span>Total due</span>
                                <span>{selectedPlan?.displayPrice}</span>
                            </div>
                        </div>

                        {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-4">{error}</div>}

                        <button 
                            disabled={loading}
                            onClick={handleProceed}
                            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-all disabled:opacity-50"
                        >
                            {loading ? "Initializing..." : `Pay ${selectedPlan?.displayPrice} Securely`}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-4 opacity-30 grayscale">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Razorpay_logo.png" alt="Razorpay" className="h-4" />
                            <div className="h-4 w-[1px] bg-white" />
                            <div className="text-[10px] font-black tracking-widest uppercase">PCI Secure</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
