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
    <div className="p-6 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
        Professor Verification
      </h1>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search by name or email"
          className="
            w-full p-3 rounded-lg

            bg-slate-50 dark:bg-slate-800
            border border-slate-300 dark:border-slate-700

            text-slate-800 dark:text-slate-100
            focus:outline-none focus:ring-2 focus:ring-slate-500
            transition
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Pending Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
          Pending Verification
        </h2>

        {filterList(pending).length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">
            No pending professors
          </p>
        )}

        <div className="space-y-3">
          {filterList(pending).map((prof) => (
            <div
              key={prof._id}
              className="
                flex justify-between items-center
                p-4 rounded-xl

                bg-white dark:bg-slate-900
                border border-slate-200 dark:border-slate-800
                shadow-sm dark:shadow-black/20
              "
            >
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {prof.name || "No name"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {prof.email}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => approveProfessor(prof._id)}
                  className="
                    px-4 py-2 rounded-lg text-sm font-medium

                    bg-slate-900 text-white
                    hover:bg-black

                    dark:bg-slate-100 dark:text-black
                    dark:hover:bg-white

                    transition
                  "
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectProfessor(prof._id)}
                  className="
                    px-4 py-2 rounded-lg text-sm font-medium

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
      </div>

      {/* Verified Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
          Verified Professors
        </h2>

        {filterList(verified).length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">
            No verified professors
          </p>
        )}

        <div className="space-y-3">
          {filterList(verified).map((prof) => (
            <div
              key={prof._id}
              className="
                p-4 rounded-xl

                bg-green-50 dark:bg-green-900/20
                border border-green-200 dark:border-green-800
              "
            >
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {prof.name || "No name"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {prof.email}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}