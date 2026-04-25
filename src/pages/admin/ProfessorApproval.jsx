import { useEffect, useState } from "react";
import API from "../../services/api";
import ProfessorDetailsModal from "../../components/admin/ProfessorDetailsModal";
import { FiClock, FiCheck, FiX, FiEye, FiLoader } from "react-icons/fi";

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

  useEffect(() => { fetchPending(); }, []);

  const approveProfessor = async (id) => {
    try {
      await API.put(`/admin/approve-professor/${id}`);
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

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-10 justify-center">
        <FiLoader className="animate-spin" size={20} />
        <span className="text-sm">Loading pending professors...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pending Approvals</h2>
          <p className="text-sm text-gray-400 mt-0.5">Review and approve professor applications</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-100">
          <FiClock size={12} />
          {professors.length} pending
        </div>
      </div>

      {/* ─── List ─── */}
      {professors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <FiCheck size={24} className="text-emerald-400" />
          </div>
          <h3 className="font-semibold text-gray-700">All clear!</h3>
          <p className="text-sm text-gray-400 mt-1">No pending professor applications to review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {professors.map((p) => {
            const initials = p.name
              ? p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
              : p.email?.[0]?.toUpperCase() || "P"
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-wrap items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] flex items-center justify-center text-white font-bold text-sm shadow shrink-0">
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800">{p.name || "No name"}</h3>
                    <p className="text-sm text-gray-400">{p.email}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {p.highestDegree && (
                        <span className="text-xs bg-purple-50 text-[var(--primary)] px-2.5 py-1 rounded-full font-medium border border-purple-100">
                          {p.highestDegree}
                        </span>
                      )}
                      {p.subjects && (
                        <span className="text-xs bg-blue-50 text-[var(--primary)] px-2.5 py-1 rounded-full font-medium border border-blue-100">
                          {p.subjects}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedProfessor(p)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                      <FiEye size={14} /> View
                    </button>
                    <button
                      onClick={() => approveProfessor(p._id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <FiCheck size={14} /> Approve
                    </button>
                    <button
                      onClick={() => rejectProfessor(p._id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
                    >
                      <FiX size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {selectedProfessor && (
        <ProfessorDetailsModal
          professor={selectedProfessor}
          onClose={() => setSelectedProfessor(null)}
        />
      )}
    </div>
  );
}
