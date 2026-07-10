import { useState, useEffect } from "react"
import { FiCalendar, FiClock, FiBookOpen, FiVideo, FiFileText } from "react-icons/fi"
import API from "../../../services/api"
import socket from "../../../services/socket"
import toast from "react-hot-toast"

export default function CalendarTab() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)) // default to July 2026 to align with course dates, but nav-enabled

  const loadEvents = async () => {
    try {
      setLoading(true)
      const res = await API.get("/lms/student/calendar")
      setEvents(res.data.events || [])
    } catch (e) {
      toast.error("Failed to load calendar events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
    socket.on("dashboard:update", (data) => {
      if (data.type === "calendar") {
        loadEvents()
      }
    })
    return () => {
      socket.off("dashboard:update")
    }
  }, [])

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  // Calculate calendar parameters
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  
  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  const formattedEvents = events.map(e => {
    return {
      ...e,
      dayString: e.date // expected YYYY-MM-DD
    }
  })

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl bg-gradient-to-r from-teal-500 to-emerald-600">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #fff, transparent)" }}/>
        <h2 className="text-xl md:text-2xl font-black">Calendar</h2>
        <p className="text-teal-100 text-sm mt-1 max-w-md">
          Keep track of live interactive classes, assignments, and exams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Calendar Grid */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-base" style={{ color: "var(--text-primary)" }}>{monthName}</h3>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevMonth}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold transition hover:bg-[var(--surface-alt)]" 
                style={{ borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
              >
                Prev
              </button>
              <button 
                onClick={handleNextMonth}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold transition hover:bg-[var(--surface-alt)]" 
                style={{ borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
              >
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-black mb-3" style={{ color: "var(--text-muted)" }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {/* Pad calendar cells */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`pad-${i}`} className="p-3 text-transparent">0</div>
            ))}
            
            {/* Days in month */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1
              const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const dayEvents = formattedEvents.filter(e => e.dayString === dayStr)
              const hasEvent = dayEvents.length > 0

              return (
                <div
                  key={day}
                  className={`p-3 text-xs rounded-xl flex flex-col items-center justify-center relative cursor-pointer transition ${
                    hasEvent
                      ? "bg-teal-50 text-teal-600 font-black border border-teal-200 dark:bg-teal-950/30 dark:border-teal-900/50"
                      : "hover:bg-[var(--surface-alt)]"
                  }`}
                  style={{ color: hasEvent ? undefined : "var(--text-primary)" }}
                  title={dayEvents.map(e => e.title).join(", ")}
                >
                  <span>{day}</span>
                  {hasEvent && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-teal-500"/>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column: Event List */}
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-sm mb-4" style={{ color: "var(--text-primary)" }}>Upcoming events</h3>
            {events.length === 0 ? (
              <div className="text-center py-10">
                <FiCalendar className="mx-auto text-gray-300 mb-2" size={24}/>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>No events scheduled</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {events.map(event => (
                  <div key={event._id} className="flex gap-3 items-start border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: "var(--border-soft)" }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      event.type === "class" ? "bg-teal-50 text-teal-600" : event.type === "exam" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"
                    }`}>
                      {event.type === "class" ? <FiBookOpen size={14}/> : <FiCalendar size={14}/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-black text-teal-600 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full uppercase">
                        {event.course}
                      </span>
                      <h4 className="font-black text-xs mt-1 truncate" style={{ color: "var(--text-primary)" }}>{event.title}</h4>
                      <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                        <FiClock size={10}/> {event.date} · {event.time}
                      </p>
                      {event.meetLink && (
                        <a 
                          href={event.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-teal-600 hover:text-teal-700 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-lg"
                        >
                          <FiVideo size={10}/> Join Interactive Session
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
