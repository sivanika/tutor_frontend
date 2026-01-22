import { useState } from "react";
import Dashboard from "../../components/professorDashboard/Dashboard";
import Students from "../../components/professorDashboard/Students";
import Profile from "../../components/professorDashboard/Profile";
import Credentials from "../../components/professorDashboard/Credentials";
import CreateSessionTab from "../../components/professorDashboard/CreateSessionTab";

export default function ProfessorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Tutor Dashboard" },
    { id: "students", label: "My Students" },
    { id: "create", label: "Create Session" },
    { id: "profile", label: "My Profile" },
    { id: "credentials", label: "Credentials" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5F2] p-6">
      {/* Tab Navigation */}
      <div className="flex bg-white rounded-lg overflow-hidden shadow mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 font-semibold transition ${
              activeTab === tab.id
                ? "bg-[#2A4D6E] text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "students" && <Students />}
      {activeTab === "create" && <CreateSessionTab />}
      {activeTab === "profile" && <Profile />}
      {activeTab === "credentials" && <Credentials />}
    </div>
  );
}
