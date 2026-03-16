import { Link } from "react-router-dom"
import {
  FiShield, FiUsers, FiActivity, FiSettings, FiArrowRight,
  FiUserCheck, FiDollarSign, FiBarChart2
} from "react-icons/fi"

const items = [
  {
    title: "Professor Verification",
    desc: "Approve or reject professor applications",
    path: "verify",
    icon: FiShield,
    color: "from-[#6A11CB] to-[#2575FC]",
    bg: "bg-purple-50",
    iconColor: "text-[#6A11CB]",
    badge: "Verification",
  },
  {
    title: "Student Management",
    desc: "View all students, subscriptions & details",
    path: "students",
    icon: FiUsers,
    color: "from-[#2575FC] to-[#FF4E9B]",
    bg: "bg-blue-50",
    iconColor: "text-[#2575FC]",
    badge: "Students",
  },
  {
    title: "Professor Management",
    desc: "Manage all professors, credentials & status",
    path: "professors",
    icon: FiUserCheck,
    color: "from-[#6A11CB] to-[#FF4E9B]",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    badge: "Professors",
  },
  {
    title: "Payments & Earnings",
    desc: "Track professor earnings and platform revenue",
    path: "earnings",
    icon: FiDollarSign,
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badge: "Revenue",
  },
  {
    title: "User Management",
    desc: "Manage all users: status, roles, access",
    path: "users",
    icon: FiBarChart2,
    color: "from-[#FF4E9B] to-orange-400",
    bg: "bg-pink-50",
    iconColor: "text-[#FF4E9B]",
    badge: "Users",
  },
  {
    title: "Activity Logs",
    desc: "View audit trail of all admin actions",
    path: "logs",
    icon: FiActivity,
    color: "from-orange-400 to-amber-400",
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
    badge: "Logs",
  },
  {
    title: "Analytics",
    desc: "Platform-wide charts and growth data",
    path: "analytics",
    icon: FiBarChart2,
    color: "from-cyan-400 to-blue-400",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    badge: "Charts",
  },
  {
    title: "Settings",
    desc: "Configure admin account and preferences",
    path: "settings",
    icon: FiSettings,
    color: "from-amber-400 to-yellow-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
    badge: "Config",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ─── Hero Banner ─── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#6A11CB] to-[#2575FC] rounded-2xl p-6 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">Welcome back, Admin</p>
          <h2 className="text-2xl font-bold mb-1">Admin Dashboard</h2>
          <p className="text-white/60 text-sm">
            Manage the TutorHours platform — users, verifications, earnings, and system settings.
          </p>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-10 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute right-36 -top-4 w-16 h-16 rounded-full bg-[#FF4E9B]/30" />
      </div>

      {/* ─── Quick Actions Grid ─── */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Quick Access</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${item.bg} w-11 h-11 rounded-xl flex items-center justify-center`}>
                    <Icon size={20} className={item.iconColor} />
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                <div className={`mt-4 h-0.5 rounded-full bg-gradient-to-r ${item.color}`} />
                <div className="flex items-center gap-1 mt-3 text-xs font-medium text-gray-400 group-hover:text-[#6A11CB] transition-colors">
                  Open <FiArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}