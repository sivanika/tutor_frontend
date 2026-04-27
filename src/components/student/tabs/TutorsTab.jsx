import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../../services/api"
import socket from "../../../services/socket"
import { useAuth } from "../../../context/AuthContext"
import { FiSearch, FiClock, FiBook, FiCheckCircle, FiLock, FiUser } from "react-icons/fi"

/* Premium check — determines if user has UNLIMITED access */
function isPremiumStudent(user) {
  if (!user || user.role !== "student") return false;
  return (
    user.subscriptionStatus === "active" &&
    (user.subscriptionTier === "premium" || user.subscriptionTier === "pay_per_session")
  );
}

export default function TutorsTab() {
  const [sessions, setSessions] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ subject: "", level: "", time: "" })
  const { user } = useAuth()
  const navigate = useNavigate()
  const isPremium = isPremiumStudent(currentUser || user)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [sessionsRes, userRes] = await Promise.all([
        API.get("/sessions"),
        API.get("/users/me")
      ])
      setSessions(sessionsRes.data)
      setCurrentUser(userRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    socket.connect()
    socket.on("dashboard:update", fetchData)
    return () => {
      socket.off("dashboard:update", fetchData)
      socket.disconnect()
    }
  }, [])

  const handleEnroll = async (id) => {
    try {
      const res = await API.post(`/sessions/${id}/enroll`)
      alert(res.data.message || "Enrolled successfully")

      socket.emit("dashboard:update")
    } catch (err) {
      console.error(err)
      alert("Enrollment failed")
    }
  }

  const isEnrolled = (session) =>
    session.students?.some(
      (s) =>
        (s.student?._id || s.student) === user?._id ||
        (s.student?._id || s.student)?.toString() === user?._id
    )

  const filtered = sessions.filter((s) => {
    if (filters.subject && !s.title.toLowerCase().includes(filters.subject.toLowerCase())) return false
    if (filters.level && s.level !== filters.level) return false
    if (filters.time && !s.time.includes(filters.time)) return false
    return true
  })

  return (
    <div className="animate-fadeIn">

      {/* FREE PLAN BANNER - Shows limits dynamically */}
      {!isPremium && currentUser?.subscriptionPlan && (
        <div
          className="mb-6 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-2"
          style={{
            background: "linear-gradient(135deg, var(--primary)10, var(--accent)08)",
            borderColor: "var(--primary)25",
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-1 text-[var(--primary)]"><FiLock /></span>

            <div>
              <p className="font-bold text-gray-800 text-sm mb-1">{currentUser.subscriptionPlan.name} (Limited Access)</p>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-600">
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-150 shadow-sm">
                  <FiBook className="text-[var(--primary)]" /> 
                  <span className={currentUser.currentPlanSessionsBooked >= currentUser.subscriptionPlan.maxSessions ? 'text-red-500 font-bold' : ''}>
                    {currentUser.currentPlanSessionsBooked || 0} / {currentUser.subscriptionPlan.maxSessions} Bookings
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-150 shadow-sm">
                  <FiUser className="text-[var(--primary)]" /> 
                  <span className={currentUser.viewedProfessors?.length >= currentUser.subscriptionPlan.maxProfileViews ? 'text-red-500 font-bold' : ''}>
                    {currentUser.viewedProfessors?.length || 0} / {currentUser.subscriptionPlan.maxProfileViews} Profile Views
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/payment?plan=premium&returnTo=student")}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 shadow-md hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))" }}
          >
            Upgrade to Premium →
          </button>
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiSearch className="text-[var(--primary)]" />
          Search Filters
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <select
            className="border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/40 focus:outline-none transition"
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          >
            <option value="">All Subjects</option>
            <option value="math">Mathematics</option>
            <option value="python">Python</option>
            <option value="data">Data Structures</option>
            <option value="physics">Physics</option>
          </select>
          <select
            className="border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/40 focus:outline-none transition"
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select
            className="border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/40 focus:outline-none transition"
            value={filters.time}
            onChange={(e) => setFilters({ ...filters, time: e.target.value })}
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
          <div className="animate-spin w-10 h-10 rounded-full border-4 border-[var(--primary)] border-t-transparent" />
        </div>
      )}

      {/* EMPTY */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <FiSearch size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg font-semibold text-gray-600">No sessions found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* SESSION CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((s) => {
          const enrolled = isEnrolled(s)
          const professorId = s.professor?._id || s.professor
          
          let canBook = true;
          let upgradeReason = null;
          if (!isPremium && currentUser?.subscriptionPlan) {
             if (currentUser.currentPlanSessionsBooked >= currentUser.subscriptionPlan.maxSessions) {
               canBook = false;
               upgradeReason = "Limit Reached";
             }
          }

          return (
            <div
              key={s._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] text-white flex items-center justify-center mr-3 font-bold text-sm shadow">
                  {s.professor?.name?.[0]?.toUpperCase() || "P"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 truncate">{s.professor?.name}</h4>
                  <p className="text-sm text-gray-400 truncate">{s.title} · {s.level}</p>
                  {/* Hourly Rate */}
                  {s.professor?.hourlyRate ? (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]">
                      <FiDollarSign className="inline-block" /> ₹{s.professor.hourlyRate}/hr

                    </span>
                  ) : null}
                </div>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-500 mb-3 space-y-1">
                <p className="flex items-center gap-2">
                  <FiBook size={14} className="text-[var(--primary)]" />
                  {s.title}
                </p>
                <p className="flex items-center gap-2">
                  <FiClock size={14} className="text-[var(--primary)]" />
                  {s.date} {s.time}
                </p>
              </div>

              <div className="mb-4">
                <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-xs font-medium">
                  {s.time}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {/* View Profile — always visible */}
                {professorId && (
                  <button
                    onClick={() => navigate(`/tutor/${professorId}`)}
                    className="w-full py-2 rounded-xl font-semibold text-sm border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FiUser size={14} />
                    View Profile
                  </button>
                )}

                {/* Book Session — Dynamic access */}
                {enrolled ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl font-semibold text-sm bg-green-50 text-green-600 flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <FiCheckCircle size={14} />
                    Already Enrolled
                  </button>
                ) : isPremium || canBook ? (
                  <button
                    onClick={() => handleEnroll(s._id)}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] hover:from-[#5A0EAD] hover:to-[#1D63D8] hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Book Session
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/payment?plan=premium&returnTo=student")}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))" }}
                  >
                    <FiLock size={13} />
                    {upgradeReason || "Upgrade to Book"}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
