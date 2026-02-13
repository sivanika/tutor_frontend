export default function Subscription() {
  return (
    <div
      className="
        py-16 px-6
        bg-slate-50
        dark:bg-gradient-to-b dark:from-slate-900 dark:to-black
        transition-colors duration-500
      "
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="
            text-3xl md:text-4xl font-bold text-center mb-12
            text-slate-800 dark:text-slate-100
          "
        >
          Professor Subscription Preferences
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {["Basic", "Premium", "Elite"].map((plan, i) => (
            <div
              key={plan}
              className="
                group
                rounded-2xl p-8
                cursor-pointer

                bg-white dark:bg-slate-900/80
                backdrop-blur-xl

                border border-slate-200 dark:border-slate-800
                shadow-md dark:shadow-black/30

                transition-all duration-300
                hover:-translate-y-2 hover:shadow-xl
                animate-[fadeIn_.5s_ease]
              "
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3
                className="
                  text-2xl font-semibold mb-3
                  text-slate-800 dark:text-slate-100
                  group-hover:tracking-wide
                  transition
                "
              >
                {plan}
              </h3>

              <p className="text-slate-600 dark:text-slate-400">
                Best suited for {plan} learners
              </p>

              {/* subtle divider */}
              <div className="mt-6 h-px bg-slate-200 dark:bg-slate-800" />

              {/* fake price area for visual balance */}
              <p className="mt-6 text-lg font-medium text-slate-800 dark:text-slate-100">
                {plan === "Basic" && "Starter plan"}
                {plan === "Premium" && "Most popular choice"}
                {plan === "Elite" && "Full feature access"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(25px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
