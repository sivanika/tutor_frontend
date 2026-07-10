import { useEffect, useState } from "react"
import API from "../../../services/api"
import { FiCreditCard, FiCheckCircle, FiClock, FiDownload } from "react-icons/fi"
import toast from "react-hot-toast"

export default function PaymentsTab() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPayments = async () => {
    try {
      const res = await API.get("/lms/payments/my")
      setPayments(res.data.payments || [])
    } catch (e) {
      toast.error("Failed to load payment history")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl bg-gradient-to-r from-rose-500 to-pink-600">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #fff, transparent)" }}/>
        <h2 className="text-xl md:text-2xl font-black">Payment History</h2>
        <p className="text-rose-100 text-sm mt-1 max-w-md">
          Track invoices, paid course enrollments, subscription plan charges, and download receipts.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="card p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <FiCreditCard size={28} className="text-rose-400"/>
          </div>
          <h3 className="font-black text-lg mb-1" style={{ color: "var(--text-primary)" }}>No Payments Yet</h3>
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>Your invoices and transaction logs will be listed here after you purchase a course or subscription plan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map(payment => (
            <div key={payment._id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <FiCreditCard size={18}/>
                </div>
                <div>
                  <h4 className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    {payment.courseId?.title || "LMS Course Access"}
                  </h4>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Order ID: {payment.razorpayOrderId} · Paid on: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0" style={{ borderColor: "var(--border-soft)" }}>
                <div className="text-right">
                  <div className="font-black text-base" style={{ color: "var(--text-primary)" }}>
                    ₹{payment.amount}
                  </div>
                  <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1 mt-0.5 justify-center">
                    <FiCheckCircle size={9}/> {payment.status}
                  </span>
                </div>
                <button
                  onClick={() => toast.success("Receipt generation triggered...")}
                  className="p-2.5 rounded-xl border flex items-center justify-center transition hover:bg-[var(--surface-alt)]"
                  style={{ borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
                  title="Download Receipt"
                >
                  <FiDownload size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
