import { useEffect, useState } from "react"
import API from "../../services/api"

export default function AdminLogs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    API.get("/admin/logs")
      .then((res) => setLogs(res.data))
      .catch(() => alert("Failed to load logs"))
  }, [])

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Admin Activity Logs
      </h2>

      {/* Table Card */}
      <div
        className="
          rounded-2xl overflow-hidden

          bg-white/90 dark:bg-slate-900/80
          backdrop-blur-xl

          border border-slate-200 dark:border-slate-800
          shadow-md dark:shadow-black/30
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Header */}
            <thead className="bg-slate-900 text-white dark:bg-black">
              <tr>
                <th className="p-3 text-left font-semibold">Admin</th>
                <th className="p-3 text-left font-semibold">Action</th>
                <th className="p-3 text-left font-semibold">Target</th>
                <th className="p-3 text-left font-semibold">Description</th>
                <th className="p-3 text-left font-semibold">Time</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="
                    border-b border-slate-200 dark:border-slate-800
                    hover:bg-slate-50 dark:hover:bg-slate-800/50
                    transition
                  "
                >
                  <td className="p-3">
                    <div className="font-medium text-slate-800 dark:text-slate-100">
                      {log.admin?.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {log.admin?.email}
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                    {log.action}
                  </td>

                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {log.target}
                  </td>

                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {log.description}
                  </td>

                  <td className="p-3 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}