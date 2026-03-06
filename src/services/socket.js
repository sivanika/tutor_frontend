import { io } from "socket.io-client"

const socket = io("https://tutor-backend-mqz1.onrender.com", {
  autoConnect: false,
})

export default socket
