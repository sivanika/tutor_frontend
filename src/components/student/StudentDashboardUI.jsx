import { useState } from "react"
import StudentHeader from "./layout/StudentHeader"
import StudentTabs from "./layout/StudentTabs"

import DashboardTab from "./tabs/DashboardTab"
import TutorsTab from "./tabs/TutorsTab"
import SessionsTab from "./tabs/SessionsTab"
import ProgressTab from "./tabs/ProgressTab"

export default function StudentDashboardUI() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] via-[#ffffff] to-[#E8E6E1]">
      {/* Header */}
      <StudentHeader />

      <div className="max-w-7xl mx-auto px-4 pb-10">
        {/* Tabs */}
        <div className="sticky top-20 z-30 bg-white rounded-t-2xl shadow-lg">
          <StudentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Content Area */}
        <div
          key={activeTab}
          className="
            bg-white rounded-b-2xl shadow-xl p-6 md:p-8 mt-1
            animate-fadeIn
            transition-all duration-300
          "
        >
          {activeTab === "dashboard" && (
            <div className="animate-slideUp">
              <DashboardTab />
            </div>
          )}

          {activeTab === "tutors" && (
            <div className="animate-slideUp">
              <TutorsTab />
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="animate-slideUp">
              <SessionsTab />
            </div>
          )}

          {activeTab === "progress" && (
            <div className="animate-slideUp">
              <ProgressTab />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
