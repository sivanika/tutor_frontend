import { FiUser, FiUsers, FiHome, FiCalendar, FiPaperclip, FiStar } from "react-icons/fi";

export default function StepProgress({ currentStep }) {
  const steps = [
    { label: "Student", icon: <FiUser /> },
    { label: "Parent", icon: <FiUsers /> },
    { label: "School", icon: <FiHome /> },
    { label: "Schedule", icon: <FiCalendar /> },
    { label: "Uploads", icon: <FiPaperclip /> },
    { label: "Plan", icon: <FiStar /> },
  ];


  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full mb-10">
      {/* Progress bar track */}
      <div className="relative mb-6">
        <div className="absolute top-5 left-0 w-full h-1.5 bg-slate-100 rounded-full" />
        <div
          className="absolute top-5 left-0 h-1.5 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
          }}
        />

        {/* Step bubbles */}
        <div className="relative flex justify-between">
          {steps.map(({ label, icon }, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isActive = currentStep === stepNumber;

            return (
              <div key={label} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 flex items-center justify-center
                    rounded-full text-sm font-bold
                    transition-all duration-400 ring-4
                    ${isCompleted
                      ? "bg-violet-600 text-white ring-violet-100 shadow-lg shadow-violet-200"
                      : isActive
                        ? "bg-indigo-600 text-white ring-indigo-100 shadow-lg shadow-indigo-200 scale-110"
                        : "bg-white text-slate-400 ring-slate-100 border border-slate-200"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{isActive ? icon : stepNumber}</span>

                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    mt-2.5 text-xs font-semibold tracking-wide transition-colors duration-300
                    ${isCompleted ? "text-violet-600" : isActive ? "text-indigo-600" : "text-slate-400"}
                  `}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
