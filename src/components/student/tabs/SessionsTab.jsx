import { useEffect, useState } from "react"
import API from "../../../services/api"
import socket from "../../../services/socket"

export default function SessionsTab() {
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

  // 🔴 JOIN SESSION HANDLER
  const handleJoinSession = (meetLink) => {
    if (!meetLink) {
      alert("Meeting link not available yet!")
      return
    }
    window.open(meetLink, "_blank")
  }

  return (
    <div className="space-y-10 animate-fadeIn">

      {/* LOADING */}
      {loading && (
        <div className="text-center py-12">
          <i className="fas fa-spinner fa-spin text-4xl text-[#2A4D6E]"></i>
          <p className="mt-2 text-gray-500">Loading your sessions...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && sessions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <i className="fas fa-calendar-times text-5xl mb-3"></i>
          <p>You have not enrolled in any session yet</p>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <>
          {/* ================= CALENDAR ================= */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#2A4D6E]">
                📅 Session Calendar
              </h3>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-[#2A4D6E] hover:text-white transition">
                  ◀
                </button>
                <button className="px-4 py-1 rounded-full bg-[#8A4F7D] text-white text-sm shadow hover:shadow-lg">
                  Today
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-[#2A4D6E] hover:text-white transition">
                  ▶
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div
                  key={d}
                  className="bg-[#2A4D6E] text-white text-center py-2 font-semibold"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border border-gray-200">
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i + 1

                const daySessions = upcoming.filter(
                  s => new Date(s.date).getDate() === day
                )

                return (
                  <div
                    key={i}
                    className="min-h-[110px] border border-gray-200 p-2 rounded-md
                               hover:bg-[#F8F5F2] transition-all duration-200"
                  >
                    <p className="font-semibold mb-1">{day}</p>

                    {daySessions.map(s => (
                      <div
                        key={s._id}
                        onClick={() => handleJoinSession(s.meetLink)}
                        title={`Join ${s.title}`}
                        className="
                          bg-green-100 text-green-700 text-xs rounded px-2 py-1 mb-1
                          hover:bg-green-600 hover:text-white
                          cursor-pointer shadow-sm
                          transition-all duration-200
                        "
                      >
                        ⏰ {new Date(`${s.date} ${s.time}`).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ================= UPCOMING SESSIONS ================= */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-[#2A4D6E] mb-4">
              ⏳ Upcoming Sessions
            </h3>

            {upcoming.length === 0 && (
              <p className="text-gray-500">No upcoming sessions</p>
            )}

            {upcoming.map(s => (
              <div
                key={s._id}
                className="flex justify-between items-center border-b py-4
                           hover:bg-[#F8F5F2] px-2 rounded transition"
              >
                <div>
                  <h4 className="font-semibold text-[#2A4D6E]">
                    {s.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {s.professor?.name} •{" "}
                    {new Date(`${s.date} ${s.time}`).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleJoinSession(s.meetLink)}
                    className="px-4 py-1 bg-[#C76B4A] text-white rounded-full text-sm
                               hover:bg-[#8A4F7D] hover:shadow-lg hover:scale-105
                               transition-all duration-300"
                  >
                    Join Session
                  </button>

                  <button
                    className="px-4 py-1 bg-[#8A4F7D] text-white rounded-full text-sm
                               hover:opacity-90 hover:shadow-lg transition"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= SESSION HISTORY ================= */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-[#2A4D6E] mb-4">
              📜 Session History
            </h3>

            {completed.length === 0 && (
              <p className="text-gray-500">No completed sessions</p>
            )}

            {completed.map(s => (
              <div
                key={s._id}
                className="flex justify-between items-center border-b py-4
                           hover:bg-[#F8F5F2] px-2 rounded transition"
              >
                <div>
                  <h4 className="font-semibold text-[#2A4D6E]">
                    {s.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {s.professor?.name} •{" "}
                    {new Date(`${s.date} ${s.time}`).toLocaleString()}
                  </p>
                </div>

                <span className="px-4 py-1 rounded-full bg-gray-200 text-gray-700 text-sm font-semibold">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
