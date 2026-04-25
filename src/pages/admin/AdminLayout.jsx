import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  FiShield, FiUsers, FiBarChart2, FiActivity,
  FiSettings, FiLogOut, FiChevronRight,
  FiBookOpen, FiDollarSign, FiUserCheck, FiBell,
  FiMenu, FiX
} from "react-icons/fi"
import NotificationBell from "../../components/common/NotificationBell"

const NAV_ITEMS = [
  { to: "verify", label: "Profile Verification", icon: FiShield },
  { to: "students", label: "Students", icon: FiUsers },
  { to: "professors", label: "Professors", icon: FiUserCheck },
  { to: "users", label: "User Management", icon: FiBookOpen },
  { to: "analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "earnings", label: "Payments & Earnings", icon: FiDollarSign },
  { to: "subscriptions", label: "Subscriptions", icon: FiSettings },
  { to: "logs", label: "Activity Logs", icon: FiActivity },
  { to: "settings", label: "Settings", icon: FiSettings },
  { to: "announcements", label: "Announcements", icon: FiBell },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  // Close sidebar when navigating on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-[Inter,sans-serif]">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col bg-gradient-to-b from-[var(--primary)] to-[var(--primary)] text-white shadow-2xl shrink-0`}>

        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center font-bold text-lg shadow-lg">
              A
            </div>
            <div>
              <p className="font-bold text-sm tracking-wide">TutorHours</p>
              <p className="text-xs text-white/60">Admin Panel</p>
            </div>
          </div>
          <button 
            className="md:hidden p-1 text-white/80 hover:text-white rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-white/15 text-white shadow-inner"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[var(--accent)]" />
                  )}
                  <Icon
                    size={16}
                    className={isActive ? "text-white" : "text-white/50 group-hover:text-white/80"}
                  />
                  <span>{label}</span>
                  {isActive && <FiChevronRight size={13} className="ml-auto text-[var(--accent)]" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-white/15">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-all duration-200"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div className="flex-1 flex flex-col overflow-hidden w-full md:w-auto">

        {/* Top Header */}
        <header className="flex items-center gap-3 md:gap-4 px-4 md:px-8 py-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
          <button 
            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">Admin Control Center</h1>
            <p className="text-[10px] md:text-xs text-gray-400 truncate">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3 shrink-0">
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] flex items-center justify-center font-bold text-sm text-white shadow">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
