import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verificationSchema } from "../validation/schemas";

function UploadRow({ icon, label, fileName, onChange, error }) {
  return (
    <div>
      <label className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white shadow flex items-center justify-center text-lg group-hover:scale-110 transition-transform">{icon}</div>
          <div>
            <p className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">{label}</p>
            {fileName ? (
              <p className="text-xs text-indigo-500 font-medium">{fileName}</p>
            ) : (
              <p className="text-xs text-slate-400">Click to browse</p>
            )}
          </div>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 group-hover:border-indigo-300 group-hover:text-indigo-600 transition-all font-semibold">Browse</span>
        <input type="file" hidden onChange={onChange} />
      </label>
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

function ConsentRow({ label, desc, checked, onChange, error }) {
  return (
    <div>
      <label className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-all duration-200">
        <div className="flex-shrink-0 mt-0.5">
          <input type="checkbox" className="w-5 h-5 rounded accent-indigo-600 cursor-pointer" checked={checked || false} onChange={onChange} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
        </div>
      </label>
      {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{error}</p>}
    </div>
  );
}

export default function StepVerification({ formData, setFormData, next, prev }) {
  const { handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: formData,
  });

  const governmentId = watch("governmentId");
  const videoIntroduction = watch("videoIntroduction");
  const terms = watch("terms");
  const consent = watch("consent");

  const onSubmit = (data) => {
    setFormData({ ...formData, ...data });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-lg shadow-lg shadow-slate-200">
          🔐
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Verification</h2>
          <p className="text-xs text-slate-400 mt-0.5">Verify your identity to build trust with students</p>
        </div>
      </div>

      <div className="space-y-4">
        <UploadRow
          icon="🪪"
          label="Government-issued ID"
          fileName={governmentId?.name}
          onChange={(e) => setValue("governmentId", e.target.files[0])}
          error={errors.governmentId?.message}
        />
        <UploadRow
          icon="🎥"
          label="Introduction Video (optional)"
          fileName={videoIntroduction?.name}
          onChange={(e) => setValue("videoIntroduction", e.target.files[0])}
          error={errors.videoIntroduction?.message}
        />
        <ConsentRow
          label="Accept Terms & Conditions"
          desc="I agree to ProfessorOn's tutor terms of service and community guidelines."
          checked={terms}
          onChange={() => setValue("terms", !terms)}
          error={errors.terms?.message}
        />
        <ConsentRow
          label="Consent to Verification"
          desc="I give permission for my documents to be reviewed and verified by the ProfessorOn team."
          checked={consent}
          onChange={() => setValue("consent", !consent)}
          error={errors.consent?.message}
        />
      </div>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={prev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button type="submit"
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all">
          Preview Profile
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </form>
  );
}
