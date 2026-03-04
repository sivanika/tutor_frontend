export default function StudentTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "fa-chart-line" },
    { id: "tutors", label: "Find Tutors", icon: "fa-search" },
    { id: "sessions", label: "My Sessions", icon: "fa-calendar-check" },
    { id: "progress", label: "My Progress", icon: "fa-trophy" },
  ]

  return (
    <div className="
      flex bg-white/70 backdrop-blur-xl rounded-full shadow-2xl
      p-2 mt-6 border border-white/30
    ">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative flex-1 py-3 px-4 rounded-full flex items-center justify-center gap-2
              font-semibold tracking-wide transition-all duration-300
              ${
                isActive
                  ? `
                    bg-gradient-to-r from-[#2A4D6E] to-[#8A4F7D] 
                    text-white shadow-[0_0_20px_rgba(138,79,125,0.6)]
                    scale-110
                  `
                  : `
                    text-[#6C7A89]
                    hover:bg-white
                    hover:text-[#2A4D6E]
                    hover:shadow-lg
                  `
              }
            `}
          >
            <i className={`fas ${tab.icon} text-sm`}></i>
            <span className="hidden sm:inline">{tab.label}</span>

            {/* Glow ring */}
            {isActive && (
              <span className="
                absolute inset-0 rounded-full 
                border-2 border-white/30
                animate-pulse
              "></span>
            )}
          </button>
        )
      })}
    </div>
  )
}
