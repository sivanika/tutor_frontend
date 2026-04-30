import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── HELPER: UPDATE STATE & STORAGE ──
  const updateAuth = (userData) => {
    localStorage.setItem("userInfo", JSON.stringify({ user: userData }))
    setUser(userData)
  }

  // 🔥 LOAD USER ON REFRESH
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me")
        const userData = res.data.user
        updateAuth(userData)
        
        // 🔁 AUTO REDIRECT ON REFRESH (only if at root)
        if (window.location.pathname === "/") {
          const { role, profileCompleted, isVerified } = userData

          if (role === "admin") {
            navigate("/admin/dashboard", { replace: true })
          } else if (role === "professor") {
            if (!profileCompleted) navigate("/professor/onboarding", { replace: true })
            else if (!isVerified) navigate("/verification-pending", { replace: true })
            else navigate("/professor/dashboard", { replace: true })
          } else if (role === "student") {
            if (!profileCompleted) navigate("/student/onboarding", { replace: true })
            else navigate("/student/dashboard", { replace: true })
          }
        }
      } catch (err) {
        // Not authenticated, clear
        localStorage.removeItem("userInfo")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    // Execute immediately only if not fetched yet
    fetchUser()
  }, [])

  // ── LOGIN ──
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password })
    const { user: userData } = res.data
    updateAuth(userData)
    return userData
  }

  // ── REGISTER ──
  const register = async (name, email, password, role) => {
    const res = await API.post("/auth/register", { name, email, password, role })
    const { user: userData } = res.data
    updateAuth(userData)
    return userData
  }

  // ── GOOGLE LOGIN ──
  const googleLogin = async (idToken, role) => {
    const res = await API.post("/auth/google", { idToken, role })
    const { user: userData } = res.data
    updateAuth(userData)
    return userData
  }

  // ── LOGOUT ──
  const logout = async () => {
    try {
      await API.post("/auth/logout")
    } catch (err) {
      console.error("Logout error:", err)
    }
    localStorage.clear()
    setUser(null)
    navigate("/", { replace: true })
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, googleLogin, setUser }}>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--surface)] dark:bg-[var(--surface)] transition-colors duration-500">
          {/* Main Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-[var(--accent)] rounded-full animate-spin-reverse opacity-60"></div>
          </div>
          
          {/* Logo / Text */}
          <div className="mt-8 text-center animate-pulse">
            <h1 className="text-2xl font-black tracking-tight dark:text-white mb-1">TutorHours</h1>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Preparing your experience</p>
          </div>

          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--primary)]/10 blur-[80px] rounded-full pointer-events-none"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
