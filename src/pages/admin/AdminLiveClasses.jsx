import { useState, useEffect } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import {
  FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight,
  FiSearch, FiInbox, FiVideo, FiCheck
} from "react-icons/fi";

const EMPTY = {
  title: "", category: "", level: "Intermediate", instructor: "",
  instructorRole: "", startDate: "", schedule: "", durationWeeks: 4,
  seatsTotal: 30, seatsLeft: 30, price: 4999, mrp: 9999,
  rating: 4.8, ratingCount: 12, gradient: "linear-gradient(135deg,#1E9E8C,#12283B)",
  shortDesc: "", longDesc: "", prerequisites: "", syllabus: [], isPublished: true,
  cohort: "", days: "", time: "", seatsFilled: 0, statusOverride: "auto",
  platform: "Zoom", meetingLink: "", autoRecord: true, trainerBio: "", whatsIncluded: []
};

const LEVEL_OPTS = ["Beginner", "Intermediate", "Advanced", "Beginner to Advanced"];
const INCLUSIONS = [
  "Recorded backup of every class",
  "Downloadable notes & slides",
  "Graded assignments + mentor feedback",
  "Live Q&A after class",
  "Attendance-linked certificate"
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
        }
      : { ...EMPTY, whatsIncluded: INCLUSIONS }
  );

  const [syllabus, setSyllabus] = useState(
    isEdit && Array.isArray(initial.syllabus)
      ? initial.syllabus.map(s => ({ topic: s.topic, details: s.details || "" }))
      : [{ topic: "", details: "" }]
  );

  const [whatsIncluded, setWhatsIncluded] = useState(
    isEdit && Array.isArray(initial.whatsIncluded)
      ? initial.whatsIncluded
      : INCLUSIONS
  );

  const [trainerPhotoFile, setTrainerPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // Syllabus Row Helpers
  const addSyllabusRow = () => {
    setSyllabus(prev => [...prev, { topic: "", details: "" }]);
  };

  const removeSyllabusRow = (idx) => {
    if (syllabus.length === 1) {
      setSyllabus([{ topic: "", details: "" }]);
    } else {
      setSyllabus(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const updateSyllabusField = (idx, field, val) => {
    setSyllabus(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  // Inclusions Helper
  const toggleInclusion = (item) => {
    setWhatsIncluded(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  // Fill Sample Data Helper
  const fillSampleBatch = () => {
    const d = new Date(); d.setDate(d.getDate() + 18);
    setForm({
      title: "Agentic AI Engineering",
      category: "Agentic AI",
      cohort: "Cohort 7",
      days: "Mon–Fri",
      time: "8:00–9:30 PM IST",
      durationWeeks: 6,
      startDate: d.toISOString().slice(0, 10),
      seatsTotal: 25,
      seatsFilled: 3,
      price: 8999,
      mrp: 14999,
      statusOverride: "auto",
      platform: "Zoom",
      meetingLink: "https://zoom.us/j/00000000000",
      autoRecord: true,
      instructor: "Prof. V. M. Venkateswara Rao, Ph.D.",
      trainerBio: "Founder & Lead Instructor, Vishidh Academy.",
      shortDesc: "Comprehensive cohort on agent anatomy, planning loops, tools & memory.",
      longDesc: "Learn how to build production-grade AI agents that operate autonomously.",
      level: "Intermediate",
      rating: 4.8,
      ratingCount: 15,
      gradient: "linear-gradient(135deg,#1E9E8C,#12283B)",
      prerequisites: "Python basics\nFamiliarity with APIs",
      isPublished: true
    });
    setSyllabus([
      { topic: "Foundations of Agentic Systems", details: "Agent anatomy, planning loops" },
      { topic: "Tools & Memory", details: "Function calling, retrieval, vector db integrations" },
      { topic: "Multi-Agent Orchestration", details: "CrewAI, AutoGen, and custom communication protocols" }
    ]);
    setWhatsIncluded(INCLUSIONS);
    toast.success("Sample batch data loaded!");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.instructor || !form.startDate) {
      return toast.error("Please fill in all required fields.");
    }
    setSaving(true);
    try {
      const fd = new FormData();

      // Syllabus maps topic/details to backend week schema
      const mappedSyllabus = syllabus.map((s, idx) => ({
        week: idx + 1,
        topic: s.topic,
        details: s.details
      })).filter(s => s.topic);

      const parsedPrereqs = typeof form.prerequisites === "string"
        ? form.prerequisites.split("\n").map(s => s.trim()).filter(Boolean)
        : [];

      // Append standard properties
      const bodyPayload = {
        ...form,
        durationWeeks: Number(form.durationWeeks),
        seatsTotal: Number(form.seatsTotal),
        seatsFilled: Number(form.seatsFilled),
        price: Number(form.price),
        mrp: Number(form.mrp),
        rating: Number(form.rating) || 0,
        ratingCount: Number(form.ratingCount) || 0,
        prerequisites: JSON.stringify(parsedPrereqs),
        syllabus: JSON.stringify(mappedSyllabus),
        whatsIncluded: JSON.stringify(whatsIncluded)
      };

      Object.entries(bodyPayload).forEach(([k, v]) => {
        fd.append(k, v);
      });

      if (trainerPhotoFile) {
        fd.append("trainerPhoto", trainerPhotoFile);
      }

      const headers = { "Content-Type": "multipart/form-data" };
      let res;
      if (isEdit) {
        res = await API.put(`/live-classes/${initial._id}`, fd, { headers });
        onSave(res.data.liveClass, "edit");
        toast.success("Live class updated!");
      } else {
        res = await API.post("/live-classes", fd, { headers });
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 dark:border-white/10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1E9E8C] to-[#2A4D6E] text-white shrink-0">
          <h3 className="font-bold text-lg font-display">{isEdit ? "Edit Live Class" : "Create Live Class"}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl transition">×</button>
        </div>

        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1 bg-gray-50/30">
          
          {/* BASICS */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Basics</h4>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Batch / cohort title *</label>
              <input required value={form.title} onChange={f("title")} placeholder="e.g. Agentic AI Engineering" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E9E8C]/40" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Topic *</label>
                <select required value={form.category} onChange={f("category")} className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none">
                  <option value="">Select…</option>
                  {["Agentic AI","LLMs","Generative AI","Data Analytics","Python","Machine Learning"].map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Cohort label *</label>
                <input required value={form.cohort} onChange={f("cohort")} placeholder="e.g. Cohort 7" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none" />
              </div>
            </div>
          </div>

          {/* SCHEDULE */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Schedule</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Days *</label>
                <input required value={form.days} onChange={f("days")} placeholder="e.g. Mon–Fri" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Time *</label>
                <input required value={form.time} onChange={f("time")} placeholder="e.g. 8:00–9:30 PM IST" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Duration (weeks) *</label>
                <input type="number" min="1" required value={form.durationWeeks} onChange={f("durationWeeks")} placeholder="6" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Start date *</label>
              <input type="date" required value={form.startDate} onChange={f("startDate")} className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-white" />
            </div>
          </div>

          {/* SEATS & PRICING */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Seats & pricing</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total seats *</label>
                <input type="number" min="1" required value={form.seatsTotal} onChange={f("seatsTotal")} placeholder="25" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Seats filled</label>
                <input type="number" min="0" value={form.seatsFilled} onChange={f("seatsFilled")} placeholder="0" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Price (₹) *</label>
                <input type="number" min="0" required value={form.price} onChange={f("price")} placeholder="8999" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">MRP (₹) *</label>
                <input type="number" min="0" required value={form.mrp} onChange={f("mrp")} placeholder="14999" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Status override</label>
                <select value={form.statusOverride} onChange={f("statusOverride")} className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none">
                  <option value="auto">Auto (based on seats filled)</option>
                  <option value="open">Open for registration</option>
                  <option value="filling">Filling fast</option>
                  <option value="full">Full — waitlist</option>
                </select>
              </div>
            </div>
          </div>

          {/* LIVE SESSION INTEGRATION */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Live session integration</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Platform</label>
                <select value={form.platform} onChange={f("platform")} className="mt-1.5 w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none">
                  <option>Zoom</option>
                  <option>Google Meet</option>
                  <option>WebRTC (built-in room)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Meeting link / room ID</label>
                <input value={form.meetingLink} onChange={f("meetingLink")} placeholder="https://zoom.us/j/..." className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
              <input type="checkbox" checked={form.autoRecord} onChange={e => setForm(p => ({ ...p, autoRecord: e.target.checked }))} className="w-4 h-4 text-teal-600 rounded border-slate-350 focus:ring-teal-500" />
              Auto-record every session and unlock only to enrolled students
            </label>
          </div>

          {/* TRAINER */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Trainer</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Trainer name *</label>
                <input required value={form.instructor} onChange={f("instructor")} placeholder="Prof. V. M. Venkateswara Rao, Ph.D." className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Trainer photo</label>
                <input type="file" accept="image/*" onChange={e => setTrainerPhotoFile(e.target.files[0])} className="mt-1.5 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:bg-teal-50 file:text-teal-700 w-full border border-dashed border-slate-200 p-2 rounded-xl bg-white dark:bg-white/5 dark:text-white dark:border-white/10" />
                {isEdit && initial.trainerPhoto && !trainerPhotoFile && (
                  <span className="text-[10px] text-slate-400 block mt-1">Current: {initial.trainerPhoto.split('/').pop()}</span>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Trainer bio</label>
              <textarea rows={2} value={form.trainerBio} onChange={f("trainerBio")} placeholder="Short bio shown on the trainer card" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none resize-none" />
            </div>
          </div>

          {/* SYLLABUS — WEEK BY WEEK */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Syllabus — week by week</h4>
            <p className="text-xs text-slate-400 -mt-2">Each row becomes one accordion item under the syllabus section.</p>
            <div className="space-y-3">
              {syllabus.map((s, sIdx) => (
                <div key={sIdx} className="flex gap-2 items-center">
                  <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">W{sIdx + 1}</span>
                  <input type="text" value={s.topic} onChange={e => updateSyllabusField(sIdx, "topic", e.target.value)} placeholder="Week title, e.g. Foundations of Agentic Systems" className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white text-xs focus:outline-none" />
                  <input type="text" value={s.details} onChange={e => updateSyllabusField(sIdx, "details", e.target.value)} placeholder="Short description" className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white text-xs focus:outline-none" />
                  <button type="button" onClick={() => removeSyllabusRow(sIdx)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500 hover:border-red-200 transition">✕</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addSyllabusRow} className="px-3 py-1.5 border border-dashed border-slate-250 dark:border-white/15 rounded-xl text-xs text-slate-500 hover:text-teal-600 hover:border-teal-300 bg-white dark:bg-white/5 dark:text-white transition w-fit">+ Add week</button>
          </div>

          {/* WHAT'S INCLUDED */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">What's included (checklist shown on page)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
              {INCLUSIONS.map((item) => {
                const checked = whatsIncluded.includes(item);
                return (
                  <label key={item} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
                    <input type="checkbox" checked={checked} onChange={() => toggleInclusion(item)} className="w-4 h-4 text-teal-600 rounded border-slate-350 focus:ring-teal-500" />
                    {item}
                  </label>
                );
              })}
            </div>
          </div>

          {/* EXTRA DETAILS */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Extra details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Short Description *</label>
                <textarea required rows={2} value={form.shortDesc} onChange={f("shortDesc")} className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Long Description</label>
                <textarea rows={2} value={form.longDesc} onChange={f("longDesc")} className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none resize-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Prerequisites (one per line)</label>
              <textarea rows={2} value={form.prerequisites} onChange={f("prerequisites")} placeholder="Python basics&#10;Familiarity with APIs" className="mt-1.5 w-full px-4 py-2 text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white rounded-xl focus:outline-none resize-none" />
            </div>
          </div>

        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-900 rounded-b-3xl shrink-0 font-[Inter]">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition">Cancel</button>
          <button type="button" onClick={fillSampleBatch} className="px-5 py-2.5 text-sm font-semibold text-teal-600 border border-teal-200 dark:border-white/10 hover:bg-teal-50 dark:hover:bg-white/5 rounded-xl transition">Fill sample data</button>
          <button type="button" onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#1E9E8C] to-[#2A4D6E] rounded-xl disabled:opacity-50 shadow-lg flex items-center gap-1">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck size={14} />}
            {saving ? "Saving..." : isEdit ? "Update Class" : "Create Class"}
          </button>
        </div>
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
