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
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        User Management
      </h2>

      {/* Filters */}
      <div
        className="
          flex flex-wrap gap-3 p-4 rounded-xl

          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800
          shadow-sm
        "
      >
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            p-2.5 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            w-full md:w-1/3
            focus:outline-none focus:ring-2 focus:ring-slate-500
          "
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="
            p-2.5 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            w-full md:w-1/4
            focus:outline-none focus:ring-2 focus:ring-slate-500
          "
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="professor">Professor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div
        className="
          overflow-x-auto rounded-xl
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800
          shadow-sm
        "
      >
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6 text-slate-500 dark:text-slate-400"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u._id}
                  className="
                    border-b border-slate-200 dark:border-slate-800
                    hover:bg-slate-50 dark:hover:bg-slate-800/60
                    transition
                  "
                >
                  <td className="p-3 text-slate-800 dark:text-slate-200">
                    {u.name}
                  </td>

                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {u.email}
                  </td>

                  <td className="p-3 capitalize text-slate-700 dark:text-slate-300">
                    {u.role}
                  </td>

                  <td className="p-3">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium

                        ${
                          u.status === "active" &&
                          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }
                        ${
                          u.status === "disabled" &&
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }
                        ${
                          u.status === "banned" &&
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }
                      `}
                    >
                      {u.status || "active"}
                    </span>
                  </td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => updateStatus(u._id, "active")}
                      className="
                        px-3 py-1 rounded-md text-xs font-medium
                        bg-green-600 text-white hover:bg-green-700
                      "
                    >
                      Activate
                    </button>

                    <button
                      onClick={() => updateStatus(u._id, "disabled")}
                      className="
                        px-3 py-1 rounded-md text-xs font-medium
                        bg-yellow-500 text-white hover:bg-yellow-600
                      "
                    >
                      Disable
                    </button>

                    <button
                      onClick={() => updateStatus(u._id, "banned")}
                      className="
                        px-3 py-1 rounded-md text-xs font-medium
                        bg-red-600 text-white hover:bg-red-700
                      "
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
      <div className="flex justify-center gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition

              ${
                page === i + 1
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-black"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}