export default function Subscription() {
  return (
    <div className="card">
  <h2 className="section">Professor Subscription Preferences</h2>

  <div className="grid md:grid-cols-3 gap-6">
    {["Basic", "Premium", "Elite"].map(plan => (
      <div
        key={plan}
        className="border rounded-xl p-6 hover:shadow-lg cursor-pointer transition"
      >
        <h3 className="text-xl font-semibold text-primary mb-2">{plan}</h3>
        <p className="text-gray-600">Best suited for {plan} learners</p>
      </div>
    ))}
  </div>
</div>

  );
}
