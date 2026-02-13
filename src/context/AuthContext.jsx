import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔥 LOAD USER ON REFRESH
  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"))

    // Check if we have valid user info with token
    if (storedUserInfo && storedUserInfo.user && storedUserInfo.token) {
      setUser(storedUserInfo.user)

      // 🔁 AUTO REDIRECT ON REFRESH
      // Only redirect if we are at root
      if (window.location.pathname === "/") {
        if (storedUserInfo.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true })
        } else if (storedUserInfo.user.role === "professor") {
          navigate("/professor/dashboard", { replace: true })
        } else {
          navigate("/student/dashboard", { replace: true })
        }
      }
    }

    setLoading(false)
  }, [])

  // LOGIN
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password })

    const { user: userData, token } = res.data

    localStorage.setItem("userInfo", JSON.stringify({ user: userData, token }))

    // Also set token separately if other parts of app expect it (just in case)
    localStorage.setItem("token", token)

    setUser(userData)
    return userData
  }

  // LOGOUT
  const logout = () => {
    localStorage.clear() // This clears everything, which is safe.
    setUser(null)
    navigate("/", { replace: true })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
