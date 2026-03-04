import { useEffect, useState, useMemo, useCallback } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import socket from "../../services/socket";
import { useAuth } from "../../context/AuthContext";
import {
  FiUsers, FiBookOpen, FiDollarSign, FiStar,
  FiArrowUpRight, FiClock, FiZap, FiTrendingUp,
  FiXCircle, FiRefreshCw, FiCalendar,
} from "react-icons/fi";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend, ArcElement, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement, Filler);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Inline reschedule state per session
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescDate, setRescDate] = useState("");
  const [rescTime, setRescTime] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [sessionRes, feedbackRes] = await Promise.all([
        API.get("/sessions/professor"),
        API.get("/feedback/professor"),
      ]);
      setSessions(sessionRes.data);
      setFeedbacks(feedbackRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));
    socket.on("dashboard:update", fetchAll);
    return () => socket.off("dashboard:update");
  }, []);

  // --- Cancel a session inline ---
  const handleCancel = async (sessionId) => {
    if (!window.confirm("Cancel this session?")) return;
    setActionLoading(true);
    try {
      await API.patch(`/sessions/${sessionId}/cancel`);
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, status: "cancelled" } : s));
      toast.success("Session cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    } finally {
      setActionLoading(false);
    }
  };

  // --- Reschedule a session inline ---
  const handleReschedule = async (e, sessionId) => {
    e.preventDefault();
    if (!rescDate && !rescTime) { toast.error("Enter a new date or time"); return; }
    setActionLoading(true);
    try {
      const res = await API.patch(`/sessions/${sessionId}/reschedule`, {
        date: rescDate || undefined, time: rescTime || undefined,
      });
      setSessions(prev => prev.map(s => s._id === sessionId ? res.data.session : s));
      setRescheduleId(null); setRescDate(""); setRescTime("");
      toast.success("Session rescheduled!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reschedule failed");
    } finally {
      setActionLoading(false);
    }
  };

  const totalStudents = useMemo(
    () => new Set(sessions.flatMap(s => s.students.map(st => st.student?._id || st.student))).size,
    [sessions]
  );
  const activeSessions = sessions.length;
  const avgRating = useMemo(
    () => feedbacks.length ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length) : 0,
    [feedbacks]
  );
  const estimatedEarnings = activeSessions * 500;

  const levelCounts = sessions.reduce((acc, s) => {
    acc[s.level] = (acc[s.level] || 0) + 1;
    return acc;
  }, {});
  const levelLabels = Object.keys(levelCounts);
  const levelValues = Object.values(levelCounts);

  const lineData = {
    labels: sessions.map((_, i) => `S${i + 1}`),
    datasets: [
      {
        label: "Enrolled Students",
        data: sessions.map(s => s.students.length),
        borderColor: "#6A11CB",
        backgroundColor: "rgba(106,17,203,0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6A11CB",
        pointRadius: 4,
      },
    ],
  };

  const doughnutData = {
    labels: levelLabels.length ? levelLabels : ["No sessions"],
    datasets: [{
      data: levelValues.length ? levelValues : [1],
      backgroundColor: ["#6A11CB", "#2575FC", "#FF4E9B", "#8B5CF6", "#06B6D4"],
      borderWidth: 0,
    }],
  };

  // ── Skeleton loading cards ──
  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl">
        {/* Skeleton Banner */}
        <div className="h-28 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" />
        {/* Skeleton stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3 animate-pulse">
              <div className="flex justify-between">
                <div className="w-11 h-11 rounded-xl bg-gray-100" />
                <div className="w-12 h-4 rounded bg-gray-100" />
              </div>
              <div className="h-8 w-16 rounded bg-gray-100" />
              <div className="h-3 w-24 rounded bg-gray-100" />
              <div className="h-1 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
        {/* Skeleton charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-64 animate-pulse">
            <div className="h-4 w-40 rounded bg-gray-100 mb-4" />
            <div className="h-48 rounded-xl bg-gray-50" />
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-64 animate-pulse">
            <div className="h-4 w-28 rounded bg-gray-100 mb-4" />
            <div className="h-48 rounded-full mx-auto w-48 bg-gray-50" />
          </div>
        </div>
      </div>
    );
  }

  const STATS = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: FiUsers,
      color: "from-[#6A11CB] to-[#2575FC]",
      bg: "bg-purple-50",
      textColor: "text-[#6A11CB]",
      sub: "Unique enrolled",
    },
    {
      label: "Sessions",
      value: activeSessions,
      icon: FiBookOpen,
      color: "from-[#2575FC] to-[#6A11CB]",
      bg: "bg-blue-50",
      textColor: "text-[#2575FC]",
      sub: "Total created",
    },
    {
      label: "Avg Rating",
      value: avgRating.toFixed(1),
      icon: FiStar,
      color: "from-[#FF4E9B] to-[#FF6B6B]",
      bg: "bg-pink-50",
      textColor: "text-[#FF4E9B]",
      sub: `From ${feedbacks.length} reviews`,
    },
    {
      label: "Est. Earnings",
      value: `₹${estimatedEarnings.toLocaleString()}`,
      icon: FiDollarSign,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      textColor: "text-emerald-600",
      sub: "₹500 / session",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">

      {/* ── Greeting Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#6A11CB] to-[#2575FC] rounded-2xl p-6 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">{getGreeting()},</p>
          <h2 className="text-2xl font-bold mb-1">{user?.email?.split("@")[0] || "Professor"} 👋</h2>
          <p className="text-white/60 text-sm">
            You have <span className="text-white font-semibold">{activeSessions} session{activeSessions !== 1 ? "s" : ""}</span> created
            and <span className="text-white font-semibold">{totalStudents} student{totalStudents !== 1 ? "s" : ""}</span> enrolled.
          </p>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-10 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute right-24 -top-4 w-16 h-16 rounded-full bg-[#FF4E9B]/30" />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg, textColor, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`${bg} w-11 h-11 rounded-xl flex items-center justify-center`}>
                <Icon size={20} className={textColor} />
              </div>
              <span className="text-xs font-medium text-gray-400 flex items-center gap-0.5">
                <FiArrowUpRight size={12} className="text-green-500" />
                Live
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
            <div className="text-sm font-medium text-gray-500">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${color}`} />
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiTrendingUp size={16} className="text-[#6A11CB]" />
                Student Enrollment Trend
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Students per session</p>
            </div>
          </div>
          <div className="h-52">
            {sessions.length > 0 ? (
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: "#f3f4f6" }, ticks: { color: "#9ca3af", font: { size: 11 } } },
                    x: { grid: { display: false }, ticks: { color: "#9ca3af", font: { size: 11 } } },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No sessions yet — create one to see trends.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Session Levels</h3>
          <p className="text-xs text-gray-400 mb-4">Distribution by level</p>
          <div className="h-52 flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                  legend: { position: "bottom", labels: { font: { size: 11 }, padding: 12 } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Recent Sessions + Feedback ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FiClock size={16} className="text-[#2575FC]" />
              Recent Sessions
            </h3>
            <span className="text-xs bg-purple-50 text-[#6A11CB] px-2.5 py-1 rounded-full font-medium">
              {activeSessions} total
            </span>
          </div>
          <div className="space-y-3">
            {sessions.length === 0 && (
              <p className="text-gray-400 text-sm py-4 text-center">No sessions yet.</p>
            )}
            {sessions.slice(0, 5).map(s => (
              <div key={s._id} className="space-y-2">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.status === "cancelled" ? "bg-red-50" : "bg-purple-50"}`}>
                    <FiBookOpen size={16} className={s.status === "cancelled" ? "text-red-400" : "text-[#6A11CB]"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${s.status === "cancelled" ? "text-gray-400 line-through" : "text-gray-800"}`}>{s.title}</p>
                    <p className="text-xs text-gray-400">{s.date || "No date"} · Level: {s.level}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {s.status === "cancelled" ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-500">Cancelled</span>
                    ) : (
                      <>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.students.length > 0 ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {s.students.length > 0 ? `${s.students.length} enrolled` : "Empty"}
                        </span>
                        <button
                          onClick={() => { setRescheduleId(rescheduleId === s._id ? null : s._id); setRescDate(""); setRescTime(""); }}
                          className="p-1.5 rounded-lg text-[#2575FC] hover:bg-blue-50 transition"
                          title="Reschedule"
                        >
                          <FiRefreshCw size={13} />
                        </button>
                        <button
                          onClick={() => handleCancel(s._id)}
                          disabled={actionLoading}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition disabled:opacity-50"
                          title="Cancel Session"
                        >
                          <FiXCircle size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* Inline reschedule form */}
                {rescheduleId === s._id && s.status !== "cancelled" && (
                  <form onSubmit={e => handleReschedule(e, s._id)} className="flex gap-2 px-3 pb-2">
                    <div className="relative flex-1">
                      <FiCalendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="date" value={rescDate} onChange={e => setRescDate(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6A11CB]/40 bg-gray-50" />
                    </div>
                    <div className="relative flex-1">
                      <FiClock size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="time" value={rescTime} onChange={e => setRescTime(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6A11CB]/40 bg-gray-50" />
                    </div>
                    <button type="submit" disabled={actionLoading}
                      className="px-3 py-2 text-xs rounded-lg font-semibold text-white bg-gradient-to-r from-[#6A11CB] to-[#2575FC] disabled:opacity-60">
                      {actionLoading ? "…" : "Save"}
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FiStar size={16} className="text-[#FF4E9B]" />
              Recent Feedback
            </h3>
            <span className="text-xs bg-pink-50 text-[#FF4E9B] px-2.5 py-1 rounded-full font-medium">
              {avgRating.toFixed(1)} ⭐ avg
            </span>
          </div>
          <div className="space-y-4">
            {feedbacks.length === 0 && (
              <p className="text-gray-400 text-sm py-4 text-center">No feedback yet.</p>
            )}
            {feedbacks.slice(0, 4).map(f => (
              <div key={f._id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-700 text-sm">{f.student?.name || "Student"}</p>
                  <div className="flex gap-0.5 text-[#FF4E9B] text-xs">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star}>{star <= f.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">"{f.message}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiZap size={16} className="text-[#FF4E9B]" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Create Session", icon: "📚", color: "from-[#6A11CB] to-[#2575FC]" },
            { label: "View Students", icon: "👥", color: "from-[#2575FC] to-[#6A11CB]" },
            { label: "Update Profile", icon: "✏️", color: "from-[#FF4E9B] to-[#FF6B6B]" },
            { label: "Add Credentials", icon: "🎓", color: "from-[#6A11CB] to-[#FF4E9B]" },
          ].map(({ label, icon, color }) => (
            <button
              key={label}
              className={`bg-gradient-to-r ${color} text-white rounded-xl px-4 py-4 text-sm font-semibold
                flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
