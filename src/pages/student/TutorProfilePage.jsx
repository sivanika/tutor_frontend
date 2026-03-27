import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const BACKEND_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://tutor-backend-mqz1.onrender.com";

/* ────────────────────────────────────────────────────────────────
   Premium check:
   - free_trial  → LIMITED (no booking, no contact, blurred sections)
   - premium     → FULL access  (subscriptionStatus must be "active")
   - pay_per_session → FULL access (subscriptionStatus must be "active")
   - no subscription / inactive → LIMITED
──────────────────────────────────────────────────────────────── */
function isPremiumStudent(user) {
    if (!user || user.role !== "student") return false;
    const activeTiers = ["premium", "pay_per_session"];
    return (
        user.subscriptionStatus === "active" &&
        activeTiers.includes(user.subscriptionTier)
    );
}


export default function TutorProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [tutor, setTutor] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isLimitError, setIsLimitError] = useState(false);

    const isPremium = isPremiumStudent(user);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Always fetch the professor profile (backend uses optionalProtect — public route)
        const fetchProfile = API.get(`/professors/${id}`)
            .then((res) => setTutor(res.data))
            .catch((err) => {
                const status = err.response?.status;
                if (status === 402) {
                    setIsLimitError(true);
                    setError(
                        err.response?.data?.detail ||
                        "You have reached your profile view limit. Please upgrade your plan."
                    );
                } else if (status === 404) {
                    setError("This tutor profile was not found.");
                } else {
                    setError("Failed to load profile. Please try again.");
                }
            });

        // Only fetch /users/me if already logged in — failure is non-blocking
        const fetchCurrentUser = user
            ? API.get(`/users/me`)
                .then((res) => setCurrentUser(res.data))
                .catch(() => {
                    // Silently ignore — currentUser stays null, premium features stay locked
                })
            : Promise.resolve();

        Promise.all([fetchProfile, fetchCurrentUser]).finally(() => setLoading(false));
    }, [id, user]);

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f5f3ff] dark:bg-[#0f0720]">
                <div className="w-12 h-12 border-4 border-[#6A11CB]/30 border-t-[#6A11CB] rounded-full animate-spin" />
            </div>
        );
    }

    /* ── Error ── */
    if (error || !tutor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f5f3ff] dark:bg-[#0f0720] p-6 text-center">
                <span className="text-5xl">{isLimitError ? "🚀" : "😕"}</span>
                <p className="text-lg font-bold text-[#1a0e33] dark:text-white max-w-md">
                    {error || "Tutor not found"}
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                      onClick={() => navigate(-1)}
                      className="px-6 py-2.5 rounded-xl text-sm justify-center font-bold text-[#6A11CB] bg-white border-2 border-[#6A11CB] hover:bg-[#f5f3ff]"
                  >
                      ← Go Back
                  </button>
                  {isLimitError && (
                    <button
                        onClick={() => navigate("/payment?plan=premium&returnTo=student")}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:scale-105 transition-all"
                        style={{ background: "linear-gradient(135deg, #FF4E9B, #6A11CB)" }}
                    >
                        Upgrade Plan →
                    </button>
                  )}
                </div>
            </div>
        );
    }

    const displayName = tutor.name || "Tutor";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    const photoUrl = tutor.profilePhoto
        ? `${BACKEND_URL}/${tutor.profilePhoto.replace(/\\/g, "/")}`
        : null;
    const ratingLabel = tutor.avgRating != null ? tutor.avgRating.toFixed(1) : "New";

    /* Availability days */
    const availDays = tutor.availability
        ? Object.entries(tutor.availability)
            .filter(([, v]) => v)
            .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
        : [];

    return (
        <div className="min-h-screen bg-[#f5f3ff] dark:bg-[#0f0720] transition-colors duration-500">

            {/* ── TOP NAV ── */}
            <nav className="sticky top-0 z-30 bg-white/80 dark:bg-[#0f0720]/90 backdrop-blur-md border-b border-[#6A11CB]/10 dark:border-[#6A11CB]/20 px-6 py-3 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-semibold text-[#6A11CB] dark:text-[#a78bfa] hover:opacity-75 transition-opacity"
                >
                    ← Back
                </button>
                <span className="font-black text-[#1a0e33] dark:text-white tracking-tight">
                    🎓 TutorHours
                </span>
                {!user && (
                    <button
                        onClick={() => navigate("/login")}
                        className="text-xs font-semibold px-4 py-1.5 rounded-lg text-white"
                        style={{ background: "linear-gradient(135deg, #6A11CB, #2575FC)" }}
                    >
                        Login
                    </button>
                )}
                {user && !isPremium && (
                    <button
                        onClick={() => navigate("/payment?plan=premium&returnTo=student")}
                        className="text-xs font-semibold px-4 py-1.5 rounded-lg text-white"
                        style={{ background: "linear-gradient(135deg, #FF4E9B, #6A11CB)" }}
                    >
                        Upgrade ✨
                    </button>
                )}
                {user && isPremium && (
                    <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                        ✓ Premium
                    </span>
                )}
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

                {/* ── UPGRADE BANNER (free users only) ── */}
                {!isPremium && (
                    <div
                        className="relative rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #6A11CB20, #FF4E9B15)" }}
                    >
                        <div
                            className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                            style={{ borderColor: "#6A11CB30" }}
                        />
                        <div className="relative z-10">
                            <p className="font-black text-[#1a0e33] dark:text-white text-sm md:text-base">
                                🚀 Upgrade to Premium
                            </p>
                            <p className="text-[#6b7280] dark:text-[#a78bfa] text-xs mt-0.5">
                                Book sessions, see full availability & contact this tutor directly.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/payment?plan=premium&returnTo=student")}
                            className="relative z-10 flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            style={{
                                background: "linear-gradient(135deg, #6A11CB, #FF4E9B)",
                                boxShadow: "0 4px 16px #6A11CB30",
                            }}
                        >
                            Upgrade Now →
                        </button>
                    </div>
                )}

                {/* ── HERO CARD ── */}
                <div className="bg-white dark:bg-[#160d2e] rounded-2xl p-7 border border-[#6A11CB]/10 dark:border-[#6A11CB]/20 shadow-md">
                    <div className="flex items-start gap-5">
                        {/* Avatar */}
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt={displayName}
                                loading="lazy"
                                width={80}
                                height={80}
                                className="w-20 h-20 rounded-2xl object-cover shadow-lg flex-shrink-0"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    document.getElementById("profile-initials").style.display = "flex";
                                }}
                            />
                        ) : null}
                        <div
                            id="profile-initials"
                            className="w-20 h-20 rounded-2xl flex-shrink-0 items-center justify-center font-black text-3xl text-white shadow-lg"
                            style={{
                                background: "linear-gradient(135deg, #6A11CB, #2575FC)",
                                boxShadow: "0 8px 24px #6A11CB40",
                                display: photoUrl ? "none" : "flex",
                            }}
                        >
                            {initials}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-black text-[#1a0e33] dark:text-white">
                                {displayName}
                            </h1>
                            {tutor.headline && (
                                <p className="text-[#6b7280] dark:text-[#a78bfa] text-sm mt-0.5">
                                    {tutor.headline}
                                </p>
                            )}
                            <p className="text-sm font-semibold text-[#6A11CB] dark:text-[#c4b5fd] mt-1">
                                {tutor.subjects || "General Tutoring"}
                            </p>

                            {/* Stats row */}
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                                <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                                    ★ {ratingLabel}
                                    <span className="text-[#6b7280] dark:text-[#a78bfa] font-normal text-xs">
                                        ({tutor.reviewCount} reviews)
                                    </span>
                                </span>
                                <span className="text-xs text-[#6b7280] dark:text-[#a78bfa]">
                                    🎓 {tutor.sessionCount} sessions
                                </span>
                                {tutor.yearsExperience && (
                                    <span className="text-xs text-[#6b7280] dark:text-[#a78bfa]">
                                        📅 {tutor.yearsExperience} yrs exp
                                    </span>
                                )}
                                {tutor.teachingLevel && (
                                    <span className="text-xs text-[#6b7280] dark:text-[#a78bfa]">
                                        📚 {tutor.teachingLevel}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio — always visible */}
                    {tutor.bio && (
                        <div className="mt-6 pt-5 border-t border-[#6A11CB]/10 dark:border-[#6A11CB]/20">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#6A11CB] dark:text-[#a78bfa] mb-2">
                                About
                            </h2>
                            <p className="text-[#374151] dark:text-[#d4caff] text-sm leading-relaxed">
                                {tutor.bio}
                            </p>
                        </div>
                    )}

                    {/* Teaching style — always visible */}
                    {tutor.teachingStyle && (
                        <div className="mt-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#6A11CB] dark:text-[#a78bfa] mb-2">
                                Teaching Style
                            </h2>
                            <p className="text-[#374151] dark:text-[#d4caff] text-sm leading-relaxed">
                                {tutor.teachingStyle}
                            </p>
                        </div>
                    )}

                    {/* Specializations chips — always visible */}
                    {tutor.specializations && (
                        <div className="mt-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#6A11CB] dark:text-[#a78bfa] mb-2">
                                Specializations
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {tutor.specializations.split(",").map((s, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full text-xs font-semibold text-[#6A11CB] dark:text-[#c4b5fd] bg-[#6A11CB]/10 dark:bg-[#6A11CB]/20"
                                    >
                                        {s.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── AVAILABILITY ── */}
                <div>
                    <div className="bg-white dark:bg-[#160d2e] rounded-2xl p-6 border border-[#6A11CB]/10 dark:border-[#6A11CB]/20 shadow-md">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#6A11CB] dark:text-[#a78bfa] mb-4">
                            📅 Availability
                        </h2>
                        {availDays.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {availDays.map((day) => (
                                    <span
                                        key={day}
                                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                                        style={{ background: "linear-gradient(135deg, #6A11CB, #2575FC)" }}
                                    >
                                        {day}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#6b7280] text-sm">No availability set yet.</p>
                        )}
                    </div>
                </div>

                {/* ── CONTACT ── */}
                <div>
                    <div className="bg-white dark:bg-[#160d2e] rounded-2xl p-6 border border-[#6A11CB]/10 dark:border-[#6A11CB]/20 shadow-md">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#6A11CB] dark:text-[#a78bfa] mb-4">
                            📬 Contact Details
                        </h2>
                        {isPremium ? (
                            <div className="space-y-2">
                                {tutor.email && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-[#6b7280]">Email:</span>
                                        <a href={`mailto:${tutor.email}`} className="text-[#6A11CB] dark:text-[#c4b5fd] font-medium hover:underline">
                                            {tutor.email}
                                        </a>
                                    </div>
                                )}
                                {tutor.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-[#6b7280]">Phone:</span>
                                        <a href={`tel:${tutor.phone}`} className="text-[#6A11CB] dark:text-[#c4b5fd] font-medium hover:underline">
                                            {tutor.phone}
                                        </a>
                                    </div>
                                )}
                                {!tutor.email && !tutor.phone && (
                                    <p className="text-[#6b7280] text-sm">No contact info added yet.</p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 bg-[#f5f3ff] dark:bg-[#1f1635] rounded-xl border border-dashed border-[#6A11CB]/30">
                                <span className="text-2xl mb-2">🔒</span>
                                <p className="text-sm text-center text-[#6b7280] dark:text-[#a78bfa] max-w-xs">
                                    Contact info is premium only. <br/>
                                    <button
                                        onClick={() => navigate("/payment?plan=premium&returnTo=student")}
                                        className="text-[#6A11CB] dark:text-[#c4b5fd] font-bold hover:underline mt-1"
                                    >
                                        Upgrade to Premium
                                    </button>
                                    {" "}to view details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── BOOK SESSION BUTTON ── */}
                <div>
                    {isPremium || (currentUser?.subscriptionPlan && currentUser.currentPlanSessionsBooked < currentUser.subscriptionPlan.maxSessions) ? (
                        <button
                            onClick={() => navigate(`/student/dashboard`)}
                            className="w-full py-4 rounded-2xl font-black text-white text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                            style={{
                                background: "linear-gradient(135deg, #6A11CB, #2575FC)",
                                boxShadow: "0 8px 32px #6A11CB50",
                            }}
                        >
                            📅 Go to Dashboard to Book →
                        </button>
                    ) : (
                        <div className="relative">
                            <button
                                disabled
                                className="w-full py-4 rounded-2xl font-black text-white text-base opacity-50 cursor-not-allowed"
                                style={{ background: "linear-gradient(135deg, #6A11CB, #2575FC)" }}
                            >
                                🔒 Book a Session (Limit Reached)
                            </button>
                            <p className="text-center text-xs text-[#6b7280] dark:text-[#a78bfa] mt-2">
                                <button
                                    onClick={() => navigate("/payment?plan=premium&returnTo=student")}
                                    className="underline text-[#6A11CB] dark:text-[#c4b5fd] hover:opacity-75"
                                >
                                    Upgrade to Premium
                                </button>{" "}
                                to book more sessions.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── REVIEWS ── */}
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[#6A11CB] dark:text-[#a78bfa] mb-4">
                        ⭐ Student Reviews
                    </h2>

                    {tutor.reviews?.length > 0 ? (
                        <div className="space-y-4">
                            {tutor.reviews.map((review, i) => (
                                <div
                                    key={i}
                                    className="bg-white dark:bg-[#160d2e] rounded-2xl p-5 border border-[#6A11CB]/10 dark:border-[#6A11CB]/20 shadow-sm"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                            style={{ background: "linear-gradient(135deg, #6A11CB, #2575FC)" }}
                                        >
                                            {(review.student?.name || "?")?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#1a0e33] dark:text-white">
                                                {review.student?.name || "Student"}
                                            </p>
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: 5 }).map((_, s) => (
                                                    <span
                                                        key={s}
                                                        className={s < review.rating ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}
                                                        style={{ fontSize: "11px" }}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#374151] dark:text-[#d4caff] leading-relaxed">
                                        {review.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#160d2e] rounded-2xl p-6 border border-[#6A11CB]/10 text-center text-[#6b7280] dark:text-[#a78bfa] text-sm">
                            No reviews yet — be the first to leave one!
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
