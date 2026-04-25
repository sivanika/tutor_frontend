import { useFormContext } from "react-hook-form";

/** Reusable floating-label field wrapper */
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

export default function StudentInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-200">
          👤
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Student Information</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tell us about yourself so we can find your perfect tutor</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Name row */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="First Name" error={errors.firstName?.message}>
            <input {...register("firstName")} className={inputCls} placeholder="e.g. Alex" />
          </Field>
          <Field label="Last Name" error={errors.lastName?.message}>
            <input {...register("lastName")} className={inputCls} placeholder="e.g. Johnson" />
          </Field>
        </div>

        {/* Contact row */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Email Address" error={errors.email?.message}>
            <input {...register("email")} className={inputCls} placeholder="you@example.com" />
          </Field>
          <Field label="Phone Number" error={errors.phone?.message}>
            <input {...register("phone")} className={inputCls} placeholder="+1 (555) 000-0000" />
          </Field>
        </div>

        {/* DOB + Grade */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Date of Birth" error={errors.birthDate?.message}>
            <input type="date" {...register("birthDate")} className={inputCls} />
          </Field>
          <Field label="Grade Level" error={errors.gradeLevel?.message}>
            <select {...register("gradeLevel")} className={inputCls}>
              <option value="">Select level…</option>
              <option value="High School">High School</option>
              <option value="College">College</option>
            </select>
          </Field>
        </div>

        {/* School */}
        <Field label="School / Institution" error={errors.school?.message}>
          <input {...register("school")} className={inputCls} placeholder="Name of your school or university" />
        </Field>

        {/* Learning Goals */}
        <Field label="Learning Goals" error={errors.learningGoals?.message}>
          <textarea
            {...register("learningGoals")}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="What do you hope to achieve with tutoring?"
          />
        </Field>

        {/* Subjects */}
        <Field label="Subjects Needing Help" error={errors.subjects?.message}>
          <textarea
            {...register("subjects")}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="e.g. Calculus, Physics, English Literature…"
          />
        </Field>
      </div>
    </div>
  );
}
