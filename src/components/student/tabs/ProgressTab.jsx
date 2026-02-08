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

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

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

  const avgScore = sessions.length === 0 ? 0 : 80 + (completed.length % 10) // placeholder
  const hoursLearned = completed.length * 1.5 // assume 1.5h per session

  // -------- Subject performance (simple grouping by title keywords) --------
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
          "rgba(42,77,110,0.7)",
          "rgba(138,79,125,0.7)",
          "rgba(199,107,74,0.7)",
          "rgba(74,139,111,0.7)",
        ],
        borderRadius: 8,
      },
    ],
  }

  // -------- Achievements logic --------
  const achievements = [
    {
      title: "Consistent Learner",
      desc: "Complete 5 sessions",
      unlocked: completed.length >= 5,
      iconColor: "text-yellow-400",
    },
    {
      title: "Session Champion",
      desc: "Complete 10 sessions",
      unlocked: completed.length >= 10,
      iconColor: "text-gray-400",
    },
    {
      title: "Learning Star",
      desc: "Complete 20 sessions",
      unlocked: completed.length >= 20,
      iconColor: "text-orange-400",
    },
    {
      title: "Early Bird",
      desc: "Attend 3 morning sessions",
      unlocked: completed.filter(s => s.time?.includes("AM")).length >= 3,
      iconColor: "text-blue-400",
    },
  ]

  // -------- Learning Goals (static now, can be moved to backend later) --------
  const goals = [
    { title: "Complete Linear Algebra", progress: Math.min(completionPercent, 100) },
    { title: "Master Python Programming", progress: Math.min(40 + completed.length * 5, 100) },
    { title: "Improve Algorithms", progress: Math.min(50 + completed.length * 3, 100) },
  ]

  return (
    <div className="space-y-10 animate-fadeIn">

      {/* LOADING */}
      {loading && (
        <div className="text-center py-12">
          <i className="fas fa-spinner fa-spin text-4xl text-[#2A4D6E]"></i>
          <p className="mt-2 text-gray-500">Loading progress...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && sessions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <i className="fas fa-chart-line text-5xl mb-3"></i>
          <p>No progress data yet. Start enrolling in sessions!</p>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <>
          {/* ================= OVERALL PROGRESS ================= */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-[#2A4D6E] mb-4">
              📊 Overall Progress
            </h3>

            <div className="grid md:grid-cols-4 gap-6">
              <ProgressCard title="Course Completion" value={`${completionPercent}%`} />
              <ProgressCard title="Average Score" value={`${avgScore}%`} />
              <ProgressCard title="Sessions Completed" value={completed.length} />
              <ProgressCard title="Hours Learned" value={hoursLearned} />
            </div>
          </div>

          {/* ================= SUBJECT + ACHIEVEMENTS ================= */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Subject Performance */}
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-bold text-[#2A4D6E] mb-4">
                📚 Subject Performance
              </h3>
              <div className="h-[260px]">
                <Bar
                  data={subjectChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-bold text-[#2A4D6E] mb-4">
                🏆 Achievements
              </h3>

              {achievements.map((a, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b py-3
                             hover:bg-[#F8F5F2] px-2 rounded transition"
                >
                  <div>
                    <h4 className="font-semibold">{a.title}</h4>
                    <p className="text-sm text-gray-500">{a.desc}</p>
                  </div>
                  <i
                    className={`fas fa-award text-2xl ${
                      a.unlocked ? a.iconColor : "text-gray-300"
                    }`}
                    title={a.unlocked ? "Unlocked" : "Locked"}
                  ></i>
                </div>
              ))}
            </div>
          </div>

          {/* ================= LEARNING GOALS ================= */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-[#2A4D6E] mb-4">
              🎯 Learning Goals
            </h3>

            {goals.map((g, i) => (
              <div key={i} className="mb-5">
                <div className="flex justify-between mb-1">
                  <h4 className="font-semibold">{g.title}</h4>
                  <span className="text-sm text-gray-600">
                    {g.progress}%
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4A8B6F] rounded-full transition-all duration-500"
                    style={{ width: `${g.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ================= SMALL REUSABLE UI ================= */

function ProgressCard({ title, value }) {
  return (
    <div
      className="bg-[#F8F5F2] rounded-xl p-6 text-center
                 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <h2 className="text-3xl font-bold text-[#2A4D6E]">
        {value}
      </h2>
      <p className="text-gray-600">{title}</p>
    </div>
  )
}
