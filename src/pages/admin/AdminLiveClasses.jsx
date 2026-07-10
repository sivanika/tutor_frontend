import { useState, useEffect } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import {
  FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight,
  FiSearch, FiInbox, FiVideo
} from "react-icons/fi";

const EMPTY = {
  title: "", category: "", level: "Intermediate", instructor: "",
  instructorRole: "", startDate: "", schedule: "", durationWeeks: 4,
  seatsTotal: 30, seatsLeft: 30, price: 4999, mrp: 9999,
  rating: 0, ratingCount: 0, gradient: "linear-gradient(135deg,#1E9E8C,#12283B)",
  shortDesc: "", longDesc: "", prerequisites: "", syllabus: "", isPublished: true,
};

const LEVEL_OPTS = ["Beginner", "Intermediate", "Advanced", "Beginner to Advanced"];
const GRADIENT_OPTS = [
  { label: "Teal → Navy", value: "linear-gradient(135deg,#1E9E8C,#12283B)" },
  { label: "Navy → Amber", value: "linear-gradient(135deg,#2A4D6E,#F2A93B)" },
  { label: "Amber → Navy", value: "linear-gradient(135deg,#F2A93B,#1B3A54)" },
  { label: "Teal → Blue", value: "linear-gradient(135deg,#1E9E8C,#2A4D6E)" },
  { label: "Blue → Coral", value: "linear-gradient(135deg,#3A6389,#E86A5C)" },
];

/* ── Form Modal ── */
function ClassModal({ initial, onClose, onSave }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState(
    isEdit
      ? {
          ...initial,
          prerequisites: Array.isArray(initial.prerequisites)
            ? initial.prerequisites.join("\n")
            : initial.prerequisites || "",
          syllabus: Array.isArray(initial.syllabus)
            ? initial.syllabus.map(w => `${w.week}|${w.topic}|${w.details || ""}`).join("\n")
            : "",
        }
      : { ...EMPTY }
  );
  const [saving, setSaving] = useState(false);
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        durationWeeks: Number(form.durationWeeks),
        seatsTotal: Number(form.seatsTotal),
        seatsLeft: Number(form.seatsLeft),
        price: Number(form.price),
        mrp: Number(form.mrp),
        rating: Number(form.rating),
        ratingCount: Number(form.ratingCount),
        prerequisites: form.prerequisites.split("\n").map(s => s.trim()).filter(Boolean),
        syllabus: form.syllabus
          .split("\n")
          .map(s => s.trim())
          .filter(Boolean)
          .map((line, i) => {
            const [week, topic, ...rest] = line.split("|");
            return { week: Number(week) || i + 1, topic: topic || line, details: rest.join("|") || "" };
          }),
      };

      if (isEdit) {
        const res = await API.put(`/live-classes/${initial._id}`, payload);
        onSave(res.data.liveClass, "edit");
        toast.success("Live class updated!");
      } else {
        const res = await API.post("/live-classes", payload);
        onSave(res.data.liveClass, "add");
        toast.success("Live class created!");
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[var(--surface-alt)] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 dark:border-white/10">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1E9E8C] to-[#2A4D6E] text-white">
          <h3 className="font-bold text-lg">{isEdit ? "Edit Live Class" : "Create Live Class"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">×</button>
        </div>

        <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto">
          {/* Row helpers */}
          {[
            { label: "Title *", key: "title", col: 2 },
            { label: "Category *", key: "category" },
            { label: "Instructor *", key: "instructor" },
            { label: "Instructor Role", key: "instructorRole" },
            { label: "Start Date *", key: "startDate", placeholder: "21 July 2026" },
            { label: "Schedule *", key: "schedule", col: 2, placeholder: "Mon / Wed · 7–8:30 PM IST" },
          ].map(({ label, key, col, placeholder }) => (
            <div key={key} className={col === 2 ? "col-span-2" : ""}>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
              <input
                required={label.includes("*")}
                value={form[key]}
                onChange={f(key)}
                placeholder={placeholder || ""}
                className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E9E8C]/40"
              />
            </div>
          ))}

          {/* Selects */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Level *</label>
            <select value={form.level} onChange={f("level")} className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none">
              {LEVEL_OPTS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gradient</label>
            <select value={form.gradient} onChange={f("gradient")} className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none">
              {GRADIENT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Numbers */}
          {[
            { label: "Duration (weeks)", key: "durationWeeks" },
            { label: "Seats Left", key: "seatsLeft" },
            { label: "Price (₹)", key: "price" },
            { label: "MRP (₹)", key: "mrp" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
              <input type="number" value={form[key]} onChange={f(key)} className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E9E8C]/40" />
            </div>
          ))}

          {/* Short desc */}
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Short Description *</label>
            <textarea required rows={2} value={form.shortDesc} onChange={f("shortDesc")} className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none resize-none" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Long Description</label>
            <textarea rows={3} value={form.longDesc} onChange={f("longDesc")} className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none resize-none" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Prerequisites (one per line)</label>
            <textarea rows={3} value={form.prerequisites} onChange={f("prerequisites")} placeholder="Python basics&#10;Familiarity with APIs" className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none resize-none" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Syllabus (one per line: week|topic|details)</label>
            <textarea rows={4} value={form.syllabus} onChange={f("syllabus")} placeholder="1|Agent Foundations|Agent anatomy, planning loops&#10;2|Tools & Memory|Function calling, retrieval" className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none resize-none font-mono text-xs" />
          </div>

          {/* Published toggle */}
          <div className="col-span-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, isPublished: !p.isPublished }))}
              className={`text-2xl transition-colors ${form.isPublished ? "text-[#1E9E8C]" : "text-slate-300"}`}
            >
              {form.isPublished ? <FiToggleRight /> : <FiToggleLeft />}
            </button>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {form.isPublished ? "Published (visible to students)" : "Draft (hidden from students)"}
            </span>
          </div>

          <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-white/10">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#1E9E8C] to-[#2A4D6E] rounded-xl disabled:opacity-50 shadow-lg">
              {saving ? "Saving..." : isEdit ? "Update Class" : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function AdminLiveClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [actionId, setActionId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/live-classes/all");
      setClasses(res.data || []);
    } catch { toast.error("Failed to load live classes"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = (cls, mode) => {
    if (mode === "add") setClasses(p => [cls, ...p]);
    else setClasses(p => p.map(x => x._id === cls._id ? cls : x));
  };

  const handleTogglePublish = async (cls) => {
    setActionId(cls._id);
    try {
      const res = await API.put(`/live-classes/${cls._id}`, { isPublished: !cls.isPublished });
      setClasses(p => p.map(x => x._id === cls._id ? res.data.liveClass : x));
      toast.success(`Class ${res.data.liveClass.isPublished ? "published" : "unpublished"}`);
    } catch { toast.error("Failed to update"); }
    finally { setActionId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this live class?")) return;
    setActionId(id);
    try {
      await API.delete(`/live-classes/${id}`);
      setClasses(p => p.filter(x => x._id !== id));
      toast.success("Live class deleted");
    } catch { toast.error("Failed to delete"); }
    finally { setActionId(null); }
  };

  const filtered = classes.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Classes", value: classes.length, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400" },
    { label: "Published", value: classes.filter(c => c.isPublished).length, color: "text-[#1E9E8C] bg-teal-50 dark:bg-teal-950/30 dark:text-teal-400" },
    { label: "Draft", value: classes.filter(c => !c.isPublished).length, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400" },
    { label: "Total Seats Left", value: classes.reduce((a, c) => a + (c.seatsLeft || 0), 0), color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <FiVideo className="text-[#1E9E8C]" /> Live Classes Management
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create, publish, and manage all live cohort listings shown to students.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white dark:bg-[var(--surface-alt)] rounded-3xl p-5 border border-slate-100 dark:border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">{s.value}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${s.color}`}>
              <FiVideo size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[var(--surface-alt)] p-4 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search classes..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E9E8C]/30"
          />
        </div>
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1E9E8C] to-[#2A4D6E] text-white text-sm font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <FiPlus size={16} /> Create Live Class
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[var(--surface-alt)] rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-[3px] border-[#1E9E8C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <FiInbox size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-slate-700 dark:text-white">No live classes found</p>
            <p className="text-sm mt-1">Click "Create Live Class" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/70 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-[10px] uppercase text-slate-400 font-extrabold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-center">Seats Left</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map(cls => (
                  <tr key={cls._id} className="hover:bg-slate-50/40 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 min-w-[200px]">
                      <p className="font-bold text-slate-800 dark:text-white">{cls.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{cls.instructor} · {cls.level}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 dark:bg-blue-900/20 text-[#2A4D6E] dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">
                        {cls.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{cls.startDate}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">₹{cls.price?.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-sm ${cls.seatsLeft <= 5 ? "text-red-500" : cls.seatsLeft <= 15 ? "text-amber-500" : "text-[#1E9E8C]"}`}>
                        {cls.seatsLeft}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(cls)}
                        disabled={actionId === cls._id}
                        className={`flex items-center gap-1.5 text-xl transition-colors ${cls.isPublished ? "text-[#1E9E8C]" : "text-slate-300 dark:text-slate-600"}`}
                      >
                        {cls.isPublished ? <FiToggleRight /> : <FiToggleLeft />}
                        <span className="text-xs font-bold">{cls.isPublished ? "Live" : "Draft"}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal(cls)}
                          disabled={actionId === cls._id}
                          className="p-2 bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-[#2A4D6E] rounded-xl border border-slate-100 dark:border-white/5 transition"
                          title="Edit"
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          disabled={actionId === cls._id}
                          className="p-2 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500 rounded-xl border border-slate-100 dark:border-white/5 transition"
                          title="Delete"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <ClassModal
          initial={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
