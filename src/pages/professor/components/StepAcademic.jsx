export default function StepAcademic({ formData, setFormData, next, prev }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        Academic Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <select
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
          value={formData.highestDegree}
          onChange={(e) =>
            setFormData({ ...formData, highestDegree: e.target.value })
          }
        >
          <option value="">Highest Degree</option>
          <option>PhD</option>
          <option>Masters</option>
          <option>Bachelors</option>
        </select>

        <input
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
          placeholder="Field of Study"
          value={formData.fieldOfStudy}
          onChange={(e) =>
            setFormData({ ...formData, fieldOfStudy: e.target.value })
          }
        />

        <input
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
          placeholder="University"
          value={formData.university}
          onChange={(e) =>
            setFormData({ ...formData, university: e.target.value })
          }
        />

        <input
          className="
            w-full p-3 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700
            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
          placeholder="Graduation Year"
          value={formData.graduationYear}
          onChange={(e) =>
            setFormData({ ...formData, graduationYear: e.target.value })
          }
        />
      </div>

      <input
        className="
          w-full p-3 rounded-lg mt-6
          bg-slate-50 dark:bg-slate-800
          border border-slate-300 dark:border-slate-700
          text-slate-800 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-slate-500
          transition
        "
        placeholder="Specializations"
        value={formData.specializations}
        onChange={(e) =>
          setFormData({ ...formData, specializations: e.target.value })
        }
      />

      <textarea
        className="
          w-full p-3 rounded-lg mt-6
          bg-slate-50 dark:bg-slate-800
          border border-slate-300 dark:border-slate-700
          text-slate-800 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-slate-500
          transition
        "
        rows="3"
        placeholder="Certifications"
        value={formData.certifications}
        onChange={(e) =>
          setFormData({ ...formData, certifications: e.target.value })
        }
      />

      {/* Degree file upload */}
      <label
        className="
          mt-6 flex items-center justify-between
          p-4 rounded-xl cursor-pointer

          bg-slate-50 dark:bg-slate-800
          border border-dashed border-slate-300 dark:border-slate-600

          text-slate-700 dark:text-slate-300
          hover:bg-slate-100 dark:hover:bg-slate-700
          transition
        "
      >
        <span className="font-medium">
          📄 Upload Degree Certificate
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {formData.degreeCertificate?.name || "Choose File"}
        </span>

        <input
          type="file"
          hidden
          onChange={(e) =>
            setFormData({
              ...formData,
              degreeCertificate: e.target.files[0],
            })
          }
        />
      </label>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prev}
          className="
            px-6 py-2 rounded-lg font-medium

            bg-slate-200 text-slate-800
            hover:bg-slate-300

            dark:bg-slate-700 dark:text-white
            dark:hover:bg-slate-600

            transition
          "
        >
          ← Back
        </button>

        <button
          onClick={next}
          className="
            px-6 py-2 rounded-lg font-semibold

            bg-slate-900 text-white
            hover:bg-black

            dark:bg-slate-100 dark:text-black
            dark:hover:bg-white

            transition-all duration-200
            active:scale-95
          "
        >
          Next →
        </button>
      </div>
    </div>
  );
}