import { NavLink, Outlet, useNavigate } from "react-router-dom"

export default function AdminLayout() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-2">
          <NavLink to="verify" className="block p-2 rounded hover:bg-slate-700">
            Profile Verification
          </NavLink>
          <NavLink to="users" className="block p-2 rounded hover:bg-slate-700">
            User Management
          </NavLink>
          <NavLink to="analytics" className="block p-2 rounded hover:bg-slate-700">
            Analytics
          </NavLink>
          <NavLink to="logs" className="block p-2 rounded hover:bg-slate-700">
            Activity Logs
          </NavLink>

          <NavLink to="settings" className="block p-2 rounded hover:bg-slate-700">
            Settings
          </NavLink>

          <button
            onClick={logout}
            className="w-full text-left p-2 rounded bg-red-600 hover:bg-red-700 mt-6"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  )
}
