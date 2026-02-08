export default function ParentInfo({ formData, setFormData, errors }) {
  return (
    <div className="card">
  <h2 className="section">Parent / Guardian Verification</h2>

  <div className="grid md:grid-cols-2 gap-5">
    <input className="input" placeholder="Parent Name" />
    <select className="input">
      <option>Select Relationship</option>
      <option>Father</option>
      <option>Mother</option>
    </select>
  </div>

  <label className="flex items-center gap-3 mt-4 bg-gray-50 p-3 rounded-lg">
    <input type="checkbox" />
    <span className="text-sm">
      I consent to ProfessorOn contacting me for verification
    </span>
  </label>
</div>

  );
}
