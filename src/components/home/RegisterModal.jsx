import { useNavigate } from "react-router-dom";
import { FiUser, FiUserCheck, FiX, FiArrowRight } from "react-icons/fi";

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const navigate = useNavigate();

  const goTo = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--overlay-bg)] backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-md p-8 rounded-3xl text-center
          border border-[var(--card-border)] shadow-2xl
          animate-slideUp space-y-6 overflow-hidden
          bg-[var(--modal-bg)]
        "
      >
        {/* Glow orbs */}
        <div className="absolute -top-20 -left-20 w-48 h-48 orb-blue opacity-30 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 orb-purple opacity-30 pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--surface-alt)] hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center transition border border-[var(--border)] z-10"
        >
          <FiX size={18} />
        </button>

        {/* Title */}
        <div className="pt-2 relative z-10">
          <h2 className="text-3xl font-black text-[var(--text-primary)]">Get Started Free</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Choose your role to create an account</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 relative z-10">
          {/* Student */}
          <button
            onClick={() => goTo("/register/student")}
            className="
              group flex items-center justify-between p-5 rounded-2xl text-left
              bg-[var(--surface-alt)] border border-[var(--border-soft)] hover:border-[var(--accent)]/50
              hover:bg-[var(--accent)]/08 transition-all duration-300 hover:-translate-y-0.5
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <FiUser />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-base">I'm a Student</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Learn from top verified professors</p>
              </div>
            </div>
            <FiArrowRight className="text-[var(--text-light)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" size={18} />
          </button>

          {/* Professor */}
          <button
            onClick={() => goTo("/register/professor")}
            className="
              group flex items-center justify-between p-5 rounded-2xl text-left
              bg-[var(--surface-alt)] border border-[var(--border-soft)] hover:border-[var(--glow)]/50
              hover:bg-[var(--glow)]/08 transition-all duration-300 hover:-translate-y-0.5
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <FiUserCheck />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-base">I'm a Professor</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Teach live classes &amp; earn income</p>
              </div>
            </div>
            <FiArrowRight className="text-[var(--text-light)] group-hover:text-[var(--glow)] group-hover:translate-x-1 transition-all" size={18} />
          </button>
        </div>

        {/* Switch to login */}
        <p className="text-xs text-center text-[var(--text-muted)] relative z-10 pt-2">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="font-bold text-[var(--accent)] hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
