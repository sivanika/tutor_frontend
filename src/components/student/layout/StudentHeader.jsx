export default function StudentHeader() {
  return (
    <header className="
      sticky top-0 z-50
      bg-gradient-to-r from-[#2A4D6E]/90 to-[#8A4F7D]/90
      backdrop-blur-xl
      shadow-[0_12px_40px_rgba(0,0,0,0.25)]
      border-b border-white/20
    ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center text-2xl font-extrabold tracking-wide group">
          <div className="
            w-11 h-11 rounded-full
            bg-gradient-to-br from-white/30 to-white/10
            flex items-center justify-center mr-3
            shadow-lg
            group-hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]
            transition
          ">
            <i className="fas fa-user-graduate text-white text-xl"></i>
          </div>
          <span className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-white via-[#FFD9C0] to-white
            animate-pulse
          ">
            ProfessorOn
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-10 font-medium">
            {["Dashboard", "Find Tutors", "My Sessions", "Messages", "Resources"].map(
              (item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="
                      relative group text-white/90
                      transition-all duration-300
                      hover:text-[#FFD9C0]
                    "
                  >
                    {item}
                    <span
                      className="
                        absolute left-1/2 -bottom-2 w-0 h-[3px]
                        bg-gradient-to-r from-[#FFD9C0] to-white
                        transition-all duration-300
                        group-hover:w-full
                        group-hover:left-0
                        rounded-full
                      "
                    ></span>
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          className="
            px-6 py-2 rounded-full font-semibold
            bg-gradient-to-r from-[#FFD9C0] to-white
            text-[#2A4D6E]
            shadow-[0_6px_20px_rgba(255,217,192,0.6)]
            hover:shadow-[0_0_25px_rgba(255,217,192,1)]
            hover:scale-110
            transition-all duration-300
          "
        >
          Logout
        </button>
      </div>
    </header>
  )
}
