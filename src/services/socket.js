import { io } from "socket.io-client"

const socket = io("https://tutor-backend-vjpj.onrender.com", {
  autoConnect: false,
})

export default socket
