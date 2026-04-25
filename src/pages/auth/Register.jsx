import { useNavigate, useSearchParams } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "";

  const planQuery = plan ? `?plan=${plan}` : "";

  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-6
        bg-gradient-to-br from-[var(--primary)] via-[#4B34C9] to-[var(--primary)]
        dark:from-[#0f0720] dark:via-[#130a2e] dark:to-[#0a0418]
        transition-colors duration-500
      "
    >
      {/* Card */}
      <div
        className="
          w-full max-w-md p-6 md:p-10 rounded-2xl text-center
          bg-white/95 dark:bg-[var(--surface)]/95
          backdrop-blur-2xl
          border border-white/50 dark:border-[var(--primary)]/20
          shadow-2xl shadow-black/20
          animate-[popup_.5s_ease]
        "
      >
        {/* Title */}
        <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
          Register As
        </h2>
        <p className="text-sm text-gray-500 dark:text-[var(--accent)] mb-8">Choose your role to get started</p>

        {/* Options */}
        <div className="flex flex-col gap-5">

          {/* Student */}
          <button
            onClick={() => navigate(`/register/student${planQuery}`)}
            className="
              group flex items-center justify-center gap-3
              py-4 rounded-xl font-semibold
              bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]
              text-white
              shadow-lg shadow-[var(--primary)]/25
              hover:shadow-xl hover:-translate-y-1
              transition-all duration-300
            "
          >
            <span className="text-xl group-hover:scale-110 transition">🎓</span>
            Student
          </button>

          {/* Professor */}
          <button
            onClick={() => navigate(`/register/professor${planQuery}`)}
            className="
              group flex items-center justify-center gap-3
              py-4 rounded-xl font-semibold
              bg-[var(--accent)] text-white
              shadow-lg shadow-[var(--accent)]/25
              hover:shadow-xl hover:-translate-y-1
              transition-all duration-300
            "
          >
            <span className="text-xl group-hover:scale-110 transition">🧑‍🏫</span>
            Professor
          </button>
        </div>

        {/* Back to login */}
        <p className="mt-8 text-sm text-gray-500 dark:text-[var(--accent)]/70">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-medium text-[var(--primary)] dark:text-[var(--accent)] hover:underline"
          >
            Login
          </span>
        </p>
      </div>

      {/* animation */}
      <style>
        {`
          @keyframes popup {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}
