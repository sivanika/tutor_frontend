import { useFormContext } from "react-hook-form";

export default function AdminUpload() {
  const { setValue, watch } = useFormContext();

  const studentPhoto = watch("studentPhoto");
  const studentDocument = watch("studentDocument");

  const handlePhotoChange = (e) => {
    setValue("studentPhoto", e.target.files[0]);
  };

  const handleDocChange = (e) => {
    setValue("studentDocument", e.target.files[0]);
  };

  return (
    <div
      className="
        p-8 rounded-2xl space-y-8

        bg-white/90 dark:bg-slate-900/80
        backdrop-blur-xl

        border border-slate-200 dark:border-slate-800
        shadow-xl dark:shadow-black/40

        transition-all duration-300
      "
    >
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Final Verification Upload
      </h2>

      {/* Upload Photo */}
      <div className="space-y-3">
        <label className="block font-semibold text-slate-700 dark:text-slate-300">
          Upload Student Photo
        </label>

        <label
          className="
            flex items-center justify-between
            p-4 rounded-xl cursor-pointer

            bg-slate-50 dark:bg-slate-800
            border border-dashed border-slate-300 dark:border-slate-700

            hover:bg-slate-100 dark:hover:bg-slate-700
            transition
          "
        >
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            📸 Choose Photo
          </span>

          <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
            {studentPhoto ? studentPhoto.name : "No file selected"}
          </span>

          <input
            type="file"
            hidden
            onChange={handlePhotoChange}
          />
        </label>
      </div>

      {/* Upload Document */}
      <div className="space-y-3">
        <label className="block font-semibold text-slate-700 dark:text-slate-300">
          Upload Student Document
        </label>

        <label
          className="
            flex items-center justify-between
            p-4 rounded-xl cursor-pointer

            bg-slate-50 dark:bg-slate-800
            border border-dashed border-slate-300 dark:border-slate-700

            hover:bg-slate-100 dark:hover:bg-slate-700
            transition
          "
        >
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            📄 Choose Document
          </span>

          <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
            {studentDocument ? studentDocument.name : "No file selected"}
          </span>

          <input
            type="file"
            hidden
            onChange={handleDocChange}
          />
        </label>
      </div>

      {/* Info Box */}
      <div
        className="
          p-4 rounded-xl text-sm
          bg-yellow-50 dark:bg-yellow-900/20
          border border-yellow-200 dark:border-yellow-800
          text-yellow-700 dark:text-yellow-400
        "
      >
        Please ensure documents are clear and valid. 
        Our team will verify your submission before approval.
      </div>
    </div>
  );
}