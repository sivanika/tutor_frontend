export default function SessionItem({ session, status }) {
  return (
    <div className="flex justify-between items-center border-b py-3">
      <div>
        <h4 className="font-semibold">{session.title}</h4>
        <p className="text-sm text-gray-500">
          {new Date(session.date).toLocaleString()}
        </p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold
        ${
          status === "upcoming"
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {status}
      </span>
    </div>
  )
}
