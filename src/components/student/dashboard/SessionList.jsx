export default function SessionList({ title, sessions, statusColor }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold mb-4 text-[var(--primary)]">
        {title}
      </h3>

      {sessions.length === 0 && (
        <p className="text-gray-500">No sessions found</p>
      )}

      {sessions.map(s => (
        <div
          key={s._id}
          className="flex justify-between items-center border-b py-3"
        >
          <div>
            <h4 className="font-semibold text-[var(--primary)]">
              {s.title}
            </h4>
            <p className="text-sm text-gray-500">
              {s.professor?.name} • {s.date} {s.time}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
          >
            {new Date(`${s.date} ${s.time}`) > new Date()
              ? "Scheduled"
              : "Completed"}
          </span>
        </div>
      ))}
    </div>
  )
}
