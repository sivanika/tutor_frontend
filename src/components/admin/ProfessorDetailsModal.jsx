export default function ProfessorDetailsModal({ professor, onClose }) {
  if (!professor) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">
          Professor Full Profile
        </h2>

        <div className="space-y-2">
          <p><b>Name:</b> {professor.name}</p>
          <p><b>Email:</b> {professor.email}</p>
          <p><b>Role:</b> {professor.role}</p>
          <p>
            <b>Status:</b>{" "}
            {professor.isVerified ? (
              <span className="text-green-600">Verified</span>
            ) : (
              <span className="text-red-600">Pending</span>
            )}
          </p>
          <p><b>Account Status:</b> {professor.status}</p>
          <p>
            <b>Joined:</b>{" "}
            {new Date(professor.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-slate-800 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
