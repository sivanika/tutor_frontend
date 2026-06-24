import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../../services/api"
import {
  FiClock, FiLayers, FiPlay, FiBookOpen, FiInbox,
  FiTrendingUp, FiArrowRight, FiCheckCircle, FiLoader, FiAlertCircle
} from "react-icons/fi"
import toast from "react-hot-toast"

import { media } from "../../../utils/media"

const STATUS_CONFIG = {
  applied:   { label: "Pending Approval", color: "text-yellow-600 bg-yellow-50 border-yellow-100", icon: FiLoader },
  approved:  { label: "Enrolled",         color: "text-green-600 bg-green-50 border-green-100",   icon: FiCheckCircle },
  rejected:  { label: "Application Denied",color: "text-red-500 bg-red-50 border-red-100",       icon: FiAlertCircle },
  completed: { label: "Completed",        color: "text-blue-600 bg-blue-50 border-blue-100",     icon: FiCheckCircle },
}

export default function CoursesTab() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await API.get("/lms/enrollments/my")
      setEnrollments(res.data.enrollments || [])
    } catch {
      toast.error("Failed to load your courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleStartCourse = (courseId) => {
    navigate(`/courses/${courseId}/learn`)
  }

  return (
    <div className="space-y-6">
      {/* Promo banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 md:p-8 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">Structured LMS Learning</h2>
          <p className="text-blue-100 text-xs md:text-sm mt-1 max-w-md">
            Unlock complete video series, lesson materials, quizzes, and earn verify-ready certificates.
          </p>
        </div>
        <button onClick={() => navigate("/courses")}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-blue-700 text-xs font-bold shadow hover:bg-blue-50 transition shrink-0">
          Browse Catalog <FiArrowRight />
        </button>
      </div>

      {/* Grid List */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">My Courses</h3>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm">
            <FiInbox size={36} className="mx-auto mb-2 text-gray-300" />
            <p className="font-semibold text-gray-600">You are not enrolled in any courses yet</p>
            <p className="text-xs mt-1">Explore our course catalog and apply to start learning!</p>
            <button onClick={() => navigate("/courses")}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition">
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map(e => {
              const c = e.courseId
              if (!c) return null
              const sc = STATUS_CONFIG[e.status] || STATUS_CONFIG.applied
              const Icon = sc.icon

              return (
                <div key={e._id} className="bg-white rounded-2xl border border-gray-150/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
                  {/* Thumbnail */}
                  <div className="relative h-36 bg-blue-50">
                    {c.thumbnailUrl ? (
                      <img src={media(c.thumbnailUrl)} alt={c.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-300">
                        <FiBookOpen size={36} />
                      </div>
                    )}
                    {/* Status badge */}
                    <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${sc.color}`}>
                      <Icon size={10} /> {sc.label}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-gray-800 line-clamp-1">{c.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{c.subject} · {c.level}</p>

                    {/* Progress bar */}
                    {e.status === "approved" || e.status === "completed" ? (
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                          <span className="flex items-center gap-0.5"><FiTrendingUp size={10} /> PROGRESS</span>
                          <span>{e.progressPercentage || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${e.progressPercentage || 0}%` }} />
                        </div>
                      </div>
                    ) : null}

                    {/* CTA Button */}
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between shrink-0">
                      {e.status === "approved" || e.status === "completed" ? (
                        <button onClick={() => handleStartCourse(c._id)}
                          className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5">
                          <FiPlay size={12} /> Continue learning
                        </button>
                      ) : e.status === "rejected" ? (
                        <div className="w-full text-center text-xs text-red-500 italic bg-red-50 p-2 rounded-xl border border-red-100">
                          {e.rejectionReason || "Application rejected by admin"}
                        </div>
                      ) : (
                        <div className="w-full text-center text-xs text-yellow-600 italic bg-yellow-50/50 p-2 rounded-xl border border-yellow-100 flex items-center justify-center gap-1.5">
                          <FiClock size={12} /> Waiting for admin approval
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
