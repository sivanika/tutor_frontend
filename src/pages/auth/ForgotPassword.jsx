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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your email and we’ll send you a reset link
        </p>

        {sent ? (
          <p className="text-green-600 text-center font-medium">
            ✅ Reset link sent! Check your email.
          </p>
        ) : (
          <>
            <input
              type="email"
              className="border p-2 w-full mb-3 rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="bg-blue-600 text-white w-full py-2 rounded disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <div className="text-center mt-4">
          <Link to="/" className="text-blue-600 text-sm">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
