export default function SchoolInfo() {
  return (
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
      <h2 className="text-slate-800 dark:text-slate-100 text-xl font-semibold mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
        School Verification
      </h2>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <input
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
          placeholder="School Email Address"
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
          placeholder="Student ID Number"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          className="
            w-4 h-4 rounded
            accent-slate-800
            dark:accent-slate-200
          "
        />
        <span className="text-sm">
          I authorize school verification
        </span>
      </label>
    </div>
  );
}
