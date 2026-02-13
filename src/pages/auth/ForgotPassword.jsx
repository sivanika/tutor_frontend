import { useState } from "react"
import API from "../../services/api"
import { Link } from "react-router-dom"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await API.post("/auth/forgot-password", { email })
      setSent(true)
    } catch {
      alert("Email not found")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-6

        bg-slate-100
        dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black

        transition-colors duration-500
      "
    >
      <form
        onSubmit={submit}
        className="
          w-full max-w-md p-8 rounded-2xl space-y-5

          bg-white/90 dark:bg-slate-900/80
          backdrop-blur-2xl

          border border-slate-200 dark:border-slate-800
          shadow-xl dark:shadow-black/40

          animate-[popup_.5s_ease]
        "
      >
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
          Forgot Password
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
          Enter your email and we’ll send you a reset link
        </p>

        {sent ? (
          <div className="text-center">
            <p className="text-green-600 dark:text-green-400 font-medium">
              ✅ Reset link sent!
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Please check your email.
            </p>
          </div>
        ) : (
          <>
            <input
              type="email"
              className="
                w-full p-3 rounded-lg
                bg-slate-50 dark:bg-slate-800
                border border-slate-300 dark:border-slate-700
                text-slate-800 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-slate-500
                transition
              "
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="
                w-full py-3 rounded-lg font-semibold

                bg-slate-900 text-white
                hover:bg-black

                dark:bg-slate-100 dark:text-black
                dark:hover:bg-white

                transition-all duration-200
                active:scale-95
                disabled:opacity-60
              "
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </form>

      {/* animation */}
      <style>
        {`
          @keyframes popup {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  )
}

export default ForgotPassword
