import { useFormContext } from "react-hook-form";
import { FiUsers } from "react-icons/fi";


function Field({ label, error, children }) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = `
  w-full px-4 py-3 rounded-xl text-sm text-slate-800
  bg-white border border-slate-200
  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
  placeholder-slate-300 transition-all duration-200 shadow-sm
  hover:border-indigo-300
`;

export default function ParentInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xl shadow-lg shadow-pink-200">
          <FiUsers />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Parent / Guardian</h2>
          <p className="text-xs text-slate-400 mt-0.5">We need a guardian's info for students under 18</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Name + Relationship */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Guardian Name" error={errors.parentName?.message}>
            <input {...register("parentName")} className={inputCls} placeholder="Full legal name" />
          </Field>
          <Field label="Relationship" error={errors.parentRelationship?.message}>
            <input {...register("parentRelationship")} className={inputCls} placeholder="e.g. Mother, Father, Guardian" />
          </Field>
        </div>

        {/* Email + Phone */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Guardian Email" error={errors.parentEmail?.message}>
            <input {...register("parentEmail")} className={inputCls} placeholder="parent@example.com" />
          </Field>
          <Field label="Guardian Phone" error={errors.parentPhone?.message}>
            <input {...register("parentPhone")} className={inputCls} placeholder="+1 (555) 000-0000" />
          </Field>
        </div>

        {/* Consent */}
        <div className="mt-2">
          <label className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 cursor-pointer group hover:bg-indigo-100 transition-all duration-200">
            <div className="flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                {...register("parentConsent")}
                className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Parental Consent</p>
              <p className="text-xs text-slate-500 mt-0.5">
                I consent to ProfessorOn contacting me regarding my child's tutoring sessions and for account verification purposes.
              </p>
            </div>
          </label>
          {errors.parentConsent && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.parentConsent.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
