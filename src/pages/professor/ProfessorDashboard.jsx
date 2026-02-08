import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Dashboard from "../../components/professorDashboard/Dashboard"
import Students from "../../components/professorDashboard/Students"
import Profile from "../../components/professorDashboard/Profile"
import Credentials from "../../components/professorDashboard/Credentials"
import CreateSessionTab from "../../components/professorDashboard/CreateSessionTab"

export default function ProfessorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const navigate = useNavigate()

  const tabs = [
    { id: "dashboard", label: "Tutor Dashboard" },
    { id: "students", label: "My Students" },
    { id: "create", label: "Create Session" },
    { id: "profile", label: "My Profile" },
    { id: "credentials", label: "Credentials" },
  ]

  // 🔴 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2A4D6E]">
          Professor Panel 🎓
        </h2>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="
            px-6 py-2 rounded-full font-semibold
            bg-gradient-to-r from-[#FFD9C0] to-white
            text-[#2A4D6E]
            shadow-md
            hover:shadow-lg hover:scale-105
            transition-all duration-300
          "
        >
          Logout
        </button>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex bg-white rounded-xl overflow-hidden shadow mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-3 font-semibold transition-all duration-300
              ${
                activeTab === tab.id
                  ? "bg-[#2A4D6E] text-white shadow-inner"
                  : "text-gray-500 hover:bg-gray-100"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "students" && <Students />}
      {activeTab === "create" && <CreateSessionTab />}
      {activeTab === "profile" && <Profile />}
      {activeTab === "credentials" && <Credentials />}
    </div>
  )
}
