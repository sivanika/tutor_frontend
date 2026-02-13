export default function StepVerification({ formData, setFormData, next, prev }) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Verification
      </h2>

      {/* Government ID */}
      <label
        className="
          flex items-center justify-between
          p-4 rounded-xl cursor-pointer

          bg-slate-50 dark:bg-slate-800
          border border-slate-300 dark:border-slate-700
          hover:bg-slate-100 dark:hover:bg-slate-700

          transition
        "
      >
        <span className="font-medium text-slate-700 dark:text-slate-200">
          🪪 Upload Government ID
        </span>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          {formData.governmentId?.name || "Choose File"}
        </span>

        <input
          type="file"
          hidden
          onChange={(e) =>
            setFormData({ ...formData, governmentId: e.target.files[0] })
          }
        />
      </label>

      {/* Video Introduction */}
      <label
        className="
          flex items-center justify-between
          p-4 rounded-xl cursor-pointer

          bg-slate-50 dark:bg-slate-800
          border border-slate-300 dark:border-slate-700
          hover:bg-slate-100 dark:hover:bg-slate-700

          transition
        "
      >
        <span className="font-medium text-slate-700 dark:text-slate-200">
          🎥 Upload Introduction Video
        </span>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          {formData.videoIntroduction?.name || "Choose File"}
        </span>

        <input
          type="file"
          hidden
          onChange={(e) =>
            setFormData({ ...formData, videoIntroduction: e.target.files[0] })
          }
        />
      </label>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={formData.terms}
            onChange={() =>
              setFormData({ ...formData, terms: !formData.terms })
            }
            className="w-4 h-4 accent-slate-800 dark:accent-slate-200"
          />
          <span className="font-medium">Accept Terms</span>
        </label>

        <label className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={() =>
              setFormData({ ...formData, consent: !formData.consent })
            }
            className="w-4 h-4 accent-slate-800 dark:accent-slate-200"
          />
          <span className="font-medium">Consent Verification</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prev}
          className="
            px-5 py-2.5 rounded-lg font-medium

            bg-slate-200 text-slate-800
            hover:bg-slate-300

            dark:bg-slate-800 dark:text-slate-200
            dark:hover:bg-slate-700

            transition
          "
        >
          ← Back
        </button>

        <button
          onClick={next}
          className="
            px-6 py-2.5 rounded-lg font-semibold

            bg-slate-900 text-white
            hover:bg-black

            dark:bg-slate-100 dark:text-black
            dark:hover:bg-white

            transition-all duration-200
            active:scale-95
          "
        >
          Preview →
        </button>
      </div>
    </div>
  );
}