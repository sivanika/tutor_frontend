/**
 * ChatTab.jsx — Real-time chat with HTTP-based message send
 *
 * Architecture:
 *   SEND: POST /api/conversations/:id/messages (REST)
 *     → server saves to DB
 *     → server pushes io.to(userId).emit("newMessage") to ALL participants' personal rooms
 *   RECEIVE: socket.on("newMessage") — fires instantly on both sender & receiver
 *
 * Personal rooms (userId) are established at login via joinUser and
 * persist for the entire session — robust, no dependency on which tab is open.
 */

import { useEffect, useRef, useState, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import API from "../../services/api"
import socket from "../../services/socket"

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
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {url
        ? <img src={url} alt="" style={{ width: sz, height: sz, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,.15)" }} />
        : <div style={{ width: sz, height: sz, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: sz * .38 }}>
            {(user?.name || "?")[0].toUpperCase()}
          </div>
      }
      {online !== undefined &&
        <span style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: online ? "#22c55e" : "#6b7280", border: "2px solid #1a0533" }} />
      }
    </div>
  )
}

/* ─── Message Bubble ──────────────────────────────────────── */
function Bubble({ msg, isMe }) {
  const isOpt = String(msg._id).startsWith("opt-")
  const read = (msg.readBy?.length || 0) > 1
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", marginBottom: 10 }}>
      {!isMe && <span style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600, marginLeft: 4, marginBottom: 3 }}>{msg.sender?.name || "User"}</span>}
      <div style={{
        maxWidth: "68%", padding: "9px 14px", fontSize: 14, lineHeight: 1.5, wordBreak: "break-word",
        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isMe ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#fff",
        color: isMe ? "#fff" : "#111827",
        border: isMe ? "none" : "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,.1)",
        opacity: isOpt ? .6 : 1,
      }}>
        {msg.text}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2, paddingInline: 2 }}>
        <span style={{ fontSize: 10, color: "#9ca3af" }}>{fmtTime(msg.createdAt)}</span>
        {isMe && (
          <svg width="14" height="10" viewBox="0 0 16 12" fill="none">
            {read
              ? <><path d="M1 6l4 4L13 1" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 6l4 4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>
              : <path d="M1 6l4 4L13 1" stroke={isOpt ? "#d1d5db" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            }
          </svg>
        )}
      </div>
    </div>
  )
}

/* ─── Typing dots ─────────────────────────────────────────── */
function Typing() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "9px 14px", background: "#fff", borderRadius: "18px 18px 18px 4px", width: "fit-content", boxShadow: "0 1px 3px rgba(0,0,0,.1)", border: "1px solid #e5e7eb", marginBottom: 10 }}>
      {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#9ca3af", display: "inline-block", animation: "tdot 1.2s infinite", animationDelay: `${i * .2}s` }} />)}
    </div>
  )
}

/* ─── Sidebar row ─────────────────────────────────────────── */
function Row({ conv, myId, active, online, onClick }) {
  const o = conv.participants?.find(p => String(p._id) !== myId) || {}
  return (
    <button onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", border: "none", cursor: "pointer", background: active ? "rgba(124,58,237,.18)" : "transparent", borderLeft: `3px solid ${active ? "#7c3aed" : "transparent"}`, textAlign: "left" }}>
      <Av user={o} sz={42} online={online} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.name || "User"}</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)", flexShrink: 0, marginLeft: 6 }}>{fmtDay(conv.lastMessage?.createdAt)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
          <span style={{ fontSize: 12, color: conv.unreadCount > 0 ? "rgba(255,255,255,.75)" : "rgba(255,255,255,.38)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: conv.unreadCount > 0 ? 600 : 400 }}>
            {conv.lastMessage?.text || "Say hello 👋"}
          </span>
          {conv.unreadCount > 0 &&
            <span style={{ flexShrink: 0, marginLeft: 6, background: "#7c3aed", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
              {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
            </span>
          }
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

    /* ── Ensure personal room is registered on EVERY connection/reconnection ─ */
    const registerRoom = () => {
      socket.emit("joinUser", { userId: me })
      console.log("🔑 joinUser emitted for", me)
    }

    // Connect if not already (dashboard may or may not have done this)
    if (!socket.connected) socket.connect()
    // Register immediately if already connected
    if (socket.connected) registerRoom()
    // Also register on every future connect/reconnect
    socket.on("connect", registerRoom)

    const onNewMessage = (msg) => {
      const convId  = String(msg.conversationId || msg.conversation)
      const sender  = String(msg.sender?._id || msg.sender)
      const cur     = activeRef.current

      if (cur && String(cur._id) === convId) {
        /* replace optimistic or append */
        setMsgs(prev => {
          if (msg._id && prev.some(m => String(m._id) === String(msg._id))) return prev
          const optIdx = prev.findIndex(m =>
            String(m._id).startsWith("opt-") && m.text === msg.text &&
            String(m.sender?._id || m.sender) === sender
          )
          if (optIdx !== -1) { const n = [...prev]; n[optIdx] = msg; return n }
          return [...prev, msg]
        })

        /* mark read for received messages */
        if (sender !== me) {
          socket.emit("markRead", { conversationId: convId, userId: me, senderId: sender })
          API.put(`/conversations/${convId}/read`).catch(() => {})
        }

        setConvs(prev => prev.map(c => String(c._id) === convId
          ? { ...c, unreadCount: 0, lastMessage: { text: msg.text, createdAt: msg.createdAt } }
          : c
        ))
      } else {
        /* not viewing this conv → bump unread badge */
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

    /* optimistic message */
    const opt = {
      _id: `opt-${Date.now()}`,
      conversation: active._id,
      conversationId: String(active._id),
      sender: { _id: me, name: user?.name, role: user?.role },
      text: t,
      readBy: [me],
      createdAt: new Date().toISOString(),
    }
    setMsgs(prev => [...prev, opt])

    try {
      /* server saves to DB and pushes socket to all participants */
      await API.post(`/conversations/${active._id}/messages`, { text: t })
    } catch (e) {
      /* rollback optimistic on error */
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
        @keyframes tdot { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes spin  { to { transform:rotate(360deg) } }
        .ci:focus { outline:none; box-shadow: 0 0 0 2px rgba(124,58,237,.4); }
        @media(min-width:768px){ .mob-list{display:flex!important} .mob-chat{display:flex!important} }
      `}</style>

      <div style={{ display: "flex", height: "calc(100vh - 130px)", minHeight: 500, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,.25)", border: "1px solid rgba(255,255,255,.08)" }}>

        {/* ══ SIDEBAR ══ */}
        <div className="mob-list" style={{ display: mobileV === "chat" ? "none" : "flex", flexDirection: "column", width: 290, flexShrink: 0, background: "linear-gradient(160deg,#1a0533,#0e1b3e)", borderRight: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ padding: "16px 14px 10px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: "0 0 10px" }}>💬 Messages</p>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="ci"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", fontSize: 13, boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loadConvs
              ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 26, height: 26, border: "3px solid #7c3aed", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} /></div>
              : filtered.length === 0
                ? <p style={{ textAlign: "center", color: "rgba(255,255,255,.3)", fontSize: 13, padding: 40 }}>No conversations</p>
                : filtered.map(conv => {
                    const o = conv.participants?.find(p => String(p._id) !== me)
                    return <Row key={conv._id} conv={conv} myId={me} active={String(active?._id) === String(conv._id)} online={o && onlineSet.has(String(o._id))} onClick={() => openConv(conv)} />
                  })
            }
          </div>
        </div>

        {/* ══ CHAT PANEL ══ */}
        <div className="mob-chat" style={{ display: mobileV === "list" ? "none" : "flex", flex: 1, flexDirection: "column", background: "#f6f6f8", minWidth: 0 }}>
          {!active
            ? <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#9ca3af", textAlign: "center", padding: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>💬</div>
                <div><p style={{ fontWeight: 700, fontSize: 17, color: "#374151", margin: 0 }}>Select a conversation</p><p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>Choose someone from the left</p></div>
              </div>
            : <>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", background: "#fff", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,.05)", flexShrink: 0 }}>
                  <button onClick={() => setMobileV("list")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280", padding: "0 4px 0 0" }}>←</button>
                  <Av user={other} sz={40} online={otherOnline} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>{other?.name || "User"}</p>
                    <p style={{ margin: 0, fontSize: 11, color: isTyping ? "#7c3aed" : otherOnline ? "#22c55e" : "#9ca3af", fontWeight: isTyping ? 600 : 400 }}>
                      {isTyping ? "typing…" : otherOnline ? "Online" : (other?.role === "professor" ? "Professor" : "Student")}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#f6f6f8" }}>
                  {loadMsgs
                    ? <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}><div style={{ width: 26, height: 26, border: "3px solid #7c3aed", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} /></div>
                    : msgs.length === 0
                      ? <div style={{ textAlign: "center", paddingTop: 60, color: "#9ca3af" }}><div style={{ fontSize: 36, marginBottom: 8 }}>👋</div><p style={{ fontWeight: 500, fontSize: 14 }}>Start the conversation!</p></div>
                      : grouped.map(item =>
                          item.sep
                            ? <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0" }}>
                                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                                <span style={{ fontSize: 11, color: "#9ca3af", background: "#f6f6f8", padding: "2px 10px", borderRadius: 20, border: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>{item.label}</span>
                                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                              </div>
                            : <Bubble key={item.key} msg={item.msg} isMe={String(item.msg.sender?._id || item.msg.sender) === me} />
                        )
                  }
                  {isTyping && <Typing />}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{ padding: "11px 14px", background: "#fff", borderTop: "1px solid #e5e7eb", flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input
                      value={text}
                      onChange={e => handleInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
                      placeholder={`Message ${other?.name || ""}…`}
                      className="ci"
                      style={{ flex: 1, padding: "10px 16px", borderRadius: 24, background: "#f3f4f6", border: "1.5px solid #e5e7eb", fontSize: 14, color: "#111827", transition: "border .2s, box-shadow .2s" }}
                    />
                    <button onClick={send} disabled={!text.trim() || sending} style={{ width: 42, height: 42, borderRadius: "50%", border: "none", cursor: text.trim() && !sending ? "pointer" : "not-allowed", background: text.trim() ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#e5e7eb", color: text.trim() ? "#fff" : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 17, transition: "all .2s" }}>
                      ➤
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
