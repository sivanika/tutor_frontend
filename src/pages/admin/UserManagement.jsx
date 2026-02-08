import { useEffect, useState } from "react"
import API from "../../services/api"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchUsers = async () => {
    try {
      const res = await API.get(
        `/admin/users?page=${page}&search=${search}&role=${role}`
      )

      // ✅ backend returns array
      setUsers(res.data || [])
      setTotal(res.data?.length || 0)
    } catch (err) {
      console.error("Failed to load users", err)
      setUsers([])
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, search, role])

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Change status to ${status}?`)) return
    await API.put(`/admin/user-status/${id}`, { status })
    fetchUsers()
  }

  const totalPages = Math.ceil(total / 10) || 1

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 border rounded w-full md:w-1/4"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="professor">Professor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 capitalize">{u.role}</td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-sm text-white
                        ${u.status === "active" && "bg-green-600"}
                        ${u.status === "disabled" && "bg-yellow-500"}
                        ${u.status === "banned" && "bg-red-600"}`}
                    >
                      {u.status || "active"}
                    </span>
                  </td>

                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => updateStatus(u._id, "active")}
                      className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => updateStatus(u._id, "disabled")}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Disable
                    </button>
                    <button
                      onClick={() => updateStatus(u._id, "banned")}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Ban
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded
              ${page === i + 1 ? "bg-slate-900 text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
