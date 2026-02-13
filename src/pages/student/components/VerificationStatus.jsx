export default function VerificationStatus({ submitted }) {
  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-xl mb-6
        border backdrop-blur-xl
        shadow-sm

        ${
          submitted
            ? "bg-green-50/80 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
            : "bg-yellow-50/80 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400"
        }
      `}
    >
      {/* Icon container */}
      <div
        className={`
          w-10 h-10 flex items-center justify-center
          rounded-lg text-lg

          ${
            submitted
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
          }
        `}
      >
        <i
          className={`fas ${
            submitted ? "fa-check" : "fa-clock"
          }`}
        ></i>
      </div>

      {/* Message */}
      <span className="font-medium text-sm">
        {submitted
          ? "Profile submitted for verification. Our team will review it."
          : "Your profile is pending verification. Please complete all sections."}
      </span>
    </div>
  );
}
