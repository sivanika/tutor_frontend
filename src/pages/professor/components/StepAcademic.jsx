import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { academicSchema } from "../validation/schemas";
import { useState } from "react";

const inputCls = `
  w-full px-4 py-3 rounded-xl text-sm text-slate-800
  bg-white border border-slate-200
  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
  placeholder-slate-300 transition-all duration-200 shadow-sm hover:border-indigo-300
`;

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
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

export default function StepAcademic({ formData, setFormData, next, prev }) {
  const [certName, setCertName] = useState(formData.degreeCertificate?.name || "");

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(academicSchema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    setFormData({ ...formData, ...data });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-lg shadow-blue-200">
          🎓
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Academic Details</h2>
          <p className="text-xs text-slate-400 mt-0.5">Your educational background and qualifications</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Highest Degree" error={errors.highestDegree?.message}>
            <select {...register("highestDegree")} className={inputCls}>
              <option value="">Select degree…</option>
              <option>PhD</option>
              <option>Masters</option>
              <option>Bachelors</option>
            </select>
          </Field>
          <Field label="Field of Study" error={errors.fieldOfStudy?.message}>
            <input {...register("fieldOfStudy")} className={inputCls} placeholder="e.g. Computer Science" />
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="University / Institution" error={errors.university?.message}>
            <input {...register("university")} className={inputCls} placeholder="e.g. MIT, Oxford" />
          </Field>
          <Field label="Graduation Year" error={errors.graduationYear?.message}>
            <input {...register("graduationYear")} className={inputCls} placeholder="e.g. 2019" />
          </Field>
        </div>

        <Field label="Specializations" error={errors.specializations?.message}>
          <input {...register("specializations")} className={inputCls} placeholder="e.g. Machine Learning, Data Structures" />
        </Field>

        <Field label="Certifications" error={errors.certifications?.message}>
          <textarea {...register("certifications")} className={`${inputCls} resize-none`} rows={3} placeholder="List any professional certificates or teaching credentials…" />
        </Field>

        {/* Degree certificate upload */}
        <Field label="Degree Certificate" error={errors.degreeCertificate?.message}>
          <label className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white shadow flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📜</div>
              <div>
                <p className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                  {certName || "Upload degree certificate"}
                </p>
                <p className="text-xs text-slate-400">PDF, JPG, PNG</p>
              </div>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 group-hover:border-indigo-300 group-hover:text-indigo-600 transition-all font-semibold">Browse</span>
            <input type="file" hidden onChange={(e) => {
              const f = e.target.files[0];
              if (f) { setValue("degreeCertificate", f); setCertName(f.name); }
            }} />
          </label>
        </Field>
      </div>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={prev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button type="submit"
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all">
          Continue
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </form>
  );
}
