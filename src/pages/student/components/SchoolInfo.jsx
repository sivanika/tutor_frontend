import { useFormContext } from "react-hook-form";

export default function SchoolInfo() {
  const { register } = useFormContext();

  const inputStyle = `
    w-full p-3 rounded-lg
    bg-slate-50 dark:bg-slate-800
    border border-slate-300 dark:border-slate-700
    text-slate-800 dark:text-slate-100
    placeholder-slate-400
    focus:outline-none focus:ring-2 focus:ring-slate-500
    transition
  `;

  return (
    <div
      className="
        w-full p-8 rounded-2xl

        bg-white/90 dark:bg-slate-900/80
        backdrop-blur-xl

        border border-slate-200 dark:border-slate-800
        shadow-lg dark:shadow-black/30

        transition
      "
    >
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        School Verification
      </h2>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-5">
        <input
          {...register("schoolEmail")}
          placeholder="School Email Address"
          className={inputStyle}
        />

        <input
          {...register("studentId")}
          placeholder="Student ID Number"
          className={inputStyle}
        />
      </div>

      {/* Checkbox */}
      <label
        className="
          flex items-start gap-3 mt-6
          p-4 rounded-lg

          bg-slate-50 dark:bg-slate-800
          border border-slate-200 dark:border-slate-700

          cursor-pointer
        "
      >
        <input
          type="checkbox"
          {...register("schoolVerification")}
          className="mt-1 accent-slate-900 dark:accent-slate-100"
        />
        <span className="text-sm text-slate-700 dark:text-slate-300">
          I authorize school verification for account approval.
        </span>
      </label>

      {/* File Upload Section */}
      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <label
          className="
            flex flex-col items-center justify-center
            p-6 rounded-xl cursor-pointer

            bg-slate-50 dark:bg-slate-800
            border border-dashed border-slate-300 dark:border-slate-600

            text-slate-600 dark:text-slate-300
            hover:bg-slate-100 dark:hover:bg-slate-700

            transition
          "
        >
          📷 Upload Student Photo
          <input
            type="file"
            {...register("studentPhoto")}
            className="hidden"
          />
        </label>

        <label
          className="
            flex flex-col items-center justify-center
            p-6 rounded-xl cursor-pointer

            bg-slate-50 dark:bg-slate-800
            border border-dashed border-slate-300 dark:border-slate-600

            text-slate-600 dark:text-slate-300
            hover:bg-slate-100 dark:hover:bg-slate-700

            transition
          "
        >
          📄 Upload Supporting Document
          <input
            type="file"
            {...register("studentDocument")}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}