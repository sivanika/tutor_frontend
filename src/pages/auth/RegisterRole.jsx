import { useNavigate } from "react-router-dom";

export default function RegisterRole() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6A11CB] to-[#2575FC] p-6">
      <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl shadow-black/20 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Register As</h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/register/student")}
            className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            🎓 Student
          </button>

          <button
            onClick={() => navigate("/register/professor")}
            className="bg-[#FF4E9B] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            🧑‍🏫 Professor
          </button>
        </div>
      </div>
    </div>
  );
}
