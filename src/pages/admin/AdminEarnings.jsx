import { useEffect, useState } from "react"
import API from "../../services/api"
import {
  FiDollarSign, FiTrendingUp, FiUsers, FiBook,
  FiLoader, FiChevronDown, FiChevronUp, FiCreditCard,
  FiPercent
} from "react-icons/fi"

function getInitials(name, email) {
  if (name) return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  return email?.[0]?.toUpperCase() || "P"
}

function fmt(num) {
  return `₹${Number(num || 0).toLocaleString("en-IN")}`
}

/* ─── Professor Earnings Detail Row ─── */
function ProfRow({ prof }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr
        className="hover:bg-gray-50/80 transition-colors cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Professor */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(prof.name, prof.email)}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-800 truncate">{prof.name}</p>
              <p className="text-xs text-gray-400 truncate">{prof.email}</p>
            </div>
          </div>
        </td>

        {/* Subjects */}
        <td className="px-5 py-4 text-xs text-gray-500 max-w-[120px] truncate">{prof.subjects}</td>

        {/* Sessions */}
        <td className="px-5 py-4 text-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[var(--primary)]">
            {prof.totalSessions}
          </span>
        </td>

        {/* Hourly Rate */}
        <td className="px-5 py-4 text-sm text-gray-600 text-right">{prof.hourlyRate ? fmt(prof.hourlyRate) : "—"}</td>

        {/* Gross Earning */}
        <td className="px-5 py-4 text-sm font-semibold text-gray-800 text-right">{fmt(prof.grossEarning)}</td>

        {/* Commission */}
        <td className="px-5 py-4 text-right">
          <div>
            <p className="text-sm font-semibold text-[var(--accent)]">{fmt(prof.commission)}</p>
            <p className="text-xs text-gray-400">{prof.commissionRate}%</p>
          </div>
        </td>

        {/* Net Payout */}
        <td className="px-5 py-4 text-sm font-bold text-emerald-600 text-right">{fmt(prof.netPayout)}</td>

        {/* Expand */}
        <td className="px-4 py-4 text-gray-400">
          {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </td>
      </tr>

      {/* Expanded detail */}
      {expanded && (
        <tr className="bg-gradient-to-r from-purple-50/40 to-blue-50/40">
          <td colSpan="8" className="px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Hourly Rate", value: prof.hourlyRate ? fmt(prof.hourlyRate) : "—", sub: "per session" },
                { label: "Total Sessions", value: prof.totalSessions, sub: "sessions conducted" },
                { label: "Active Students", value: prof.activeStudents, sub: "unique students" },
                { label: "Commission Rate", value: `${prof.commissionRate}%`, sub: "platform cut" },
                { label: "Gross Earnings", value: fmt(prof.grossEarning), sub: "before commission" },
                { label: "Platform Commission", value: fmt(prof.commission), sub: "revenue to platform" },
                { label: "Net Payout", value: fmt(prof.netPayout), sub: "professor receives" },
                { label: "Joined", value: new Date(prof.joinedAt).toLocaleDateString("en-IN"), sub: "member since" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

/* ─── Main Component ─── */
export default function AdminEarnings() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("commission")

  useEffect(() => {
    API.get("/admin/earnings")
      .then(res => setData(res.data))
      .catch(() => alert("Failed to load earnings data"))
      .finally(() => setLoading(false))
  }, [])

  const professors = [...(data?.professors || [])].sort((a, b) => {
    if (sortBy === "commission")    return b.commission - a.commission
    if (sortBy === "sessions")     return b.totalSessions - a.totalSessions
    if (sortBy === "gross")        return b.grossEarning - a.grossEarning
    if (sortBy === "payout")       return b.netPayout - a.netPayout
    return 0
  })

  const summary = data?.summary || {}

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
        <FiLoader className="animate-spin" size={22} />
        <span className="text-sm">Calculating earnings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Payments & Earnings</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Estimated earnings based on sessions × hourly rate. Commission revenue is the platform's income.
        </p>
      </div>

      {/* Platform Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Platform Revenue",
            value: fmt(summary.totalCommission),
            icon: FiDollarSign,
            bg: "bg-purple-50", color: "text-[var(--primary)]",
            grad: "from-[var(--primary)] to-[var(--primary)]",
            highlight: true,
          },
          {
            label: "Total Gross Earnings",
            value: fmt(summary.totalGross),
            icon: FiTrendingUp,
            bg: "bg-emerald-50", color: "text-emerald-500",
            grad: "from-emerald-400 to-teal-400",
          },
          {
            label: "Total Sessions",
            value: summary.totalSessions || 0,
            icon: FiBook,
            bg: "bg-blue-50", color: "text-[var(--primary)]",
            grad: "from-[var(--primary)] to-[var(--accent)]",
          },
          {
            label: "Active Professors",
            value: summary.totalProfessors || 0,
            icon: FiUsers,
            bg: "bg-amber-50", color: "text-amber-500",
            grad: "from-amber-400 to-yellow-400",
          },
          {
            label: "Total Students",
            value: summary.totalStudents || 0,
            icon: FiUsers,
            bg: "bg-pink-50", color: "text-[var(--accent)]",
            grad: "from-[var(--accent)] to-orange-400",
          },
        ].map(({ label, value, icon: Icon, bg, color, grad, highlight }) => (
          <div key={label} className={`rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md hover:-translate-y-0.5 ${highlight ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] text-white border-transparent" : "bg-white border-gray-100"}`}>
            <div className={`${highlight ? "bg-white/20" : bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={highlight ? "text-white" : color} />
            </div>
            <div className={`text-2xl font-bold mb-0.5 ${highlight ? "text-white" : "text-gray-800"}`}>{value}</div>
            <div className={`text-xs ${highlight ? "text-white/70" : "text-gray-400"}`}>{label}</div>
            {!highlight && <div className={`mt-3 h-0.5 rounded-full bg-gradient-to-r ${grad}`} />}
          </div>
        ))}
      </div>

      {/* Commission Insight Banner */}
      <div className="bg-gradient-to-r from-[var(--accent)]/5 to-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] flex items-center justify-center shrink-0">
          <FiPercent size={18} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">18% Platform Commission Model</p>
          <p className="text-xs text-gray-500 mt-0.5">
            On the <strong>Pay Per Session</strong> model, TutorHours retains 18% of each session's value as platform revenue. The professor receives 82% as their net payout.
          </p>
        </div>
        <div className="ml-auto text-right shrink-0">
          <p className="text-2xl font-bold text-[var(--primary)]">{fmt(summary.totalCommission)}</p>
          <p className="text-xs text-gray-400">total commission earned</p>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-medium">Sort by:</span>
        {[
          { key: "commission", label: "Commission" },
          { key: "sessions",   label: "Sessions" },
          { key: "gross",      label: "Gross Earning" },
          { key: "payout",     label: "Net Payout" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              sortBy === key
                ? "bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Professor</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subjects</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate/hr</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gross</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Payout</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {professors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400">
                    <FiCreditCard size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No verified professors with earnings data</p>
                  </td>
                </tr>
              ) : professors.map(prof => <ProfRow key={prof._id} prof={prof} />)}
            </tbody>

            {/* Grand Total Row */}
            {professors.length > 0 && (
              <tfoot>
                <tr className="bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary)]/5 border-t-2 border-[var(--primary)]/20">
                  <td className="px-5 py-4 font-bold text-gray-800" colSpan="4">
                    Platform Total ({professors.length} professors)
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-gray-800">{fmt(summary.totalGross)}</td>
                  <td className="px-5 py-4 text-right font-bold text-[var(--accent)]">{fmt(summary.totalCommission)}</td>
                  <td className="px-5 py-4 text-right font-bold text-emerald-600">{fmt(summary.totalGross - summary.totalCommission)}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center pb-2">
        * Earnings are estimated based on sessions conducted × hourly rate. Actual payouts may vary.
      </p>
    </div>
  )
}
