import { useEffect, useState, useCallback } from "react"
import API from "../../services/api"
import {
  FiSearch, FiX, FiUser, FiMail, FiBook, FiAward,
  FiBriefcase, FiFilter, FiChevronRight, FiLoader,
  FiCheckCircle, FiClock, FiStar, FiExternalLink,
  FiCheck, FiSlash, FiAlertTriangle, FiRefreshCw,
  FiPhone, FiDollarSign, FiPercent
} from "react-icons/fi"
import toast from "react-hot-toast"

const VERIFY_STYLES = {
  true:  { label: "Verified",  cls: "bg-emerald-50 text-emerald-600 border border-emerald-100", icon: FiCheckCircle, dot: "bg-emerald-400" },
  false: { label: "Pending",   cls: "bg-amber-50 text-amber-600 border border-amber-100",       icon: FiClock,       dot: "bg-amber-400" },
}
const STATUS_STYLES = {
  active:   { cls: "bg-emerald-50 text-emerald-600 border border-emerald-100", dot: "bg-emerald-400" },
  disabled: { cls: "bg-amber-50 text-amber-600 border border-amber-100",       dot: "bg-amber-400" },
  banned:   { cls: "bg-red-50 text-red-600 border border-red-100",             dot: "bg-red-400" },
}
const getStatusStyle = (s) => STATUS_STYLES[s] || STATUS_STYLES.active

function getInitials(name, email) {
  if (name) return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  return email?.[0]?.toUpperCase() || "P"
}

/* ─── Professor Full Detail Modal ─── */
function ProfessorModal({ professor: init, onClose, onRefresh }) {
  const [professor, setProfessor] = useState(init)
  const [saving, setSaving] = useState(null)

  // Always fetch fresh data from backend when modal opens
  useEffect(() => {
    API.get(`/admin/professor/${init._id}`)
      .then(r => setProfessor(r.data))
      .catch(() => {})
  }, [init._id])

  const initials = getInitials(professor.name, professor.email)
  const verifyInfo = VERIFY_STYLES[String(professor.isVerified)] || VERIFY_STYLES.false
  const VerifyIcon = verifyInfo.icon

  const approve = async () => {
    setSaving("approve")
    try {
      await API.put(`/admin/approve-professor/${professor._id}`)
      setProfessor(p => ({ ...p, isVerified: true }))
      onRefresh?.()
      toast.success("Professor approved ✓")
    } catch { toast.error("Approval failed") }
    finally { setSaving(null) }
  }

  const reject = async () => {
    if (!confirm("Reject and delete this professor's account?")) return
    setSaving("reject")
    try {
      await API.put(`/admin/reject-professor/${professor._id}`)
      toast.success("Professor rejected")
      onRefresh?.()
      onClose()
    } catch { toast.error("Rejection failed") }
    finally { setSaving(null) }
  }

  const handleStatus = async (newStatus) => {
    setSaving(newStatus)
    try {
      await API.put(`/admin/user-status/${professor._id}`, { status: newStatus })
      setProfessor(p => ({ ...p, status: newStatus }))
      onRefresh?.()
      toast.success(`Account ${newStatus}`)
    } catch { toast.error("Status update failed") }
    finally { setSaving(null) }
  }

  const statusInfo = getStatusStyle(professor.status)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold text-xl shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h2 className="text-xl font-bold truncate">{professor.name || "No name"}</h2>
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-white/20`}>
                <VerifyIcon size={10} /> {verifyInfo.label}
              </span>
              {professor.isFeatured && (
                <span className="text-xs bg-amber-400/80 text-white px-2 py-0.5 rounded-full font-medium">⭐ Featured</span>
              )}
            </div>
            <p className="text-white/70 text-sm">{professor.email}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {professor.subjects && (
                <span className="text-xs bg-white/15 text-white/80 px-2 py-0.5 rounded-full">{professor.subjects}</span>
              )}
              {professor.hourlyRate && (
                <span className="text-xs bg-white/15 text-white/80 px-2 py-0.5 rounded-full">₹{professor.hourlyRate}/hr</span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full bg-white/15`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusInfo.dot} mr-1`} />
                {professor.status || "active"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition shrink-0">
            <FiX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatChip label="Hourly Rate" value={professor.hourlyRate ? `₹${professor.hourlyRate}` : "—"} icon={FiDollarSign} />
            <StatChip label="Commission" value={`${professor.commissionRate || 18}%`} icon={FiPercent} />
            <StatChip label="Students Helped" value={professor.studentsHelped || 0} icon={FiUser} />
          </div>

          {/* Personal Info */}
          <Section title="Contact & Location" icon={FiUser}>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow icon={FiMail} label="Email" value={professor.email} />
              <InfoRow icon={FiPhone} label="Phone" value={professor.phone} />
              <InfoRow label="Country" value={professor.country} />
              <InfoRow label="Timezone" value={professor.timezone} />
            </div>
            {professor.bio && <TextBlock label="Bio" value={professor.bio} />}
            {professor.headline && <TextBlock label="Headline" value={professor.headline} />}
          </Section>

          {/* Education */}
          <Section title="Education & Credentials" icon={FiBook}>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow label="Highest Degree" value={professor.highestDegree} />
              <InfoRow label="Field of Study" value={professor.fieldOfStudy} />
              <InfoRow label="University" value={professor.university} />
              <InfoRow label="Graduation Year" value={professor.graduationYear} />
              <InfoRow label="Certifications" value={professor.certifications} />
            </div>
          </Section>

          {/* Teaching */}
          <Section title="Teaching Profile" icon={FiBriefcase}>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow label="Experience" value={professor.yearsExperience ? `${professor.yearsExperience} years` : null} />
              <InfoRow label="Teaching Level" value={professor.teachingLevel} />
              <InfoRow label="Subjects" value={professor.subjects} />
              <InfoRow label="Specializations" value={professor.specializations} />
            </div>
            {professor.teachingPhilosophy && <TextBlock label="Teaching Philosophy" value={professor.teachingPhilosophy} />}
          </Section>

          {/* Documents */}
          {(professor.governmentId || professor.degreeCertificate || professor.videoIntroduction) && (
            <Section title="Uploaded Documents" icon={FiAward}>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: professor.governmentId, label: "Government ID" },
                  { key: professor.degreeCertificate, label: "Degree Certificate" },
                  { key: professor.videoIntroduction, label: "Video Introduction" },
                ].filter(d => d.key).map(d => (
                  <a key={d.label} href={`http://localhost:5000/${d.key}`} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-[var(--primary)] border border-blue-100 hover:bg-blue-100 transition">
                    <FiExternalLink size={12} /> {d.label}
                  </a>
                ))}
              </div>
            </Section>
          )}

          <p className="text-xs text-gray-400">
            Registered on {new Date(professor.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {/* Verify actions */}
            {!professor.isVerified && (
              <>
                <ActionBtn onClick={approve} loading={saving === "approve"} icon={FiCheck} label="Approve"
                  cls="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white hover:shadow-md" />
                <ActionBtn onClick={reject} loading={saving === "reject"} icon={FiSlash} label="Reject"
                  cls="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100" />
              </>
            )}
            {/* Account status controls */}
            <ActionBtn onClick={() => handleStatus("active")} loading={saving === "active"}
              disabled={professor.status === "active"} icon={FiCheckCircle} label="Activate"
              cls="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100" />
            <ActionBtn onClick={() => handleStatus("disabled")} loading={saving === "disabled"}
              disabled={professor.status === "disabled"} icon={FiAlertTriangle} label="Disable"
              cls="bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100" />
            <ActionBtn onClick={() => handleStatus("banned")} loading={saving === "banned"}
              disabled={professor.status === "banned"} icon={FiSlash} label="Ban"
              cls="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100" />
          </div>
          <button onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white hover:shadow-md hover:-translate-y-0.5 transition-all">
            <FiX size={14} /> Close
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Component ─── */
export default function AdminProfessors() {
  const [professors, setProfessors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selected, setSelected] = useState(null)

  const fetchProfessors = useCallback(async () => {
    setLoading(true)
    try {
      const res = await API.get(`/admin/professors-full?search=${encodeURIComponent(search)}&status=${statusFilter}`)
      setProfessors(res.data || [])
    } catch (err) {
      console.error("Failed to load professors:", err)
      toast.error("Failed to load professor list")
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => { fetchProfessors() }, [fetchProfessors])

  const totalVerified = professors.filter(p => p.isVerified).length
  const totalPending = professors.filter(p => !p.isVerified).length
  const totalFeatured = professors.filter(p => p.isFeatured).length
  const totalActive = professors.filter(p => (p.status || "active") === "active").length

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Professor Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">Full profile, credentials, and account control for all professors</p>
        </div>
        <button onClick={fetchProfessors} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--primary)] transition">
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "All Professors",  value: professors.length, grad: "from-[var(--primary)] to-[var(--primary)]" },
          { label: "Verified",        value: totalVerified,     grad: "from-emerald-400 to-teal-400" },
          { label: "Pending Review",  value: totalPending,      grad: "from-amber-400 to-yellow-400" },
          { label: "Featured",        value: totalFeatured,     grad: "from-[var(--accent)] to-orange-400" },
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
            placeholder="Search name, email, subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter size={13} className="text-gray-400" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all">
            <option value="">All Professors</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>
        <span className="text-xs text-gray-400 self-center">{professors.length} professors</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <FiLoader className="animate-spin" size={20} /> Loading professors from database...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Professor</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subjects</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-3 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {professors.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-12">
                    <FiSearch size={26} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-400">No professors found</p>
                  </td></tr>
                ) : professors.map(p => {
                  const verifyInfo = VERIFY_STYLES[String(p.isVerified)] || VERIFY_STYLES.false
                  const VIcon = verifyInfo.icon
                  const statusInfo = getStatusStyle(p.status)
                  return (
                    <tr key={p._id} onClick={() => setSelected(p)}
                      className="hover:bg-purple-50/30 transition-colors cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {getInitials(p.name, p.email)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="font-semibold text-gray-800 truncate text-sm">{p.name || <span className="text-gray-400 italic text-xs">No name</span>}</p>
                              {p.isFeatured && <FiStar size={11} className="text-amber-400 shrink-0" />}
                            </div>
                            <p className="text-xs text-gray-400 truncate">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 max-w-[130px] truncate">{p.subjects || <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-4 font-semibold text-sm text-gray-800">{p.hourlyRate ? `₹${p.hourlyRate}` : <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-purple-50 text-[var(--primary)] px-2 py-1 rounded-full font-semibold border border-purple-100">
                          {p.commissionRate || 18}%
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${verifyInfo.cls}`}>
                          <VIcon size={10} /> {verifyInfo.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusInfo.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {p.status || "active"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-3 py-4"><FiChevronRight size={16} className="text-gray-300" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <ProfessorModal
          professor={selected}
          onClose={() => setSelected(null)}
          onRefresh={fetchProfessors}
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
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">{Icon && <Icon size={11} />}{label}</p>
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

function StatChip({ label, value, icon: Icon }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
      {Icon && <Icon size={14} className="text-[var(--primary)] mx-auto mb-1" />}
      <p className="text-base font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
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
