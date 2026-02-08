export default function StepAcademic({ formData, setFormData, next, prev }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Academic Details</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <select className="input"
          value={formData.highestDegree}
          onChange={e => setFormData({ ...formData, highestDegree: e.target.value })}>
          <option value="">Highest Degree</option>
          <option>PhD</option>
          <option>Masters</option>
          <option>Bachelors</option>
        </select>

        <input className="input" placeholder="Field of Study"
          value={formData.fieldOfStudy}
          onChange={e => setFormData({ ...formData, fieldOfStudy: e.target.value })}
        />

        <input className="input" placeholder="University"
          value={formData.university}
          onChange={e => setFormData({ ...formData, university: e.target.value })}
        />

        <input className="input" placeholder="Graduation Year"
          value={formData.graduationYear}
          onChange={e => setFormData({ ...formData, graduationYear: e.target.value })}
        />
      </div>

      <input className="input mt-6" placeholder="Specializations"
        value={formData.specializations}
        onChange={e => setFormData({ ...formData, specializations: e.target.value })}
      />

      <textarea className="input mt-6" rows="3" placeholder="Certifications"
        value={formData.certifications}
        onChange={e => setFormData({ ...formData, certifications: e.target.value })}
      />

      {/* ✅ DEGREE FILE UPLOAD */}
      <label className="file-box mt-6">
        📄 Upload Degree Certificate
        <span>{formData.degreeCertificate?.name || "Choose File"}</span>
        <input type="file" hidden
          onChange={e => setFormData({ ...formData, degreeCertificate: e.target.files[0] })}
        />
      </label>

      <div className="flex justify-between mt-8">
        <button onClick={prev} className="btn-secondary">← Back</button>
        <button onClick={next} className="btn-primary">Next →</button>
      </div>
    </div>
  );
}
