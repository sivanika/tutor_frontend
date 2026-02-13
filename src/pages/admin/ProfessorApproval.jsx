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

  if (loading)
    return (
      <p className="p-6 text-slate-600 dark:text-slate-400">
        Loading...
      </p>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Pending Professor Approvals
      </h2>

      {professors.length === 0 ? (
        <div
          className="
            p-6 rounded-xl text-center
            bg-slate-100 dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            text-slate-600 dark:text-slate-400
          "
        >
          No pending professors.
        </div>
      ) : (
        <div className="grid gap-4">
          {professors.map((p) => (
            <div
              key={p._id}
              className="
                flex justify-between items-center
                p-5 rounded-xl

                bg-white dark:bg-slate-900
                border border-slate-200 dark:border-slate-800

                shadow-sm dark:shadow-black/30
                transition hover:shadow-lg
              "
            >
              {/* Professor Info */}
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                  {p.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {p.email}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Degree: {p.highestDegree}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Subjects: {p.subjects}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProfessor(p)}
                  className="
                    px-4 py-2 rounded-lg text-sm font-medium

                    bg-slate-200 text-slate-800
                    hover:bg-slate-300

                    dark:bg-slate-800 dark:text-slate-200
                    dark:hover:bg-slate-700

                    transition
                  "
                >
                  View
                </button>

                <button
                  onClick={() => approveProfessor(p._id)}
                  className="
                    px-4 py-2 rounded-lg text-sm font-semibold

                    bg-green-600 text-white
                    hover:bg-green-700

                    transition
                  "
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectProfessor(p._id)}
                  className="
                    px-4 py-2 rounded-lg text-sm font-semibold

                    bg-red-600 text-white
                    hover:bg-red-700

                    transition
                  "
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
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