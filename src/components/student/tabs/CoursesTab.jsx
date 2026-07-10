import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../../services/api"
import {
  FiClock, FiLayers, FiPlay, FiBookOpen, FiInbox,
  FiTrendingUp, FiArrowRight, FiCheckCircle, FiLoader, FiAlertCircle,
  FiStar, FiUsers, FiAward
} from "react-icons/fi"
import toast from "react-hot-toast"
import { media } from "../../../utils/media"

const STATUS_CONFIG = {
  applied:   { label: "Pending Approval", color: "bg-yellow-50 text-yellow-600 border-yellow-100", icon: FiLoader },
  approved:  { label: "Enrolled",         color: "bg-green-50 text-green-600 border-green-100",    icon: FiCheckCircle },
  rejected:  { label: "Application Denied", color: "bg-red-50 text-red-500 border-red-100",        icon: FiAlertCircle },
  completed: { label: "Completed",        color: "bg-blue-50 text-blue-600 border-blue-100",       icon: FiCheckCircle },
}

const DIFF_COLORS = {
  Beginner:     "bg-green-50 text-green-600",
  Intermediate: "bg-amber-50 text-amber-600",
  Advanced:     "bg-red-50 text-red-500",
}

export default function CoursesTab() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading]         = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const r = await API.get("/lms/enrollments/my")
      setEnrollments(r.data.enrollments || [])
    } catch { toast.error("Failed to load your courses") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const activeCount    = enrollments.filter(e => e.status === "approved").length
  const completedCount = enrollments.filter(e => e.status === "completed").length
  const pendingCount   = enrollments.filter(e => e.status === "applied").length

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Promo banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl" style={{ background: "linear-gradient(135deg, #1D4ED8, #4F46E5)" }}>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #A78BFA, transparent)" }}/>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black">Structured LMS Learning</h2>
            <p className="text-blue-100 text-sm mt-1 max-w-md">
              Unlock complete video series, lesson materials, quizzes, and earn verifiable certificates.
            </p>
          </div>
          <button
            onClick={() => navigate("/courses")}
            className="btn-ripple shrink-0 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-black text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Browse Catalog <FiArrowRight size={14}/>
          </button>
        </div>
      </div>

      {/* Summary stats */}
      {enrollments.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active",    count: activeCount,    color: "from-blue-500 to-indigo-600", bg: "bg-blue-50",   tc: "text-blue-600" },
            { label: "Completed", count: completedCount, color: "from-green-400 to-emerald-500",bg: "bg-green-50", tc: "text-green-600" },
            { label: "Pending",   count: pendingCount,   color: "from-amber-400 to-orange-500",bg: "bg-amber-50",  tc: "text-amber-600" },
          ].map(({ label, count, color, bg, tc }) => (
            <div key={label} className="card p-4 text-center">
              <div className="text-2xl font-black mb-0.5" style={{ color: "var(--text-primary)" }}>{count}</div>
              <div className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{label}</div>
              <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${color}`}/>
            </div>
          ))}
        </div>
      )}

      {/* Course grid */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>My Courses</h3>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="card p-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <FiInbox size={28} className="text-blue-300"/>
            </div>
            <h3 className="font-black text-lg mb-1" style={{ color: "var(--text-primary)" }}>No Courses Yet</h3>
            <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>Browse our catalog and enroll in your first course.</p>
            <button
              onClick={() => navigate("/courses")}
              className="btn-ripple inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-black text-sm"
              style={{ background: "var(--grad-primary)" }}
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {enrollments.map(e => {
              const c = e.courseId
              if (!c) return null
              const sc   = STATUS_CONFIG[e.status] || STATUS_CONFIG.applied
              const Icon = sc.icon
              const pct  = e.progressPercentage || 0
              const diff = c.level || "Beginner"

              return (
                <div key={e._id} className="card card-lift overflow-hidden flex flex-col group">
                  {/* Thumbnail */}
                  <div className="relative h-40" style={{ background: "linear-gradient(135deg, #1E3A8A, #4C1D95)" }}>
                    {c.thumbnailUrl ? (
                      <img src={media(c.thumbnailUrl)} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiBookOpen size={40} className="text-white/30"/>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>

                    {/* Status badge */}
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black border flex items-center gap-1 ${sc.color}`}>
                      <Icon size={9}/> {sc.label}
                    </span>

                    {/* Level badge */}
                    <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-black ${DIFF_COLORS[diff] || "bg-gray-100 text-gray-600"}`}>
                      {diff}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="font-black text-sm leading-tight line-clamp-2 mb-1" style={{ color: "var(--text-primary)" }}>{c.title}</h4>
                    <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{c.subject}</p>

                    {/* Fake rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} viewBox="0 0 20 20" className={`w-3 h-3 ${i < 4 ? "fill-amber-400" : "fill-gray-200"}`}>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                      <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>4.0</span>
                    </div>

                    {/* Progress */}
                    {(e.status === "approved" || e.status === "completed") && (
                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] font-bold mb-1.5" style={{ color: "var(--text-muted)" }}>
                          <span className="flex items-center gap-0.5"><FiTrendingUp size={9}/> PROGRESS</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }}/>
                        </div>
                        {e.lastLesson && (
                          <p className="text-[10px] mt-1.5" style={{ color: "var(--text-muted)" }}>
                            Last: {e.lastLesson}
                          </p>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--border-soft)" }}>
                      {e.status === "approved" || e.status === "completed" ? (
                        <button
                          onClick={() => navigate(`/courses/${c._id}/learn`)}
                          className="btn-ripple w-full py-2.5 rounded-xl font-black text-sm text-white shadow hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                          style={{ background: "var(--grad-primary)" }}
                        >
                          <FiPlay size={13}/> Continue Learning
                        </button>
                      ) : e.status === "rejected" ? (
                        <div className="w-full text-center text-xs text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
                          {e.rejectionReason || "Application rejected"}
                        </div>
                      ) : (
                        <div className="w-full flex items-center justify-center gap-1.5 text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                          <FiClock size={12}/> Awaiting admin approval
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
