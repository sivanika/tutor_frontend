export default function AdminUpload({ formData, setFormData }) {
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      studentPhoto: file,
    });
  };

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      studentDocument: file,
    });
  };

  return (
    <div className="space-y-6 mt-6">

      {/* Photo Upload */}
      <div
        className="
          p-5 rounded-xl
          bg-white dark:bg-slate-900/80
          border border-slate-200 dark:border-slate-800
          shadow-sm dark:shadow-black/30
          transition
        "
      >
        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">
          Upload Student Photo
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-700 dark:text-slate-200
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:bg-slate-900 file:text-white
            file:font-medium
            hover:file:bg-black
            dark:file:bg-slate-100 dark:file:text-black
            dark:hover:file:bg-white
            transition
          "
        />
      </div>

      {/* Document Upload */}
      <div
        className="
          p-5 rounded-xl
          bg-white dark:bg-slate-900/80
          border border-slate-200 dark:border-slate-800
          shadow-sm dark:shadow-black/30
          transition
        "
      >
        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">
          Upload Student Document
        </label>

        <input
          type="file"
          onChange={handleDocChange}
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-700 dark:text-slate-200
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:bg-slate-900 file:text-white
            file:font-medium
            hover:file:bg-black
            dark:file:bg-slate-100 dark:file:text-black
            dark:hover:file:bg-white
            transition
          "
        />
      </div>
    </div>
  );
}
