import { useState, useEffect } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import {
  FiBriefcase, FiSearch, FiInbox, FiCheck, FiX, FiEye,
  FiTrash2, FiCalendar, FiMail, FiFileText, FiPlus, FiEdit2,
  FiToggleLeft, FiToggleRight,
} from "react-icons/fi";

const TYPE_OPTS = ["Full-time", "Part-time", "Contract", "Internship"];

const EMPTY_POS = { title: "", type: "Full-time", location: "", dept: "", description: "", skills: "" };

/* ── Position Form Modal ── */
function PositionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY_POS);
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?._id;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        const res = await API.put(`/careers/positions/${initial._id}`, form);
        onSave(res.data.position, "edit");
        toast.success("Position updated");
      } else {
        const res = await API.post("/careers/positions", form);
        onSave(res.data.position, "add");
        toast.success("Position created");
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save position");
    } finally {
      setSaving(false);
    }
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white">
          <h3 className="font-bold text-lg">{isEdit ? "Edit Position" : "New Open Position"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">×</button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Job Title *</label>
              <input required value={form.title} onChange={f("title")} className="mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type *</label>
              <select value={form.type} onChange={f("type")} className="mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40">
                {TYPE_OPTS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location *</label>
              <input required value={form.location} onChange={f("location")} placeholder="Remote / Hybrid" className="mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Department *</label>
              <input required value={form.dept} onChange={f("dept")} placeholder="e.g. Support, Engineering" className="mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description *</label>
              <textarea required rows={3} value={form.description} onChange={f("description")} className="mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Skills (comma-separated)</label>
              <input value={form.skills} onChange={f("skills")} placeholder="Node.js, MongoDB, REST APIs" className="mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-[var(--primary)] rounded-xl hover:opacity-90 disabled:opacity-50">
              {saving ? "Saving..." : isEdit ? "Update Position" : "Create Position"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function AdminCareers() {
  const [tab, setTab] = useState("applications");

  /* Applications state */
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionId, setActionId] = useState(null);

  /* Positions state */
  const [positions, setPositions] = useState([]);
  const [posLoading, setPosLoading] = useState(true);
  const [posModal, setPosModal] = useState(null); // null | "new" | position-object

  /* Fetch applications */
  const fetchApplications = async () => {
    setAppsLoading(true);
    try {
      const res = await API.get("/careers/applications");
      setApplications(res.data || []);
    } catch { toast.error("Failed to load applications"); }
    finally { setAppsLoading(false); }
  };

  /* Fetch positions */
  const fetchPositions = async () => {
    setPosLoading(true);
    try {
      const res = await API.get("/careers/positions/all");
      setPositions(res.data || []);
    } catch { toast.error("Failed to load positions"); }
    finally { setPosLoading(false); }
  };

  useEffect(() => { fetchApplications(); fetchPositions(); }, []);

  /* Application handlers */
  const handleUpdateStatus = async (id, status) => {
    setActionId(id);
    try {
      await API.put(`/careers/applications/${id}`, { status });
      toast.success(`Marked as ${status}`);
      setApplications((p) => p.map((a) => a._id === id ? { ...a, status } : a));
      if (selectedApp?._id === id) setSelectedApp((p) => ({ ...p, status }));
    } catch { toast.error("Failed to update status"); }
    finally { setActionId(null); }
  };

  const handleDeleteApp = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    setActionId(id);
    try {
      await API.delete(`/careers/applications/${id}`);
      toast.success("Deleted");
      setApplications((p) => p.filter((a) => a._id !== id));
      if (selectedApp?._id === id) setSelectedApp(null);
    } catch { toast.error("Failed to delete"); }
    finally { setActionId(null); }
  };

  /* Position handlers */
  const handlePosSave = (pos, mode) => {
    if (mode === "add") setPositions((p) => [pos, ...p]);
    else setPositions((p) => p.map((x) => x._id === pos._id ? pos : x));
  };

  const handleToggleOpen = async (pos) => {
    try {
      const res = await API.put(`/careers/positions/${pos._id}`, { isOpen: !pos.isOpen });
      setPositions((p) => p.map((x) => x._id === pos._id ? res.data.position : x));
      toast.success(res.data.position.isOpen ? "Position reopened" : "Position marked as filled");
    } catch { toast.error("Failed to toggle status"); }
  };

  const handleDeletePos = async (id) => {
    if (!window.confirm("Permanently delete this position?")) return;
    try {
      await API.delete(`/careers/positions/${id}`);
      setPositions((p) => p.filter((x) => x._id !== id));
      toast.success("Position deleted");
    } catch { toast.error("Failed to delete position"); }
  };

  const filteredApps = applications.filter((a) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.positionTitle.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Total", value: applications.length, color: "#2563EB" },
    { label: "Pending", value: applications.filter((a) => a.status === "Pending").length, color: "#eab308" },
    { label: "Selected", value: applications.filter((a) => a.status === "Selected").length, color: "#22c55e" },
    { label: "Rejected", value: applications.filter((a) => a.status === "Rejected").length, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiBriefcase className="text-[var(--primary)]" /> Careers Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage open positions and review applicant submissions</p>
        </div>
        {tab === "positions" && (
          <button onClick={() => setPosModal("new")} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition">
            <FiPlus /> Add Position
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[["applications", "Job Applications"], ["positions", "Open Positions"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition ${tab === key ? "border-[var(--primary)] text-[var(--primary)]" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ─────────── APPLICATIONS TAB ─────────── */}
      {tab === "applications" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: s.color + "18", color: s.color }}>{s.value}</div>
                <p className="text-sm font-semibold text-gray-700">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white p-4 rounded-t-2xl border-t border-x border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="relative sm:max-w-xs w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search applicants..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30" />
            </div>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {["All", "Pending", "Selected", "Rejected"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${statusFilter === s ? "bg-white shadow text-gray-800" : "text-gray-500"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm overflow-hidden">
            {appsLoading ? (
              <div className="flex justify-center py-14"><div className="w-7 h-7 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" /></div>
            ) : filteredApps.length === 0 ? (
              <div className="py-14 text-center text-gray-400"><FiInbox size={36} className="mx-auto mb-3 text-gray-300" /><p>No applications found</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Applicant</th>
                      <th className="px-5 py-3">Role</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredApps.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800">{app.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><FiMail size={11} />{app.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-[var(--primary)]">{app.positionTitle}</span>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FiCalendar size={11} />{new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${app.status === "Selected" ? "bg-green-50 text-green-700" : app.status === "Rejected" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-700"}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setSelectedApp(app)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50" title="View"><FiEye size={14} /></button>
                            {app.status === "Pending" && <>
                              <button onClick={() => handleUpdateStatus(app._id, "Selected")} disabled={actionId === app._id} className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-40" title="Select"><FiCheck size={14} /></button>
                              <button onClick={() => handleUpdateStatus(app._id, "Rejected")} disabled={actionId === app._id} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-40" title="Reject"><FiX size={14} /></button>
                            </>}
                            <button onClick={() => handleDeleteApp(app._id)} disabled={actionId === app._id} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40" title="Delete"><FiTrash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail Modal */}
          {selectedApp && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white shrink-0">
                  <div><p className="text-white/70 text-xs">Application Details</p><h3 className="font-bold text-lg">{selectedApp.name}</h3></div>
                  <button onClick={() => setSelectedApp(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl">×</button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                    <div><p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Email</p><p className="text-sm font-medium text-gray-800 flex items-center gap-1"><FiMail className="text-gray-400" />{selectedApp.email}</p></div>
                    <div><p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Position</p><p className="text-sm font-medium text-[var(--primary)]">{selectedApp.positionTitle}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                    <div><p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Date</p><p className="text-sm text-gray-800 flex items-center gap-1"><FiCalendar className="text-gray-400" />{new Date(selectedApp.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div>
                    <div><p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Status</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${selectedApp.status === "Selected" ? "bg-green-50 text-green-700" : selectedApp.status === "Rejected" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-700"}`}>{selectedApp.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-2 flex items-center gap-1"><FiFileText />Cover Letter</p>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 max-h-52 overflow-y-auto">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                  {selectedApp.status === "Pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateStatus(selectedApp._id, "Selected")} className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-green-600 text-white hover:bg-green-700"><FiCheck />Select</button>
                      <button onClick={() => handleUpdateStatus(selectedApp._id, "Rejected")} className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600"><FiX />Reject</button>
                    </div>
                  )}
                  <button onClick={() => setSelectedApp(null)} className="ml-auto px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-200">Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─────────── POSITIONS TAB ─────────── */}
      {tab === "positions" && (
        <div className="space-y-4">
          {posLoading ? (
            <div className="flex justify-center py-14"><div className="w-7 h-7 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" /></div>
          ) : positions.length === 0 ? (
            <div className="py-14 text-center bg-white rounded-2xl border border-gray-100 text-gray-400">
              <FiInbox size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No positions yet</p>
              <p className="text-sm mt-1">Click "Add Position" to create your first listing</p>
            </div>
          ) : (
            positions.map((pos) => (
              <div key={pos._id} className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${pos.isOpen ? "border-gray-100 hover:shadow-md" : "border-gray-200 opacity-60"}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-gray-800">{pos.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${pos.isOpen ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {pos.isOpen ? "Open" : "Filled"}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{pos.type}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{pos.location}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{pos.dept}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{pos.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pos.skills.map((s) => (
                        <span key={s} className="text-xs bg-purple-50 text-[var(--primary)] px-2 py-0.5 rounded-full font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleToggleOpen(pos)} className={`p-2 rounded-lg transition ${pos.isOpen ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`} title={pos.isOpen ? "Mark as Filled" : "Reopen Position"}>
                      {pos.isOpen ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                    </button>
                    <button onClick={() => setPosModal(pos)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition" title="Edit"><FiEdit2 size={16} /></button>
                    <button onClick={() => handleDeletePos(pos._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition" title="Delete"><FiTrash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Position Form Modal */}
      {posModal && (
        <PositionModal
          initial={posModal === "new" ? null : posModal}
          onClose={() => setPosModal(null)}
          onSave={handlePosSave}
        />
      )}
    </div>
  );
}
