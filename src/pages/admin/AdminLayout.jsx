import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  FiShield, FiUsers, FiBarChart2, FiActivity,
  FiSettings, FiLogOut, FiChevronRight,
  FiBookOpen, FiDollarSign, FiUserCheck, FiBell
} from "react-icons/fi"

const NAV_ITEMS = [
  { to: "verify", label: "Profile Verification", icon: FiShield },
  { to: "students", label: "Students", icon: FiUsers },
  { to: "professors", label: "Professors", icon: FiUserCheck },
  { to: "users", label: "User Management", icon: FiBookOpen },
  { to: "analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "earnings", label: "Payments & Earnings", icon: FiDollarSign },
  { to: "logs", label: "Activity Logs", icon: FiActivity },
  { to: "settings", label: "Settings", icon: FiSettings },
  { to: "announcements", label: "Announcements", icon: FiBell },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-[Inter,sans-serif]">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="w-64 flex flex-col bg-gradient-to-b from-[#6A11CB] to-[#2575FC] text-white shadow-2xl shrink-0">

        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/15">
          <div className="w-9 h-9 rounded-xl bg-[#FF4E9B] flex items-center justify-center font-bold text-lg shadow-lg">
            A
          </div>
          <div>
            <p className="font-bold text-sm tracking-wide">TutorHours</p>
            <p className="text-xs text-white/60">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
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
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#FF4E9B]" />
                  )}
                  <Icon
                    size={16}
                    className={isActive ? "text-white" : "text-white/50 group-hover:text-white/80"}
                  />
                  <span>{label}</span>
                  {isActive && <FiChevronRight size={13} className="ml-auto text-[#FF4E9B]" />}
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
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header className="flex items-center gap-4 px-8 py-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Admin Control Center</h1>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6A11CB] to-[#2575FC] flex items-center justify-center font-bold text-sm text-white shadow">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}