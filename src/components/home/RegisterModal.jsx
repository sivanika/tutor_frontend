import { useNavigate } from "react-router-dom";

export default function RegisterModal({ onClose, onSwitchToLogin }) {
    const navigate = useNavigate();

    const goTo = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
          relative w-full max-w-md p-10 rounded-2xl text-center
          bg-white/95 dark:bg-[#1a1035]/95 backdrop-blur-2xl
          border border-white/50 dark:border-[#6A11CB]/20
          shadow-2xl shadow-black/20
          animate-[modalIn_.3s_ease]
        "
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-[#0f0720] hover:bg-gray-200 dark:hover:bg-[#6A11CB]/20 flex items-center justify-center text-gray-500 dark:text-[#a78bfa] hover:text-gray-800 dark:hover:text-white transition"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Register As</h2>
                <p className="text-sm text-gray-500 dark:text-[#a78bfa] mb-8">Choose your role to get started</p>

                {/* Options */}
                <div className="flex flex-col gap-5">
                    {/* Student */}
                    <button
                        onClick={() => goTo("/register/student")}
                        className="
              group flex items-center justify-center gap-3
              py-4 rounded-xl font-semibold
              bg-gradient-to-r from-[#6A11CB] to-[#2575FC]
              text-white
              shadow-lg shadow-[#6A11CB]/25
              hover:shadow-xl hover:-translate-y-1
              transition-all duration-300
            "
                    >
                        <span className="text-xl group-hover:scale-110 transition">🎓</span>
                        Student
                    </button>

                    {/* Professor */}
                    <button
                        onClick={() => goTo("/register/professor")}
                        className="
              group flex items-center justify-center gap-3
              py-4 rounded-xl font-semibold
              bg-[#FF4E9B] text-white
              shadow-lg shadow-[#FF4E9B]/25
              hover:shadow-xl hover:-translate-y-1
              transition-all duration-300
            "
                    >
                        <span className="text-xl group-hover:scale-110 transition">🧑‍🏫</span>
                        Professor
                    </button>
                </div>

                {/* Switch to login */}
                <p className="mt-8 text-sm text-gray-500 dark:text-[#a78bfa]/70">
                    Already have an account?{" "}
                    <button
                        onClick={onSwitchToLogin}
                        className="font-medium text-[#6A11CB] dark:text-[#a78bfa] hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>

            <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
}
