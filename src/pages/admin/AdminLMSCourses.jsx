import { useEffect, useState } from "react"
import API from "../../services/api"
import {
  FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronRight,
  FiX, FiCheck, FiBookOpen, FiInbox, FiUpload, FiLink,
  FiFilm, FiFileText, FiAlertCircle, FiGlobe, FiUsers
} from "react-icons/fi"
import toast from "react-hot-toast"

import { media } from "../../utils/media"

const STATUS_STYLES = {
  draft:     "bg-yellow-50 text-yellow-700 border-yellow-200",
  published: "bg-green-50 text-green-700 border-green-200",
  archived:  "bg-gray-100 text-gray-500 border-gray-200",
}

const emptyForm = {
  title: "", description: "", subject: "", instructor: "Admin",
  duration: "Self-paced", level: "All Levels", price: 0,
  category: "", tags: "", status: "draft",
  thumbnailUrl: "", videoUrl: "",
}

// ── tiny shared input ───────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
    {children}
  </div>
)
const Input = (props) => (
  <input {...props} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
)
const Select = ({ children, ...props }) => (
  <select {...props} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
    {children}
  </select>
)
const Textarea = (props) => (
  <textarea {...props} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
)

// ── MediaPicker ─────────────────────────────────────────────
function MediaPicker({ label, urlVal, onUrl, onFile, accept }) {
  const [mode, setMode] = useState("url")
  return (
    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50 space-y-2">
      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</p>
      <div className="flex gap-4 text-xs">
        {["url", "file"].map(m => (
          <label key={m} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" checked={mode === m} onChange={() => setMode(m)} /> {m === "url" ? "URL" : "Upload file"}
          </label>
        ))}
      </div>
      {mode === "url"
        ? <Input value={urlVal} onChange={e => onUrl(e.target.value)} placeholder="https://..." />
        : <input type="file" accept={accept}
            onChange={e => onFile(e.target.files[0])}
            className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 w-full border border-dashed border-gray-200 p-2 rounded-xl bg-white" />
      }
    </div>
  )
}

// ── Module + Lesson Manager ─────────────────────────────────
function ModuleManager({ courseId }) {
  const [modules, setModules] = useState([])
  const [expanded, setExpanded] = useState({})
  const [newModTitle, setNewModTitle] = useState("")
  const [addingMod, setAddingMod] = useState(false)
  const [newLesson, setNewLesson] = useState({})   // { [moduleId]: {title, type, contentUrl, file} }

  const load = async () => {
    try {
      const res = await API.get(`/lms/courses/${courseId}`)
      setModules(res.data.modules || [])
    } catch { toast.error("Failed to load modules") }
  }
  useEffect(() => { if (courseId) load() }, [courseId])

  const addModule = async () => {
    if (!newModTitle.trim()) return toast.error("Module title required")
    setAddingMod(true)
    try {
      await API.post(`/lms/courses/${courseId}/modules`, { title: newModTitle.trim() })
      setNewModTitle("")
      load()
    } catch (e) { toast.error(e.response?.data?.message || "Failed") }
    finally { setAddingMod(false) }
  }

  const delModule = async (id) => {
    if (!window.confirm("Delete module and all its lessons?")) return
    try { await API.delete(`/lms/modules/${id}`); load() }
    catch { toast.error("Failed to delete module") }
  }

  const addLesson = async (moduleId) => {
    const l = newLesson[moduleId] || {}
    if (!l.title?.trim()) return toast.error("Lesson title required")
    try {
      const fd = new FormData()
      fd.append("title", l.title.trim())
      fd.append("type", l.type || "video")
      if (l.file) fd.append("contentFile", l.file)
      else fd.append("contentUrl", l.contentUrl || "")
      await API.post(`/lms/modules/${moduleId}/lessons`, fd, { headers: { "Content-Type": "multipart/form-data" } })
      setNewLesson(prev => ({ ...prev, [moduleId]: {} }))
      load()
    } catch (e) { toast.error(e.response?.data?.message || "Failed to add lesson") }
  }

  const delLesson = async (id) => {
    if (!window.confirm("Delete this lesson?")) return
    try { await API.delete(`/lms/lessons/${id}`); load() }
    catch { toast.error("Failed") }
  }

  const setLField = (moduleId, key, val) =>
    setNewLesson(prev => ({ ...prev, [moduleId]: { ...(prev[moduleId] || {}), [key]: val } }))

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Modules & Lessons</p>

      {modules.map(mod => (
        <div key={mod._id} className="border border-gray-200 rounded-2xl overflow-hidden">
          {/* Module header */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
            onClick={() => setExpanded(e => ({ ...e, [mod._id]: !e[mod._id] }))}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              {expanded[mod._id] ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
              {mod.title}
              <span className="text-xs font-normal text-gray-400 ml-1">({mod.lessons?.length || 0} lessons)</span>
            </div>
            <button onClick={e => { e.stopPropagation(); delModule(mod._id) }}
              className="p-1 text-red-400 hover:bg-red-50 rounded-lg transition"><FiTrash2 size={13} /></button>
          </div>

          {/* Lessons */}
          {expanded[mod._id] && (
            <div className="px-4 pb-4 pt-2 space-y-2">
              {mod.lessons?.map(l => (
                <div key={l._id} className="flex items-center justify-between text-sm bg-white border border-gray-100 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    {l.type === "video" ? <FiFilm size={13} className="text-blue-500" /> : <FiFileText size={13} className="text-orange-500" />}
                    <span className="text-gray-700">{l.title}</span>
                    <span className="text-xs text-gray-400 capitalize">({l.type})</span>
                  </div>
                  <button onClick={() => delLesson(l._id)} className="p-1 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={12} /></button>
                </div>
              ))}

              {/* Add lesson form */}
              <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                <p className="text-xs font-semibold text-gray-400">Add Lesson</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Lesson title" value={newLesson[mod._id]?.title || ""}
                    onChange={e => setLField(mod._id, "title", e.target.value)} />
                  <Select value={newLesson[mod._id]?.type || "video"}
                    onChange={e => setLField(mod._id, "type", e.target.value)}>
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                    <option value="quiz">Quiz</option>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Content URL (or upload below)"
                    value={newLesson[mod._id]?.contentUrl || ""}
                    onChange={e => setLField(mod._id, "contentUrl", e.target.value)} />
                  <label className="flex items-center gap-1 px-3 py-2 border border-dashed border-gray-200 rounded-xl text-xs text-gray-500 cursor-pointer hover:bg-gray-50 shrink-0">
                    <FiUpload size={12} />
                    <input type="file" accept="video/*,.pdf" className="hidden"
                      onChange={e => setLField(mod._id, "file", e.target.files[0])} />
                    {newLesson[mod._id]?.file ? "✓ File" : "File"}
                  </label>
                </div>
                <button onClick={() => addLesson(mod._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">
                  <FiPlus size={12} /> Add Lesson
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add module */}
      <div className="flex gap-2">
        <Input placeholder="New module title..." value={newModTitle} onChange={e => setNewModTitle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addModule()} />
        <button onClick={addModule} disabled={addingMod}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 shrink-0">
          <FiPlus size={14} /> Module
        </button>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────
export default function AdminLMSCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [thumbFile, setThumbFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [managingId, setManagingId] = useState(null)

  const load = async () => {
    setLoading(true)
    try { const r = await API.get("/lms/courses"); setCourses(r.data.courses || []) }
    catch { toast.error("Failed to load courses") }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setForm(emptyForm); setEditId(null); setThumbFile(null); setVideoFile(null); setShowForm(true) }
  const openEdit = (c) => {
    setForm({ title: c.title, description: c.description, subject: c.subject, instructor: c.instructor || "Admin",
      duration: c.duration || "Self-paced", level: c.level || "All Levels", price: c.price || 0,
      category: c.category || "", tags: (c.tags || []).join(", "), status: c.status || "draft",
      thumbnailUrl: c.thumbnailUrl || "", videoUrl: c.videoUrl || "" })
    setEditId(c._id); setThumbFile(null); setVideoFile(null); setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditId(null) }

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.subject.trim())
      return toast.error("Title, description and subject are required")
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (thumbFile) fd.append("thumbnailFile", thumbFile)
      if (videoFile) fd.append("videoFile", videoFile)
      if (editId) { await API.put(`/lms/courses/${editId}`, fd, { headers: { "Content-Type": "multipart/form-data" } }); toast.success("Course updated!") }
      else { await API.post("/lms/courses", fd, { headers: { "Content-Type": "multipart/form-data" } }); toast.success("Course created!") }
      closeForm(); load()
    } catch (e) { toast.error(e.response?.data?.message || "Failed to save") }
    finally { setSaving(false) }
  }

  const setStatus = async (id, status) => {
    try { await API.patch(`/lms/courses/${id}/status`, { status }); load(); toast.success(`Course ${status}`) }
    catch { toast.error("Failed to update status") }
  }

  const del = async (id) => {
    if (!window.confirm("Delete this course and all its content?")) return
    try { await API.delete(`/lms/courses/${id}`); load(); toast.success("Deleted") }
    catch { toast.error("Failed to delete") }
  }

  const filtered = courses.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = c.title.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q)
    const matchStatus = filterStatus === "all" || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = [
    { label: "Total", value: courses.length, color: "#2563EB" },
    { label: "Published", value: courses.filter(c => c.status === "published").length, color: "#22c55e" },
    { label: "Draft", value: courses.filter(c => c.status === "draft").length, color: "#f59e0b" },
    { label: "Archived", value: courses.filter(c => c.status === "archived").length, color: "#94a3b8" },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FiBookOpen className="text-[var(--primary)]" /> LMS Courses</h1>
          <p className="text-sm text-gray-400 mt-0.5">Build structured courses with modules and lessons</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold shadow hover:opacity-90 transition">
          <FiPlus size={16} /> New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold" style={{ background: s.color + "18", color: s.color }}>{s.value}</div>
            <p className="text-sm font-semibold text-gray-700">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-t-2xl border-t border-x border-gray-100 flex flex-wrap items-center gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..."
          className="px-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-72" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FiInbox size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No courses found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {c.thumbnailUrl
                          ? <img src={media(c.thumbnailUrl)} alt={c.title} className="w-14 h-9 object-cover rounded-lg border border-gray-100" onError={e => e.target.style.display = "none"} />
                          : <div className="w-14 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><FiBookOpen size={16} className="text-blue-400" /></div>
                        }
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">{c.title}</p>
                          <p className="text-xs text-gray-400">{c.subject} · {c.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">{c.category || "—"}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-700">{c.price > 0 ? `₹${c.price}` : "Free"}</td>
                    <td className="px-5 py-4">
                      <select value={c.status}
                        onChange={e => setStatus(c._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${STATUS_STYLES[c.status] || STATUS_STYLES.draft}`}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setManagingId(managingId === c._id ? null : c._id)}
                          title="Manage Modules" className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition">
                          <FiGlobe size={15} />
                        </button>
                        <button onClick={() => openEdit(c)} title="Edit" className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"><FiEdit2 size={15} /></button>
                        <button onClick={() => del(c._id)} title="Delete" className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Inline Module Manager */}
            {managingId && (
              <div className="border-t border-indigo-100 bg-indigo-50/40 px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                    <FiGlobe size={14} /> Modules — {courses.find(c => c._id === managingId)?.title}
                  </p>
                  <button onClick={() => setManagingId(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"><FiX size={16} /></button>
                </div>
                <ModuleManager courseId={managingId} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slideUp">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2"><FiBookOpen className="text-[var(--primary)]" /> {editId ? "Edit Course" : "New Course"}</h2>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"><FiX size={18} /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title *"><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Course title" /></Field>
                <Field label="Subject *"><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Mathematics" /></Field>
              </div>
              <Field label="Description *"><Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will students learn?" /></Field>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Instructor"><Input value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} /></Field>
                <Field label="Duration"><Input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="Self-paced" /></Field>
                <Field label="Level">
                  <Select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                    {["All Levels","Beginner","Intermediate","Advanced"].map(l => <option key={l}>{l}</option>)}
                  </Select>
                </Field>
                <Field label="Price (₹)"><Input type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Category"><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Science" /></Field>
                <Field label="Tags (comma-separated)"><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="tag1, tag2" /></Field>
              </div>
              <Field label="Status">
                <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Select>
              </Field>
              <MediaPicker label="Thumbnail Image" urlVal={form.thumbnailUrl} onUrl={v => setForm(f => ({ ...f, thumbnailUrl: v }))} onFile={setThumbFile} accept="image/*" />
              <MediaPicker label="Promo Video (optional)" urlVal={form.videoUrl} onUrl={v => setForm(f => ({ ...f, videoUrl: v }))} onFile={setVideoFile} accept="video/*" />
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={closeForm} className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold shadow hover:opacity-95 transition disabled:opacity-50">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck size={15} />}
                {saving ? "Saving..." : editId ? "Save Changes" : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
