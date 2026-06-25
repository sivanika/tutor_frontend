import { useState, useEffect } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import {
  FiBriefcase, FiSearch, FiInbox, FiCheck, FiX, FiEye,
  FiTrash2, FiCalendar, FiMail, FiFileText, FiPlus, FiEdit2,
  FiToggleLeft, FiToggleRight, FiChevronDown, FiAlertCircle
} from "react-icons/fi";

const TYPE_OPTS = ["Full-time", "Part-time", "Contract", "Internship"];

const EMPTY_POS = { title: "", type: "Full-time", location: "Remote", dept: "", description: "", skills: "" };

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
        toast.success("Position updated successfully");
      } else {
        const res = await API.post("/careers/positions", form);
        onSave(res.data.position, "add");
        toast.success("Position posted successfully");
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
      <div className="bg-white dark:bg-[var(--surface-alt)] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-white/10">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[var(--primary)] to-indigo-700 text-white">
          <h3 className="font-bold text-lg">{isEdit ? "Edit Open Position" : "Post New Job"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl font-semibold">×</button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Job Title *</label>
              <input required value={form.title} onChange={f("title")} placeholder="e.g. Senior Technical Support Engineer" className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/05 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Type *</label>
              <select value={form.type} onChange={f("type")} className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40">
                {TYPE_OPTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Location/Mode *</label>
              <input required value={form.location} onChange={f("location")} placeholder="Remote / Hybrid / Onsite" className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/05 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Department *</label>
              <input required value={form.dept} onChange={f("dept")} placeholder="e.g. Support, Engineering, QA" className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/05 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Description *</label>
              <textarea required rows={4} value={form.description} onChange={f("description")} placeholder="Describe roles, responsibilities, and requirements..." className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/05 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Skills (comma-separated)</label>
              <input value={form.skills} onChange={f("skills")} placeholder="React, Node.js, Mongoose, Technical Writing" className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/05 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/05 rounded-xl transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary)] to-indigo-700 rounded-xl hover:opacity-95 disabled:opacity-50 transition shadow-lg shadow-[var(--primary)]/20">
              {saving ? "Saving..." : isEdit ? "Update Position" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Applicants Modal ── */
function ApplicantsModal({ job, applications, onClose, onUpdateStatus, onDeleteApp, actionId }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const jobApps = applications.filter((app) => app.positionId === job._id);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[var(--surface-alt)] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 dark:border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[var(--primary)] to-indigo-700 text-white shrink-0">
          <div>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Candidate Applications</p>
            <h3 className="font-bold text-lg">{job.title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl transition">×</button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* List of Applications */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-slate-100 dark:border-white/10">
            <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span>Submitted Profiles</span>
              <span className="bg-blue-50 dark:bg-blue-900/40 text-[var(--primary)] dark:text-[var(--accent)] text-xs font-bold px-2 py-0.5 rounded-full">{jobApps.length}</span>
            </h4>

            {jobApps.length === 0 ? (
              <div className="py-20 text-center text-slate-400 dark:text-slate-500">
                <FiInbox size={48} className="mx-auto mb-3 opacity-40" />
                <p className="font-medium">No candidates have applied yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobApps.map((app) => (
                  <div
                    key={app._id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedApp?._id === app._id
                        ? "border-[var(--primary)] bg-[var(--primary)]/05 shadow-sm"
                        : "border-slate-100 dark:border-white/05 hover:bg-slate-50 dark:hover:bg-white/05 bg-white dark:bg-white/02"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-slate-800 dark:text-white">{app.name}</p>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        app.status === "Selected"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : app.status === "Rejected"
                          ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mb-2">{app.email}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><FiCalendar size={12} /> {formatDate(app.createdAt)}</span>
                      <span className="text-[var(--primary)] font-semibold dark:text-[var(--accent)]">Click to review →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="w-full md:w-[450px] bg-slate-50/50 dark:bg-black/10 p-6 overflow-y-auto flex flex-col justify-between">
            {selectedApp ? (
              <div className="space-y-5 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Details</span>
                    <h4 className="font-extrabold text-lg text-slate-800 dark:text-white mt-1">{selectedApp.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <FiMail size={14} className="text-slate-400" />
                      <span>{selectedApp.email}</span>
                    </p>
                  </div>

                  <div className="border-t border-slate-100 dark:border-white/10 pt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FiFileText size={13} /> Cover Letter / Pitch
                    </p>
                    <div className="p-4 bg-white dark:bg-white/05 border border-slate-100 dark:border-white/10 rounded-2xl max-h-80 overflow-y-auto">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-white/10 pt-4 mt-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateStatus(selectedApp._id, "Selected").then((res) => { if (res) setSelectedApp(res); })}
                        disabled={actionId === selectedApp._id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 disabled:opacity-50 transition"
                      >
                        <FiCheck /> Shortlist
                      </button>
                      <button
                        onClick={() => onUpdateStatus(selectedApp._id, "Rejected").then((res) => { if (res) setSelectedApp(res); })}
                        disabled={actionId === selectedApp._id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 disabled:opacity-50 transition"
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        onDeleteApp(selectedApp._id);
                        setSelectedApp(null);
                      }}
                      disabled={actionId === selectedApp._id}
                      className="p-2 bg-slate-100 dark:bg-white/05 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 text-slate-400 rounded-xl transition"
                      title="Delete Application"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8 my-auto">
                <FiEye size={40} className="mb-3 opacity-30 text-[var(--primary)]" />
                <p className="font-semibold">Review Candidate Profile</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">Select any applicant from the list to review details and set statuses</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/02 flex justify-end shrink-0">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-white/05 transition">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function AdminCareers() {
  const [positions, setPositions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Active, Draft, Closed
  const [posModal, setPosModal] = useState(null); // null | "new" | position-object
  const [appsModalJob, setAppsModalJob] = useState(null); // null | position-object
  const [actionId, setActionId] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [posRes, appRes] = await Promise.all([
        API.get("/careers/positions/all"),
        API.get("/careers/applications")
      ]);
      setPositions(posRes.data || []);
      setApplications(appRes.data || []);
    } catch (err) {
      toast.error("Failed to load careers information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Position Save handler
  const handlePosSave = (pos, mode) => {
    if (mode === "add") setPositions((p) => [pos, ...p]);
    else setPositions((p) => p.map((x) => (x._id === pos._id ? pos : x)));
  };

  // Inline status changer (dropdown)
  const handleStatusChange = async (pos, newStatus) => {
    const updatedIsOpen = newStatus === "Active";
    setActionId(pos._id);
    try {
      const res = await API.put(`/careers/positions/${pos._id}`, { isOpen: updatedIsOpen });
      setPositions((p) => p.map((x) => (x._id === pos._id ? res.data.position : x)));
      toast.success(`Position status changed to ${newStatus}`);
    } catch {
      toast.error("Failed to change position status");
    } finally {
      setActionId(null);
    }
  };

  // Delete Job Position
  const handleDeletePos = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this job position? All related application logs will remain, but the position listing will be deleted.")) return;
    setActionId(id);
    try {
      await API.delete(`/careers/positions/${id}`);
      setPositions((p) => p.filter((x) => x._id !== id));
      toast.success("Job listing permanently deleted");
    } catch {
      toast.error("Failed to delete position");
    } finally {
      setActionId(null);
    }
  };

  // Update Application Status (Selected, Rejected)
  const handleUpdateAppStatus = async (appId, status) => {
    setActionId(appId);
    try {
      const res = await API.put(`/careers/applications/${appId}`, { status });
      toast.success(`Candidate marked as ${status}`);
      setApplications((p) => p.map((a) => (a._id === appId ? { ...a, status } : a)));
      setActionId(null);
      return res.data.application;
    } catch {
      toast.error("Failed to update candidate status");
      setActionId(null);
      return null;
    }
  };

  // Delete Application
  const handleDeleteApp = async (appId) => {
    if (!window.confirm("Permanently delete this applicant submission?")) return;
    setActionId(appId);
    try {
      await API.delete(`/careers/applications/${appId}`);
      setApplications((p) => p.filter((a) => a._id !== appId));
      toast.success("Application deleted");
    } catch {
      toast.error("Failed to delete application");
    } finally {
      setActionId(null);
    }
  };

  // Stats
  const totalJobs = positions.length;
  const activeJobs = positions.filter((p) => p.isOpen).length;
  const draftJobs = positions.filter((p) => !p.isOpen).length; // Map to draft/closed counts
  const totalApps = applications.length;

  // New applications in the last 7 days
  const newAppsCount = applications.filter((app) => {
    const createdDate = new Date(app.createdAt);
    const diffTime = Math.abs(new Date() - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const stats = [
    { label: "Total Jobs", value: totalJobs, icon: FiBriefcase, bgColor: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" },
    { label: "Active", value: activeJobs, icon: FiCheck, bgColor: "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" },
    { label: "Drafts", value: draftJobs, icon: FiFileText, bgColor: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400" },
    { label: "Total Applications", value: totalApps, icon: FiMail, bgColor: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400" },
    { label: "New (7 Days)", value: newAppsCount, icon: FiCalendar, bgColor: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400" }
  ];

  // Filtering positions
  const filteredPositions = positions.filter((pos) => {
    const query = searchTerm.toLowerCase();
    const matchSearch =
      pos.title.toLowerCase().includes(query) ||
      pos.dept.toLowerCase().includes(query) ||
      pos.type.toLowerCase().includes(query);

    if (statusFilter === "All") return matchSearch;
    if (statusFilter === "Active") return matchSearch && pos.isOpen;
    if (statusFilter === "Draft") return matchSearch && !pos.isOpen; // Map drafts to false
    if (statusFilter === "Closed") return matchSearch && !pos.isOpen; // Map closed to false
    return matchSearch;
  });

  const getBadgeStyles = (type) => {
    const t = type.toLowerCase();
    if (t.includes("full")) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30";
    if (t.includes("part")) return "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30";
    if (t.includes("contract")) return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30";
    return "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30";
  };

  const getStatusStyles = (isOpen) => {
    if (isOpen) return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/30";
    return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/05 dark:text-slate-400 dark:border-white/10";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <FiBriefcase className="text-[var(--primary)]" /> Careers Management
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor open roles, configure job settings, and manage applicant files.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-[var(--surface-alt)] rounded-3xl p-5 border border-slate-100 dark:border-white/10 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">{s.value}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${s.bgColor}`}>
              <s.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[var(--surface-alt)] p-4 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/05 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
          />
        </div>

        {/* Filter segment + Post Job button */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center justify-end">
          <div className="flex bg-slate-50 dark:bg-white/05 p-1 rounded-2xl border border-slate-100 dark:border-white/10 w-full sm:w-auto">
            {["All", "Active", "Draft", "Closed"].map((pill) => (
              <button
                key={pill}
                onClick={() => setStatusFilter(pill)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all ${
                  statusFilter === pill
                    ? "bg-white dark:bg-slate-800 shadow text-slate-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPosModal("new")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white text-sm font-bold rounded-xl hover:opacity-95 shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-[1px] transition-all"
          >
            <FiPlus size={16} /> Post New Job
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[var(--surface-alt)] rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPositions.length === 0 ? (
          <div className="py-20 text-center text-slate-400 dark:text-slate-500">
            <FiInbox size={56} className="mx-auto mb-4 opacity-30 text-[var(--primary)]" />
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">No listings found</h4>
            <p className="text-sm mt-1 max-w-sm mx-auto">Try customizing your filters or post a new job opening to start receiving profile submissions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/70 dark:bg-white/02 border-b border-slate-100 dark:border-white/10 text-[10px] uppercase text-slate-400 font-extrabold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Applications</th>
                  <th className="px-6 py-4">Posted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/05">
                {filteredPositions.map((pos) => {
                  const appsCount = applications.filter((app) => app.positionId === pos._id).length;

                  return (
                    <tr key={pos._id} className="hover:bg-slate-50/40 dark:hover:bg-white/02 transition-colors">
                      {/* Title/Role */}
                      <td className="px-6 py-4.5 font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer min-w-[200px]" onClick={() => setAppsModalJob(pos)}>
                        {pos.title}
                      </td>

                      {/* Dept */}
                      <td className="px-6 py-4.5 text-slate-600 dark:text-slate-300 font-semibold">
                        {pos.dept}
                      </td>

                      {/* Type Badge */}
                      <td className="px-6 py-4.5">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getBadgeStyles(pos.type)}`}>
                          {pos.type}
                        </span>
                      </td>

                      {/* Mode / Location */}
                      <td className="px-6 py-4.5 text-slate-600 dark:text-slate-300 font-medium">
                        {pos.location}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4.5">
                        <div className="relative inline-block w-28">
                          <select
                            disabled={actionId === pos._id}
                            value={pos.isOpen ? "Active" : "Closed"}
                            onChange={(e) => handleStatusChange(pos, e.target.value)}
                            className={`w-full px-3 py-1.5 rounded-xl text-xs font-bold border appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 pr-8 bg-white dark:bg-slate-800 ${getStatusStyles(pos.isOpen)}`}
                          >
                            <option value="Active">✓ Active</option>
                            <option value="Closed">✗ Closed</option>
                          </select>
                          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                        </div>
                      </td>

                      {/* Applications Button */}
                      <td className="px-6 py-4.5 text-center">
                        <button
                          onClick={() => setAppsModalJob(pos)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            appsCount > 0
                              ? "bg-blue-50/80 text-[var(--primary)] border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-[var(--accent)] dark:border-blue-800/40"
                              : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-white/02 dark:text-slate-500 dark:border-white/05"
                          }`}
                        >
                          <FiMail size={12} />
                          <span>{appsCount}</span>
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4.5 text-xs text-slate-400 font-medium">
                        {new Date(pos.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPosModal(pos)}
                            disabled={actionId === pos._id}
                            className="p-2 bg-slate-50 dark:bg-white/02 text-slate-500 dark:text-slate-400 hover:text-[var(--primary)] dark:hover:text-[var(--accent)] rounded-xl border border-slate-100 dark:border-white/05 hover:shadow-sm transition"
                            title="Edit Job"
                          >
                            <FiEdit2 size={13} />
                          </button>
                          <button
                            onClick={() => setAppsModalJob(pos)}
                            className="p-2 bg-slate-50 dark:bg-white/02 text-slate-500 dark:text-slate-400 hover:text-green-600 rounded-xl border border-slate-100 dark:border-white/05 hover:shadow-sm transition"
                            title="Review Applicants"
                          >
                            <FiEye size={13} />
                          </button>
                          <button
                            onClick={() => handleDeletePos(pos._id)}
                            disabled={actionId === pos._id}
                            className="p-2 bg-slate-50 dark:bg-white/02 text-slate-400 hover:text-red-500 rounded-xl border border-slate-100 dark:border-white/05 hover:shadow-sm transition"
                            title="Delete"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job Position Modal (New / Edit) */}
      {posModal && (
        <PositionModal
          initial={posModal === "new" ? null : posModal}
          onClose={() => setPosModal(null)}
          onSave={handlePosSave}
        />
      )}

      {/* Review Applicants Modal */}
      {appsModalJob && (
        <ApplicantsModal
          job={appsModalJob}
          applications={applications}
          onClose={() => setAppsModalJob(null)}
          onUpdateStatus={handleUpdateAppStatus}
          onDeleteApp={handleDeleteApp}
          actionId={actionId}
        />
      )}
    </div>
  );
}
