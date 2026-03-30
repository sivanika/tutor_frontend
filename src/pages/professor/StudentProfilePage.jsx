import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FiArrowLeft, FiBook, FiMapPin, FiUser, FiTarget, FiLock } from "react-icons/fi";

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "https://tutor-backend-mqz1.onrender.com";

/* ─────────────────────────────────────────────────────────────────
   Premium check for professors:
   - Professor with subscriptionStatus "active" + premium/pay_per_session tier → FULL
   - No plan / inactive → BASIC (still can view, contact details hidden)
────────────────────────────────────────────────────────────────── */
function isPremiumProfessor(user) {
  if (!user || user.role !== "professor") return false;
  const activeTiers = ["premium", "pay_per_session"];
  return (
    user.subscriptionStatus === "active" &&
    activeTiers.includes(user.subscriptionTier)
  );
}

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [student, setStudent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLimitError, setIsLimitError] = useState(false);

  const isPremium = isPremiumProfessor(user);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchProfile = API.get(`/student/${id}`)
      .then((res) => setStudent(res.data))
      .catch((err) => {
        const status = err.response?.status;
        if (status === 402) {
          setIsLimitError(true);
          setError(
            err.response?.data?.detail ||
              "You have reached your student profile view limit. Please upgrade your plan."
          );
        } else if (status === 404) {
          setError("This student profile was not found.");
        } else {
          setError("Failed to load profile. Please try again.");
        }
      });

    const fetchCurrentUser = user
      ? API.get(`/users/me`)
          .then((res) => setCurrentUser(res.data))
          .catch(() => {})
      : Promise.resolve();

    Promise.all([fetchProfile, fetchCurrentUser]).finally(() =>
      setLoading(false)
    );
  }, [id, user]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff5f9] dark:bg-[#0f0720]">
        <div className="w-12 h-12 border-4 border-[#FF4E9B]/30 border-t-[#FF4E9B] rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Error / Limit ── */
  if (error || !student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fff5f9] dark:bg-[#0f0720] p-6 text-center">
        <span className="text-5xl">{isLimitError ? "🚀" : "😕"}</span>
        <p className="text-lg font-bold text-[#1a0e33] dark:text-white max-w-md">
          {error || "Student not found"}
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#FF4E9B] bg-white border-2 border-[#FF4E9B] hover:bg-[#fff5f9] transition-all"
          >
            ← Go Back
          </button>
          {isLimitError && (
            <button
              onClick={() => navigate("/payment?plan=premium&returnTo=professor")}
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

  const displayName = student.name || "Student";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const photoUrl = student.studentPhoto
    ? `${BACKEND_URL}/${student.studentPhoto.replace(/\\/g, "/")}`
    : null;

  const subjects = Array.isArray(student.specializations)
    ? student.specializations
    : typeof student.specializations === "string" && student.specializations.trim()
    ? student.specializations.split(",").map((s) => s.trim())
    : [];

  return (
    <div className="min-h-screen bg-[#fff5f9] dark:bg-[#0f0720] transition-colors duration-500">

      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-[#0f0720]/90 backdrop-blur-md border-b border-[#FF4E9B]/10 dark:border-[#FF4E9B]/20 px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-[#FF4E9B] dark:text-[#f9a8d4] hover:opacity-75 transition-opacity"
        >
          <FiArrowLeft size={16} />
          Back
        </button>
        <span className="font-black text-[#1a0e33] dark:text-white tracking-tight">
          🎓 TutorHours
        </span>
        {user && !isPremium && (
          <button
            onClick={() => navigate("/payment?plan=premium&returnTo=professor")}
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

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* ── UPGRADE BANNER (non-premium professors) ── */}
        {!isPremium && (
          <div
            className="relative rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #FF4E9B20, #6A11CB15)" }}
          >
            <div
              className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
              style={{ borderColor: "#FF4E9B30" }}
            />
            <div className="relative z-10">
              <p className="font-black text-[#1a0e33] dark:text-white text-sm md:text-base">
                🚀 Upgrade to Premium
              </p>
              <p className="text-[#6b7280] dark:text-[#f9a8d4] text-xs mt-0.5">
                View unlimited student profiles and see full learning details.
              </p>
            </div>
            <button
              onClick={() => navigate("/payment?plan=premium&returnTo=professor")}
              className="relative z-10 flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #FF4E9B, #6A11CB)",
                boxShadow: "0 4px 16px #FF4E9B30",
              }}
            >
              Upgrade Now →
            </button>
          </div>
        )}

        {/* ── HERO CARD ── */}
        <div className="bg-white dark:bg-[#160d2e] rounded-2xl p-7 border border-[#FF4E9B]/10 dark:border-[#FF4E9B]/20 shadow-md">
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
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-3xl text-white shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #FF4E9B, #6A11CB)",
                  boxShadow: "0 8px 24px #FF4E9B40",
                }}
              >
                {initials}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-[#1a0e33] dark:text-white">
                {displayName}
              </h1>
              {student.gradeLevel && (
                <p className="text-sm font-semibold text-[#FF4E9B] dark:text-[#f9a8d4] mt-0.5">
                  {student.gradeLevel}
                </p>
              )}
              {student.school && (
                <p className="flex items-center gap-1.5 text-sm text-[#6b7280] dark:text-[#a78bfa] mt-1">
                  <FiMapPin size={12} className="text-[#FF4E9B]" />
                  {student.school}
                </p>
              )}
            </div>
          </div>

          {/* Bio — always visible */}
          {student.bio && (
            <div className="mt-6 pt-5 border-t border-[#FF4E9B]/10 dark:border-[#FF4E9B]/20">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF4E9B] dark:text-[#f9a8d4] mb-2">
                About
              </h2>
              <p className="text-[#374151] dark:text-[#d4caff] text-sm leading-relaxed">
                {student.bio}
              </p>
            </div>
          )}
        </div>

        {/* ── SUBJECTS / NEEDS HELP WITH ── */}
        {subjects.length > 0 && (
          <div className="bg-white dark:bg-[#160d2e] rounded-2xl p-6 border border-[#FF4E9B]/10 dark:border-[#FF4E9B]/20 shadow-md">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF4E9B] dark:text-[#f9a8d4] mb-4 flex items-center gap-2">
              <FiBook size={13} /> Needs Help With
            </h2>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subj, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-semibold text-[#FF4E9B] dark:text-[#f9a8d4] bg-[#FF4E9B]/10 dark:bg-[#FF4E9B]/20"
                >
                  {subj}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── LEARNING GOALS — gated for non-premium ── */}
        <div className="bg-white dark:bg-[#160d2e] rounded-2xl p-6 border border-[#FF4E9B]/10 dark:border-[#FF4E9B]/20 shadow-md">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF4E9B] dark:text-[#f9a8d4] mb-4 flex items-center gap-2">
            <FiTarget size={13} /> Learning Goals
          </h2>
          {isPremium ? (
            student.learningGoals ? (
              <p className="text-[#374151] dark:text-[#d4caff] text-sm leading-relaxed">
                {student.learningGoals}
              </p>
            ) : (
              <p className="text-[#9ca3af] text-sm italic">No learning goals specified.</p>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-6 bg-[#fff5f9] dark:bg-[#1f1635] rounded-xl border border-dashed border-[#FF4E9B]/30">
              <FiLock className="text-[#FF4E9B] mb-2" size={22} />
              <p className="text-sm text-center text-[#6b7280] dark:text-[#a78bfa] max-w-xs">
                Learning goals are premium only.{" "}
                <button
                  onClick={() => navigate("/payment?plan=premium&returnTo=professor")}
                  className="text-[#FF4E9B] dark:text-[#f9a8d4] font-bold hover:underline mt-1"
                >
                  Upgrade to Premium
                </button>{" "}
                to view full details.
              </p>
            </div>
          )}
        </div>

        {/* ── STUDENT LEVEL & GRADE ── */}
        <div className="bg-white dark:bg-[#160d2e] rounded-2xl p-6 border border-[#FF4E9B]/10 dark:border-[#FF4E9B]/20 shadow-md">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF4E9B] dark:text-[#f9a8d4] mb-4 flex items-center gap-2">
            <FiUser size={13} /> Student Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Grade Level</p>
              <span className="inline-block px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-[#6A11CB] dark:text-[#c4b5fd] text-xs font-bold rounded-lg border border-purple-100 dark:border-purple-800">
                {student.gradeLevel || "Not specified"}
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">School</p>
              <p className="text-sm text-[#374151] dark:text-[#d4caff] font-medium">
                {student.school || "Not listed"}
              </p>
            </div>
          </div>
        </div>

        {/* ── BACK TO BROWSE ── */}
        <button
          onClick={() => navigate(-1)}
          className="w-full py-4 rounded-2xl font-black text-white text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #FF4E9B, #6A11CB)",
            boxShadow: "0 8px 32px #FF4E9B50",
          }}
        >
          <FiArrowLeft size={18} />
          Back to Browse Students
        </button>

      </div>
    </div>
  );
}
