/**
 * ChatTab.jsx — Real-time chat with HTTP-based message send
 * (Light UI Theme based on user design)
 */

import { useEffect, useRef, useState, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import API from "../../services/api"
import socket from "../../services/socket"
import { FiPhone, FiSearch, FiSend, FiChevronLeft } from "react-icons/fi"

/* ─── helpers ──────────────────────────────────────────────── */
const uid = (user) => String(user?.id || user?._id || "")

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "")
const photoURL = (u) => { const p = u?.profilePhoto || u?.studentPhoto; return p ? `${BASE}${p}` : null }
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""
const fmtDay = (d) => {
  if (!d) return ""
  const date = new Date(d), now = new Date(), yest = new Date(now.setDate(now.getDate() - 1))
  if (date.toDateString() === new Date().toDateString()) return "Today"
  if (date.toDateString() === yest.toDateString()) return "Yesterday"
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
}

/* ─── Avatar ──────────────────────────────────────────────── */
function Av({ user, sz = 40, online }) {
  const url = photoURL(user)
  const isProf = user?.role === "professor"
  const bg = isProf ? "bg-purple-600" : "bg-[#10b981]" // Purple for prof, Green for student
  return (
    <div style={{ width: sz, height: sz }} className="relative flex-shrink-0">
      {url ? (
        <img src={url} alt="" className="w-full h-full rounded-full object-cover shadow-sm" />
      ) : (
        <div className={`w-full h-full rounded-full ${bg} flex items-center justify-center text-white font-semibold shadow-sm`} style={{ fontSize: sz * 0.4 }}>
          {((user?.name || user?.email || "?")[0]).toUpperCase()}
        </div>
      )}
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${online ? 'bg-green-500' : 'bg-gray-400'}`} />
      )}
    </div>
  )
}

/* ─── Message Bubble ──────────────────────────────────────── */
function Bubble({ msg, isMe }) {
  const isOpt = String(msg._id).startsWith("opt-")
  const read = (msg.readBy?.length || 0) > 1

  return (
    <div className={`flex items-end gap-2 mb-4 max-w-[85%] ${isMe ? 'ml-auto justify-end' : ''}`}>
      {!isMe && <Av user={msg.sender} sz={28} />}
      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && <span className="text-[11px] text-gray-500 font-medium ml-1 mb-1">{msg.sender?.name || "User"}</span>}
        <div 
          className={`px-4 py-2.5 text-sm shadow-sm
          ${isMe 
            ? 'bg-purple-600 text-white rounded-2xl rounded-br-sm' 
            : 'bg-[#f4f4f5] text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100'
          }`}
          style={{ wordBreak: "break-word", opacity: isOpt ? 0.7 : 1 }}
        >
          {msg.text}
        </div>
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-[10px] text-gray-400">{fmtTime(msg.createdAt)}</span>
          {isMe && (
            <svg width="14" height="10" viewBox="0 0 16 12" fill="none">
              {read
                ? <><path d="M1 6l4 4L13 1" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 6l4 4" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>
                : <path d="M1 6l4 4L13 1" stroke={isOpt ? "#d1d5db" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              }
            </svg>
          )}
        </div>
      </div>
      {isMe && <Av user={msg.sender} sz={28} />}
    </div>
  )
}

/* ─── Typing dots ─────────────────────────────────────────── */
function Typing({ user }) {
  return (
    <div className="flex items-end gap-2 mb-4 max-w-[80%]">
      {user && <Av user={user} sz={28} />}
      <div className="flex items-center gap-1 px-4 py-3 bg-[#f4f4f5] border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm w-fit">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

/* ─── Sidebar row ─────────────────────────────────────────── */
function Row({ conv, myId, active, online, onClick }) {
  const o = conv.participants?.find(p => String(p._id) !== myId) || {}
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 p-4 border-b border-gray-100 transition-colors text-left
        ${active ? 'bg-gray-50 border-l-4 border-l-purple-600' : 'bg-white hover:bg-gray-50 border-l-4 border-l-transparent'}
      `}
    >
      <Av user={o} sz={44} online={online} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-semibold text-gray-800 text-sm truncate">{o.name || "User"}</span>
          <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{fmtDay(conv.lastMessage?.createdAt)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
            {conv.lastMessage?.text || "Say hello 👋"}
          </span>
          {conv.unreadCount > 0 && (
            <span className="flex-shrink-0 ml-2 bg-purple-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
              {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

/* ══════════════════ MAIN ══════════════════ */
export default function ChatTab({ preOpenUserId = null }) {
  const { user } = useAuth()
  const me = uid(user)

  const [convs, setConvs]           = useState([])
  const [active, setActive]         = useState(null)
  const [msgs, setMsgs]             = useState([])
  const [text, setText]             = useState("")
  const [search, setSearch]         = useState("")
  const [isTyping, setIsTyping]     = useState(false)
  const [onlineSet, setOnlineSet]   = useState(new Set())
  const [loadConvs, setLoadConvs]   = useState(true)
  const [loadMsgs, setLoadMsgs]     = useState(false)
  const [sending, setSending]       = useState(false)
  const [mobileV, setMobileV]       = useState("list")

  const bottomRef   = useRef(null)
  const typingTimer = useRef(null)
  const activeRef   = useRef(null)
  activeRef.current = active

  const other        = active?.participants?.find(p => String(p._id) !== me)
  const otherOnline  = other && onlineSet.has(String(other._id))

  /* ─── load conversations list ─── */
  useEffect(() => {
    if (!me) return
    API.get("/conversations")
      .then(r => setConvs(r.data || []))
      .catch(() => {})
      .finally(() => setLoadConvs(false))
  }, [me])

  /* ─── open conversation ─── */
  const openConv = useCallback((conv) => {
    setActive(conv)
    setMsgs([])
    setIsTyping(false)
    setLoadMsgs(true)
    setMobileV("chat")

    API.get(`/conversations/${conv._id}/messages`)
      .then(r => {
        setMsgs(r.data || [])
        // mark read
        const otherUser = conv.participants?.find(p => String(p._id) !== me)
        socket.emit("markRead", { conversationId: conv._id, userId: me, senderId: otherUser?._id })
        API.put(`/conversations/${conv._id}/read`).catch(() => {})
        setConvs(prev => prev.map(c => c._id === conv._id ? { ...c, unreadCount: 0 } : c))
      })
      .catch(() => {})
      .finally(() => setLoadMsgs(false))
  }, [me])

  /* ─── pre-open from external "Chat" button ─── */
  useEffect(() => {
    if (!preOpenUserId || !me) return
    API.post("/conversations", { otherUserId: preOpenUserId })
      .then(r => {
        if (!r.data?._id) return
        setConvs(prev => prev.find(c => c._id === r.data._id) ? prev : [{ ...r.data, unreadCount: 0 }, ...prev])
        openConv(r.data)
      })
      .catch(() => {})
  }, [preOpenUserId, me, openConv])

  /* ─── socket listeners ─── */
  useEffect(() => {
    if (!me) return

    const registerRoom = () => {
      socket.emit("joinUser", { userId: me })
    }

    if (!socket.connected) socket.connect()
    if (socket.connected) registerRoom()
    socket.on("connect", registerRoom)

    const onNewMessage = (msg) => {
      const convId  = String(msg.conversationId || msg.conversation)
      const sender  = String(msg.sender?._id || msg.sender)
      const cur     = activeRef.current

      if (cur && String(cur._id) === convId) {
        setMsgs(prev => {
          if (msg._id && prev.some(m => String(m._id) === String(msg._id))) return prev
          const optIdx = prev.findIndex(m =>
            String(m._id).startsWith("opt-") && m.text === msg.text &&
            String(m.sender?._id || m.sender) === sender
          )
          if (optIdx !== -1) { const n = [...prev]; n[optIdx] = msg; return n }
          return [...prev, msg]
        })

        if (sender !== me) {
          socket.emit("markRead", { conversationId: convId, userId: me, senderId: sender })
          API.put(`/conversations/${convId}/read`).catch(() => {})
        }

        setConvs(prev => prev.map(c => String(c._id) === convId
          ? { ...c, unreadCount: 0, lastMessage: { text: msg.text, createdAt: msg.createdAt } }
          : c
        ))
      } else {
        if (sender !== me) {
          setConvs(prev => prev.map(c => String(c._id) === convId
            ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: { text: msg.text, createdAt: msg.createdAt } }
            : c
          ))
        }
      }
    }

    const onTyping     = ({ conversationId }) => { if (String(conversationId) === String(activeRef.current?._id)) setIsTyping(true) }
    const onStopTyping = ({ conversationId }) => { if (String(conversationId) === String(activeRef.current?._id)) setIsTyping(false) }
    const onRead       = () => setMsgs(prev => prev.map(m => String(m.sender?._id || m.sender) === me ? { ...m, readBy: [...(m.readBy || []), "__read__"] } : m))
    const onOnline     = ({ userId }) => setOnlineSet(s => new Set([...s, String(userId)]))
    const onOffline    = ({ userId }) => setOnlineSet(s => { const n = new Set(s); n.delete(String(userId)); return n })

    socket.on("newMessage",   onNewMessage)
    socket.on("typing",       onTyping)
    socket.on("stopTyping",   onStopTyping)
    socket.on("messagesRead", onRead)
    socket.on("userOnline",   onOnline)
    socket.on("userOffline",  onOffline)
    return () => {
      socket.off("connect",      registerRoom)
      socket.off("newMessage",   onNewMessage)
      socket.off("typing",       onTyping)
      socket.off("stopTyping",   onStopTyping)
      socket.off("messagesRead", onRead)
      socket.off("userOnline",   onOnline)
      socket.off("userOffline",  onOffline)
    }
  }, [me])

  /* ─── auto-scroll ─── */
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs, isTyping])

  /* ─── send via HTTP POST ─── */
  const send = async () => {
    const t = text.trim()
    if (!t || !active || !me || sending) return
    setText("")
    setSending(true)
    clearTimeout(typingTimer.current)
    socket.emit("stopTyping", { conversationId: active._id, receiverId: other?._id })

    const myAvatarUser = { _id: me, name: user?.name, role: user?.role, profilePhoto: user?.profilePhoto, studentPhoto: user?.studentPhoto, email: user?.email };

    const opt = {
      _id: `opt-${Date.now()}`,
      conversation: active._id,
      conversationId: String(active._id),
      sender: myAvatarUser,
      text: t,
      readBy: [me],
      createdAt: new Date().toISOString(),
    }
    setMsgs(prev => [...prev, opt])

    try {
      await API.post(`/conversations/${active._id}/messages`, { text: t })
    } catch (e) {
      setMsgs(prev => prev.filter(m => m._id !== opt._id))
      console.error("send error:", e)
    } finally {
      setSending(false)
    }
  }

  const handleInput = (val) => {
    setText(val)
    if (!active || !other) return
    socket.emit("typing", { conversationId: active._id, receiverId: other._id })
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(
      () => socket.emit("stopTyping", { conversationId: active._id, receiverId: other._id }),
      1500
    )
  }

  const filtered = convs.filter(c => {
    if (!search) return true
    return c.participants?.find(p => String(p._id) !== me)?.name?.toLowerCase().includes(search.toLowerCase())
  })

  /* Group messages by day */
  const grouped = []
  let lastDay = null
  for (const msg of msgs) {
    const day = new Date(msg.createdAt || Date.now()).toDateString()
    if (day !== lastDay) { grouped.push({ sep: true, key: day, label: fmtDay(msg.createdAt) }); lastDay = day }
    grouped.push({ sep: false, key: msg._id, msg })
  }

  /* ─── RENDER ─── */
  return (
    <>
      <style>{`
        @media(min-width:768px){ .mob-list{display:flex!important} .mob-chat{display:flex!important} }
      `}</style>

      <div className="flex h-[calc(100vh-130px)] min-h-[500px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
        
        {/* ══ SIDEBAR ══ */}
        <div className="mob-list flex-col w-[320px] flex-shrink-0 border-r border-gray-200 bg-white" style={{ display: mobileV === "chat" ? "none" : "flex" }}>
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={search} onChange={e => setSearch(e.target.value)} 
                type="text" placeholder="Search conversations..." 
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-shadow" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-white">
            {loadConvs
              ? <div className="flex justify-center p-10"><div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /></div>
              : filtered.length === 0
                ? <p className="text-center text-gray-400 text-sm p-10">No conversations</p>
                : filtered.map(conv => {
                    const o = conv.participants?.find(p => String(p._id) !== me)
                    return <Row key={conv._id} conv={conv} myId={me} active={String(active?._id) === String(conv._id)} online={o && onlineSet.has(String(o._id))} onClick={() => openConv(conv)} />
                  })
            }
          </div>
        </div>

        {/* ══ CHAT PANEL ══ */}
        <div className="mob-chat flex-col flex-1 min-w-0 bg-white" style={{ display: mobileV === "list" ? "none" : "flex" }}>
          {!active
            ? <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 text-center p-6 bg-gray-50/50">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl">💬</div>
                <div>
                  <p className="font-bold text-lg text-gray-700 m-0">Select a conversation</p>
                  <p className="text-sm text-gray-500 mt-1">Choose someone from the left to start chatting.</p>
                </div>
              </div>
            : <>
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setMobileV("list")} className="md:hidden p-1 text-gray-500 hover:text-gray-700">
                      <FiChevronLeft size={24} />
                    </button>
                    <Av user={other} sz={44} online={otherOnline} />
                    <div>
                      <h2 className="font-bold text-gray-800 text-base">{other?.name || "User"}</h2>
                      <p className="text-xs text-gray-500">
                        {other?.role === "professor" ? "Professor" : (other?.major ? `${other.major} - Enrolled` : "Student")}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition">
                    <FiPhone size={18} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                  {loadMsgs
                    ? <div className="flex justify-center pt-10"><div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /></div>
                    : msgs.length === 0
                      ? <div className="text-center pt-16 text-gray-400"><div className="text-4xl mb-3">👋</div><p className="font-medium text-sm">Start the conversation!</p></div>
                      : grouped.map(item =>
                          item.sep
                            ? <div key={item.key} className="flex items-center gap-3 my-6">
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="text-xs font-medium text-gray-400">{item.label}</span>
                                <div className="flex-1 h-px bg-gray-100" />
                              </div>
                            : <Bubble key={item.key} msg={item.msg} isMe={String(item.msg.sender?._id || item.msg.sender) === me} />
                        )
                  }
                  {isTyping && <Typing user={other} />}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
                  <div className="flex items-center gap-3 max-w-4xl mx-auto">
                    <input
                      value={text}
                      onChange={e => handleInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                    />
                    <button 
                      onClick={send} 
                      disabled={!text.trim() || sending} 
                      className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                        ${text.trim() && !sending ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                      `}
                    >
                      <FiSend size={18} className={text.trim() && !sending ? 'ml-1' : ''} />
                    </button>
                  </div>
                </div>
              </>
          }
        </div>
      </div>
    </>
  )
}
