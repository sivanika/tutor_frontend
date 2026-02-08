export default function Availability({ formData, setFormData, errors }) {
  const slots = ["Mon Morning", "Thu mon", "Tue Evening", "Sat Morning"];

  const toggleSlot = slot => {
    const updated = formData.availability.includes(slot)
      ? formData.availability.filter(s => s !== slot)
      : [...formData.availability, slot];

    setFormData({ ...formData, availability: updated });
  };

  return (
    <>
      <div className="card">
  <h2 className="section">Free Time Availability</h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {slots.map(slot => (
      <button
        key={slot}
        onClick={() => toggleSlot(slot)}
        className={`p-3 rounded-lg border font-medium
          ${
            formData.availability.includes(slot)
              ? "bg-primary text-white border-primary"
              : "bg-white hover:bg-gray-100"
          }`}
      >
        {slot}
      </button>
    ))}
  </div>
</div>


      {errors.availability && <p className="error">{errors.availability}</p>}
    </>
  );
}
