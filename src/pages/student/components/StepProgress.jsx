export default function StepProgress({ currentStep }) {
  const steps = ["Student", "Parent", "School", "Availability", "Subscription"];

  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded" />

        <div
          className="absolute top-5 left-0 h-1 bg-slate-900 dark:bg-slate-100 rounded transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {steps.map((s, i) => {
          const isActive = currentStep >= i + 1;

          return (
            <div key={s} className="relative z-10 flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={`
                  w-10 h-10 flex items-center justify-center
                  rounded-full text-sm font-semibold
                  transition-all duration-300

                  ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-black"
                      : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }
                `}
              >
                {i + 1}
              </div>

              {/* Label */}
              <span
                className={`
                  mt-3 text-sm font-medium text-center
                  ${
                    isActive
                      ? "text-slate-900 dark:text-slate-100"
                      : "text-slate-400 dark:text-slate-500"
                  }
                `}
              >
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
