import API from "../../../services/api"

export default function TutorCard({ session, onEnroll }) {
  const handleEnroll = async () => {
    try {
      await API.post(`/sessions/${session._id}/enroll`)
      alert("Successfully Enrolled 🎉")
      onEnroll()
    } catch (err) {
      alert(err.response?.data?.message || "Enroll failed")
    }
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow border-l-4 border-[var(--success)] hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center mr-3">
          <i className="fas fa-user-graduate"></i>
        </div>
        <div>
          <h4 className="font-bold text-[var(--primary)]">
            {session.professor?.name}
          </h4>
          <p className="text-sm text-gray-500">
            {session.title} • {session.level}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="text-sm text-gray-600 mb-2">
        <p>
          <i className="fas fa-book mr-2 text-[var(--accent)]"></i>
          {session.title}
        </p>
        <p>
          <i className="fas fa-clock mr-2 text-[var(--accent)]"></i>
          {session.date} {session.time}
        </p>
      </div>

      {/* Slots */}
      <div className="flex gap-2 flex-wrap mb-3">
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
          {session.time}
        </span>
      </div>

      {/* Book Button */}
      <button
        onClick={handleEnroll}
        className="w-full bg-[var(--accent)] text-white py-2 rounded hover:bg-[var(--secondary)] transition"
      >
        Book Session
      </button>
    </div>
  )
}
