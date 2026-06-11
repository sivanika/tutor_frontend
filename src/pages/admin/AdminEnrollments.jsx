import { useEffect, useState } from "react"
import API from "../../services/api"
import {
  FiUsers, FiCheck, FiX, FiInbox, FiSearch,
  FiClock, FiCheckCircle, FiXCircle, FiAward
} from "react-icons/fi"
import toast from "react-hot-toast"

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"
const media = (url) => !url ? "" : url.startsWith("uploads/") ? `${API_BASE}/${url}` : url

const STATUS_CONFIG = {
  applied:   { label: "Pending",   icon: FiClock,       bg: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  approved:  { label: "Approved",  icon: FiCheckCircle, bg: "bg-green-50 text-green-700 border-green-200" },
  rejected:  { label: "Rejected",  icon: FiXCircle,     bg: "bg-red-50 text-red-600 border-red-200" },
  completed: { label: "Completed", icon: FiAward,        bg: "bg-blue-50 text-blue-700 border-blue-200" },
}

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("applied")
  const [search, setSearch] = useState("")
  const [acting, setActing] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const params = filterStatus !== "all" ? `?status=${filterStatus}` : ""
      const res = await API.get(`/lms/enrollments${params}`)
      setEnrollments(res.data.enrollments || [])
    } catch { toast.error("Failed to load enrollments") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filterStatus])

  const approve = async (id) => {
    setActing(id + "approve")
    try {
      await API.patch(`/lms/enrollments/${id}/approve`)
      toast.success("Enrollment approved ✓")
      load()
    } catch (e) { toast.error(e.response?.data?.message || "Failed") }
    finally { setActing(null) }
  }

  const reject = async (id) => {
    const reason = prompt("Rejection reason (optional):")
    if (reason === null) return
    setActing(id + "reject")
    try {
      await API.patch(`/lms/enrollments/${id}/reject`, { reason })
      toast.success("Enrollment rejected")
      load()
    } catch (e) { toast.error(e.response?.data?.message || "Failed") }
    finally { setActing(null) }
  }

  const counts = {
    all: enrollments.length,
    applied: enrollments.filter(e => e.status === "applied").length,
    approved: enrollments.filter(e => e.status === "approved").length,
    rejected: enrollments.filter(e => e.status === "rejected").length,
    completed: enrollments.filter(e => e.status === "completed").length,
  }

  const filtered = enrollments.filter(e => {
    const q = search.toLowerCase()
    return (
      e.studentId?.name?.toLowerCase().includes(q) ||
      e.studentId?.email?.toLowerCase().includes(q) ||
      e.courseId?.title?.toLowerCase().includes(q)
    )
  })

  const tabs = ["all", "applied", "approved", "rejected", "completed"]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiUsers className="text-[var(--primary)]" /> Enrollment Requests
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Review and approve student course applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Pending", count: counts.applied, color: "#f59e0b" },
          { label: "Approved", count: counts.approved, color: "#22c55e" },
          { label: "Rejected", count: counts.rejected, color: "#ef4444" },
          { label: "Completed", count: counts.completed, color: "#2563EB" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ background: s.color + "18", color: s.color }}>{s.count}</div>
            <p className="text-sm font-semibold text-gray-700">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-t-2xl border-t border-x border-gray-100 px-4 pt-4 pb-0">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div className="flex gap-1 flex-wrap">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  filterStatus === tab
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-500 hover:bg-gray-100"
                }`}>
                {tab} {tab !== "all" && `(${counts[tab]})`}
              </button>
            ))}
          </div>
          <div className="relative">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search student or course..."
              className="pl-8 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FiInbox size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No enrollments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Applied</th>
                  <th className="px-5 py-4">Progress</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(e => {
                  const sc = STATUS_CONFIG[e.status] || STATUS_CONFIG.applied
                  const Icon = sc.icon
                  return (
                    <tr key={e._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {e.studentId?.studentPhoto
                            ? <img src={media(e.studentId.studentPhoto)} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                            : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                {e.studentId?.name?.[0]?.toUpperCase() || "S"}
                              </div>
                          }
                          <div>
                            <p className="font-semibold text-gray-800">{e.studentId?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-400">{e.studentId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-700 line-clamp-1">{e.courseId?.title || "—"}</p>
                        <p className="text-xs text-gray-400">{e.courseId?.subject}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {new Date(e.enrolledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${e.progressPercentage || 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 font-medium">{e.progressPercentage || 0}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg}`}>
                          <Icon size={11} /> {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {e.status === "applied" && (
                            <>
                              <button onClick={() => approve(e._id)} disabled={acting === e._id + "approve"}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition disabled:opacity-50">
                                {acting === e._id + "approve"
                                  ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  : <FiCheck size={12} />}
                                Approve
                              </button>
                              <button onClick={() => reject(e._id)} disabled={acting === e._id + "reject"}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50">
                                <FiX size={12} /> Reject
                              </button>
                            </>
                          )}
                          {e.status === "approved" && (
                            <button onClick={() => reject(e._id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-500 text-xs font-semibold hover:bg-gray-200 transition">
                              <FiX size={12} /> Revoke
                            </button>
                          )}
                          {e.status === "rejected" && e.rejectionReason && (
                            <span className="text-xs text-gray-400 italic max-w-[120px] truncate" title={e.rejectionReason}>
                              {e.rejectionReason}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
