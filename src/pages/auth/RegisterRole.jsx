import { useNavigate } from "react-router-dom";

export default function RegisterRole() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Register As</h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/register/student")}
            className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            🎓 Student
          </button>

          <button
            onClick={() => navigate("/register/professor")}
            className="bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700"
          >
            🧑‍🏫 Professor
          </button>
        </div>
      </div>
    </div>
  );
}
