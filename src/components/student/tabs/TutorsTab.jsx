import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../../services/api"
import socket from "../../../services/socket"
import { useAuth } from "../../../context/AuthContext"
import {
  FiSearch, FiClock, FiBook, FiCheckCircle, FiLock, FiUser,
  FiDollarSign, FiStar, FiMapPin, FiCalendar, FiMessageSquare, FiFilter,
  FiX, FiChevronDown
} from "react-icons/fi"

function isPremiumStudent(user) {
  if (!user || user.role !== "student") return false
  return (
    user.subscriptionStatus === "active" &&
    (user.subscriptionTier === "premium" || user.subscriptionTier === "pay_per_session")
  )
}

/* Star display */
function StarRating({ rating = 0, reviews = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "fill-amber-400" : "fill-gray-200"}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      {reviews > 0 && <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>({reviews})</span>}
    </div>
  )
}

export default function TutorsTab() {
  const [sessions, setSessions]         = useState([])
  const [currentUser, setCurrentUser]   = useState(null)
  const [loading, setLoading]           = useState(true)
  const [filters, setFilters]           = useState({ subject: "", level: "", time: "" })
  const [showFilters, setShowFilters]   = useState(false)
  const { user } = useAuth()
  const navigate  = useNavigate()
  const isPremium = isPremiumStudent(currentUser || user)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [sRes, uRes] = await Promise.all([API.get("/sessions"), API.get("/users/me")])
      setSessions(sRes.data)
      setCurrentUser(uRes.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchData()
    socket.connect(); socket.on("dashboard:update", fetchData)
    return () => { socket.off("dashboard:update", fetchData); socket.disconnect() }
  }, [])

  const handleEnroll = async (id) => {
    try {
      const r = await API.post(`/sessions/${id}/enroll`)
      alert(r.data.message || "Enrolled successfully")
      socket.emit("dashboard:update")
    } catch (e) { console.error(e); alert("Enrollment failed") }
  }

  const isEnrolled = (s) =>
    s.students?.some(st =>
      (st.student?._id || st.student) === user?._id ||
      (st.student?._id || st.student)?.toString() === user?._id
    )

  const filtered = sessions.filter(s => {
    if (filters.subject && !s.title.toLowerCase().includes(filters.subject.toLowerCase())) return false
    if (filters.level && s.level !== filters.level) return false
    if (filters.time && !s.time.includes(filters.time)) return false
    return true
  })

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Upgrade banner */}
      {!isPremium && currentUser?.subscriptionPlan && (
        <div className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,.06), rgba(139,92,246,.06))", borderColor: "rgba(37,99,235,.2)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FiLock size={18} className="text-blue-500"/>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                {currentUser.subscriptionPlan.name} — Limited Access
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {currentUser.currentPlanSessionsBooked}/{currentUser.subscriptionPlan.maxSessions} bookings used
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/payment?plan=premium&returnTo=student")}
            className="shrink-0 btn-ripple px-5 py-2 rounded-xl text-sm font-black text-white shadow hover:shadow-md hover:scale-105 transition-all"
            style={{ background: "var(--grad-primary)" }}
          >
            Upgrade to Premium →
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}/>
            <input
              placeholder="Search by subject, tutor…"
              value={filters.subject}
              onChange={e => setFilters({ ...filters, subject: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none border transition"
              style={{
                background: "var(--surface-alt)", borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Level filter */}
          <div className="relative">
            <select
              value={filters.level}
              onChange={e => setFilters({ ...filters, level: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm outline-none border transition font-medium"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <FiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }}/>
          </div>

          {/* Time filter */}
          <div className="relative">
            <select
              value={filters.time}
              onChange={e => setFilters({ ...filters, time: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm outline-none border transition font-medium"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
            >
              <option value="">Any Time</option>
              <option value="AM">Morning</option>
              <option value="PM">Evening</option>
            </select>
            <FiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }}/>
          </div>

          {/* Clear filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={() => setFilters({ subject: "", level: "", time: "" })}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition border border-red-100"
            >
              <FiX size={13}/> Clear ({activeFiltersCount})
            </button>
          )}

          {/* Result count */}
          <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
            {filtered.length} tutors
          </span>
        </div>

        {/* Active filter chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.subject && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                "{filters.subject}" <button onClick={() => setFilters({ ...filters, subject: "" })}><FiX size={10}/></button>
              </span>
            )}
            {filters.level && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">
                {filters.level} <button onClick={() => setFilters({ ...filters, level: "" })}><FiX size={10}/></button>
              </span>
            )}
            {filters.time && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                {filters.time === "AM" ? "Morning" : "Evening"} <button onClick={() => setFilters({ ...filters, time: "" })}><FiX size={10}/></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-10 h-10 rounded-full border-4 border-[var(--primary)] border-t-transparent"/>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <FiSearch size={28} className="text-blue-400"/>
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>No tutors found</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Try adjusting your search filters</p>
        </div>
      )}

      {/* Session / Tutor Cards Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(s => {
            const enrolled    = isEnrolled(s)
            const professorId = s.professor?._id || s.professor
            let canBook       = true
            let upgradeReason = null
            if (!isPremium && currentUser?.subscriptionPlan) {
              if (currentUser.currentPlanSessionsBooked >= currentUser.subscriptionPlan.maxSessions) {
                canBook = false; upgradeReason = "Limit Reached"
              }
            }

            // Fake enrichment for display
            const rating  = s.professor?.rating   || (3.8 + Math.random() * 1.2)
            const reviews = s.professor?.reviews   || Math.floor(Math.random() * 200 + 20)
            const isAvailableToday = Math.random() > 0.4

            return (
              <div
                key={s._id}
                className="card card-lift overflow-hidden flex flex-col group"
              >
                {/* Card header gradient */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"/>

                <div className="p-5 flex flex-col flex-1">
                  {/* Tutor info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-black text-xl text-white shadow">
                        {s.professor?.name?.[0]?.toUpperCase() || "P"}
                      </div>
                      {isAvailableToday && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" title="Available Today"/>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-black text-sm" style={{ color: "var(--text-primary)" }}>{s.professor?.name}</h4>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">✓ Verified</span>
                      </div>
                      <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{s.title} · {s.level}</p>
                      <StarRating rating={rating} reviews={reviews}/>
                    </div>
                    {s.professor?.hourlyRate && (
                      <div className="shrink-0 text-right">
                        <p className="font-black text-sm text-blue-600">₹{s.professor.hourlyRate}</p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>/hr</p>
                      </div>
                    )}
                  </div>

                  {/* Tags row */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-alt)]" style={{ color: "var(--text-muted)" }}>
                      <FiBook size={9}/> {s.title}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-alt)]" style={{ color: "var(--text-muted)" }}>
                      <FiClock size={9}/> {s.time}
                    </span>
                    {isAvailableToday && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                        Available Today
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 mb-4 text-xs" style={{ color: "var(--text-muted)" }}>
                    <FiCalendar size={12}/>
                    <span>{s.date} at {s.time}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 mt-auto">
                    {professorId && (
                      <button
                        onClick={() => navigate(`/tutor/${professorId}`)}
                        className="w-full py-2 rounded-xl text-sm font-bold border-2 transition hover:shadow-sm"
                        style={{ borderColor: "var(--primary)", color: "var(--primary)", background: "transparent" }}
                        onMouseOver={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff" }}
                        onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--primary)" }}
                      >
                        <FiUser className="inline mr-1.5" size={13}/> View Profile
                      </button>
                    )}

                    {enrolled ? (
                      <button disabled className="w-full py-2.5 rounded-xl font-bold text-sm bg-green-50 text-green-600 flex items-center justify-center gap-1.5 cursor-not-allowed">
                        <FiCheckCircle size={14}/> Already Enrolled
                      </button>
                    ) : isPremium || canBook ? (
                      <button
                        onClick={() => handleEnroll(s._id)}
                        className="btn-ripple w-full py-2.5 rounded-xl font-black text-sm text-white shadow hover:shadow-md hover:-translate-y-0.5 transition-all"
                        style={{ background: "var(--grad-primary)" }}
                      >
                        Book Session
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/payment?plan=premium&returnTo=student")}
                        className="w-full py-2.5 rounded-xl font-black text-sm text-white flex items-center justify-center gap-1.5"
                        style={{ background: "var(--grad-warm)" }}
                      >
                        <FiLock size={13}/> {upgradeReason || "Upgrade to Book"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
