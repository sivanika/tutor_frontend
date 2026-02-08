import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-6

        bg-slate-100
        dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black

        transition-colors duration-500
      "
    >
      {/* Card */}
      <div
        className="
          w-full max-w-md p-10 rounded-2xl text-center

          bg-white/90 dark:bg-slate-900/80
          backdrop-blur-2xl

          border border-slate-200 dark:border-slate-800
          shadow-xl dark:shadow-black/40

          animate-[popup_.5s_ease]
        "
      >
        {/* Title */}
        <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">
          Register As
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-5">

          {/* Student */}
          <button
            onClick={() => navigate("/register/student")}
            className="
              group flex items-center justify-center gap-3
              py-4 rounded-xl font-medium

              bg-slate-900 text-white
              hover:bg-black

              dark:bg-slate-100 dark:text-black
              dark:hover:bg-white

              shadow-md hover:shadow-xl
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            <span className="text-xl group-hover:scale-110 transition">🎓</span>
            Student
          </button>

          {/* Professor */}
          <button
            onClick={() => navigate("/register/professor")}
            className="
              group flex items-center justify-center gap-3
              py-4 rounded-xl font-medium

              bg-slate-800 text-white
              hover:bg-slate-900

              dark:bg-slate-200 dark:text-black
              dark:hover:bg-white

              shadow-md hover:shadow-xl
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            <span className="text-xl group-hover:scale-110 transition">🧑‍🏫</span>
            Professor
          </button>
        </div>

        {/* Back to login */}
        <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-medium hover:underline"
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
