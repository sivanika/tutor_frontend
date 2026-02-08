export default function StepPersonal({ formData, setFormData, next }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Personal Information</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <input className="input" placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />

        <input className="input" placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />

        <input className="input" placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input className="input" placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <select className="input" value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}>
          <option value="">Select Country</option>
          <option>India</option>
          <option>USA</option>
          <option>UK</option>
        </select>

        <select className="input" value={formData.timezone}
          onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}>
          <option value="">Select Timezone</option>
          <option>IST</option>
          <option>EST</option>
          <option>PST</option>
        </select>
      </div>

      <textarea className="input mt-6" rows="4" placeholder="Professional Bio"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
      />

      <label className="file-box mt-6">
        📸 Upload Profile Photo
        <span>{formData.profilePhoto?.name || "Choose File"}</span>
        <input type="file" hidden
          onChange={e => setFormData({ ...formData, profilePhoto: e.target.files[0] })}
        />
      </label>

      <div className="flex justify-end mt-8">
        <button onClick={next} className="btn-primary">Next →</button>
      </div>
    </div>
  );
}
