import { io } from "socket.io-client"

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/api$/, "")

const socket = io(BASE_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  auth: (cb) => {
    try {
      const info = JSON.parse(localStorage.getItem("userInfo") || "{}")
      cb({ token: info?.token || "" })
    } catch {
      cb({ token: "" })
    }
  },
})

export default socket
