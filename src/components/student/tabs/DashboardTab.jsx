import { useEffect, useState } from "react"
import API from "../../../services/api"
import socket from "../../../services/socket"
import { useAuth } from "../../../context/AuthContext"
import {
  FiBook, FiClock, FiCheckCircle, FiArrowUpRight,
  FiCalendar, FiVideo, FiExternalLink, FiSearch, FiAlertCircle,
} from "react-icons/fi"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS, LineElement, PointElement,
  LinearScale, CategoryScale, Tooltip, Legend, Filler,
} from "chart.js"

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler)

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardTab() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const res = await API.get("/sessions/enrolled")
      setSessions(res.data)
    } catch (err) {
      console.error("Fetch enrolled sessions error:", err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
    socket.connect()
    socket.on("dashboard:update", fetchSessions)
    return () => {
      socket.off("dashboard:update", fetchSessions)
      socket.disconnect()
    }
  }, [])

  // Use explicit myStatus from backend
  const upcoming = sessions.filter(s => s.myStatus === "enrolled" && new Date(`${s.date} ${s.time}`) > new Date())
  const needsCompletion = sessions.filter(s => s.myStatus === "enrolled" && new Date(`${s.date} ${s.time}`) <= new Date())
  const completed = sessions.filter(s => s.myStatus === "completed")

  const STATS = [
    {
      label: "Enrolled",
      value: sessions.length,
      icon: FiBook,
      color: "from-[#6A11CB] to-[#2575FC]",
      bg: "bg-purple-50",
      textColor: "text-[#6A11CB]",
      sub: "Total sessions",
    },
    {
      label: "Upcoming",
      value: upcoming.length,
      icon: FiClock,
      color: "from-[#2575FC] to-[#6A11CB]",
      bg: "bg-blue-50",
      textColor: "text-[#2575FC]",
      sub: "Scheduled ahead",
    },
    {
      label: "Needs Completion",
      value: needsCompletion.length,
      icon: FiAlertCircle,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      textColor: "text-amber-500",
      sub: "Mark as complete",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: FiCheckCircle,
      color: "from-[#FF4E9B] to-[#FF6B6B]",
      bg: "bg-pink-50",
      textColor: "text-[#FF4E9B]",
      sub: "Finished sessions",
    },
  ]

  const progressData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Learning Progress",
        data: [10, 25, 40, 55, 65 + completed.length * 2, 70 + completed.length * 3],
        borderColor: "#6A11CB",
        backgroundColor: "rgba(106,17,203,0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6A11CB",
        pointRadius: 4,
      },
    ],
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 rounded-full border-4 border-[#6A11CB] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl animate-fadeIn">

      {/* ── Greeting Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#6A11CB] to-[#2575FC] rounded-2xl p-6 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">{getGreeting()},</p>
          <h2 className="text-2xl font-bold mb-1">
            {user?.email?.split("@")[0] || "Student"} 👋
          </h2>
          <p className="text-white/60 text-sm">
            You have{" "}
            <span className="text-white font-semibold">{upcoming.length} upcoming</span>,{" "}
            {needsCompletion.length > 0 && (
              <><span className="text-amber-300 font-semibold">{needsCompletion.length} awaiting completion</span>, and{" "}</>
            )}
            <span className="text-white font-semibold">{completed.length} completed</span> sessions.
          </p>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-10 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute right-24 -top-4 w-16 h-16 rounded-full bg-[#FF4E9B]/30" />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg, textColor, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
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

      {/* ── Progress Chart ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800">Learning Progress</h3>
            <p className="text-xs text-gray-400 mt-0.5">Your performance over time</p>
          </div>
          <span className="text-xs bg-purple-50 text-[#6A11CB] px-3 py-1 rounded-full font-medium">
            {Math.min(100, 60 + completed.length * 3)}% overall
          </span>
        </div>
        <div className="h-52">
          <Line
            data={progressData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  grid: { color: "#f3f4f6" },
                  ticks: { color: "#9ca3af", font: { size: 11 }, callback: v => `${v}%` },
                },
                x: {
                  grid: { display: false },
                  ticks: { color: "#9ca3af", font: { size: 11 } },
                },
              },
            }}
          />
        </div>
      </div>

      {/* ── Sessions Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Upcoming */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FiCalendar size={16} className="text-[#2575FC]" />
              Upcoming Sessions
            </h3>
            <span className="text-xs bg-blue-50 text-[#2575FC] px-2.5 py-1 rounded-full font-medium">
              {upcoming.length} scheduled
            </span>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiClock size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No upcoming sessions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 4).map(s => (
                <SessionRow key={s._id} session={s} status="Upcoming" />
              ))}
            </div>
          )}
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FiCheckCircle size={16} className="text-[#FF4E9B]" />
              Completed Sessions
            </h3>
            <span className="text-xs bg-pink-50 text-[#FF4E9B] px-2.5 py-1 rounded-full font-medium">
              {completed.length} done
            </span>
          </div>

          {completed.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiCheckCircle size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No completed sessions yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completed.slice(0, 4).map(s => (
                <SessionRow key={s._id} session={s} status="Completed" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* No sessions enrolled state */}
      {sessions.length === 0 && (
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-gray-700 font-semibold text-lg">No sessions enrolled yet</h3>
          <p className="text-gray-400 text-sm mt-2 mb-5">Browse available tutors and enroll in your first session!</p>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <FiSearch size={15} />
            Browse Tutors
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Reusable Row ── */
function SessionRow({ session, status }) {
  const isUpcoming = status === "Upcoming"
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isUpcoming ? "bg-blue-50" : "bg-pink-50"
        }`}>
        {isUpcoming
          ? <FiVideo size={16} className="text-[#2575FC]" />
          : <FiCheckCircle size={16} className="text-[#FF4E9B]" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 text-sm truncate">{session.title}</p>
        <p className="text-xs text-gray-400 truncate">
          {session.professor?.name || "Professor"} ·{" "}
          {session.date} {session.time}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isUpcoming
          ? "bg-blue-50 text-[#2575FC]"
          : "bg-pink-50 text-[#FF4E9B]"
          }`}>
          {status}
        </span>
        {isUpcoming && session.meetLink && (
          <a
            href={session.meetLink}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-purple-100 text-gray-400 hover:text-[#6A11CB] transition"
          >
            <FiExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  )
}
