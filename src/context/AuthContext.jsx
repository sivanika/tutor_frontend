import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── HELPER: UPDATE STATE & STORAGE ──
  const updateAuth = (userData, token) => {
    localStorage.setItem("userInfo", JSON.stringify({ user: userData, token }))
    localStorage.setItem("token", token) // Backup for direct API calls if needed
    setUser(userData)
  }

  // 🔥 LOAD USER ON REFRESH
  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (storedUserInfo?.user && storedUserInfo?.token) {
      setUser(storedUserInfo.user)

      // 🔁 AUTO REDIRECT ON REFRESH (only if at root)
      if (window.location.pathname === "/") {
        const { role, profileCompleted, isVerified } = storedUserInfo.user

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
    }
    setLoading(false)
  }, [])

  // ── LOGIN ──
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password })
    const { user: userData, token } = res.data
    updateAuth(userData, token)
    return userData
  }

  // ── REGISTER ──
  const register = async (name, email, password, role) => {
    const res = await API.post("/auth/register", { name, email, password, role })
    const { user: userData, token } = res.data
    updateAuth(userData, token)
    return userData
  }

  // ── LOGOUT ──
  const logout = () => {
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
