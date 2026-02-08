import { useEffect, useState } from "react"
import API from "../../../services/api"
import socket from "../../../services/socket"

export default function TutorsTab() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    subject: "",
    level: "",
    time: "",
  })

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

    // 🔴 real time update trigger (socket)
    socket.emit("dashboard:update")

  } catch (err) {
    console.error(err)
    alert("Enrollment failed")
  }
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
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 hover:shadow-xl">
        <h3 className="text-lg font-bold text-[#2A4D6E] mb-4">
          🔍 Search Filters
        </h3>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <select
            className="border p-2 rounded"
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
            className="border p-2 rounded"
            value={filters.level}
            onChange={e => setFilters({ ...filters, level: e.target.value })}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            className="border p-2 rounded"
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
        <div className="text-center py-12">
          <i className="fas fa-spinner fa-spin text-4xl text-[#2A4D6E]"></i>
          <p className="mt-2 text-gray-500">Loading tutors...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <i className="fas fa-user-times text-5xl mb-3"></i>
          <p>No tutors found</p>
        </div>
      )}

      {/* TUTOR CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => (
          <div
            key={s._id}
            className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#4A8B6F]
                       hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#2A4D6E] text-white flex items-center justify-center mr-3">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div>
                <h4 className="font-bold text-[#2A4D6E]">
                  {s.professor?.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {s.title} • {s.level}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="text-sm text-gray-600 mb-3">
              <p>
                <i className="fas fa-book mr-2 text-[#C76B4A]"></i>
                {s.title}
              </p>
              <p>
                <i className="fas fa-clock mr-2 text-[#C76B4A]"></i>
                {s.date} {s.time}
              </p>
            </div>

            {/* Slot */}
            <div className="mb-4">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                {s.time}
              </span>
            </div>

            {/* Button */}
            <button
              onClick={() => handleEnroll(s._id)}
              className="w-full bg-[#C76B4A] text-white py-2 rounded-full
                         hover:bg-[#8A4F7D] hover:shadow-lg hover:scale-105
                         transition-all duration-300"
            >
              Book Session
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
