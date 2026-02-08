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
    const storedUser = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")

    if (storedUser && token) {
      setUser(storedUser)

      // 🔁 AUTO REDIRECT ON REFRESH
      if (window.location.pathname === "/") {
        if (storedUser.role === "admin") {
          navigate("/admin/dashboard", { replace: true })
        } else if (storedUser.role === "professor") {
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

    const userData = res.data.user
    const token = res.data.token

    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", token)

    setUser(userData)
    return userData
  }

  // LOGOUT
  const logout = () => {
    localStorage.clear()
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
