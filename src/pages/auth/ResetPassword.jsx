import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import API from "../../services/api"

function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { label: "Weak", percent: 25, color: "bg-red-500" }
  if (score === 2 || score === 3)
    return { label: "Medium", percent: 60, color: "bg-yellow-500" }
  return { label: "Strong", percent: 100, color: "bg-green-600" }
}

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [loading, setLoading] = useState(false)

  const strength = getPasswordStrength(password)
  const isMatch = password === confirmPassword

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await API.post(`/auth/reset-password/${token}`, {
        newPassword: password,
      })
      alert("Password reset successful")
      navigate("/")
    } catch {
      alert("Reset link expired or invalid")
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
          w-full max-w-md p-8 rounded-2xl space-y-4

          bg-white/90 dark:bg-slate-900/80
          backdrop-blur-2xl

          border border-slate-200 dark:border-slate-800
          shadow-xl dark:shadow-black/40

          animate-[popup_.5s_ease]
        "
      >
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
          Reset Password
        </h2>

        {/* Password */}
        <div className="relative mb-1">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            className="
              w-full p-3 rounded-lg pr-16
              bg-slate-50 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-slate-500
              transition
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowRules(true)}
            onBlur={() => setShowRules(false)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-10 top-3 text-slate-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>

          <span
            className="absolute right-3 top-3 cursor-pointer"
            onMouseEnter={() => setShowRules(true)}
            onMouseLeave={() => setShowRules(false)}
          >
            ℹ️
          </span>
        </div>

        {/* Rules */}
        {showRules && (
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 bg-slate-100 dark:bg-slate-800 p-2 rounded">
            <p>• At least 8 characters</p>
            <p>• One uppercase letter</p>
            <p>• One number</p>
            <p>• One special character</p>
          </div>
        )}

        {/* Strength bar */}
        {password && (
          <>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded mb-1">
              <div
                className={`h-2 rounded ${strength.color}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            <p className="text-sm mb-2 text-slate-700 dark:text-slate-300">
              Strength: <b>{strength.label}</b>
            </p>
          </>
        )}

        {/* Confirm */}
        <input
          type="password"
          placeholder="Confirm password"
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {!isMatch && confirmPassword && (
          <p className="text-red-500 text-sm">
            Passwords do not match
          </p>
        )}

        <button
          disabled={!isMatch || strength.label === "Weak" || loading}
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
          {loading ? "Resetting..." : "Reset Password"}
        </button>
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

export default ResetPassword
