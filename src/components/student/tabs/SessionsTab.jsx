import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../../services/api"
import socket from "../../../services/socket"
import {
  FiCalendar, FiClock, FiCheckCircle, FiVideo,
  FiExternalLink, FiMessageCircle, FiChevronLeft, FiChevronRight,
} from "react-icons/fi"

export default function SessionsTab() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(null)
  const navigate = useNavigate()

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date())

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

  // ── Filter sessions by student status ──
  const enrolled = sessions.filter(s => s.myStatus === "enrolled")
  const completed = sessions.filter(s => s.myStatus === "completed")

  // Split enrolled into upcoming and needs-completion
  const upcoming = enrolled.filter(s => new Date(`${s.date} ${s.time}`) > new Date())
  const needsCompletion = enrolled.filter(s => new Date(`${s.date} ${s.time}`) <= new Date())

  // ── Join Session ──
  const handleJoinSession = (meetLink) => {
    if (!meetLink) {
      alert("Meeting link not available yet!")
      return
    }
    window.open(meetLink, "_blank")
  }

  // ── Mark Complete ──
  const handleMarkComplete = async (sessionId) => {
    try {
      setCompleting(sessionId)
      await API.post(`/sessions/${sessionId}/complete`)
      socket.emit("dashboard:update")
      fetchSessions()
    } catch (err) {
      console.error(err)
      alert("Failed to mark as complete")
    } finally {
      setCompleting(null)
    }
  }

  // ── Calendar helpers ──
  const year = calendarDate.getFullYear()
  const month = calendarDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const prevMonth = () => setCalendarDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCalendarDate(new Date(year, month + 1, 1))
  const goToday = () => setCalendarDate(new Date())

  const getSessionsForDay = (day) => {
    return sessions.filter(s => {
      const d = new Date(s.date)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
  }

  const today = new Date()
  const isToday = (day) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 rounded-full border-4 border-[#6A11CB] border-t-transparent" />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && sessions.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <FiCalendar size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg font-semibold text-gray-600">No sessions enrolled yet</p>
          <p className="text-sm text-gray-400 mt-1">Browse available tutors and enroll in your first session!</p>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <>
          {/* ═══════════ CALENDAR ═══════════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FiCalendar className="text-[#6A11CB]" />
                Session Calendar
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#6A11CB] hover:text-white flex items-center justify-center transition"
                >
                  <FiChevronLeft size={16} />
                </button>
                <button
                  onClick={goToday}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white text-sm font-medium shadow hover:shadow-lg transition"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#6A11CB] hover:text-white flex items-center justify-center transition"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-600 mb-3 text-center">{monthName}</p>

            {/* Day Headers */}
            <div className="grid grid-cols-7">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white text-center py-2 text-xs font-semibold first:rounded-tl-lg last:rounded-tr-lg">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border border-gray-200 rounded-b-lg overflow-hidden">
              {/* Empty cells for offset */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[90px] border border-gray-100 bg-gray-50" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const daySessions = getSessionsForDay(day)
                const todayClass = isToday(day) ? "bg-[#6A11CB]/5 ring-2 ring-[#6A11CB]/20" : ""

                return (
                  <div
                    key={day}
                    className={`min-h-[90px] border border-gray-100 p-1.5 hover:bg-gray-50 transition ${todayClass}`}
                  >
                    <p className={`text-xs font-semibold mb-1 ${isToday(day) ? "text-[#6A11CB]" : "text-gray-500"}`}>
                      {day}
                    </p>

                    {daySessions.map(s => {
                      const statusColor = s.myStatus === "completed"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white cursor-pointer"

                      return (
                        <div
                          key={s._id}
                          onClick={() => s.myStatus !== "completed" && handleJoinSession(s.meetLink)}
                          title={s.myStatus === "completed" ? `${s.title} (Completed)` : `Join: ${s.title}`}
                          className={`${statusColor} text-[10px] rounded px-1.5 py-0.5 mb-0.5 shadow-sm transition-all duration-200 truncate`}
                        >
                          {s.myStatus === "completed" ? "✓" : "⏰"}{" "}
                          {s.time ? new Date(`2000-01-01 ${s.time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : s.title}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200" /> Upcoming
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-100 border border-green-200" /> Completed
              </span>
            </div>
          </div>

          {/* ═══════════ UPCOMING SESSIONS ═══════════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiClock className="text-[#2575FC]" />
                Upcoming Sessions
              </h3>
              <span className="text-xs bg-blue-50 text-[#2575FC] px-2.5 py-1 rounded-full font-medium">
                {upcoming.length} scheduled
              </span>
            </div>

            {upcoming.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <FiClock size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No upcoming sessions</p>
              </div>
            )}

            <div className="space-y-3">
              {upcoming.map(s => (
                <div key={s._id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <FiVideo size={16} className="text-[#2575FC]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm truncate">{s.title}</h4>
                      <p className="text-xs text-gray-400">
                        {s.professor?.name} · {s.date} {s.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#2575FC]">
                      Enrolled
                    </span>
                    <button
                      onClick={() => handleJoinSession(s.meetLink)}
                      className="px-4 py-1.5 bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white rounded-full text-xs font-semibold
                                 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-1"
                    >
                      <FiExternalLink size={12} />
                      Join Session
                    </button>
                    <button
                      onClick={() => navigate(`/chat/${s._id}`)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-purple-100 text-gray-400 hover:text-[#6A11CB] transition"
                      title="Session Chat"
                    >
                      <FiMessageCircle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════ NEEDS COMPLETION ═══════════ */}
          {needsCompletion.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FiCheckCircle className="text-amber-500" />
                  Awaiting Completion
                </h3>
                <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-medium">
                  {needsCompletion.length} pending
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                These sessions have passed — mark them as complete after attending.
              </p>

              <div className="space-y-3">
                {needsCompletion.map(s => (
                  <div key={s._id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-amber-100 bg-amber-50/30 hover:bg-amber-50 transition">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <FiClock size={16} className="text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">{s.title}</h4>
                        <p className="text-xs text-gray-400">
                          {s.professor?.name} · {s.date} {s.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/chat/${s._id}`)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-purple-100 text-gray-400 hover:text-[#6A11CB] transition"
                        title="Session Chat"
                      >
                        <FiMessageCircle size={14} />
                      </button>
                      <button
                        onClick={() => handleMarkComplete(s._id)}
                        disabled={completing === s._id}
                        className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-semibold
                                   hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {completing === s._id ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Completing…
                          </>
                        ) : (
                          <>
                            <FiCheckCircle size={12} />
                            Mark as Complete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ COMPLETED SESSIONS ═══════════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiCheckCircle className="text-green-500" />
                Completed Sessions
              </h3>
              <span className="text-xs bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-medium">
                {completed.length} done
              </span>
            </div>

            {completed.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <FiCheckCircle size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No completed sessions yet</p>
                <p className="text-xs text-gray-300 mt-1">Attend a session and mark it as complete!</p>
              </div>
            )}

            <div className="space-y-3">
              {completed.map(s => (
                <div key={s._id} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <FiCheckCircle size={16} className="text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm truncate">{s.title}</h4>
                    <p className="text-xs text-gray-400">
                      {s.professor?.name} · {s.date} {s.time}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                    Completed ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
