import { useEffect, useState, useCallback } from "react"
import API from "../../services/api"
import {
  FiSearch, FiX, FiUser, FiMail, FiPhone, FiBook,
  FiCalendar, FiCreditCard, FiFilter, FiChevronRight,
  FiAlertCircle, FiLoader, FiCheckCircle, FiSlash,
  FiAlertTriangle, FiRefreshCw
} from "react-icons/fi"
import toast from "react-hot-toast"

const TIER_STYLES = {
  premium:         { label: "Premium",         cls: "bg-purple-50 text-[var(--primary)] border-purple-100" },
  free_trial:      { label: "Free Trial",      cls: "bg-blue-50 text-[var(--primary)] border-blue-100" },
  pay_per_session: { label: "Pay Per Session", cls: "bg-amber-50 text-amber-600 border-amber-100" },
  null:            { label: "No Plan",         cls: "bg-gray-100 text-gray-400 border-gray-200" },
}
const getTierInfo = (tier) => TIER_STYLES[tier] || { label: tier || "No Plan", cls: "bg-gray-100 text-gray-400 border-gray-200" }

const STATUS_STYLES = {
  active:   { cls: "bg-emerald-50 text-emerald-600 border border-emerald-100", dot: "bg-emerald-400" },
  disabled: { cls: "bg-amber-50 text-amber-600 border border-amber-100",   dot: "bg-amber-400" },
  banned:   { cls: "bg-red-50 text-red-600 border border-red-100",         dot: "bg-red-400" },
}
const getStatusStyle = (s) => STATUS_STYLES[s] || STATUS_STYLES.active

function getInitials(name, email) {
  if (name) return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  return email?.[0]?.toUpperCase() || "S"
}

/* ─── Student Detail Modal ─── */
function StudentDetailModal({ student: initialStudent, onClose, onStatusChange }) {
  const [student, setStudent] = useState(initialStudent)
  const [saving, setSaving] = useState(null)
  const [plans, setPlans] = useState([])

  // Re-fetch to always show latest
  useEffect(() => {
    API.get(`/admin/student/${initialStudent._id}`)
      .then(r => setStudent(r.data))
      .catch(() => {})
      
    API.get("/subscriptions/admin/plans")
      .then(r => setPlans(r.data))
      .catch(() => {})
  }, [initialStudent._id])

  const initials = getInitials(student.name, student.email)
  const tierInfo = getTierInfo(student.subscriptionTier)
  const statusInfo = getStatusStyle(student.status)

  const handleStatus = async (newStatus) => {
    setSaving(newStatus)
    try {
      await API.put(`/admin/user-status/${student._id}`, { status: newStatus })
      setStudent(s => ({ ...s, status: newStatus }))
      onStatusChange?.()
      toast.success(`Student ${newStatus === "active" ? "activated" : newStatus === "disabled" ? "disabled" : "banned"}`)
    } catch {
      toast.error("Failed to update status")
    } finally {
      setSaving(null)
    }
  }

  const handlePlanChange = async (planId) => {
    try {
      await API.put(`/subscriptions/admin/users/${student._id}/plan`, { planId: planId || null })
      toast.success("Plan updated manually")
      const r = await API.get(`/admin/student/${student._id}`)
      setStudent(r.data)
      onStatusChange?.()
    } catch {
      toast.error("Failed to update plan")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold text-xl">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold">{student.name || "No name set"}</h2>
            <p className="text-white/70 text-sm">{student.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-white/20`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                {student.status || "active"}
              </span>
              <span className="text-xs text-white/60">joined {new Date(student.createdAt).toLocaleDateString("en-IN")}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition">
            <FiX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* —— SUBSCRIPTION —— */}
          <Section title="Subscription & Payment" icon={FiCreditCard}>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Current Plan</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${tierInfo.cls}`}>
                  {tierInfo.label}
                </span>
              </div>
              <InfoRow label="Subscription Status" value={student.subscriptionStatus || "inactive"} />
              <InfoRow label="Started" value={student.subscriptionStartDate
                ? new Date(student.subscriptionStartDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                : null} />
              <InfoRow label="Expires" value={student.subscriptionExpiryDate
                ? new Date(student.subscriptionExpiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                : null} />
              <InfoRow label="Sessions Booked" value={`${student.currentPlanSessionsBooked || 0} ${student.subscriptionPlan?.maxSessions ? `/ ${student.subscriptionPlan.maxSessions}` : ''}`} />
              <InfoRow label="Profiles Viewed" value={`${student.viewedProfessors?.length || 0} ${student.subscriptionPlan?.maxProfileViews ? `/ ${student.subscriptionPlan.maxProfileViews}` : ''}`} />
            </div>
            
            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Manual Upgrade</p>
              <select 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8E2DE2]"
                onChange={(e) => handlePlanChange(e.target.value)}
                value={student.subscriptionPlan?._id || student.subscriptionPlan || ""}
              >
                <option value="">No Plan</option>
                {plans.map(p => <option key={p._id} value={p._id}>{p.name} (₹{p.price/100})</option>)}
              </select>
            </div>

            {(student.razorpayPaymentId || student.razorpayOrderId) && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Razorpay IDs</p>
                {student.razorpayPaymentId && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Payment ID</span>
                    <code className="text-xs bg-purple-50 text-[var(--primary)] px-2 py-0.5 rounded font-mono">{student.razorpayPaymentId}</code>
                  </div>
                )}
                {student.razorpayOrderId && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Order ID</span>
                    <code className="text-xs bg-blue-50 text-[var(--primary)] px-2 py-0.5 rounded font-mono">{student.razorpayOrderId}</code>
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* —— STUDENT PROFILE —— */}
          <Section title="Academic Profile" icon={FiBook}>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow icon={FiCalendar} label="Date of Birth" value={student.birthDate} />
              <InfoRow label="Grade / Level" value={student.gradeLevel} />
              <InfoRow label="School / Institution" value={student.school} />
              <InfoRow label="Location" value={student.location} />
            </div>
            {student.learningGoals && (
              <TextBlock label="Learning Goals" value={student.learningGoals} />
            )}
            {student.professorPreferences && (
              <TextBlock label="Professor Preferences" value={student.professorPreferences} />
            )}
          </Section>

          {/* —— PARENT / GUARDIAN —— */}
          {(student.parentName || student.parentEmail || student.parentPhone) && (
            <Section title="Parent / Guardian" icon={FiPhone}>
              <div className="grid sm:grid-cols-2 gap-3">
                <InfoRow label="Name" value={student.parentName} />
                <InfoRow icon={FiMail} label="Email" value={student.parentEmail} />
                <InfoRow icon={FiPhone} label="Phone" value={student.parentPhone} />
                <InfoRow label="Relationship" value={student.parentRelationship} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-400">Parental Consent:</span>
                {student.parentConsent
                  ? <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><FiCheckCircle size={11} /> Given</span>
                  : <span className="text-xs text-red-500 font-semibold flex items-center gap-1"><FiAlertCircle size={11} /> Not given</span>}
              </div>
            </Section>
          )}
        </div>

        {/* Footer — Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0">
          <div className="flex gap-2">
            <ActionBtn
              onClick={() => handleStatus("active")}
              loading={saving === "active"}
              disabled={student.status === "active"}
              icon={FiCheckCircle}
              label="Activate"
              cls="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
            />
            <ActionBtn
              onClick={() => handleStatus("disabled")}
              loading={saving === "disabled"}
              disabled={student.status === "disabled"}
              icon={FiAlertTriangle}
              label="Disable"
              cls="bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100"
            />
            <ActionBtn
              onClick={() => handleStatus("banned")}
              loading={saving === "banned"}
              disabled={student.status === "banned"}
              icon={FiSlash}
              label="Ban"
              cls="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
            />
          </div>
          <button onClick={onClose} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white hover:shadow-md hover:-translate-y-0.5 transition-all">
            <FiX size={14} /> Close
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Component ─── */
export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [tier, setTier] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selected, setSelected] = useState(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await API.get(`/admin/students?search=${encodeURIComponent(search)}&tier=${tier}`)
      const data = res.data || []
      // Apply status filter client-side for snappiness
      setStudents(statusFilter ? data.filter(s => (s.status || "active") === statusFilter) : data)
    } catch (err) {
      console.error("Failed to load students:", err)
      toast.error("Failed to load student list")
    } finally {
      setLoading(false)
    }
  }, [search, tier, statusFilter])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  const totalAll = students.length
  const totalActive = students.filter(s => (s.status || "active") === "active").length
  const totalPremium = students.filter(s => s.subscriptionTier === "premium").length
  const totalFree = students.filter(s => !s.subscriptionTier || s.subscriptionTier === "free_trial").length

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">Full registered student profiles, subscriptions, and account controls</p>
        </div>
        <button onClick={fetchStudents} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--primary)] transition">
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students",       value: totalAll,     grad: "from-[var(--primary)] to-[var(--accent)]" },
          { label: "Active Accounts",      value: totalActive,  grad: "from-emerald-400 to-teal-400" },
          { label: "Premium Members",      value: totalPremium, grad: "from-[var(--primary)] to-[var(--primary)]" },
          { label: "Free / Trial Users",   value: totalFree,    grad: "from-amber-400 to-yellow-400" },
        ].map(({ label, value, grad }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="text-2xl font-bold text-gray-800 mb-0.5">{loading ? "—" : value}</div>
            <div className="text-xs text-gray-400">{label}</div>
            <div className={`mt-3 h-0.5 rounded-full bg-gradient-to-r ${grad}`} />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter size={13} className="text-gray-400" />
          <select value={tier} onChange={e => setTier(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all">
            <option value="">All Plans</option>
            <option value="premium">Premium</option>
            <option value="free_trial">Free Trial</option>
            <option value="pay_per_session">Pay Per Session</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
            <option value="banned">Banned</option>
          </select>
        </div>
        <span className="text-xs text-gray-400 self-center">{totalAll} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <FiLoader className="animate-spin" size={20} /> Loading students from database...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Academic</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscription</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                  <th className="px-3 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-12">
                    <FiSearch size={26} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-400">No students found matching your filters</p>
                  </td></tr>
                ) : students.map(s => {
                  const tierInfo = getTierInfo(s.subscriptionTier)
                  const statusInfo = getStatusStyle(s.status)
                  return (
                    <tr key={s._id}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => setSelected(s)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {getInitials(s.name, s.email)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate text-sm">{s.name || <span className="text-gray-400 italic text-xs">No name</span>}</p>
                            <p className="text-xs text-gray-400 truncate">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 font-medium">{s.gradeLevel || <span className="text-gray-300">—</span>}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[130px]">{s.school || "Not set"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${tierInfo.cls}`}>
                          {tierInfo.label}
                        </span>
                        {s.subscriptionStatus === "active" && (
                          <p className="text-xs text-emerald-500 mt-0.5 font-medium">Active</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusInfo.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {s.status || "active"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-3 py-4">
                        <FiChevronRight size={16} className="text-gray-300" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <StudentDetailModal
          student={selected}
          onClose={() => setSelected(null)}
          onStatusChange={fetchStudents}
        />
      )}
    </div>
  )
}

/* ─── Helpers ─── */
function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={13} className="text-[var(--primary)]" />}
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
        {Icon && <Icon size={11} />}{label}
      </p>
      <p className="text-sm text-gray-700 font-medium">{value}</p>
    </div>
  )
}

function TextBlock({ label, value }) {
  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{value}</p>
    </div>
  )
}

function ActionBtn({ onClick, loading, disabled, icon: Icon, label, cls }) {
  return (
    <button onClick={onClick} disabled={loading || disabled}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${cls}`}>
      {loading ? <FiLoader size={12} className="animate-spin" /> : <Icon size={12} />}
      {label}
    </button>
  )
}
