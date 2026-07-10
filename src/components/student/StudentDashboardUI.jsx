import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  FiGrid, FiSearch, FiBook, FiTrendingUp, FiLogOut, FiMenu, FiX,
  FiChevronRight, FiBell, FiMessageSquare, FiBookOpen, FiVideo,
  FiSettings, FiMoon, FiSun, FiUser, FiChevronLeft, FiZap,
  FiAward, FiCalendar, FiStar, FiClipboard, FiCreditCard, FiDownload
} from "react-icons/fi"
import ChatTab from "../../components/chat/ChatTab"
import socket from "../../services/socket"
import NotificationBell from "../../components/common/NotificationBell"

import DashboardTab from "./tabs/DashboardTab"
import SessionsTab from "./tabs/SessionsTab"
import ProgressTab from "./tabs/ProgressTab"
import TutorsTab from "./tabs/TutorsTab"
import MySubjectsTab from "./tabs/MySubjectsTab"
import CoursesTab from "./tabs/CoursesTab"
import CertificatesTab from "./tabs/CertificatesTab"
import AssignmentsTab from "./tabs/AssignmentsTab"
import QuizzesTab from "./tabs/QuizzesTab"
import CalendarTab from "./tabs/CalendarTab"
import PaymentsTab from "./tabs/PaymentsTab"
import DownloadsTab from "./tabs/DownloadsTab"

/* ── Constants ── */
const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",       icon: FiGrid,          badge: null, group: "main" },
  { id: "courses",      label: "My Courses",      icon: FiVideo,         badge: null, group: "main" },
  { id: "certificates", label: "Certificates",    icon: FiAward,         badge: null, group: "main" },
  { id: "assignments",  label: "Assignments",     icon: FiClipboard,     badge: null, group: "main" },
  { id: "quizzes",      label: "Quizzes",         icon: FiZap,           badge: null, group: "main" },
  { id: "tutors",       label: "Browse Tutors",   icon: FiSearch,        badge: null, group: "learning" },
  { id: "sessions",     label: "My Sessions",     icon: FiCalendar,      badge: null, group: "learning" },
  { id: "subjects",     label: "My Subjects",     icon: FiBookOpen,      badge: null, group: "learning" },
  { id: "messages",     label: "Messages",        icon: FiMessageSquare, badge: "dynamic", group: "learning" },
  { id: "progress",     label: "My Progress",     icon: FiTrendingUp,    badge: null, group: "learning" },
  { id: "calendar",     label: "Calendar",        icon: FiCalendar,      badge: null, group: "tools" },
  { id: "payments",     label: "Payment History", icon: FiCreditCard,    badge: null, group: "tools" },
  { id: "downloads",    label: "Downloads",       icon: FiDownload,      badge: null, group: "tools" },
]

const GREETING = () => {
  const h = new Date().getHours()
  if (h < 12) return "Good Morning"
  if (h < 17) return "Good Afternoon"
  return "Good Evening"
}

export default function StudentDashboardUI() {
  const [activeTab, setActiveTab]     = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed]     = useState(false)
  const [chatUnread, setChatUnread]   = useState(0)
  const [darkMode, setDarkMode]       = useState(() =>
    document.documentElement.classList.contains("dark")
  )
  const [searchOpen, setSearchOpen]   = useState(false)
  const [searchVal, setSearchVal]     = useState("")
  const [profileOpen, setProfileOpen] = useState(false)

  const activeTabRef    = useRef("dashboard")
  const profileRef      = useRef(null)
  const navigate        = useNavigate()
  const { user, logout } = useAuth()

  /* ── Dark mode toggle ── */
  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle("dark", next)
  }

  /* ── Close profile dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* ── Socket ── */
  useEffect(() => {
    if (!user) return
    const userId = user.id || user._id
    if (!userId) return

    const onConnect = () => socket.emit("joinUser", { userId })
    socket.on("connect", onConnect)
    if (socket.connected) socket.emit("joinUser", { userId })
    else socket.connect()

    const onNewMsg = (msg) => {
      if (activeTabRef.current !== "messages") {
        setChatUnread((n) => n + 1)
        toast.success(`New message from ${msg.sender?.name || "Professor"}`, {
          icon: "💬", duration: 4000,
        })
      }
    }
    socket.on("newMessage", onNewMsg)

    return () => {
      socket.off("connect", onConnect)
      socket.off("newMessage", onNewMsg)
    }
  }, [user])

  const handleTabChange = (id) => {
    activeTabRef.current = id
    setActiveTab(id)
    if (id === "messages") setChatUnread(0)
    setSidebarOpen(false)
  }

  const handleLogout = async () => await logout()

  const nameDisplay = user?.name || user?.email?.split("@")[0] || "Student"
  const initials    = nameDisplay.slice(0, 2).toUpperCase()
  const currentTab  = NAV_ITEMS.find(t => t.id === activeTab)

  return (
    <div className={`flex h-screen overflow-hidden font-[Inter,sans-serif] ${darkMode ? "dark" : ""}`}
      style={{ background: "var(--bg)" }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 modal-overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════ */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 flex flex-col sidebar-grad
          text-white shadow-2xl transition-all duration-300 ease-in-out shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "w-[72px]" : "w-[260px]"}
        `}
      >
        {/* ── Brand ── */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
          <div className="relative shrink-0">
            <img
              src="/logos/vishidh-emblem-192x192.webp"
              alt="VishidhAcademy"
              className="w-10 h-10 rounded-xl object-contain shadow-lg"
              onError={e => { e.target.style.display="none" }}
            />
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg absolute inset-0">
              V
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-slideInLeft">
              <p className="font-black text-sm tracking-wide truncate">VishidhAcademy</p>
              <p className="text-[11px] text-white/60 mt-0.5">Student Portal</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="hidden lg:flex ml-auto w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 items-center justify-center transition shrink-0"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <FiChevronRight size={14}/> : <FiChevronLeft size={14}/>}
          </button>
          <button
            className="lg:hidden text-white/60 hover:text-white ml-auto"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={20}/>
          </button>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-hide space-y-0.5">
          {/* GROUP: Main LMS */}
          {!collapsed && (
            <p className="px-3 mb-1 text-[9px] font-black uppercase tracking-widest text-white/30">
              Learning
            </p>
          )}
          {NAV_ITEMS.filter(n => n.group === "main").map(({ id, label, icon: Icon, badge }) => {
            const active   = activeTab === id
            const msgBadge = badge === "dynamic" && chatUnread > 0 && !active
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                title={collapsed ? label : ""}
                className={`
                  w-full flex items-center gap-3 rounded-xl text-sm font-medium
                  transition-all duration-200 relative group
                  ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                  ${active
                    ? "bg-white/15 text-white shadow-inner"
                    : "text-white/65 hover:bg-white/10 hover:text-white"}
                `}
              >
                {active && <span className="nav-active-dot"/>}
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${active ? "bg-white/20 shadow-sm" : "bg-transparent group-hover:bg-white/10"}`}>
                  <Icon size={18} className={active ? "text-white" : "text-white/70 group-hover:text-white"}/>
                </span>
                {!collapsed && <span className="flex-1 text-left truncate">{label}</span>}
                {!collapsed && msgBadge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 animate-pulse">
                    {chatUnread > 9 ? "9+" : chatUnread}
                  </span>
                )}
              </button>
            )
          })}

          {/* GROUP: Tutoring */}
          {!collapsed && (
            <p className="px-3 mt-4 mb-1 text-[9px] font-black uppercase tracking-widest text-white/30">
              Tutoring
            </p>
          )}
          {collapsed && <div className="mx-auto w-6 border-t border-white/10 my-2"/>}
          {NAV_ITEMS.filter(n => n.group === "learning").map(({ id, label, icon: Icon, badge }) => {
            const active   = activeTab === id
            const msgBadge = badge === "dynamic" && chatUnread > 0 && !active
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                title={collapsed ? label : ""}
                className={`
                  w-full flex items-center gap-3 rounded-xl text-sm font-medium
                  transition-all duration-200 relative group
                  ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                  ${active
                    ? "bg-white/15 text-white shadow-inner"
                    : "text-white/65 hover:bg-white/10 hover:text-white"}
                `}
              >
                {active && <span className="nav-active-dot"/>}
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${active ? "bg-white/20 shadow-sm" : "bg-transparent group-hover:bg-white/10"}`}>
                  <Icon size={18} className={active ? "text-white" : "text-white/70 group-hover:text-white"}/>
                </span>
                {!collapsed && <span className="flex-1 text-left truncate">{label}</span>}
                {!collapsed && msgBadge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 animate-pulse">
                    {chatUnread > 9 ? "9+" : chatUnread}
                  </span>
                )}
                {collapsed && msgBadge && (
                  <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#1e3a8a]"/>
                )}
              </button>
            )
          })}

          {/* GROUP: Tools */}
          {!collapsed && (
            <p className="px-3 mt-4 mb-1 text-[9px] font-black uppercase tracking-widest text-white/30">
              Tools
            </p>
          )}
          {collapsed && <div className="mx-auto w-6 border-t border-white/10 my-2"/>}
          {NAV_ITEMS.filter(n => n.group === "tools").map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                title={collapsed ? label : ""}
                className={`
                  w-full flex items-center gap-3 rounded-xl text-sm font-medium
                  transition-all duration-200 relative group
                  ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                  ${active
                    ? "bg-white/15 text-white shadow-inner"
                    : "text-white/65 hover:bg-white/10 hover:text-white"}
                `}
              >
                {active && <span className="nav-active-dot"/>}
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${active ? "bg-white/20 shadow-sm" : "bg-transparent group-hover:bg-white/10"}`}>
                  <Icon size={18} className={active ? "text-white" : "text-white/70 group-hover:text-white"}/>
                </span>
                {!collapsed && <span className="flex-1 text-left truncate">{label}</span>}
              </button>
            )
          })}
        </nav>

        {/* ── Divider ── */}
        <div className="mx-4 border-t border-white/10"/>

        {/* ── Profile Card ── */}
        <div className={`p-3 ${collapsed ? "flex flex-col items-center gap-3 py-4" : ""}`}>
          {!collapsed ? (
            <div className="bg-white/10 rounded-2xl p-3 space-y-3">
              {/* Avatar + info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-black text-sm shadow-lg shrink-0">
                    {initials}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#312E81]"/>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">{nameDisplay}</p>
                  <p className="text-[11px] text-white/60 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-white/10 rounded-lg py-1.5">
                  <div className="text-sm font-black">🔥 12</div>
                  <div className="text-[9px] text-white/60 mt-0.5">Streak</div>
                </div>
                <div className="bg-white/10 rounded-lg py-1.5">
                  <div className="text-sm font-black">⭐ 5</div>
                  <div className="text-[9px] text-white/60 mt-0.5">Certs</div>
                </div>
                <div className="bg-white/10 rounded-lg py-1.5">
                  <div className="text-sm font-black">🏆 8</div>
                  <div className="text-[9px] text-white/60 mt-0.5">Courses</div>
                </div>
              </div>

              {/* Membership badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-gradient-to-r from-yellow-400/30 to-orange-400/30 text-yellow-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <FiZap size={9}/> Premium Member
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-[11px] text-red-300 hover:text-red-200 transition font-medium"
                >
                  <FiLogOut size={12}/> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-black text-sm shadow-lg">
                {initials}
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center transition"
                title="Logout"
              >
                <FiLogOut size={16} className="text-red-300"/>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── STICKY NAVBAR ── */}
        <header
          className="shrink-0 sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 h-16 border-b"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border-soft)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-[var(--surface-alt)] transition"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={20} style={{ color: "var(--text-muted)" }}/>
          </button>

          {/* Page title */}
          <div className="hidden md:block">
            <h1 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              {currentTab?.label}
            </h1>
            <p className="text-[11px]" style={{ color: "var(--text-light)" }}>
              {GREETING()}, {nameDisplay.split(" ")[0]} 👋
            </p>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xs mx-auto md:mx-4">
            {searchOpen ? (
              <div className="relative animate-slideInLeft">
                <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}/>
                <input
                  autoFocus
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onBlur={() => { setSearchOpen(false); setSearchVal("") }}
                  placeholder="Search courses, tutors…"
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none border transition"
                  style={{
                    background: "var(--surface-alt)",
                    borderColor: "var(--primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition hover:shadow-sm"
                style={{
                  background: "var(--surface-alt)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <FiSearch size={14}/>
                <span className="hidden sm:inline">Search…</span>
              </button>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 ml-auto">

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-xl transition hover:scale-105"
              style={{ background: "var(--surface-alt)", color: "var(--text-muted)" }}
              title="Toggle dark mode"
            >
              {darkMode ? <FiSun size={17}/> : <FiMoon size={17}/>}
            </button>

            {/* Notification bell */}
            <div className="p-0.5">
              <NotificationBell/>
            </div>

            {/* Settings shortcut */}
            <button
              onClick={() => navigate("/settings")}
              className="p-2.5 rounded-xl transition hover:scale-105"
              style={{ background: "var(--surface-alt)", color: "var(--text-muted)" }}
              title="Settings"
            >
              <FiSettings size={17}/>
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl transition hover:shadow-sm"
                style={{ background: "var(--surface-alt)", border: "1px solid var(--border-soft)" }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-black text-xs text-white shadow">
                  {initials}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold leading-none" style={{ color: "var(--text-primary)" }}>
                    {nameDisplay.split(" ")[0]}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>Student</p>
                </div>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-xl border overflow-hidden animate-slideUp z-50"
                  style={{ background: "var(--surface)", borderColor: "var(--border-soft)" }}
                >
                  <div className="p-3 border-b" style={{ borderColor: "var(--border-soft)" }}>
                    <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{nameDisplay}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
                  </div>
                  <div className="p-1">
                    {[
                      { label: "My Profile", icon: FiUser, action: () => {} },
                      { label: "Progress",   icon: FiTrendingUp, action: () => handleTabChange("progress") },
                      { label: "Settings",   icon: FiSettings,   action: () => navigate("/settings") },
                    ].map(({ label, icon: Icon, action }) => (
                      <button
                        key={label}
                        onClick={() => { action(); setProfileOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition hover:bg-[var(--surface-alt)]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <Icon size={15} style={{ color: "var(--text-muted)" }}/> {label}
                      </button>
                    ))}
                    <div className="border-t my-1" style={{ borderColor: "var(--border-soft)" }}/>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition text-red-500 hover:bg-red-50"
                    >
                      <FiLogOut size={15}/> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── CONTENT AREA ── */}
        <main
          className={`flex-1 overflow-y-auto scrollbar-thin ${
            activeTab === "messages" ? "p-0" : "p-4 md:p-6"
          }`}
        >
          <div
            key={activeTab}
            className={`animate-fadeIn ${activeTab === "messages" ? "h-full" : "max-w-7xl mx-auto"}`}
          >
            {activeTab === "dashboard"    && <DashboardTab onTabChange={handleTabChange}/>}
            {activeTab === "courses"      && <CoursesTab/>}
            {activeTab === "certificates" && <CertificatesTab/>}
            {activeTab === "assignments"  && <AssignmentsTab/>}
            {activeTab === "quizzes"      && <QuizzesTab/>}
            {activeTab === "tutors"       && <TutorsTab/>}
            {activeTab === "sessions"     && <SessionsTab/>}
            {activeTab === "subjects"     && <MySubjectsTab/>}
            {activeTab === "messages"     && <ChatTab/>}
            {activeTab === "progress"     && <ProgressTab/>}
            {activeTab === "calendar"     && <CalendarTab/>}
            {activeTab === "payments"     && <PaymentsTab/>}
            {activeTab === "downloads"    && <DownloadsTab/>}
          </div>
        </main>

        {/* ── Mobile bottom nav ── */}
        <nav
          className="lg:hidden flex shrink-0 border-t safe-area-pb"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border-soft)",
            boxShadow: "0 -4px 20px rgba(0,0,0,.06)",
          }}
        >
          {NAV_ITEMS.slice(0, 5).map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all"
                style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}
              >
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition
                  ${active ? "bg-blue-50" : ""}
                `}>
                  <Icon size={17}/>
                </div>
                <span className="text-[9px] font-semibold leading-none">{label.split(" ")[0]}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
