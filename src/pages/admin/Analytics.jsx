import { useEffect, useState } from "react"
import API from "../../services/api"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const COLORS = ["#334155", "#64748b", "#0f172a", "#1e293b"]

export default function Analytics() {
  const [data, setData] = useState({
    roleChart: [],
    verificationChart: [],
    growthData: [],
  })

  useEffect(() => {
    API.get("/admin/analytics-charts")
      .then((res) => {
        const apiData = res.data

        const roleChart = [
          { name: "Students", value: apiData.data?.[0] || 0 },
          { name: "Professors", value: apiData.data?.[1] || 0 },
        ]

        const verificationChart = [
          { name: "Verified", value: apiData.verifiedProfessors || 0 },
          { name: "Pending", value: apiData.pendingProfessors || 0 },
        ]

        const growthData = [
          { week: "Week 1", users: apiData.totalUsers || 0 },
        ]

        setData({
          roleChart,
          verificationChart,
          growthData,
        })
      })
      .catch(() => alert("Failed to load charts"))
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Analytics Dashboard
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Students vs Professors */}
        <div
          className="
            p-5 rounded-2xl

            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800

            shadow-sm dark:shadow-black/30
            backdrop-blur
          "
        >
          <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">
            Students vs Professors
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.roleChart}>
              <XAxis stroke="#64748b" dataKey="name" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="value" fill="#334155" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Verified vs Pending */}
        <div
          className="
            p-5 rounded-2xl

            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800

            shadow-sm dark:shadow-black/30
            backdrop-blur
          "
        >
          <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">
            Professor Verification Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.verificationChart}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {data.verificationChart.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Chart */}
        <div
          className="
            p-5 rounded-2xl col-span-1 lg:col-span-2

            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800

            shadow-sm dark:shadow-black/30
            backdrop-blur
          "
        >
          <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">
            User Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.growthData}>
              <XAxis stroke="#64748b" dataKey="week" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#0f172a"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}