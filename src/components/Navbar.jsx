import { useAuth } from "../context/AuthContext"

function Navbar() {
  const { logout, user } = useAuth()

  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6">
      <h1 className="font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.email}
        </span>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar
