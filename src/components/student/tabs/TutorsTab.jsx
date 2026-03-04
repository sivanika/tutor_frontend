import { useEffect, useState } from "react"
import API from "../../../services/api"
import socket from "../../../services/socket"
import { useAuth } from "../../../context/AuthContext"
import {
  FiSearch, FiClock, FiBook, FiCheckCircle,
} from "react-icons/fi"

export default function TutorsTab() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    subject: "",
    level: "",
    time: "",
  })
  const { user } = useAuth()

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const res = await API.get("/sessions")
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

  const handleEnroll = async (id) => {
    try {
      const res = await API.post(`/sessions/${id}/enroll`)
      alert(res.data.message || "Enrolled successfully 🎉")

      // real time update trigger (socket)
      socket.emit("dashboard:update")

    } catch (err) {
      console.error(err)
      alert("Enrollment failed")
    }
  }

  // Check if current user is enrolled in a session
  const isEnrolled = (session) => {
    return session.students?.some(
      (s) => (s.student?._id || s.student) === user?._id ||
        (s.student?._id || s.student)?.toString() === user?._id
    )
  }

  const filtered = sessions.filter(s => {
    if (filters.subject && !s.title.toLowerCase().includes(filters.subject.toLowerCase())) return false
    if (filters.level && s.level !== filters.level) return false
    if (filters.time && !s.time.includes(filters.time)) return false
    return true
  })

  return (
    <div className="animate-fadeIn">

      {/* FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiSearch className="text-[#6A11CB]" />
          Search Filters
        </h3>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <select
            className="border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#6A11CB]/40 focus:outline-none transition"
            value={filters.subject}
            onChange={e => setFilters({ ...filters, subject: e.target.value })}
          >
            <option value="">All Subjects</option>
            <option value="math">Mathematics</option>
            <option value="python">Python</option>
            <option value="data">Data Structures</option>
            <option value="physics">Physics</option>
          </select>

          <select
            className="border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#6A11CB]/40 focus:outline-none transition"
            value={filters.level}
            onChange={e => setFilters({ ...filters, level: e.target.value })}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            className="border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#6A11CB]/40 focus:outline-none transition"
            value={filters.time}
            onChange={e => setFilters({ ...filters, time: e.target.value })}
          >
            <option value="">Any Time</option>
            <option value="AM">Morning</option>
            <option value="PM">Evening</option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 rounded-full border-4 border-[#6A11CB] border-t-transparent" />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <FiSearch size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg font-semibold text-gray-600">No tutors found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* TUTOR CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => {
          const enrolled = isEnrolled(s)

          return (
            <div
              key={s._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6
                         hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6A11CB] to-[#2575FC] text-white flex items-center justify-center mr-3 font-bold text-sm shadow">
                  {s.professor?.name?.[0]?.toUpperCase() || "P"}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    {s.professor?.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {s.title} · {s.level}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-500 mb-3 space-y-1">
                <p className="flex items-center gap-2">
                  <FiBook size={14} className="text-[#6A11CB]" />
                  {s.title}
                </p>
                <p className="flex items-center gap-2">
                  <FiClock size={14} className="text-[#6A11CB]" />
                  {s.date} {s.time}
                </p>
              </div>

              {/* Slot */}
              <div className="mb-4">
                <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-xs font-medium">
                  {s.time}
                </span>
              </div>

              {/* Button */}
              {enrolled ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl font-semibold text-sm bg-green-50 text-green-600 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <FiCheckCircle size={14} />
                  Already Enrolled
                </button>
              ) : (
                <button
                  onClick={() => handleEnroll(s._id)}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm text-white
                             bg-gradient-to-r from-[#6A11CB] to-[#2575FC]
                             hover:from-[#5A0EAD] hover:to-[#1D63D8]
                             hover:shadow-lg hover:scale-105
                             transition-all duration-300"
                >
                  Book Session
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
