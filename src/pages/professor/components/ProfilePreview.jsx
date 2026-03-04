export default function ProfilePreview({ formData, restart, submit }) {
  return (
    <div
      className="
        bg-white/90 dark:bg-slate-900/80
        backdrop-blur-2xl
        p-8 rounded-2xl
        border border-slate-200 dark:border-slate-800
        shadow-xl dark:shadow-black/40
        transition-colors
      "
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={
            formData.profilePhoto
              ? URL.createObjectURL(formData.profilePhoto)
              : "https://via.placeholder.com/100"
          }
          className="
            w-28 h-28 rounded-full
            border-4 border-slate-300 dark:border-slate-700
            object-cover
            shadow-md
          "
        />

        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {formData.firstName} {formData.lastName}
          </h2>

          <p className="text-slate-600 dark:text-slate-400">
            {formData.fieldOfStudy} Professor
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {formData.country} ({formData.timezone})
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
        <p className="text-slate-700 dark:text-slate-300">
          <b>Email:</b> {formData.email}
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          <b>Phone:</b> {formData.phone}
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          <b>Education:</b> {formData.highestDegree}
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          <b>University:</b> {formData.university}
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          <b>Experience:</b> {formData.yearsExperience}
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          <b>Hourly Rate:</b> ${formData.hourlyRate}/hr
        </p>
      </div>

      {/* Bio */}
      <div className="mt-6">
        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
          Bio
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {formData.bio}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={restart}
          className="
            px-6 py-3 rounded-xl font-semibold
            bg-slate-200 text-slate-800
            hover:bg-slate-300
            dark:bg-slate-800 dark:text-slate-200
            dark:hover:bg-slate-700
            transition
          "
        >
          Edit Again
        </button>

        <button
          onClick={submit}
          className="
            px-6 py-3 rounded-xl font-bold
            bg-slate-900 text-white
            hover:bg-black
            dark:bg-slate-100 dark:text-black
            dark:hover:bg-white
            shadow-md
            hover:shadow-xl
            hover:-translate-y-0.5
            transition-all duration-200
          "
        >
          Confirm & Submit
        </button>
      </div>
    </div>
  );
}
