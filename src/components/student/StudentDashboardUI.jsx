import { useState } from "react"
import { useNavigate } from "react-router-dom"

import StudentHeader from "./layout/StudentHeader"
import StudentTabs from "./layout/StudentTabs"

import DashboardTab from "./tabs/DashboardTab"
import TutorsTab from "./tabs/TutorsTab"
import SessionsTab from "./tabs/SessionsTab"
import ProgressTab from "./tabs/ProgressTab"

export default function StudentDashboardUI() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const navigate = useNavigate()

  // ✅ LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] via-white to-[#E8E6E1]">

      {/* Header with Logout */}
      <StudentHeader onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 pb-10">
        
        {/* Tabs */}
        <div className="sticky top-20 z-30 bg-white rounded-t-2xl shadow-lg">
          <StudentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Content */}
        <div
          key={activeTab}
          className="
            bg-white rounded-b-2xl shadow-xl p-6 md:p-8 mt-1
            animate-fadeIn transition-all duration-300
          "
        >
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "tutors" && <TutorsTab />}
          {activeTab === "sessions" && <SessionsTab />}
          {activeTab === "progress" && <ProgressTab />}
        </div>
      </div>
    </div>
  )
}
