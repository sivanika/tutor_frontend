import { useEffect, useState } from "react";
import API from "../../services/api";
import ProfessorDetailsModal from "../../components/admin/ProfessorDetailsModal";

export default function ProfessorApproval() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  const fetchPending = async () => {
    try {
      const { data } = await API.get("/admin/pending-professors");
      setProfessors(data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load pending professors");
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approveProfessor = async (id) => {
    try {
      await API.put(`/admin/verify-professor/${id}`);
      alert("Professor approved successfully");
      fetchPending();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const rejectProfessor = async (id) => {
    try {
      await API.put(`/admin/reject-professor/${id}`);
      alert("Professor rejected");
      fetchPending();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Professor Approvals</h2>

      {professors.length === 0 ? (
        <p>No pending professors.</p>
      ) : (
        <div className="grid gap-4">
          {professors.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow rounded p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.email}</p>
                <p className="text-sm">Degree: {p.highestDegree}</p>
                <p className="text-sm">Subjects: {p.subjects}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProfessor(p)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  View
                </button>

                <button
                  onClick={() => approveProfessor(p._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectProfessor(p._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProfessor && (
        <ProfessorDetailsModal
          professor={selectedProfessor}
          onClose={() => setSelectedProfessor(null)}
        />
      )}
    </div>
  );
}
