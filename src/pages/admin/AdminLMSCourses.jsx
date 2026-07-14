import { useEffect, useState } from "react"
import API from "../../services/api"
import {
  FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronRight,
  FiX, FiCheck, FiBookOpen, FiInbox, FiUpload, FiLink,
  FiFilm, FiFileText, FiAlertCircle, FiGlobe, FiUsers
} from "react-icons/fi"
import toast from "react-hot-toast"

import { media } from "../../utils/media"
import AdminLiveClasses from "./AdminLiveClasses"

const STATUS_STYLES = {
  draft:     "bg-yellow-50 text-yellow-700 border-yellow-200",
  published: "bg-green-50 text-green-700 border-green-200",
  archived:  "bg-gray-100 text-gray-500 border-gray-200",
}

const emptyForm = {
  title: "", description: "", subject: "", instructor: "Admin",
  duration: "Self-paced", level: "All Levels", price: 0, oldPrice: "",
  category: "", tags: "", status: "draft",
  students: "", rating: "", reviews: "", bestseller: false,
  thumbnailUrl: "", videoUrl: "", drm: "Signed URL (expiring)",
  passScore: 70, attemptPolicy: "unlimited", autoCertificate: true,
  certIssuer: "Vishidh Academy", certDomain: "vishidhacademy.com"
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
function LMSCourseTab() {
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

  // Curriculum Chapters state
  const [chapters, setChapters] = useState([
    {
      id: "ch-0",
      title: "",
      videoUrl: "",
      pdfUrl: "",
      subtopics: [{ id: "sub-0", title: "", videoUrl: "", pdfUrl: "" }],
      quiz: []
    }
  ])

  // Curriculum helper methods
  const addChapter = () => {
    setChapters(prev => [
      ...prev,
      {
        id: `ch-new-${Date.now()}`,
        title: "",
        videoUrl: "",
        pdfUrl: "",
        subtopics: [{ id: `sub-new-${Date.now()}`, title: "", videoUrl: "", pdfUrl: "" }],
        quiz: []
      }
    ])
  }

  const removeChapter = (chId) => {
    if (chapters.length === 1) {
      setChapters([
        {
          id: "ch-0",
          title: "",
          videoUrl: "",
          pdfUrl: "",
          subtopics: [{ id: "sub-0", title: "", videoUrl: "", pdfUrl: "" }],
          quiz: []
        }
      ])
    } else {
      setChapters(prev => prev.filter(c => c.id !== chId))
    }
  }

  const addSubtopic = (chId) => {
    setChapters(prev =>
      prev.map(c =>
        c.id === chId
          ? {
              ...c,
              subtopics: [
                ...c.subtopics,
                { id: `sub-new-${Date.now()}`, title: "", videoUrl: "", pdfUrl: "" }
              ]
            }
          : c
      )
    )
  }

  const removeSubtopic = (chId, subId) => {
    setChapters(prev =>
      prev.map(c => {
        if (c.id === chId) {
          const filtered = c.subtopics.filter(s => s.id !== subId)
          return {
            ...c,
            subtopics: filtered.length > 0 ? filtered : [{ id: `sub-empty-${Date.now()}`, title: "", videoUrl: "", pdfUrl: "" }]
          }
        }
        return c
      })
    )
  }

  const addQuizQuestion = (chId) => {
    setChapters(prev =>
      prev.map(c =>
        c.id === chId
          ? {
              ...c,
              quiz: [
                ...c.quiz,
                {
                  id: `q-new-${Date.now()}`,
                  questionText: "",
                  options: ["", "", "", ""],
                  correctOption: 0
                }
              ]
            }
          : c
      )
    )
  }

  const removeQuizQuestion = (chId, qId) => {
    setChapters(prev =>
      prev.map(c =>
        c.id === chId
          ? { ...c, quiz: c.quiz.filter(q => q.id !== qId) }
          : c
      )
    )
  }

  const updateChapterField = (chId, field, val) => {
    setChapters(prev => prev.map(c => c.id === chId ? { ...c, [field]: val } : c))
  }

  const updateSubtopicField = (chId, subId, field, val) => {
    setChapters(prev =>
      prev.map(c =>
        c.id === chId
          ? {
              ...c,
              subtopics: c.subtopics.map(s => s.id === subId ? { ...s, [field]: val } : s)
            }
          : c
      )
    )
  }

  const updateQuizQuestionField = (chId, qId, field, val) => {
    setChapters(prev =>
      prev.map(c =>
        c.id === chId
          ? {
              ...c,
              quiz: c.quiz.map(q => q.id === qId ? { ...q, [field]: val } : q)
            }
          : c
      )
    )
  }

  const fillCourseSample = () => {
    setForm({
      title: "Vector Databases for Production RAG",
      description: "Learn how to build high-performance vector search applications using Pinecone, Milvus, and pgvector.",
      subject: "LLMs",
      instructor: "Ananya Sharma",
      duration: "9.5",
      level: "Intermediate",
      price: 2499,
      oldPrice: 3299,
      students: "3.8k",
      rating: 4.7,
      reviews: 88,
      bestseller: false,
      category: "LLMs",
      tags: "vector db, rag, search, semantic",
      status: "published",
      thumbnailUrl: "",
      videoUrl: "https://cdn.vishidhacademy.com/courses/vectordb-rag/master.m3u8",
      drm: "Signed URL (expiring)",
      passScore: 70,
      attemptPolicy: "unlimited",
      autoCertificate: true,
      certIssuer: "Vishidh Academy",
      certDomain: "vishidhacademy.com"
    })

    setChapters([
      {
        id: "ch-sample-1",
        title: "Why vector search",
        videoUrl: "https://cdn.vishidhacademy.com/vectordb-rag/ch1.mp4",
        pdfUrl: "https://cdn.vishidhacademy.com/vectordb-rag/ch1-notes.pdf",
        subtopics: [
          { id: "sub-sample-1", title: "Embeddings 101", videoUrl: "https://cdn.vishidhacademy.com/vectordb-rag/ch1-sub1.mp4", pdfUrl: "" },
          { id: "sub-sample-2", title: "Similarity metrics", videoUrl: "", pdfUrl: "https://cdn.vishidhacademy.com/vectordb-rag/ch1-sub2.pdf" }
        ],
        quiz: [
          {
            id: "q-sample-1",
            questionText: "Which metric measures angle-based similarity between vectors?",
            options: ["Cosine similarity", "Manhattan distance", "Jaccard index", "Hamming distance"],
            correctOption: 0
          }
        ]
      },
      {
        id: "ch-sample-2",
        title: "Indexing strategies (HNSW, IVF)",
        videoUrl: "https://cdn.vishidhacademy.com/vectordb-rag/ch2.mp4",
        pdfUrl: "",
        subtopics: [
          { id: "sub-sample-3", title: "HNSW graphs", videoUrl: "", pdfUrl: "" }
        ],
        quiz: []
      }
    ])

    toast.success("Sample course data loaded! (including dynamic chapters & quiz)")
  }

  const load = async () => {
    setLoading(true)
    try { const r = await API.get("/lms/courses"); setCourses(r.data.courses || []) }
    catch { toast.error("Failed to load courses") }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openNew = () => {
    setForm(emptyForm)
    setChapters([
      {
        id: "ch-0",
        title: "",
        videoUrl: "",
        pdfUrl: "",
        subtopics: [{ id: "sub-0", title: "", videoUrl: "", pdfUrl: "" }],
        quiz: []
      }
    ])
    setEditId(null)
    setThumbFile(null)
    setVideoFile(null)
    setShowForm(true)
  }

  const openEdit = async (c) => {
    const loadToast = toast.loading("Loading course details...")
    try {
      const res = await API.get(`/lms/courses/${c._id}`)
      const fullCourse = res.data.course
      const fullModules = res.data.modules || []

      setForm({
        title: fullCourse.title || "",
        description: fullCourse.description || "",
        subject: fullCourse.subject || "",
        instructor: fullCourse.instructor || "Admin",
        duration: fullCourse.duration || "Self-paced",
        level: fullCourse.level || "All Levels",
        price: fullCourse.price || 0,
        oldPrice: fullCourse.oldPrice || "",
        category: fullCourse.category || "",
        tags: (fullCourse.tags || []).join(", "),
        status: fullCourse.status || "draft",
        students: fullCourse.students || "",
        rating: fullCourse.rating || "",
        reviews: fullCourse.reviews || "",
        bestseller: fullCourse.bestseller || false,
        thumbnailUrl: fullCourse.thumbnailUrl || "",
        videoUrl: fullCourse.videoUrl || "",
        drm: fullCourse.drm || "Signed URL (expiring)",
        passScore: fullCourse.passScore || 70,
        attemptPolicy: fullCourse.attemptPolicy || "unlimited",
        autoCertificate: fullCourse.autoCertificate ?? true,
        certIssuer: fullCourse.certIssuer || "Vishidh Academy",
        certDomain: fullCourse.certDomain || "vishidhacademy.com"
      })

      const mappedChapters = fullModules.map((m, mIdx) => ({
        _id: m._id,
        id: m._id || `ch-loaded-${mIdx}`,
        title: m.title || "",
        videoUrl: m.videoUrl || "",
        pdfUrl: m.pdfUrl || "",
        subtopics: (m.lessons || []).map((l, lIdx) => ({
          _id: l._id,
          id: l._id || `sub-loaded-${lIdx}`,
          title: l.title || "",
          videoUrl: l.type === "video" ? l.contentUrl : "",
          pdfUrl: l.type === "pdf" ? l.contentUrl : ""
        })),
        quiz: (m.quiz || []).map((q, qIdx) => ({
          id: q._id || `q-loaded-${qIdx}`,
          questionText: q.questionText || "",
          options: q.options || ["", "", "", ""],
          correctOption: q.correctOption ?? 0
        }))
      }))

      setChapters(mappedChapters.length > 0 ? mappedChapters : [
        {
          id: "ch-0",
          title: "",
          videoUrl: "",
          pdfUrl: "",
          subtopics: [{ id: "sub-0", title: "", videoUrl: "", pdfUrl: "" }],
          quiz: []
        }
      ])

      setEditId(c._id)
      setThumbFile(null)
      setVideoFile(null)
      setShowForm(true)
    } catch (e) {
      toast.error("Failed to load course details")
    } finally {
      toast.dismiss(loadToast)
    }
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

      // Sync Dynamic Chapters Builder state
      const cleanedChapters = chapters.map(ch => {
        const cleanSubtopics = ch.subtopics.map(sub => ({
          _id: sub._id,
          title: sub.title?.trim(),
          videoUrl: sub.videoUrl?.trim(),
          pdfUrl: sub.pdfUrl?.trim()
        })).filter(s => s.title)

        const cleanQuiz = ch.quiz.map(q => ({
          questionText: q.questionText?.trim(),
          options: q.options.map(o => o.trim()),
          correctOption: Number(q.correctOption)
        })).filter(q => q.questionText)

        return {
          _id: ch._id,
          title: ch.title?.trim(),
          videoUrl: ch.videoUrl?.trim(),
          pdfUrl: ch.pdfUrl?.trim(),
          subtopics: cleanSubtopics,
          quiz: cleanQuiz
        }
      }).filter(ch => ch.title)

      fd.append("chapters", JSON.stringify(cleanedChapters))

      if (editId) {
        await API.put(`/lms/courses/${editId}`, fd, { headers: { "Content-Type": "multipart/form-data" } })
        toast.success("Course updated!")
      } else {
        await API.post("/lms/courses", fd, { headers: { "Content-Type": "multipart/form-data" } })
        toast.success("Course created!")
      }
      closeForm()
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save")
    } finally {
      setSaving(false)
    }
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slideUp">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2"><FiBookOpen className="text-[var(--primary)]" /> {editId ? "Edit Course" : "New Course"}</h2>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"><FiX size={18} /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* BASICS CARD */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Basics</h3>
                  <Field label="Course Title *">
                    <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. LLM Foundations: From Tokens to Transformers" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Category / Topic *">
                      <Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                        <option value="">Select…</option>
                        {["LLMs","Generative AI","Agentic AI","Data Analytics","Python","Machine Learning"].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </Select>
                    </Field>
                    <Field label="Level *">
                      <Select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                        <option value="">Select…</option>
                        {["Beginner","Intermediate","Advanced"].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                      </Select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Instructor name *">
                      <Input value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} placeholder="e.g. Dr. Rao" />
                    </Field>
                    <Field label="Total duration (hours) *">
                      <Input type="number" step="0.5" min="0.5" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 8.5" />
                    </Field>
                  </div>
                  <Field label="Subject *">
                    <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Mathematics" />
                  </Field>
                  <Field label="Description *">
                    <Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will students learn?" />
                  </Field>
                  <Field label="Tags (comma-separated)">
                    <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="tag1, tag2" />
                  </Field>
                </div>

                {/* PRICING & SOCIAL PROOF */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Pricing & social proof</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Price (₹) *">
                      <Input type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="1999" />
                    </Field>
                    <Field label="Compare-at price (₹)">
                      <Input type="number" min={0} value={form.oldPrice} onChange={e => setForm(f => ({ ...f, oldPrice: e.target.value }))} placeholder="2999" />
                    </Field>
                    <Field label="Students enrolled">
                      <Input value={form.students} onChange={e => setForm(f => ({ ...f, students: e.target.value }))} placeholder="e.g. 12k" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Rating (0–5)">
                      <Input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} placeholder="4.8" />
                    </Field>
                    <Field label="Review count">
                      <Input type="number" min={0} value={form.reviews} onChange={e => setForm(f => ({ ...f, reviews: e.target.value }))} placeholder="412" />
                    </Field>
                    <div className="flex items-center h-full pt-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 select-none">
                        <input type="checkbox" checked={form.bestseller} onChange={e => setForm(f => ({ ...f, bestseller: e.target.checked }))} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        Mark as Bestseller badge
                      </label>
                    </div>
                  </div>
                  <Field label="Status">
                    <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </Select>
                  </Field>
                </div>

                {/* THUMBNAIL */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Thumbnail</h3>
                  <MediaPicker label="Thumbnail Image" urlVal={form.thumbnailUrl} onUrl={v => setForm(f => ({ ...f, thumbnailUrl: v }))} onFile={setThumbFile} accept="image/*" />
                  <p className="text-[10px] text-gray-400 -mt-2 leading-relaxed">If left empty, the card auto-generates a brand-colored gradient thumbnail.</p>
                </div>

                {/* VIDEO SOURCE */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Video source</h3>
                  <MediaPicker label="Video file / stream URL" urlVal={form.videoUrl} onUrl={v => setForm(f => ({ ...f, videoUrl: v }))} onFile={setVideoFile} accept="video/*" />
                  <Field label="DRM / access mode">
                    <Select value={form.drm} onChange={e => setForm(f => ({ ...f, drm: e.target.value }))}>
                      <option>Signed URL (expiring)</option>
                      <option>DRM-protected (Widevine/FairPlay)</option>
                      <option>Public (not recommended)</option>
                    </Select>
                  </Field>
                </div>

                {/* CURRICULUM builder */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Curriculum — chapters, sub-topics, materials &amp; quizzes</h3>
                  </div>
                  <p className="text-xs text-gray-400 -mt-2">Build the course tree: each chapter can hold optional video/PDF links, nested sub-topics (with their own optional video/PDF), and a chapter quiz. This maps directly to the video player's chapter nav and the student dashboard's progress checklist.</p>
                  
                  <div className="space-y-4">
                    {chapters.map((ch, chIdx) => (
                      <div key={ch.id} className="border border-gray-200 rounded-2xl bg-gray-50/50 p-4">
                        <div className="flex gap-3 items-center mb-3">
                          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {chIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={ch.title}
                            onChange={e => updateChapterField(ch.id, "title", e.target.value)}
                            placeholder="Chapter title, e.g. Why LLMs, why now"
                            className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => removeChapter(ch.id)}
                            className="p-1.5 rounded-lg border border-gray-250 text-gray-400 hover:text-red-500 hover:border-red-300 bg-white transition"
                            title="Remove chapter"
                          >
                            <FiX size={15} />
                          </button>
                        </div>

                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Chapter-level materials (optional)</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <input
                            type="url"
                            value={ch.videoUrl}
                            onChange={e => updateChapterField(ch.id, "videoUrl", e.target.value)}
                            placeholder="🎬 Video link (optional)"
                            className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                          />
                          <input
                            type="url"
                            value={ch.pdfUrl}
                            onChange={e => updateChapterField(ch.id, "pdfUrl", e.target.value)}
                            placeholder="📄 PDF material link (optional)"
                            className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                          />
                        </div>

                        <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sub-topics</h5>
                          <div className="space-y-2 mb-2">
                            {ch.subtopics.map((sub, sIdx) => (
                              <div key={sub.id} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-4">
                                  <input
                                    type="text"
                                    value={sub.title}
                                    onChange={e => updateSubtopicField(ch.id, sub.id, "title", e.target.value)}
                                    placeholder="Sub-topic title"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                  />
                                </div>
                                <div className="col-span-4">
                                  <input
                                    type="url"
                                    value={sub.videoUrl}
                                    onChange={e => updateSubtopicField(ch.id, sub.id, "videoUrl", e.target.value)}
                                    placeholder="Video link (optional)"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <input
                                    type="url"
                                    value={sub.pdfUrl}
                                    onChange={e => updateSubtopicField(ch.id, sub.id, "pdfUrl", e.target.value)}
                                    placeholder="PDF link (optional)"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                  />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                  <button
                                    type="button"
                                    onClick={() => removeSubtopic(ch.id, sub.id)}
                                    className="p-1 rounded-lg text-gray-400 hover:text-red-500 transition"
                                    title="Remove sub-topic"
                                  >
                                    <FiX size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => addSubtopic(ch.id)}
                            className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 w-fit"
                          >
                            + Add sub-topic
                          </button>
                        </div>

                        <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Chapter quiz (optional — student must pass to progress)</h5>
                          <div className="space-y-3 mb-2">
                            {ch.quiz.map((q, qIdx) => (
                              <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm relative">
                                <button
                                  type="button"
                                  onClick={() => removeQuizQuestion(ch.id, q.id)}
                                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition"
                                  title="Remove question"
                                >
                                  <FiX size={14} />
                                </button>
                                <div className="mb-2 pr-6">
                                  <input
                                    type="text"
                                    value={q.questionText}
                                    onChange={e => updateQuizQuestionField(ch.id, q.id, "questionText", e.target.value)}
                                    placeholder="Question text"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold"
                                  />
                                </div>
                                <div className="space-y-1.5 pl-2">
                                  {q.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="flex items-center gap-2">
                                      <input
                                        type="radio"
                                        name={`quiz-correct-${q.id}`}
                                        checked={Number(q.correctOption) === oIdx}
                                        onChange={() => updateQuizQuestionField(ch.id, q.id, "correctOption", oIdx)}
                                        className="accent-teal-600 w-4 h-4 cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={e => {
                                          const newOpts = [...q.options]
                                          newOpts[oIdx] = e.target.value
                                          updateQuizQuestionField(ch.id, q.id, "options", newOpts)
                                        }}
                                        placeholder={`Option ${oIdx + 1}`}
                                        className="flex-1 px-2.5 py-1 rounded-lg border border-gray-250 text-xs bg-gray-50 focus:outline-none"
                                      />
                                      {Number(q.correctOption) === oIdx && (
                                        <span className="text-[10px] text-teal-600 font-bold">✓ correct</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => addQuizQuestion(ch.id)}
                            className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 w-fit"
                          >
                            + Add quiz question
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addChapter}
                    className="px-3 py-1.5 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 hover:text-blue-600 hover:border-blue-300 bg-white transition w-fit"
                  >
                    + Add chapter
                  </button>
                </div>

                {/* ASSESSMENT & CERTIFICATION */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Assessment & certification</h3>
                  <p className="text-xs text-gray-400 -mt-2">Controls how quizzes are graded and how the completion certificate is issued.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Passing score required (%)">
                      <Input type="number" min={0} max={100} value={form.passScore} onChange={e => setForm(f => ({ ...f, passScore: e.target.value }))} />
                    </Field>
                    <Field label="Quiz attempts allowed">
                      <Select value={form.attemptPolicy} onChange={e => setForm(f => ({ ...f, attemptPolicy: e.target.value }))}>
                        <option value="unlimited">Unlimited — retry until passed</option>
                        <option value="3">Limited — 3 attempts</option>
                        <option value="5">Limited — 5 attempts</option>
                        <option value="1">Single attempt only</option>
                      </Select>
                    </Field>
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 select-none">
                    <input type="checkbox" checked={form.autoCertificate} onChange={e => setForm(f => ({ ...f, autoCertificate: e.target.checked }))} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                    Auto-issue certificate immediately on course + quiz completion
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Certificate issuer name">
                      <Input value={form.certIssuer} onChange={e => setForm(f => ({ ...f, certIssuer: e.target.value }))} />
                    </Field>
                    <Field label="Issuer domain (shown on certificate)">
                      <Input value={form.certDomain} onChange={e => setForm(f => ({ ...f, certDomain: e.target.value }))} />
                    </Field>
                  </div>

                  {/* Certificate preview */}
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center bg-gradient-to-br from-blue-50/20 to-indigo-50/20 mt-2">
                    <div className="w-10 h-10 rounded-full mx-auto mb-2 bg-gradient-to-br from-blue-600 to-sky-500 text-white font-display text-sm font-bold flex items-center justify-center shadow-md">
                      V
                    </div>
                    <p className="font-bold text-gray-800 text-base font-display">Certificate of Completion</p>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
                      This certifies that <strong>[Student Name]</strong> has successfully completed <strong className="text-gray-800">{form.title || "[Course Title]"}</strong>, meeting the required passing score.
                    </p>
                    <p className="text-[10px] text-gray-400 mt-4 font-semibold uppercase tracking-wide">
                      Issued by <strong className="text-gray-700">{form.certIssuer || "Vishidh Academy"}</strong> · <span>{form.certDomain || "vishidhacademy.com"}</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl font-[Inter] shrink-0">
              <button onClick={closeForm} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-150 hover:text-gray-700 transition">Cancel</button>
              <button onClick={fillCourseSample} className="px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition" type="button">Fill sample data</button>
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

export default function AdminLMSCourses() {
  const [activeTab, setActiveTab] = useState("course")

  return (
    <div>
      <div className="bg-[#f5f9fc] dark:bg-[var(--navy-900)] rounded-3xl p-8 mb-6 border border-slate-200 dark:border-white/10">
        <span className="text-[var(--accent)] font-mono text-xs tracking-widest uppercase mb-2 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-2)] shadow-[0_0_0_3px_rgba(242,169,59,0.22)]"></span>
          Admin panel
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-2">Add content to Vishidh Academy</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-2xl text-sm leading-relaxed">
          Manage Recorded Courses and Live Batches. Choose a tab below to configure learning materials, pricing, assessment rules, and view existing entries.
        </p>
      </div>

      <div className="flex gap-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-full w-max mb-6">
        <button 
          onClick={() => setActiveTab("course")} 
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "course" ? "bg-[var(--accent)] text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
        >
          📼 Recorded Course
        </button>
        <button 
          onClick={() => setActiveTab("batch")} 
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "batch" ? "bg-[var(--accent)] text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
        >
          🎥 Live Batch
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "course" && <LMSCourseTab />}
        {activeTab === "batch" && <AdminLiveClasses />}
      </div>
    </div>
  )
}
