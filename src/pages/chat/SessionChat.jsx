import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import socket from "../../services/socket"

export default function SessionChat() {
  const { sessionId } = useParams()
  const { user } = useAuth()
  const me = String(user?.id || user?._id || "")

  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => {
    socket.connect()
    socket.emit("joinSession", { sessionId })         // ✅ fixed: was "join-session"

    const handler = (msg) => {
      console.log("📩 CLIENT RECEIVED:", msg)
      setMessages((prev) => [...prev, msg])
    }

    socket.on("newMessage", handler)                  // ✅ fixed: was "receive-message"
    return () => socket.off("newMessage", handler)
  }, [sessionId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = () => {
    if (!text.trim()) return
    socket.emit("sendMessage", {                      // ✅ fixed: was "send-message"
      sessionId,
      userId: me,                                     // ✅ fixed: was sender: "user"
      text,
    })
    setText("")
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 font-semibold text-lg">
        Session Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No messages yet 👋</p>
        )}

        {messages.map((m, i) => {
          const isMe = String(m.sender?._id || m.sender) === me   // ✅ fixed: compares real IDs

          return (
            <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {!isMe && (
                <p className="text-xs text-gray-500 mb-1 ml-1">
                  {m.sender?.name || "User"}
                </p>
              )}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow
                  ${isMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                  }`}
              >
                <p>{m.text}</p>
                <p className="text-[10px] opacity-70 text-right mt-1">
                  {m.createdAt
                    ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : ""}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}
