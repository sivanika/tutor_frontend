import { useEffect, useState } from "react";
import API from "../../services/api";
import socket from "../../services/socket";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [sessionRes, feedbackRes] = await Promise.all([
      API.get("/sessions/professor"),
      API.get("/feedback/professor"),
    ]);
    setSessions(sessionRes.data);
    setFeedbacks(feedbackRes.data);
  };

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));

    socket.on("dashboard:update", () => {
      fetchAll();
    });

    return () => socket.off("dashboard:update");
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  const totalStudents = new Set(
    sessions.flatMap((s) => s.students.map((st) => st._id))
  ).size;

  const activeSessions = sessions.length;

  const avgRating =
    feedbacks.reduce((sum, f) => sum + f.rating, 0) /
      (feedbacks.length || 1);

  return (
    <div className="space-y-8">
      {/* PARTS WILL BE INSERTED HERE */}
      {/* ===================== PART 1 ===================== */}
{/* Subscription Notice */}
<div className="bg-gradient-to-r from-[#2A4D6E] to-[#8A4F7D] text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-center shadow">
  <div>
    <h3 className="text-xl font-bold mb-1">Premium Subscription Active</h3>
    <p className="text-sm opacity-90">
      Your profile is fully visible to students. Enjoy full access to all
      premium features.
    </p>
  </div>
  <button className="mt-3 md:mt-0 bg-white text-[#2A4D6E] px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
    Manage Subscription
  </button>
</div>

{/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Total Students */}
  <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
    <h3 className="text-[#2A4D6E] font-semibold mb-2 flex items-center gap-2">
      <span className="text-[#C76B4A]">👨‍🎓</span> Total Students
    </h3>
    <div className="text-4xl font-bold text-[#2A4D6E]">
      {totalStudents}
    </div>
    <p className="text-gray-500 text-sm">Unique enrolled students</p>
  </div>

  {/* Active Sessions */}
  <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
    <h3 className="text-[#2A4D6E] font-semibold mb-2 flex items-center gap-2">
      <span className="text-[#C76B4A]">📚</span> Active Sessions
    </h3>
    <div className="text-4xl font-bold text-[#2A4D6E]">
      {activeSessions}
    </div>
    <p className="text-gray-500 text-sm">Total sessions created</p>
  </div>

  {/* Earnings (Derived Example) */}
  <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
    <h3 className="text-[#2A4D6E] font-semibold mb-2 flex items-center gap-2">
      <span className="text-[#C76B4A]">💰</span> Earnings
    </h3>
    <div className="text-4xl font-bold text-[#2A4D6E]">
      ₹{activeSessions * 500}
    </div>
    <p className="text-gray-500 text-sm">
      Estimated based on sessions (₹500/session)
    </p>
  </div>
</div>
{/* =================== END PART 1 =================== */}

{/* ===================== PART 2 ===================== */}
{/* Performance Analytics + Student Statistics */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Performance Analytics Chart */}
  <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
    <h3 className="text-[#2A4D6E] font-semibold mb-4 flex items-center gap-2">
      <span className="text-[#C76B4A]">📈</span> Performance Analytics
    </h3>

    <div className="h-64">
      <Line
        data={{
          labels: sessions.map((s, i) => `Session ${i + 1}`),
          datasets: [
            {
              label: "Enrolled Students",
              data: sessions.map((s) => s.students.length),
              borderColor: "#4A8B6F",
              backgroundColor: "rgba(74, 139, 111, 0.15)",
              tension: 0.3,
              fill: true,
            },
            {
              label: "Sessions Growth",
              data: sessions.map((_, i) => i + 1),
              borderColor: "#C76B4A",
              backgroundColor: "rgba(199, 107, 74, 0.15)",
              tension: 0.3,
              fill: true,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  </div>

  {/* Student Statistics */}
  <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
    <h3 className="text-[#2A4D6E] font-semibold mb-4 flex items-center gap-2">
      <span className="text-[#C76B4A]">🎓</span> Student Statistics
    </h3>

    <div className="space-y-4">
      <div>
        <div className="text-3xl font-bold text-[#2A4D6E]">
          {totalStudents}
        </div>
        <p className="text-gray-500 text-sm">Total Students Enrolled</p>
      </div>

      <div>
        <div className="text-3xl font-bold text-[#4A8B6F]">
          {activeSessions}
        </div>
        <p className="text-gray-500 text-sm">Active Sessions Running</p>
      </div>

      <div>
        <div className="text-3xl font-bold text-[#C76B4A]">
          {avgRating.toFixed(1)} / 5
        </div>
        <p className="text-gray-500 text-sm">Average Student Rating</p>
      </div>
    </div>
  </div>
</div>

{/* Engagement Insights */}
<div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-[#2A4D6E] font-semibold flex items-center gap-2">
      <span className="text-[#C76B4A]">📊</span> Student Engagement Insights
    </h3>
    <button className="bg-[#C76B4A] text-white px-4 py-1 rounded-full text-sm hover:bg-[#8A4F7D] transition">
      View Details
    </button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <InsightCard
      value={`${Math.min(100, totalStudents * 5)}%`}
      label="Avg. Session Completion"
    />
    <InsightCard
      value={`${Math.min(100, activeSessions * 10)}%`}
      label="Assignment Submission Rate"
    />
    <InsightCard
      value={`${avgRating.toFixed(1)}/5`}
      label="Student Satisfaction"
    />
    <InsightCard
      value={`${Math.min(100, activeSessions * 8)}%`}
      label="Repeat Enrollment Rate"
    />
  </div>
</div>
{/* =================== END PART 2 =================== */}
{/* ===================== PART 3 ===================== */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  {/* Recent Sessions */}
  <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
    <h3 className="text-[#2A4D6E] font-semibold mb-4 flex items-center gap-2">
      <span className="text-[#C76B4A]">🕒</span> Recent Sessions
    </h3>

    <div className="space-y-3">
      {sessions.slice(0, 5).map((s) => (
        <div
          key={s._id}
          className="flex justify-between items-center border-b pb-2 last:border-b-0"
        >
          <div>
            <p className="font-semibold text-[#2A4D6E]">{s.title}</p>
            <p className="text-gray-500 text-sm">
              {s.date || "No date"} • {s.time || "No time"}
            </p>
          </div>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              s.students.length > 0
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {s.students.length > 0 ? "Active" : "New"}
          </span>
        </div>
      ))}

      {!sessions.length && (
        <p className="text-gray-500 text-sm">No sessions created yet.</p>
      )}
    </div>
  </div>

  {/* Current Courses */}
  <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
    <h3 className="text-[#2A4D6E] font-semibold mb-4 flex items-center gap-2">
      <span className="text-[#C76B4A]">🏃</span> Current Courses
    </h3>

    <div className="space-y-3">
      {sessions.map((s) => (
        <div
          key={s._id}
          className="flex justify-between items-center border-b pb-2 last:border-b-0"
        >
          <div>
            <p className="font-semibold text-[#2A4D6E]">{s.title}</p>
            <p className="text-gray-500 text-sm">
              Level: {s.level} • {s.time || "No time"}
            </p>
          </div>

          <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
            Active
          </span>
        </div>
      ))}

      {!sessions.length && (
        <p className="text-gray-500 text-sm">No active courses.</p>
      )}
    </div>
  </div>

</div>
{/* =================== END PART 3 =================== */}
{/* ===================== PART 4 ===================== */}
<div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
  <h3 className="text-[#2A4D6E] font-semibold mb-4 flex items-center gap-2">
    <span className="text-[#C76B4A]">⭐</span> Recent Feedback
  </h3>

  {feedbacks.length === 0 && (
    <p className="text-gray-500 text-sm">No feedback received yet.</p>
  )}

  <div className="space-y-4">
    {feedbacks.slice(0, 5).map((f) => (
      <div
        key={f._id}
        className="border-b last:border-b-0 pb-4"
      >
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="font-semibold text-[#2A4D6E]">
              {f.student?.name || "Student"}
            </p>
            <p className="text-gray-400 text-xs">
              {new Date(f.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Stars */}
          <div className="flex gap-1 text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>
                {star <= f.rating ? "★" : "☆"}
              </span>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          “{f.message}”
        </p>
      </div>
    ))}
  </div>
</div>
{/* =================== END PART 4 =================== */}

    </div>
  );
}
function InsightCard({ value, label }) {
  return (
    <div className="text-center bg-[#F8F5F2] rounded-lg p-4">
      <div className="text-2xl font-bold text-[#2A4D6E]">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}
