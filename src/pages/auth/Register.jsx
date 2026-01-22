import { useState } from "react"
import { Link } from "react-router-dom"
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

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("student")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showRules, setShowRules] = useState(false)

  const strength = getPasswordStrength(password)
  const isMatch = password === confirmPassword

  const submit = async (e) => {
    e.preventDefault()
    if (!isMatch) return alert("Passwords do not match")

    try {
      await API.post("/auth/register", {
        name,
        email,
        role,
        password,
      })
      alert("Registered successfully")
      navigate("/")
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register
        </h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          className="border p-2 w-full mb-3 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="professor">Professor</option>
        </select>

        {/* Password */}
        <div className="relative mb-1">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border p-2 w-full rounded pr-16"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowRules(true)}
            onBlur={() => setShowRules(false)}
            required
          />

          {/* Eye */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-8 top-2.5"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>

          {/* Info */}
          <span
            className="absolute right-2 top-2.5 cursor-pointer"
            onMouseEnter={() => setShowRules(true)}
            onMouseLeave={() => setShowRules(false)}
          >
            ℹ️
          </span>
        </div>

        {/* Password rules tooltip */}
        {showRules && (
          <div className="text-xs text-gray-600 mb-2 bg-gray-100 p-2 rounded">
            <p>• At least 8 characters</p>
            <p>• One uppercase letter</p>
            <p>• One number</p>
            <p>• One special character</p>
          </div>
        )}

        {/* Strength bar */}
        {password && (
          <>
            <div className="w-full h-2 bg-gray-200 rounded mb-1">
              <div
                className={`h-2 rounded ${strength.color}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            <p className="text-sm mb-2">
              Strength: <b>{strength.label}</b>
            </p>
          </>
        )}

        {/* Confirm password */}
        <input
          type="password"
          placeholder="Confirm password"
          className="border p-2 w-full mb-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {!isMatch && confirmPassword && (
          <p className="text-red-500 text-sm mb-2">
            Passwords do not match
          </p>
        )}

        <button
          disabled={!isMatch || strength.label === "Weak"}
          className="bg-green-600 text-white w-full py-2 rounded disabled:opacity-60"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register
