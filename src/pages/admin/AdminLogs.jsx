import { useEffect, useState } from "react"
import API from "../../services/api"
import { FiActivity, FiClock, FiUser, FiTag, FiFileText } from "react-icons/fi"

const ACTION_COLORS = {
  approve: "bg-emerald-50 text-emerald-600",
  reject: "bg-red-50 text-red-600",
  ban: "bg-red-50 text-red-700",
  disable: "bg-amber-50 text-amber-600",
  activate: "bg-blue-50 text-blue-600",
  feature: "bg-purple-50 text-[#6A11CB]",
  update: "bg-gray-100 text-gray-600",
}

function actionBadgeClass(action = "") {
  const key = Object.keys(ACTION_COLORS).find(k => action.toLowerCase().includes(k))
  return key ? ACTION_COLORS[key] : "bg-gray-100 text-gray-500"
}

export default function AdminLogs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    API.get("/admin/logs")
      .then((res) => setLogs(res.data))
      .catch(() => alert("Failed to load logs"))
  }, [])

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Activity Logs</h2>
          <p className="text-sm text-gray-400 mt-0.5">Audit trail of all admin actions</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 text-[#6A11CB] px-3 py-1.5 rounded-full text-xs font-semibold border border-purple-100">
          <FiActivity size={12} />
          {logs.length} entries
        </div>
      </div>

      {/* ─── Logs Table ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <FiFileText size={32} className="opacity-30" />
            <p className="text-sm">No activity logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><FiUser size={11} /> Admin</span>
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><FiTag size={11} /> Action</span>
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><FiClock size={11} /> Time</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => {
                  const initials = log.admin?.name
                    ? log.admin.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                    : "A"
                  return (
                    <tr key={log._id} className="hover:bg-gray-50/60 transition-colors group">
                      {/* Admin */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6A11CB] to-[#2575FC] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 text-xs leading-tight">{log.admin?.name || "Admin"}</p>
                            <p className="text-xs text-gray-400 truncate">{log.admin?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${actionBadgeClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>

                      {/* Target */}
                      <td className="px-5 py-4 text-gray-600 text-xs max-w-[140px] truncate">
                        {log.target}
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4 text-gray-500 text-xs max-w-[200px]">
                        <p className="line-clamp-2 leading-relaxed">{log.description}</p>
                      </td>

                      {/* Time */}
                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-US", {
                          month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}