import { useEffect, useState } from "react"
import API from "../../services/api"
import {
  FiUsers, FiSearch, FiInbox, FiClock, FiCheckCircle, FiXCircle,
  FiDollarSign, FiBookOpen, FiActivity, FiChevronDown, FiChevronUp
} from "react-icons/fi"
import toast from "react-hot-toast"
import { media } from "../../utils/media"

const PAYMENT_STATUS_CONFIG = {
  pending: { label: "Pending", badge: "bg-amber-50 text-amber-600 border-amber-200", icon: FiClock },
  success: { label: "Success", badge: "bg-green-50 text-green-700 border-green-200", icon: FiCheckCircle },
  failed: { label: "Failed", badge: "bg-red-50 text-red-600 border-red-200", icon: FiXCircle },
  cancelled: { label: "Cancelled", badge: "bg-gray-50 text-gray-500 border-gray-200", icon: FiXCircle },
}

export default function AdminEnrollments() {
  const [data, setData] = useState({ payments: [], enrollments: [], summary: {} })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("payments")
  const [search, setSearch] = useState("")
  const [expandedStudentId, setExpandedStudentId] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await API.get("/admin/lms-payments-stats")
      if (res.data.success) {
        setData({
          payments: res.data.payments || [],
          enrollments: res.data.enrollments || [],
          summary: res.data.summary || {},
        })
      }
    } catch {
      toast.error("Failed to load LMS payment statistics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const { payments, enrollments, summary } = data

  // Group enrollments/payments by student for Student Purchase History
  const studentPurchaseHistory = () => {
    const studentMap = {}
    payments.forEach(p => {
      if (!p.studentId) return
      const sId = p.studentId._id
      if (!studentMap[sId]) {
        studentMap[sId] = {
          student: p.studentId,
          totalSpent: 0,
          successfulPurchases: [],
          failedPurchases: [],
        }
      }
      if (p.status === "success") {
        studentMap[sId].totalSpent += p.amount
        studentMap[sId].successfulPurchases.push(p)
      } else {
        studentMap[sId].failedPurchases.push(p)
      }
    })
    return Object.values(studentMap).sort((a, b) => b.totalSpent - a.totalSpent)
  }

  // Filter based on search query
  const q = search.toLowerCase()

  const filteredPayments = payments.filter(p => {
    return (
      p.studentId?.name?.toLowerCase().includes(q) ||
      p.studentId?.email?.toLowerCase().includes(q) ||
      p.courseId?.title?.toLowerCase().includes(q) ||
      p.razorpayOrderId?.toLowerCase().includes(q) ||
      p.razorpayPaymentId?.toLowerCase().includes(q)
    )
  })

  const filteredEnrollments = enrollments.filter(e => {
    return (
      e.studentId?.name?.toLowerCase().includes(q) ||
      e.studentId?.email?.toLowerCase().includes(q) ||
      e.courseId?.title?.toLowerCase().includes(q) ||
      e.razorpayPaymentId?.toLowerCase().includes(q)
    )
  })

  const filteredFailed = payments
    .filter(p => p.status === "failed" || p.status === "cancelled")
    .filter(p => {
      return (
        p.studentId?.name?.toLowerCase().includes(q) ||
        p.studentId?.email?.toLowerCase().includes(q) ||
        p.courseId?.title?.toLowerCase().includes(q) ||
        p.errorDescription?.toLowerCase().includes(q)
      )
    })

  const filteredStudents = studentPurchaseHistory().filter(sh => {
    return (
      sh.student?.name?.toLowerCase().includes(q) ||
      sh.student?.email?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiDollarSign className="text-[var(--primary)]" /> LMS Payments & Enrollments
        </h1>
        <p className="text-sm text-gray-400 mt-1">Monitor course purchases, revenue growth, and enrollment statuses.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: "Total Revenue",
            value: `₹${(summary.totalRevenue || 0).toLocaleString("en-IN")}`,
            icon: FiDollarSign,
            bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
          },
          {
            label: "Active Enrollments",
            value: summary.successfulEnrollmentsCount || 0,
            icon: FiCheckCircle,
            bg: "bg-blue-50 text-blue-600 border-blue-100",
          },
          {
            label: "Failed Payments",
            value: summary.failedPaymentsCount || 0,
            icon: FiXCircle,
            bg: "bg-red-50 text-red-600 border-red-100",
          },
          {
            label: "Payment Attempts",
            value: summary.totalPaymentAttempts || 0,
            icon: FiActivity,
            bg: "bg-purple-50 text-purple-600 border-purple-100",
          },
        ].map((s, idx) => {
          const Icon = s.icon
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${s.bg}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{s.label}</p>
                <p className="text-xl font-bold text-gray-800 mt-0.5">{s.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs and Search Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-gray-50/50">
          <div className="flex gap-1 flex-wrap">
            {[
              { id: "payments", label: "Payment History", count: payments.length },
              { id: "enrollments", label: "Successful Enrollments", count: enrollments.length },
              { id: "failed", label: "Failed Payments", count: summary.failedPaymentsCount || 0 },
              { id: "students", label: "Student Purchase History", count: studentPurchaseHistory().length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSearch("")
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/10"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="relative">
            <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64 transition-all"
            />
          </div>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-10 h-10 border-[3px] border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ─── TAB: PAYMENT HISTORY ─── */}
              {activeTab === "payments" && (
                <div className="overflow-x-auto">
                  {filteredPayments.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                      <FiInbox size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="font-semibold text-sm">No payment records found</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Transaction ID / Order ID</th>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Course</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredPayments.map(p => {
                          const config = PAYMENT_STATUS_CONFIG[p.status] || PAYMENT_STATUS_CONFIG.pending
                          const StatusIcon = config.icon
                          return (
                            <tr key={p._id} className="hover:bg-gray-50/50 transition duration-150">
                              <td className="px-6 py-4 font-mono font-medium text-gray-600">
                                <p className="text-gray-800">{p.razorpayPaymentId || "—"}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{p.razorpayOrderId}</p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                  {p.studentId?.studentPhoto ? (
                                    <img src={media(p.studentId.studentPhoto)} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold">
                                      {p.studentId?.name?.[0]?.toUpperCase() || "S"}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-semibold text-gray-800">{p.studentId?.name || "Unknown student"}</p>
                                    <p className="text-[10px] text-gray-400">{p.studentId?.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-700">
                                {p.courseId?.title || "Deleted Course"}
                              </td>
                              <td className="px-6 py-4 font-bold text-gray-800">
                                ₹{p.amount.toLocaleString("en-IN")}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${config.badge}`}>
                                  <StatusIcon size={11} />
                                  {config.label}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-400">
                                {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ─── TAB: SUCCESSFUL ENROLLMENTS ─── */}
              {activeTab === "enrollments" && (
                <div className="overflow-x-auto">
                  {filteredEnrollments.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                      <FiInbox size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="font-semibold text-sm">No successful enrollments found</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Course</th>
                          <th className="px-6 py-4">Transaction ID</th>
                          <th className="px-6 py-4">Price Paid</th>
                          <th className="px-6 py-4">Learning Progress</th>
                          <th className="px-6 py-4">Enrolled On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredEnrollments.map(e => (
                          <tr key={e._id} className="hover:bg-gray-50/50 transition duration-150">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                {e.studentId?.studentPhoto ? (
                                  <img src={media(e.studentId.studentPhoto)} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                    {e.studentId?.name?.[0]?.toUpperCase() || "S"}
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-800">{e.studentId?.name || "Unknown student"}</p>
                                  <p className="text-[10px] text-gray-400">{e.studentId?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-700">{e.courseId?.title || "Deleted Course"}</p>
                              <p className="text-[10px] text-gray-400">{e.courseId?.subject}</p>
                            </td>
                            <td className="px-6 py-4 font-mono text-gray-500">
                              {e.razorpayPaymentId || "Free Course / Direct"}
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-800">
                              ₹{(e.paymentAmount ?? 0).toLocaleString("en-IN")}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${e.progressPercentage || 0}%` }} />
                                </div>
                                <span className="font-medium text-gray-600">{e.progressPercentage || 0}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              {new Date(e.enrolledDate || e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ─── TAB: FAILED PAYMENTS ─── */}
              {activeTab === "failed" && (
                <div className="overflow-x-auto">
                  {filteredFailed.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                      <FiInbox size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="font-semibold text-sm">No failed payments found</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Course</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Issue Details</th>
                          <th className="px-6 py-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredFailed.map(p => (
                          <tr key={p._id} className="hover:bg-gray-50/50 transition duration-150">
                            <td className="px-6 py-4 font-mono font-medium text-gray-600">
                              {p.razorpayOrderId}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                {p.studentId?.studentPhoto ? (
                                  <img src={media(p.studentId.studentPhoto)} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-bold">
                                    {p.studentId?.name?.[0]?.toUpperCase() || "S"}
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-800">{p.studentId?.name || "Unknown student"}</p>
                                  <p className="text-[10px] text-gray-400">{p.studentId?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-700">
                              {p.courseId?.title || "Deleted Course"}
                            </td>
                            <td className="px-6 py-4 font-semibold text-red-500">
                              ₹{p.amount.toLocaleString("en-IN")}
                            </td>
                            <td className="px-6 py-4 text-red-600 bg-red-50/30 font-medium italic">
                              {p.errorDescription || "Payment was rejected or abandoned"}
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ─── TAB: STUDENT PURCHASE HISTORY ─── */}
              {activeTab === "students" && (
                <div className="p-4 space-y-4">
                  {filteredStudents.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      <FiInbox size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="font-semibold text-sm">No student purchase history found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredStudents.map(sh => {
                        const isExpanded = expandedStudentId === sh.student._id
                        return (
                          <div key={sh.student._id} className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200">
                            <div
                              onClick={() => setExpandedStudentId(isExpanded ? null : sh.student._id)}
                              className="flex items-center justify-between p-4 bg-white hover:bg-gray-50/50 cursor-pointer transition select-none"
                            >
                              <div className="flex items-center gap-3">
                                {sh.student.studentPhoto ? (
                                  <img src={media(sh.student.studentPhoto)} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {sh.student.name?.[0]?.toUpperCase() || "S"}
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-bold text-gray-800 text-sm">{sh.student.name}</h4>
                                  <p className="text-gray-400 text-[10px] mt-0.5">{sh.student.email}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Total Spent</p>
                                  <p className="text-sm font-bold text-emerald-600">₹{sh.totalSpent.toLocaleString("en-IN")}</p>
                                </div>
                                <div className="text-right hidden sm:block">
                                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Courses Bought</p>
                                  <p className="text-sm font-semibold text-gray-700">{sh.successfulPurchases.length}</p>
                                </div>
                                {isExpanded ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="bg-gray-50/40 border-t border-gray-100 p-4 space-y-3">
                                <h5 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Successful Course Enrolments</h5>
                                {sh.successfulPurchases.length === 0 ? (
                                  <p className="text-xs text-gray-400 italic">No course purchases completed yet.</p>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {sh.successfulPurchases.map(p => (
                                      <div key={p._id} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                                        <div>
                                          <p className="font-bold text-gray-700 text-xs">{p.courseId?.title || "Deleted Course"}</p>
                                          <p className="text-[10px] text-gray-400 mt-1">Paid on: {new Date(p.paymentDate || p.createdAt).toLocaleDateString("en-IN")}</p>
                                          <p className="text-[9px] font-mono text-gray-400 mt-0.5">TXN: {p.razorpayPaymentId}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                                            ₹{p.amount}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
