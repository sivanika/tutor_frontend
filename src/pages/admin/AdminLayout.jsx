import { NavLink, Outlet, useNavigate } from "react-router-dom"

export default function AdminLayout() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const linkStyle = ({ isActive }) =>
    `
    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
    transition
    ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
    }
  `

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-black transition-colors">
      {/* Sidebar */}
      <aside
        className="
          w-64 p-5
          bg-slate-900
          text-white
          border-r border-slate-800
          shadow-xl
        "
      >
        <h2 className="text-xl font-bold mb-8 tracking-wide">
          Admin Panel
        </h2>

        <nav className="space-y-2">
          <NavLink to="verify" className={linkStyle}>
            Profile Verification
          </NavLink>

          <NavLink to="users" className={linkStyle}>
            User Management
          </NavLink>

          <NavLink to="analytics" className={linkStyle}>
            Analytics
          </NavLink>

          <NavLink to="logs" className={linkStyle}>
            Activity Logs
          </NavLink>

          <NavLink to="settings" className={linkStyle}>
            Settings
          </NavLink>

          {/* Logout */}
          <button
            onClick={logout}
            className="
              w-full text-left px-4 py-2.5 rounded-lg mt-6
              bg-red-600 hover:bg-red-700
              text-white font-medium
              transition
            "
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Page Content */}
      <main
        className="
          flex-1 p-8
          bg-slate-50
          dark:bg-gradient-to-br dark:from-slate-900 dark:to-black
          transition-colors duration-500
        "
      >
        <Outlet />
      </main>
    </div>
  )
}