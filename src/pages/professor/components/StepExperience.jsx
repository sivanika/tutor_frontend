export default function StepExperience({ formData, setFormData, next, prev }) {
  const toggle = (key) => {
    setFormData({
      ...formData,
      availability: { ...formData.availability, [key]: !formData.availability[key] }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Teaching Experience</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <input className="input" placeholder="Experience"
          value={formData.yearsExperience}
          onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })}
        />

        <input className="input" placeholder="Teaching Level"
          value={formData.teachingLevel}
          onChange={e => setFormData({ ...formData, teachingLevel: e.target.value })}
        />
      </div>

      <textarea className="input mt-6" placeholder="Subjects"
        value={formData.subjects}
        onChange={e => setFormData({ ...formData, subjects: e.target.value })}
      />

      <input className="input mt-6" placeholder="Hourly Rate"
        value={formData.hourlyRate}
        onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4 mt-6">
        {Object.keys(formData.availability).map(i => (
          <label key={i} className="flex items-center gap-2 font-semibold">
            <input type="checkbox" checked={formData.availability[i]} onChange={() => toggle(i)} />
            {i.toUpperCase()}
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={prev} className="btn-secondary">← Back</button>
        <button onClick={next} className="btn-primary">Next →</button>
      </div>
    </div>
  );
}
