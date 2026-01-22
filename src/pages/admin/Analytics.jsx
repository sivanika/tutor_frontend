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

const COLORS = ["#2563eb", "#7c3aed", "#16a34a", "#dc2626"]

export default function Analytics() {
  const [data, setData] = useState(null)

  useEffect(() => {
    API.get("/admin/analytics-charts")
      .then((res) => setData(res.data))
      .catch(() => alert("Failed to load charts"))
  }, [])

  if (!data) return <p>Loading analytics...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Students vs Professors (Bar Chart) */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Students vs Professors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.roleChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Verified vs Pending (Pie Chart) */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Professor Verification Status</h3>
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
        <div className="bg-white p-4 rounded shadow col-span-1 lg:col-span-2">
          <h3 className="font-semibold mb-2">User Growth (Weekly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.growthData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
