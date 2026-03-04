import { useFormContext } from "react-hook-form";

export default function ParentInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        Parent / Guardian Information
      </h2>

      {/* Name + Relationship */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <input
            {...register("parentName")}
            placeholder="Parent Name"
            className={inputStyle}
          />
          {errors.parentName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.parentName.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register("parentRelationship")}
            placeholder="Relationship"
            className={inputStyle}
          />
          {errors.parentRelationship && (
            <p className="text-red-500 text-sm mt-1">
              {errors.parentRelationship.message}
            </p>
          )}
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <div>
          <input
            {...register("parentEmail")}
            placeholder="Parent Email"
            className={inputStyle}
          />
          {errors.parentEmail && (
            <p className="text-red-500 text-sm mt-1">
              {errors.parentEmail.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register("parentPhone")}
            placeholder="Parent Phone"
            className={inputStyle}
          />
          {errors.parentPhone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.parentPhone.message}
            </p>
          )}
        </div>
      </div>

      {/* Consent */}
      <div className="mt-6">
        <label
          className="
            flex items-start gap-3 p-4 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-200 dark:border-slate-700
            cursor-pointer
          "
        >
          <input
            type="checkbox"
            {...register("parentConsent")}
            className="mt-1 accent-slate-900 dark:accent-slate-100"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            I consent to ProfessorOn contacting me for verification.
          </span>
        </label>

        {errors.parentConsent && (
          <p className="text-red-500 text-sm mt-2">
            {errors.parentConsent.message}
          </p>
        )}
      </div>
    </div>
  );
}