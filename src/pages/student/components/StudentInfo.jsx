export default function StudentInfo({ formData, setFormData, errors }) {
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputStyle = `
    w-full p-3 rounded-lg
    bg-slate-50 dark:bg-slate-800
    border border-slate-300 dark:border-slate-700
    text-slate-800 dark:text-slate-100
    placeholder-slate-400
    focus:outline-none focus:ring-2 focus:ring-slate-500
    transition
  `;

  return (
    <div
      className="
        w-full p-8 rounded-2xl

        bg-white/90 dark:bg-slate-900/80
        backdrop-blur-xl

        border border-slate-200 dark:border-slate-800
        shadow-lg dark:shadow-black/30

        transition
      "
    >
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        Student Information
      </h2>

      {/* Name */}
      <div className="grid md:grid-cols-2 gap-5">
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={inputStyle}
          placeholder="First Name"
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Last Name"
        />
      </div>

      {/* Contact */}
      <div className="grid md:grid-cols-2 gap-5 mt-4">
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Email Address"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Phone Number"
        />
      </div>

      {/* DOB + Grade */}
      <div className="grid md:grid-cols-2 gap-5 mt-4">
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className={inputStyle}
        />
        <select
          name="gradeLevel"
          value={formData.gradeLevel}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="">Select Grade Level</option>
          <option>High School</option>
          <option>College</option>
        </select>
      </div>

      {/* Goals */}
      <textarea
        name="learningGoals"
        value={formData.learningGoals}
        onChange={handleChange}
        className={`${inputStyle} mt-4`}
        placeholder="Learning Goals"
      />

      {/* Subjects */}
      <textarea
        name="subjects"
        value={formData.subjects}
        onChange={handleChange}
        className={`${inputStyle} mt-4`}
        placeholder="Subjects Needing Help"
      />
    </div>
  );
}
