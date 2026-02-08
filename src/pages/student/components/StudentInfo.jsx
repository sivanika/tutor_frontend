export default function StudentInfo({ formData, setFormData, errors }) {
  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="card">
      <h2 className="section">Student Information</h2>

      <div className="grid md:grid-cols-2 gap-5">
        <input name="firstName" value={formData.firstName} onChange={handleChange} className="input" placeholder="First Name" />
        <input name="lastName" value={formData.lastName} onChange={handleChange} className="input" placeholder="Last Name" />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-4">
        <input name="email" value={formData.email} onChange={handleChange} className="input" placeholder="Email Address" />
        <input name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="Phone Number" />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-4">
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="input" />
        <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} className="input">
          <option value="">Select Grade Level</option>
          <option>High School</option>
          <option>College</option>
        </select>
      </div>

      <textarea name="learningGoals" value={formData.learningGoals} onChange={handleChange} className="input mt-4" placeholder="Learning Goals" />
      <textarea name="subjects" value={formData.subjects} onChange={handleChange} className="input mt-4" placeholder="Subjects Needing Help" />
    </div>
  );
}
