import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  FiGrid, FiSearch, FiBook, FiTrendingUp,
  FiLogOut, FiMenu, FiX, FiChevronRight, FiBell
} from "react-icons/fi"

import DashboardTab from "./tabs/DashboardTab"
import TutorsTab from "./tabs/TutorsTab"
import SessionsTab from "./tabs/SessionsTab"
import ProgressTab from "./tabs/ProgressTab"

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid },
  { id: "tutors", label: "Browse Tutors", icon: FiSearch },
  { id: "sessions", label: "My Sessions", icon: FiBook },
  { id: "progress", label: "My Progress", icon: FiTrendingUp },
]

export default function StudentDashboardUI() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const currentTab = NAV_ITEMS.find(t => t.id === activeTab)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-[Inter,sans-serif]">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 flex flex-col
        bg-gradient-to-b from-[#6A11CB] to-[#2575FC]
        text-white shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/15">
          <div className="w-9 h-9 rounded-xl bg-[#FF4E9B] flex items-center justify-center font-bold text-lg shadow-lg">
            T
          </div>
          <div>
            <p className="font-bold text-sm tracking-wide">TutorHours</p>
            <p className="text-xs text-white/70">Student Portal</p>
          </div>
          <button
            className="ml-auto lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSidebarOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 group relative
                  ${active
                    ? "bg-white/15 text-white shadow-inner"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#FF4E9B]" />
                )}
                <Icon size={18} className={active ? "text-white" : "text-white/50 group-hover:text-white/80"} />
                <span>{label}</span>
                {active && <FiChevronRight size={14} className="ml-auto text-[#FF4E9B]" />}
              </button>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-5 border-t border-white/15">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-[#FF4E9B] flex items-center justify-center font-bold text-sm shadow shrink-0">
              {user?.email?.[0]?.toUpperCase() || "S"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.email || "Student"}</p>
              <p className="text-xs text-white/60">Student</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-all duration-200"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ══════════════ MAIN ══════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={20} className="text-gray-600" />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-800">{currentTab?.label}</h1>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
              <FiBell size={18} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4E9B]" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6A11CB] to-[#2575FC] flex items-center justify-center font-bold text-sm text-white shadow">
              {user?.email?.[0]?.toUpperCase() || "S"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div key={activeTab} className="animate-fadeIn">
            {activeTab === "dashboard" && <DashboardTab />}
            {activeTab === "tutors" && <TutorsTab />}
            {activeTab === "sessions" && <SessionsTab />}
            {activeTab === "progress" && <ProgressTab />}
          </div>
        </main>
      </div>
    </div>
  )
}
