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
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
