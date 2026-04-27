import { useNavigate } from "react-router-dom";
import { FiBook, FiUser } from "react-icons/fi";


export default function RegisterRole() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] p-6">
      <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl shadow-black/20 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Register As</h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/register/student")}
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              <FiBook /> Student
            </span>

          </button>

          <button
            onClick={() => navigate("/register/professor")}
            className="bg-[var(--accent)] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              <FiUser /> Professor
            </span>

          </button>
        </div>
      </div>
    </div>
  );
}
