import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../../services/api"
import { useAuth } from "../../context/AuthContext"
import {
  FiBookOpen, FiArrowLeft, FiLock, FiCheckCircle, FiShield,
  FiCreditCard, FiSmartphone, FiActivity
} from "react-icons/fi"
import toast from "react-hot-toast"

export default function CoursePaymentPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Load Course Info
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await API.get(`/lms/courses/${courseId}`)
        if (res.data.success) {
          setCourse(res.data.course)
          // If student is already enrolled (isEnrolled is returned by backend)
          if (res.data.isEnrolled) {
            toast.success("You are already enrolled in this course!")
            navigate(`/courses/${courseId}/learn`)
          }
        }
      } catch (err) {
        toast.error("Failed to load course details")
        navigate("/courses")
      } finally {
        setLoading(false)
      }
    }
    if (courseId) loadCourse()
  }, [courseId, navigate])

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to proceed")
      navigate("/login")
      return
    }

    setPaying(true)
    try {
      // 1. Create order on backend
      const res = await API.post("/payment/course/create-order", { courseId })

      // 2. Handle free course activation
      if (res.data.free) {
        const activateRes = await API.post("/payment/course/activate-free", { courseId })
        if (activateRes.data.success) {
          toast.success("Enrolled in free course successfully! 🎉")
          navigate(`/courses/${courseId}/learn`)
        }
        return
      }

      // 3. Paid course Razorpay flow
      const { orderId, amount, currency, courseName, keyId } = res.data

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "VishidhAcademy",
        description: `Course Purchase - ${courseName}`,
        image: "/logos/vishidh-emblem-192x192.webp",
        order_id: orderId,
        handler: async function (response) {
          setPaying(true)
          try {
            // Verify payment signature
            const verifyRes = await API.post("/payment/course/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: courseId,
            })
            if (verifyRes.data.success) {
              toast.success("Enrolled successfully! Enjoy learning. 🎉")
              navigate(`/courses/${courseId}/learn`)
            }
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed.")
          } finally {
            setPaying(false)
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#2563EB", // Primary theme color
        },
        modal: {
          ondismiss: async function () {
            try {
              await API.post("/payment/course/cancel", {
                razorpay_order_id: orderId,
                errorDescription: "Payment modal dismissed by student",
              })
            } catch (err) {
              console.error("Cancel API error:", err)
            }
            toast.error("Payment cancelled.")
            setPaying(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on("payment.failed", async function (response) {
        try {
          await API.post("/payment/course/cancel", {
            razorpay_order_id: orderId,
            errorDescription: response.error?.description || "Payment failed",
          })
        } catch (err) {
          console.error("Failed to log failed payment:", err)
        }
        toast.error(response.error?.description || "Payment failed. Please try again.")
        setPaying(false)
      })

      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate payment")
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!course) return null

  const isFree = course.price === 0

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter,sans-serif] flex flex-col justify-between py-10 px-4">
      <div className="max-w-4xl mx-auto w-full">
        {/* Navigation back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 mb-6 transition"
        >
          <FiArrowLeft /> Cancel and Go Back
        </button>

        {/* Content Box */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Left Details column */}
          <div className="md:col-span-3 p-6 md:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-blue-50 text-blue-600 uppercase">
                Checkout
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight">
                {course.title}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                {course.description}
              </p>
              <div className="flex items-center gap-4 text-[11px] text-gray-500 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100 w-fit">
                <span><strong>Instructor:</strong> {course.instructor || "Admin"}</span>
                <span><strong>Level:</strong> {course.level}</span>
                <span><strong>Duration:</strong> {course.duration}</span>
              </div>
            </div>

            {/* Payment options list */}
            <div className="space-y-3 border-t border-gray-100 pt-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Available Payment Methods
              </h3>
              {isFree ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-2xl text-xs text-green-700 font-semibold">
                  <FiCheckCircle size={15} /> Free Activation (Instant enrollment without payment)
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3.5 border border-gray-100 rounded-2xl hover:border-blue-500/30 transition shadow-sm bg-gray-50/20">
                    <FiSmartphone className="text-blue-500 shrink-0" size={16} />
                    <div>
                      <p className="text-xs font-bold text-gray-700">UPI / QR</p>
                      <p className="text-[9px] text-gray-400">GPay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3.5 border border-gray-100 rounded-2xl hover:border-blue-500/30 transition shadow-sm bg-gray-50/20">
                    <FiCreditCard className="text-blue-500 shrink-0" size={16} />
                    <div>
                      <p className="text-xs font-bold text-gray-700">Cards</p>
                      <p className="text-[9px] text-gray-400">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="md:col-span-2 bg-gray-950 p-6 md:p-8 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">
                Order Summary
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Course Fee</span>
                  <span className="font-semibold">{isFree ? "Free" : `₹${course.price.toLocaleString("en-IN")}`}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Platform Fee</span>
                  <span className="text-emerald-400 font-semibold">₹0 (Free)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>GST (18%)</span>
                  <span className="text-white/40">Inclusive</span>
                </div>
                <div className="border-t border-white/10 pt-3.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-white/80">Total Due Today</span>
                  <span className="text-lg font-black text-emerald-400">
                    {isFree ? "₹0" : `₹${course.price.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                disabled={paying}
                className={`w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 disabled:opacity-50`}
              >
                {paying ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isFree ? (
                  <>
                    <FiCheckCircle size={13} />
                    Enroll for Free →
                  </>
                ) : (
                  <>
                    <FiLock size={13} />
                    Pay ₹{course.price.toLocaleString("en-IN")} Securely →
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 justify-center text-[10px] text-white/40 text-center leading-relaxed">
                <FiShield size={12} className="shrink-0 text-emerald-500" />
                <span>SSL Secured & Verified checkout via Razorpay.</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
