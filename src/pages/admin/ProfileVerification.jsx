import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function ProfileVerification() {
  const [pending, setPending] = useState([]);
  const [verified, setVerified] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  const loadData = async () => {
    try {
      const res1 = await API.get("/admin/pending-professors");
      const res2 = await API.get("/admin/verified-professors");

      setPending(res1.data || []);
      setVerified(res2.data || []);
    } catch (err) {
      toast.error("Failed to load professors");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ SAFE FILTER (NO CRASH)
  const filterList = (list) =>
    list.filter((prof) => {
      const name = prof?.name?.toLowerCase() || "";
      const email = prof?.email?.toLowerCase() || "";
      return (
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase())
      );
    });

  const approveProfessor = async (id) => {
    try {
      await API.put(`/admin/approve-professor/${id}`);
      toast.success("Professor approved");
      loadData();
    } catch {
      toast.error("Approval failed");
    }
  };

  const rejectProfessor = async (id) => {
    try {
      await API.put(`/admin/reject-professor/${id}`);
      toast.success("Professor rejected");
      loadData();
    } catch {
      toast.error("Rejection failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Professor Verification</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email"
        className="border p-2 rounded w-full mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Pending */}
      <h2 className="text-xl font-semibold mb-2">Pending Verification</h2>

      {filterList(pending).length === 0 && (
        <p className="text-gray-500 mb-4">No pending professors</p>
      )}

      {filterList(pending).map((prof) => (
        <div
          key={prof._id}
          className="border p-4 rounded mb-3 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{prof.name || "No name"}</p>
            <p className="text-sm text-gray-600">{prof.email}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => approveProfessor(prof._id)}
              className="px-4 py-1 bg-green-600 text-white rounded"
            >
              Approve
            </button>
            <button
              onClick={() => rejectProfessor(prof._id)}
              className="px-4 py-1 bg-red-600 text-white rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      {/* Verified */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Verified Professors</h2>

      {filterList(verified).length === 0 && (
        <p className="text-gray-500">No verified professors</p>
      )}

      {filterList(verified).map((prof) => (
        <div
          key={prof._id}
          className="border p-4 rounded mb-3 bg-green-50"
        >
          <p className="font-semibold">{prof.name || "No name"}</p>
          <p className="text-sm text-gray-600">{prof.email}</p>
        </div>
      ))}
    </div>
  );
}
