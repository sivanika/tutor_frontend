import { useFormContext } from "react-hook-form";
import { FiCalendar, FiSun, FiSunrise, FiSunset, FiMoon } from "react-icons/fi";


const SCHEDULE_GROUPS = [
  {
    label: "Day Type",
    slots: [
      { id: "weekdays", label: "Weekdays", icon: <FiCalendar />, desc: "Mon – Fri" },
      { id: "weekends", label: "Weekends", icon: <FiSun />,      desc: "Sat & Sun" },
    ],
  },
  {
    label: "Time of Day",
    slots: [
      { id: "mornings", label: "Morning",   icon: <FiSunrise />,  desc: "6 AM – 12 PM" },
      { id: "afternoons", label: "Afternoon", icon: <FiSun />,      desc: "12 PM – 5 PM" },
      { id: "evenings", label: "Evening",   icon: <FiMoon />,     desc: "5 PM – 10 PM" },
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl shadow-lg shadow-amber-200">
          <FiCalendar />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Your Schedule</h2>
          <p className="text-xs text-slate-400 mt-0.5">Select when you're free — we'll match you with tutors who teach then</p>
        </div>
      </div>

      {/* Selected count badge */}
      <div className="mb-6 mt-4">
        {availability.length > 0 ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-100">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {availability.length} slot{availability.length !== 1 ? "s" : ""} selected
          </span>
        ) : (
          <span className="text-xs text-slate-400 italic">No slots selected yet</span>
        )}
      </div>

      <div className="space-y-6">
        {SCHEDULE_GROUPS.map(({ label, slots }) => (
          <div key={label}>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              {label}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {slots.map(({ id, label: slotLabel, emoji, desc }) => {
                const active = availability.includes(id);
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => toggle(id)}
                    className={`
                      p-4 rounded-xl font-medium text-sm border-2
                      flex flex-col items-start gap-1 transition-all duration-200
                      ${active
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-[1.02]"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm"
                      }
                    `}
                  >
                    <span className="text-xl">{icon}</span>

                    <span className="font-semibold leading-tight">{slotLabel}</span>
                    <span className={`text-xs leading-tight ${active ? "text-indigo-200" : "text-slate-400"}`}>
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {errors.availability && (
        <p className="mt-5 text-xs text-red-500 flex items-center gap-1.5 font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.availability.message}
        </p>
      )}
    </div>
  );
}
