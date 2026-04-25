import { useNavigate } from "react-router-dom";

export default function ProfessorPaymentStep() {
    const navigate = useNavigate();

    const handleActivate = () => {
        // Redirect to the new dedicated professor payment page
        navigate("/professor/payment");
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">
                    Final Step — Platform Agreement
                </p>
                <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2">
                    Start Teaching with{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, var(--primary), var(--accent))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        TutorHours
                    </span>
                </h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Join as a professor with our simple commission model — no upfront costs, no monthly fee.
                </p>
            </div>

            {/* Commission Model Card */}
            <div className="max-w-xl mx-auto">
                <div
                    className="relative p-8 rounded-2xl border-2 border-[var(--primary)]/30 shadow-xl"
                    style={{
                        background: "linear-gradient(160deg, var(--surface-alt) 0%, #fdf0f7 100%)",
                        boxShadow: "0 8px 32px rgba(106,17,203,0.15)",
                    }}
                >
                    {/* Top gradient strip */}
                    <div
                        className="absolute top-0 left-0 w-full h-1.5 rounded-t-2xl"
                        style={{ background: "linear-gradient(135deg, var(--primary), var(--primary))" }}
                    />

                    {/* Badge */}
                    <div
                        className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow"
                        style={{ background: "linear-gradient(135deg, var(--primary), var(--primary))" }}
                    >
                        Pay Per Session
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6 mt-2">
                        <span className="text-6xl font-black text-[var(--text-primary)]">18%</span>
                        <span className="text-lg text-slate-500 ml-2">commission</span>
                        <p className="text-sm text-slate-400 mt-1">per completed session</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                        {[
                            { icon: "🆓", text: "No monthly fee or upfront cost" },
                            { icon: "💸", text: "You keep 82% of every session fee" },
                            { icon: "📅", text: "Set your own schedule & hourly rate" },
                            { icon: "🎓", text: "Access to all student requests" },
                            { icon: "📊", text: "Earnings dashboard & analytics" },
                            { icon: "🔒", text: "Secure payouts via Razorpay" },
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                                <span className="text-lg">{item.icon}</span>
                                {item.text}
                            </li>
                        ))}
                    </ul>

                    {/* Commission breakdown */}
                    <div className="mt-6 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-[var(--primary)]/10">
                        <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                            Example Breakdown
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <p className="text-lg font-black text-[var(--text-primary)]">₹500</p>
                                <p className="text-xs text-slate-400">Session Fee</p>
                            </div>
                            <div>
                                <p className="text-lg font-black text-[var(--accent)]">₹90</p>
                                <p className="text-xs text-slate-400">Platform (18%)</p>
                            </div>
                            <div>
                                <p className="text-lg font-black text-[var(--primary)]">₹410</p>
                                <p className="text-xs text-slate-400">You Earn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms */}
            <div className="max-w-xl mx-auto">
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 text-center">
                    By activating, you agree to TutorHours'{" "}
                    <span className="text-[var(--primary)] font-semibold cursor-pointer hover:underline">
                        Terms of Service
                    </span>{" "}
                    and the{" "}
                    <span className="text-[var(--primary)] font-semibold cursor-pointer hover:underline">
                        Tutor Commission Policy
                    </span>.
                </div>
            </div>

            {/* CTA — goes to payment page */}
            <div className="flex justify-center">
                <button
                    onClick={handleActivate}
                    className="px-10 py-3.5 rounded-2xl font-bold text-white text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    style={{
                        background: "linear-gradient(135deg, var(--primary), var(--primary))",
                        boxShadow: "0 8px 24px rgba(106,17,203,0.35)",
                    }}
                >
                    Review &amp; Activate My Listing →
                </button>
            </div>

            <p className="text-center text-xs text-slate-400">
                🔒 This listing is free. Payments for sessions processed by{" "}
                <span className="font-semibold text-slate-500">Razorpay</span>
            </p>
        </div>
    );
}
