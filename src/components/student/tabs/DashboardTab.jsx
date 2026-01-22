import { useEffect, useState } from "react"
import API from "../../../services/api"
import socket from "../../../services/socket"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
)

export default function DashboardTab() {
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

  const upcoming = sessions.filter(
    s => new Date(`${s.date} ${s.time}`) > new Date()
  )

  const completed = sessions.filter(
    s => new Date(`${s.date} ${s.time}`) <= new Date()
  )

  // Fake progressive chart from real data count
  const progressData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Learning Progress",
        data: [
          10,
          25,
          40,
          60,
          completed.length * 10 + 60,
        ],
        borderColor: "#4A8B6F",
        backgroundColor: "rgba(74,139,111,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  return (
    <div className="space-y-10 animate-fadeIn">

      {/* LOADING */}
      {loading && (
        <div className="text-center py-12">
          <i className="fas fa-spinner fa-spin text-4xl text-[#2A4D6E]"></i>
          <p className="mt-2 text-gray-500">Loading dashboard...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && sessions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <i className="fas fa-folder-open text-5xl mb-3"></i>
          <p>No dashboard data available yet</p>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <>
          {/* SUBSCRIPTION NOTICE */}
          <div className="bg-gradient-to-r from-[#2A4D6E] to-[#8A4F7D] text-white
                          rounded-2xl p-6 flex flex-col md:flex-row
                          justify-between items-center shadow-lg">
            <div>
              <h3 className="text-xl font-bold">
                Premium Student Account
              </h3>
              <p className="opacity-90">
                Full access to all tutors and features
              </p>
            </div>
            <button
              className="mt-4 md:mt-0 px-5 py-2 bg-white text-[#2A4D6E]
                         rounded-full font-semibold hover:shadow-lg
                         hover:scale-105 transition"
            >
              Manage Subscription
            </button>
          </div>

          {/* LEARNING PROGRESS CHART */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-[#2A4D6E] mb-4">
              📈 Learning Progress
            </h3>
            <div className="h-[250px]">
              <Line
                data={progressData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard
              icon="fa-book-open"
              title="Enrolled Sessions"
              value={sessions.length}
            />
            <StatCard
              icon="fa-clock"
              title="Upcoming Sessions"
              value={upcoming.length}
            />
            <StatCard
              icon="fa-check-circle"
              title="Completed Sessions"
              value={completed.length}
            />
          </div>

          {/* UPCOMING SESSIONS */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-[#2A4D6E] mb-4">
              ⏳ Upcoming Sessions
            </h3>

            {upcoming.length === 0 && (
              <p className="text-gray-500">No upcoming sessions</p>
            )}

            {upcoming.map(s => (
              <SessionRow key={s._id} session={s} status="Scheduled" />
            ))}
          </div>

          {/* RECENT SESSIONS */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-[#2A4D6E] mb-4">
              🕘 Recent Sessions
            </h3>

            {completed.length === 0 && (
              <p className="text-gray-500">No completed sessions</p>
            )}

            {completed.slice(0, 5).map(s => (
              <SessionRow key={s._id} session={s} status="Completed" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ================== Small Reusable Components ================== */

function StatCard({ icon, title, value }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-md p-6 text-center
                 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      <i className={`fas ${icon} text-3xl text-[#C76B4A] mb-3`}></i>
      <h4 className="text-lg font-semibold text-[#2A4D6E]">
        {title}
      </h4>
      <p className="text-3xl font-bold text-[#2A4D6E]">
        {value}
      </p>
    </div>
  )
}

function SessionRow({ session, status }) {
  const badgeStyle =
    status === "Scheduled"
      ? "bg-green-100 text-green-700"
      : "bg-gray-200 text-gray-700"

  return (
    <div
      className="flex justify-between items-center border-b py-4
                 hover:bg-[#F8F5F2] px-2 rounded transition"
    >
      <div>
        <h4 className="font-semibold text-[#2A4D6E]">
          {session.title}
        </h4>
        <p className="text-sm text-gray-500">
          {session.professor?.name} •{" "}
          {new Date(`${session.date} ${session.time}`).toLocaleString()}
        </p>
      </div>

      <span
        className={`px-4 py-1 rounded-full text-sm font-semibold ${badgeStyle}`}
      >
        {status}
      </span>
    </div>
  )
}
