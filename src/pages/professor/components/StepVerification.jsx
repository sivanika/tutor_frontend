export default function StepVerification({ formData, setFormData, next, prev }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Verification</h2>

      <label className="file-box mb-6">
        🪪 Upload Government ID
        <span>{formData.governmentId?.name || "Choose File"}</span>
        <input type="file" hidden
          onChange={e => setFormData({ ...formData, governmentId: e.target.files[0] })}
        />
      </label>

      <label className="file-box mb-6">
        🎥 Upload Introduction Video
        <span>{formData.videoIntroduction?.name || "Choose File"}</span>
        <input type="file" hidden
          onChange={e => setFormData({ ...formData, videoIntroduction: e.target.files[0] })}
        />
      </label>

      <label className="flex gap-2 font-semibold mb-3">
        <input type="checkbox" checked={formData.terms}
          onChange={() => setFormData({ ...formData, terms: !formData.terms })} />
        Accept Terms
      </label>

      <label className="flex gap-2 font-semibold">
        <input type="checkbox" checked={formData.consent}
          onChange={() => setFormData({ ...formData, consent: !formData.consent })} />
        Consent Verification
      </label>

      <div className="flex justify-between mt-8">
        <button onClick={prev} className="btn-secondary">← Back</button>
        <button onClick={next} className="btn-primary">Preview →</button>
      </div>
    </div>
  );
}
