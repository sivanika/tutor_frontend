import { useState } from "react";
import { useFormContext } from "react-hook-form";

function Field({ label, error, children }) {
  return (
    <div>
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

function UploadZone({ label, icon, fileName, onChange }) {
  return (
    <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group">
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow text-2xl group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <p className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">{label}</p>
      {fileName ? (
        <span className="text-xs text-indigo-500 font-medium bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">{fileName}</span>
      ) : (
        <span className="text-xs text-slate-400">Click to browse files</span>
      )}
      <input type="file" className="hidden" onChange={onChange} />
    </label>
  );
}

export default function SchoolInfo() {
  const { register, setValue } = useFormContext();
  const [photoName, setPhotoName] = useState("");
  const [docName, setDocName] = useState("");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-lg shadow-lg shadow-emerald-200">
          🏫
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">School Verification</h2>
          <p className="text-xs text-slate-400 mt-0.5">Verify your enrollment so tutors can trust your profile</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="School Email">
            <input {...register("schoolEmail")} className={inputCls} placeholder="you@school.edu" />
          </Field>
          <Field label="Student ID Number">
            <input {...register("studentId")} className={inputCls} placeholder="e.g. STU-2024-0001" />
          </Field>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-all duration-200">
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              {...register("schoolVerification")}
              className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Authorization</p>
            <p className="text-xs text-slate-500 mt-0.5">
              I authorize ProfessorOn to contact my school for enrollment verification.
            </p>
          </div>
        </label>

        {/* Upload zones */}
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <UploadZone
            label="Upload Student Photo"
            icon="📷"
            fileName={photoName}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setValue("studentPhoto", file);
                setPhotoName(file.name);
              }
            }}
          />
          <UploadZone
            label="Supporting Document"
            icon="📄"
            fileName={docName}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setValue("studentDocument", file);
                setDocName(file.name);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}