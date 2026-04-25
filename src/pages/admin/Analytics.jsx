import { useEffect, useState } from "react"
import API from "../../services/api"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts"
import { FiUsers, FiTrendingUp, FiPieChart, FiBarChart2 } from "react-icons/fi"

const BRAND_COLORS = ["var(--primary)", "var(--primary)", "var(--accent)", "#F59E0B"]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg">
        <p className="font-semibold mb-0.5">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

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
        setData({ roleChart, verificationChart, growthData })
      })
      .catch(() => alert("Failed to load charts"))
  }, [])

  const totalUsers = (data.roleChart[0]?.value || 0) + (data.roleChart[1]?.value || 0)

  const STAT_ITEMS = [
    { label: "Total Users", value: totalUsers, icon: FiUsers, bg: "bg-purple-50", color: "text-[var(--primary)]", grad: "from-[var(--primary)] to-[var(--primary)]" },
    { label: "Students", value: data.roleChart[0]?.value || 0, icon: FiBarChart2, bg: "bg-blue-50", color: "text-[var(--primary)]", grad: "from-[var(--primary)] to-[var(--accent)]" },
    { label: "Professors", value: data.roleChart[1]?.value || 0, icon: FiTrendingUp, bg: "bg-pink-50", color: "text-[var(--accent)]", grad: "from-[var(--accent)] to-orange-400" },
    { label: "Verified Profs", value: data.verificationChart[0]?.value || 0, icon: FiPieChart, bg: "bg-amber-50", color: "text-amber-500", grad: "from-amber-400 to-yellow-500" },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ─── Header ─── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <p className="text-sm text-gray-400 mt-0.5">Platform-wide metrics and growth insights</p>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_ITEMS.map(({ label, value, icon: Icon, bg, color, grad }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className={`${bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-0.5">{value}</div>
            <div className="text-xs text-gray-400">{label}</div>
            <div className={`mt-3 h-0.5 rounded-full bg-gradient-to-r ${grad}`} />
          </div>
        ))}
      </div>

      {/* ─── Charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Students vs Professors */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <FiBarChart2 size={14} className="text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Students vs Professors</h3>
              <p className="text-xs text-gray-400">User role distribution</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.roleChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
                {data.roleChart.map((_, i) => (
                  <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Verification Status Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center">
              <FiPieChart size={14} className="text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Professor Verification</h3>
              <p className="text-xs text-gray-400">Verified vs pending</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.verificationChart}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={55}
                paddingAngle={4}
              >
                {data.verificationChart.map((_, i) => (
                  <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <FiTrendingUp size={14} className="text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">User Growth</h3>
              <p className="text-xs text-gray-400">Platform growth over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.growthData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="users"
                name="Users"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ r: 5, fill: "var(--primary)", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
