
export default function StudentHeader({ onLogout }) {

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
        <div className="flex items-center group">
          <Link to="/student/dashboard" className="flex items-center gap-2">
            <img
              src="/logos/vishidh-emblem-192x192.webp"
              alt="Vishidh VishidhAcademy"
              className="w-12 h-12 sm:hidden object-contain"
            />
            <img
              src="/logos/vishidh-logo-768x384.png"
              alt="Vishidh VishidhAcademy"
              className="hidden sm:block h-14 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
            />
          </Link>
        </div>


        {/* Logout Button (LOGIC ADDED ONLY) */}
        <button
          onClick={onLogout}
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
