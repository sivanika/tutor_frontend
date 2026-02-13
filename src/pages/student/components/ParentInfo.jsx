export default function ParentInfo({ formData, setFormData, errors }) {
  return (
    <div
      className="
        rounded-2xl p-6 space-y-6

        bg-white
        dark:bg-slate-900/80

        border border-slate-200 dark:border-slate-800
        shadow-md dark:shadow-black/30

        backdrop-blur-xl
        transition-colors duration-300
      "
    >
      {/* Title */}
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Parent / Guardian Verification
      </h2>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-5">
        <input
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
          placeholder="Parent Name"
        />

        <select
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
        >
          <option>Select Relationship</option>
          <option>Father</option>
          <option>Mother</option>
        </select>
      </div>

      {/* Consent */}
      <label
        className="
          flex items-start gap-3
          p-4 rounded-lg

          bg-slate-50 dark:bg-slate-800
          border border-slate-200 dark:border-slate-700

          cursor-pointer
        "
      >
        <input
          type="checkbox"
          className="mt-1 accent-slate-900 dark:accent-slate-100"
        />
        <span className="text-sm text-slate-700 dark:text-slate-300">
          I consent to ProfessorOn contacting me for verification
        </span>
      </label>
    </div>
  );
}
