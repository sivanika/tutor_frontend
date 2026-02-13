export default function StepExperience({ formData, setFormData, next, prev }) {
  const toggle = (key) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [key]: !formData.availability[key],
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Teaching Experience
      </h2>

      {/* Experience + Level */}
      <div className="grid md:grid-cols-2 gap-6">
        <input
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
          placeholder="Years of Experience"
          value={formData.yearsExperience}
          onChange={(e) =>
            setFormData({ ...formData, yearsExperience: e.target.value })
          }
        />

        <input
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
          placeholder="Teaching Level (e.g. School, College)"
          value={formData.teachingLevel}
          onChange={(e) =>
            setFormData({ ...formData, teachingLevel: e.target.value })
          }
        />
      </div>

      {/* Subjects */}
      <textarea
        className="
          w-full p-3 rounded-lg
          bg-slate-50 dark:bg-slate-800
          border border-slate-300 dark:border-slate-700
          text-slate-800 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-slate-500
          transition
        "
        placeholder="Subjects you teach"
        value={formData.subjects}
        onChange={(e) =>
          setFormData({ ...formData, subjects: e.target.value })
        }
      />

      {/* Hourly Rate */}
      <input
        className="
          w-full p-3 rounded-lg
          bg-slate-50 dark:bg-slate-800
          border border-slate-300 dark:border-slate-700
          text-slate-800 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-slate-500
          transition
        "
        placeholder="Hourly Rate"
        value={formData.hourlyRate}
        onChange={(e) =>
          setFormData({ ...formData, hourlyRate: e.target.value })
        }
      />

      {/* Availability */}
      <div>
        <p className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">
          Availability
        </p>

        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData.availability).map((i) => (
            <label
              key={i}
              className="
                flex items-center gap-3 p-3 rounded-lg
                border border-slate-300 dark:border-slate-700
                bg-slate-50 dark:bg-slate-800
                cursor-pointer
                hover:bg-slate-100 dark:hover:bg-slate-700
                transition
              "
            >
              <input
                type="checkbox"
                checked={formData.availability[i]}
                onChange={() => toggle(i)}
                className="accent-slate-800 dark:accent-slate-200"
              />
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {i.toUpperCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={prev}
          className="
            px-5 py-2.5 rounded-lg font-medium

            bg-slate-200 text-slate-800
            hover:bg-slate-300

            dark:bg-slate-800 dark:text-slate-200
            dark:hover:bg-slate-700

            transition
          "
        >
          ← Back
        </button>

        <button
          onClick={next}
          className="
            px-6 py-2.5 rounded-lg font-semibold

            bg-slate-900 text-white
            hover:bg-black

            dark:bg-slate-100 dark:text-black
            dark:hover:bg-white

            transition-all duration-200
            active:scale-95
          "
        >
          Next →
        </button>
      </div>
    </div>
  );
}