import { useState } from "react";
import { useFormContext } from "react-hook-form";

function UploadZone({ label, icon, description, fileName, onChange }) {
  return (
    <label className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 group
      border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50">
      <div className="w-14 h-14 rounded-2xl bg-white shadow flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      {fileName ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-medium shadow-lg shadow-indigo-200">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="max-w-[140px] truncate">{fileName}</span>
        </div>
      ) : (
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold border border-slate-200 text-slate-500 bg-white group-hover:border-indigo-300 group-hover:text-indigo-600 transition-all">
          Browse File
        </span>
      )}
      <input type="file" className="hidden" onChange={onChange} />
    </label>
  );
}

export default function AdminUpload() {
  const { setValue } = useFormContext();
  const [photoName, setPhotoName] = useState("");
  const [docName, setDocName] = useState("");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg shadow-violet-200">
          📎
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Verification Documents</h2>
          <p className="text-xs text-slate-400 mt-0.5">Upload your documents for admin review and approval</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <UploadZone
          label="Student Photo"
          icon="📸"
          description="Clear, recent headshot (JPG, PNG)"
          fileName={photoName}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) { setValue("studentPhoto", file); setPhotoName(file.name); }
          }}
        />
        <UploadZone
          label="Supporting Document"
          icon="📄"
          description="ID, transcript, or enrollment letter"
          fileName={docName}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) { setValue("studentDocument", file); setDocName(file.name); }
          }}
        />
      </div>

      {/* Info banner */}
      <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
        <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong className="font-semibold">Important:</strong> Ensure all documents are clear, unobstructed, and valid.
          Our team will verify your submission within 1–2 business days before activation.
        </p>
      </div>
    </div>
  );
}