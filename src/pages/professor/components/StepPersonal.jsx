export default function StepPersonal({ formData, setFormData, next }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        Personal Information
      </h2>

      {/* Input grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <input
          className="opt-input"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />

        <input
          className="opt-input"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />

        <input
          className="opt-input"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          className="opt-input"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
        />

        <select
          className="opt-input"
          value={formData.country}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
        >
          <option value="">Select Country</option>
          <option>India</option>
          <option>USA</option>
          <option>UK</option>
        </select>

        <select
          className="opt-input"
          value={formData.timezone}
          onChange={(e) =>
            setFormData({ ...formData, timezone: e.target.value })
          }
        >
          <option value="">Select Timezone</option>
          <option>IST</option>
          <option>EST</option>
          <option>PST</option>
        </select>
      </div>

      {/* Bio */}
      <textarea
        className="opt-input mt-6"
        rows="4"
        placeholder="Professional Bio"
        value={formData.bio}
        onChange={(e) =>
          setFormData({ ...formData, bio: e.target.value })
        }
      />

      {/* File Upload */}
      <label
        className="
          mt-6 flex items-center justify-between
          p-4 rounded-xl cursor-pointer

          bg-slate-50 dark:bg-slate-800
          border border-slate-300 dark:border-slate-700

          text-slate-700 dark:text-slate-200
          hover:bg-slate-100 dark:hover:bg-slate-700
          transition
        "
      >
        <span className="font-medium">📸 Upload Profile Photo</span>
        <span className="text-sm text-slate-500">
          {formData.profilePhoto?.name || "Choose File"}
        </span>

        <input
          type="file"
          hidden
          onChange={(e) =>
            setFormData({ ...formData, profilePhoto: e.target.files[0] })
          }
        />
      </label>

      {/* Next button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={next}
          className="
            px-6 py-3 rounded-lg font-semibold

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