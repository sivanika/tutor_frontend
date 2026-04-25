import { useEffect, useState } from "react"
import API from "../../../services/api"
import socket from "../../../services/socket"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"
import {
  FiTrendingUp, FiClock, FiCheckCircle, FiTarget,
  FiAward, FiStar, FiZap, FiSun, FiLock
} from "react-icons/fi"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function ProgressTab() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const res = await API.get("/sessions/enrolled")
      setSessions(res.data)
    } catch (err) {
      console.error(err)
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

  // ---------------- Calculations ----------------
  const now = new Date()
  const completed = sessions.filter(
    s => new Date(`${s.date} ${s.time}`) <= now
  )
  const upcoming = sessions.filter(
    s => new Date(`${s.date} ${s.time}`) > now
  )

  const completionPercent =
    sessions.length === 0
      ? 0
      : Math.round((completed.length / sessions.length) * 100)

  const avgScore = sessions.length === 0 ? 0 : 80 + (completed.length % 10)
  const hoursLearned = completed.length * 1.5

  // -------- Subject performance --------
  const subjectMap = {
    Mathematics: 0,
    "Computer Science": 0,
    Physics: 0,
    Other: 0,
  }

  sessions.forEach(s => {
    const t = s.title.toLowerCase()
    if (t.includes("math") || t.includes("algebra") || t.includes("calculus"))
      subjectMap["Mathematics"]++
    else if (t.includes("python") || t.includes("data") || t.includes("algorithm"))
      subjectMap["Computer Science"]++
    else if (t.includes("physics"))
      subjectMap["Physics"]++
    else
      subjectMap["Other"]++
  })

  const subjectChartData = {
    labels: Object.keys(subjectMap),
    datasets: [
      {
        label: "Sessions",
        data: Object.values(subjectMap),
        backgroundColor: [
          "rgba(106,17,203,0.85)",
          "rgba(37,117,252,0.85)",
          "rgba(255,78,155,0.85)",
          "rgba(99,102,241,0.85)",
        ],
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  }

  // -------- Achievements --------
  const achievements = [
    {
      title: "Consistent Learner",
      desc: "Complete 5 sessions",
      unlocked: completed.length >= 5,
      icon: FiStar,
      color: "from-yellow-400 to-orange-400",
      bg: "bg-yellow-50",
      iconColor: "text-yellow-500",
    },
    {
      title: "Session Champion",
      desc: "Complete 10 sessions",
      unlocked: completed.length >= 10,
      icon: FiAward,
      color: "from-gray-400 to-gray-600",
      bg: "bg-gray-100",
      iconColor: "text-gray-500",
    },
    {
      title: "Learning Star",
      desc: "Complete 20 sessions",
      unlocked: completed.length >= 20,
      icon: FiZap,
      color: "from-orange-400 to-red-400",
      bg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      title: "Early Bird",
      desc: "Attend 3 morning sessions",
      unlocked: completed.filter(s => s.time?.includes("AM")).length >= 3,
      icon: FiSun,
      color: "from-blue-400 to-cyan-400",
      bg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ]

  // -------- Learning Goals --------
  const goals = [
    { title: "Complete Linear Algebra", progress: Math.min(completionPercent, 100), color: "from-[var(--primary)] to-[var(--primary)]" },
    { title: "Master Python Programming", progress: Math.min(40 + completed.length * 5, 100), color: "from-[var(--primary)] to-[var(--accent)]" },
    { title: "Improve Algorithms", progress: Math.min(50 + completed.length * 3, 100), color: "from-[var(--accent)] to-orange-400" },
  ]

  const STAT_CARDS = [
    {
      label: "Course Completion",
      value: `${completionPercent}%`,
      icon: FiTrendingUp,
      color: "from-[var(--primary)] to-[var(--primary)]",
      bg: "bg-purple-50",
      iconColor: "text-[var(--primary)]",
      sub: "Overall progress",
    },
    {
      label: "Average Score",
      value: `${avgScore}%`,
      icon: FiStar,
      color: "from-[var(--accent)] to-orange-400",
      bg: "bg-pink-50",
      iconColor: "text-[var(--accent)]",
      sub: "Performance metric",
    },
    {
      label: "Sessions Completed",
      value: completed.length,
      icon: FiCheckCircle,
      color: "from-emerald-400 to-teal-500",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      sub: "Finished sessions",
    },
    {
      label: "Hours Learned",
      value: `${hoursLearned}h`,
      icon: FiClock,
      color: "from-amber-400 to-yellow-500",
      bg: "bg-amber-50",
      iconColor: "text-amber-500",
      sub: "Time invested",
    },
  ]

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin w-12 h-12 rounded-full border-4 border-[var(--primary)] border-t-transparent" />
        <p className="text-sm text-gray-400">Loading your progress...</p>
      </div>
    )
  }

  /* ─── Empty State ─── */
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-center gap-4 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] flex items-center justify-center shadow-lg">
          <FiTrendingUp size={36} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-700">No Progress Yet</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Start enrolling in sessions to track your learning journey and earn achievements!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl animate-fadeIn">

      {/* ──────── Hero Banner ──────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] rounded-2xl p-6 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">Your Learning Journey</p>
          <h2 className="text-2xl font-bold mb-1">My Progress Overview</h2>
          <p className="text-white/60 text-sm">
            You've completed{" "}
            <span className="text-white font-semibold">{completed.length} sessions</span> and earned{" "}
            <span className="text-[var(--accent)] font-semibold">
              {achievements.filter(a => a.unlocked).length} achievements
            </span>.
          </p>
          {/* Circular progress indicator */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="30" fill="none"
                  stroke="var(--accent)" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  strokeDashoffset={`${2 * Math.PI * 30 * (1 - completionPercent / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{completionPercent}%</span>
              </div>
            </div>
            <span className="text-white/60 text-xs mt-1">Complete</span>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-10 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute right-36 -top-4 w-16 h-16 rounded-full bg-[var(--accent)]/30" />
      </div>

      {/* ──────── Stat Cards ──────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg, iconColor, sub }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${bg} w-11 h-11 rounded-xl flex items-center justify-center`}>
                <Icon size={20} className={iconColor} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
            <div className="text-sm font-medium text-gray-500">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${color}`} />
          </div>
        ))}
      </div>

      {/* ──────── Chart + Achievements ──────── */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* Subject Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <FiTarget size={16} className="text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Subject Performance</h3>
              <p className="text-xs text-gray-400">Sessions per subject</p>
            </div>
          </div>
          <div className="h-[240px]">
            <Bar
              data={subjectChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "var(--text-primary)",
                    padding: 10,
                    cornerRadius: 8,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: "#f3f4f6" },
                    ticks: { color: "#9ca3af", font: { size: 11 } },
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: "var(--text-muted)", font: { size: 11 } },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
              <FiAward size={16} className="text-yellow-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Achievements</h3>
              <p className="text-xs text-gray-400">
                {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {achievements.map((a, i) => {
              const Icon = a.icon
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    a.unlocked
                      ? "bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-sm"
                      : "bg-gray-50 opacity-60"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    a.unlocked
                      ? `bg-gradient-to-br ${a.color}`
                      : "bg-gray-200"
                  }`}>
                    {a.unlocked
                      ? <Icon size={18} className="text-white" />
                      : <FiLock size={16} className="text-gray-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm">{a.title}</h4>
                    <p className="text-xs text-gray-400">{a.desc}</p>
                  </div>
                  {a.unlocked && (
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                      Earned ✓
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ──────── Learning Goals ──────── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
            <FiTarget size={16} className="text-[var(--accent)]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Learning Goals</h3>
            <p className="text-xs text-gray-400">Track your objectives</p>
          </div>
        </div>

        <div className="space-y-5">
          {goals.map((g, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700 text-sm">{g.title}</h4>
                <span className="text-sm font-bold text-gray-800">{g.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${g.color} transition-all duration-700`}
                  style={{ width: `${g.progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-400">
                  {g.progress < 30 ? "Just started" : g.progress < 70 ? "In progress" : "Almost there!"}
                </span>
                <span className="text-xs text-gray-400">{100 - g.progress}% remaining</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
