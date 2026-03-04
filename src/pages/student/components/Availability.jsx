import { useFormContext } from "react-hook-form";

// These slots align with the professor's availability object keys:
// Professor stores: { weekdays, weekends, mornings, afternoons, evenings }
// Student selects which of those match their schedule
const SCHEDULE_GROUPS = [
  {
    label: "Day Type",
    slots: [
      { id: "weekdays", label: "Weekdays", emoji: "📅" },
      { id: "weekends", label: "Weekends", emoji: "🏖️" },
    ],
  },
  {
    label: "Time of Day",
    slots: [
      { id: "mornings", label: "Morning", emoji: "🌅" },
      { id: "afternoons", label: "Afternoon", emoji: "☀️" },
      { id: "evenings", label: "Evening", emoji: "🌙" },
    ],
  },
];

export default function Availability() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const availability = watch("availability") || [];

  const toggle = (slot) => {
    const updated = availability.includes(slot)
      ? availability.filter((s) => s !== slot)
      : [...availability, slot];
    setValue("availability", updated, { shouldValidate: true });
  };

  return (
    <div
      className="
        p-8 rounded-2xl

        bg-white/90 dark:bg-slate-900/80
        backdrop-blur-xl

        border border-slate-200 dark:border-slate-800
        shadow-lg dark:shadow-black/30

        transition-colors duration-300
      "
    >
      {/* Title */}
      <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">
        Your Availability
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Select when you are free — we will match you with professors who teach during those times.
      </p>

      {/* Grouped Slots */}
      <div className="space-y-6">
        {SCHEDULE_GROUPS.map(({ label, slots }) => (
          <div key={label}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              {label}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {slots.map(({ id, label: slotLabel, emoji }) => {
                const active = availability.includes(id);
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => toggle(id)}
                    className={`
                      p-4 rounded-xl font-medium text-sm
                      border transition-all duration-200
                      flex items-center gap-2

                      ${active
                        ? `bg-slate-900 text-white border-slate-900
                             shadow-md
                             dark:bg-slate-100 dark:text-black dark:border-slate-100`
                        : `bg-slate-50 text-slate-700 border-slate-300
                             hover:bg-slate-100
                             dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700`
                      }
                      hover:-translate-y-0.5
                      active:scale-95
                    `}
                  >
                    <span>{emoji}</span>
                    {slotLabel}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {errors.availability && (
        <p className="mt-4 text-sm text-red-500 font-medium">
          {errors.availability.message}
        </p>
      )}
    </div>
  );
}