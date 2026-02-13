export default function Availability({ formData, setFormData, errors }) {
  const slots = ["Mon Morning", "Thu mon", "Tue Evening", "Sat Morning"];

  const toggleSlot = (slot) => {
    const updated = formData.availability.includes(slot)
      ? formData.availability.filter((s) => s !== slot)
      : [...formData.availability, slot];

    setFormData({ ...formData, availability: updated });
  };

  return (
    <>
      <div
        className="
          p-6 rounded-2xl

          bg-white/90 dark:bg-slate-900/80
          backdrop-blur-xl

          border border-slate-200 dark:border-slate-800
          shadow-md dark:shadow-black/30

          transition-colors duration-300
        "
      >
        <h2 className="text-xl font-semibold mb-5 text-slate-800 dark:text-slate-100">
          Free Time Availability
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {slots.map((slot) => {
            const active = formData.availability.includes(slot);

            return (
              <button
                key={slot}
                onClick={() => toggleSlot(slot)}
                className={`
                  p-3 rounded-lg border font-medium text-sm
                  transition-all duration-200

                  ${
                    active
                      ? `
                        bg-slate-900 text-white
                        border-slate-900
                        shadow-md
                        dark:bg-slate-100 dark:text-black dark:border-slate-100
                      `
                      : `
                        bg-slate-50 text-slate-700
                        border-slate-300
                        hover:bg-slate-100

                        dark:bg-slate-800
                        dark:text-slate-200
                        dark:border-slate-700
                        dark:hover:bg-slate-700
                      `
                  }

                  hover:-translate-y-0.5
                  active:scale-95
                `}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {errors.availability && (
        <p className="text-red-500 text-sm mt-2">
          {errors.availability}
        </p>
      )}
    </>
  );
}
