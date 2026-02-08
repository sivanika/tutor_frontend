export default function StatsCards({ enrolled, upcoming, completed }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-[var(--primary)] font-semibold">
          Enrolled Sessions
        </h3>
        <p className="text-3xl font-bold">{enrolled}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-[var(--primary)] font-semibold">
          Upcoming Sessions
        </h3>
        <p className="text-3xl font-bold">{upcoming}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-[var(--primary)] font-semibold">
          Completed Sessions
        </h3>
        <p className="text-3xl font-bold">{completed}</p>
      </div>
    </div>
  )
}
