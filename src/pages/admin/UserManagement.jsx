import { useEffect, useState } from "react"
import API from "../../services/api"
import { FiSearch, FiChevronLeft, FiChevronRight, FiUserCheck, FiUserX, FiSlash } from "react-icons/fi"

const ROLE_BADGE = {
  student: "bg-blue-50 text-[#2575FC]",
  professor: "bg-purple-50 text-[#6A11CB]",
  admin: "bg-pink-50 text-[#FF4E9B]",
}

const STATUS_BADGE = {
  active: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  disabled: "bg-amber-50 text-amber-600 border border-amber-100",
  banned: "bg-red-50 text-red-600 border border-red-100",
}

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchUsers = async () => {
    try {
      const res = await API.get(`/admin/users?page=${page}&search=${search}&role=${role}`)
      setUsers(res.data || [])
      setTotal(res.data?.length || 0)
    } catch (err) {
      console.error("Failed to load users", err)
      setUsers([])
    }
  }

  useEffect(() => { fetchUsers() }, [page, search, role])

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Change status to ${status}?`)) return
    await API.put(`/admin/user-status/${id}`, { status })
    fetchUsers()
  }

  const totalPages = Math.ceil(total / 10) || 1

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ─── Header ─── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <p className="text-sm text-gray-400 mt-0.5">Search, filter, and manage all platform users</p>
      </div>

      {/* ─── Filters ─── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/30 focus:border-[#6A11CB] focus:bg-white transition-all"
          />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/30 focus:border-[#6A11CB] focus:bg-white transition-all min-w-[140px]"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="professor">Professor</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex items-center text-xs text-gray-400 px-1">
          {total} user{total !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <FiSearch size={28} className="opacity-30" />
                      <p className="text-sm">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const initials = u.name
                    ? u.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                    : u.email?.[0]?.toUpperCase() || "U"
                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6A11CB] to-[#2575FC] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">{u.name || "—"}</p>
                            <p className="text-xs text-gray-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ROLE_BADGE[u.role] || "bg-gray-100 text-gray-500"}`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[u.status] || STATUS_BADGE.active}`}>
                          {u.status || "active"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateStatus(u._id, "active")}
                            title="Activate"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition"
                          >
                            <FiUserCheck size={12} /> Activate
                          </button>
                          <button
                            onClick={() => updateStatus(u._id, "disabled")}
                            title="Disable"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 transition"
                          >
                            <FiUserX size={12} /> Disable
                          </button>
                          <button
                            onClick={() => updateStatus(u._id, "banned")}
                            title="Ban"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
                          >
                            <FiSlash size={12} /> Ban
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FiChevronLeft size={14} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                    page === i + 1
                      ? "bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white shadow-sm"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}