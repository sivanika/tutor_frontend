export default function VerificationStatus({ submitted }) {
  const statusStyles = submitted
    ? {
        container:
          "bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800 text-green-700 dark:text-green-400",
        iconBg:
          "bg-green-500 text-white dark:bg-green-400 dark:text-black",
        icon: "✓",
        badge:
          "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
        message:
          "Profile submitted for verification. Our team will review it.",
      }
    : {
        container:
          "bg-gradient-to-r from-yellow-50/80 to-amber-50/80 border-yellow-200 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400",
        iconBg:
          "bg-yellow-500 text-white dark:bg-yellow-400 dark:text-black",
        icon: "⏳",
        badge:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
        message:
          "Your profile is pending verification. Please complete all sections.",
      };

  return (
    <div
      className={`
        relative flex items-center gap-5 p-5 rounded-2xl mb-8
        border backdrop-blur-2xl shadow-md
        transition-all duration-300
        hover:shadow-lg
        ${statusStyles.container}
      `}
    >
      {/* Glow Background Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-20 blur-xl bg-white dark:bg-black pointer-events-none" />

      {/* Icon */}
      <div
        className={`
          relative z-10
          w-12 h-12 flex items-center justify-center
          rounded-xl text-xl font-bold
          shadow-md
          transition-transform duration-300
          hover:scale-105
          ${statusStyles.iconBg}
        `}
      >
        {statusStyles.icon}
      </div>

      {/* Text Area */}
      <div className="relative z-10 flex flex-col">
        <span className="text-sm font-semibold tracking-wide">
          Verification Status
        </span>

        <span className="text-sm opacity-90 mt-1 leading-relaxed">
          {statusStyles.message}
        </span>
      </div>

      {/* Status Badge */}
      <div
        className={`
          relative z-10 ml-auto
          px-3 py-1 rounded-full text-xs font-semibold
          ${statusStyles.badge}
        `}
      >
        {submitted ? "Submitted" : "Pending"}
      </div>
    </div>
  );
}