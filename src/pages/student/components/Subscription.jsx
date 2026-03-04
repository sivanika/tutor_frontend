import { useFormContext } from "react-hook-form";

export default function Subscription() {
  const { register, watch } = useFormContext();

  const selectedPlan = watch("subscriptionTier");

  const plans = [
    {
      id: "basic",
      title: "Basic",
      description: "Perfect for casual learners getting started.",
      features: [
        "Access to verified professors",
        "Standard support",
        "Flexible scheduling",
      ],
    },
    {
      id: "premium",
      title: "Premium",
      description: "Ideal for consistent academic improvement.",
      features: [
        "Priority professor matching",
        "Progress tracking dashboard",
        "Extended support hours",
      ],
    },
    {
      id: "elite",
      title: "Elite",
      description: "Best for competitive and advanced learners.",
      features: [
        "Top-rated professors",
        "Personal learning roadmap",
        "Dedicated academic mentor",
      ],
    },
  ];

  return (
    <div
      className="
        p-8 rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        backdrop-blur-xl
        border border-slate-200 dark:border-slate-800
        shadow-lg dark:shadow-black/30
        transition
      "
    >
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        Choose Your Subscription Plan
      </h2>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const active = selectedPlan === plan.id;

          return (
            <label
              key={plan.id}
              className={`
                cursor-pointer p-6 rounded-xl border transition-all duration-300
                ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white dark:bg-slate-100 dark:text-black dark:border-slate-100 shadow-xl"
                    : "border-slate-300 bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 hover:shadow-md"
                }
              `}
            >
              <input
                type="radio"
                value={plan.id}
                {...register("subscriptionTier")}
                className="hidden"
              />

              <h3 className="text-xl font-semibold mb-2">
                {plan.title}
              </h3>

              <p className="text-sm mb-4 opacity-80">
                {plan.description}
              </p>

              <ul className="space-y-2 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-lg">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </label>
          );
        })}
      </div>

      {/* Professor Preferences */}
      <div>
        <label className="block mb-2 font-medium text-slate-800 dark:text-slate-100">
          Professor Preferences
        </label>

        <textarea
          {...register("professorPreferences")}
          placeholder="Example: I prefer professors with 5+ years experience in Mathematics and patient teaching style..."
          rows="4"
          className="
            w-full p-4 rounded-xl
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
        />
      </div>
    </div>
  );
}