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
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Activity Logs</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-2">Admin</th>
              <th className="p-2">Action</th>
              <th className="p-2">Target</th>
              <th className="p-2">Description</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  {log.admin?.name}
                  <br />
                  <span className="text-xs text-gray-500">
                    {log.admin?.email}
                  </span>
                </td>
                <td className="p-2 font-semibold text-blue-600">
                  {log.action}
                </td>
                <td className="p-2">{log.target}</td>
                <td className="p-2">{log.description}</td>
                <td className="p-2 text-sm text-gray-600">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
