import { useState, useEffect, useCallback, useRef } from "react"
import API from "../../services/api"
import toast from "react-hot-toast"
import {
  FiClipboard, FiZap, FiCalendar, FiDownload, FiPlus, FiTrash2,
  FiRefreshCw, FiLoader, FiBook, FiCheck, FiAlertCircle,
  FiLink, FiUploadCloud, FiFile, FiX
} from "react-icons/fi"

const TABS = [
  { id: "assignments", label: "Assignments", icon: FiClipboard, color: "from-blue-500 to-indigo-600" },
  { id: "quizzes",     label: "Quizzes",     icon: FiZap,       color: "from-purple-500 to-pink-500"  },
  { id: "calendar",   label: "Calendar",    icon: FiCalendar,  color: "from-emerald-500 to-teal-500" },
  { id: "downloads",  label: "Downloads",   icon: FiDownload,  color: "from-orange-500 to-red-500"   },
]

/* ─── Reusable form field ─── */
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
const inp = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition"
const sel = inp + " font-semibold"

/* ─── Course selector ─── */
function CourseSelect({ courses, value, onChange, required = true }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={sel} required={required}>
      <option value="">— Select Course —</option>
      {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
    </select>
  )
}

/* ─── Existing record row ─── */
function RecordRow({ icon: Icon, title, sub, badge, badgeCls }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition">
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
        <Icon size={14} className="text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-400 truncate">{sub}</p>
      </div>
      {badge && <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 ${badgeCls}`}>{badge}</span>}
    </div>
  )
}

export default function AdminLMSContent() {
  const [tab, setTab] = useState("assignments")
  const [courses, setCourses] = useState([])
  const [records, setRecords] = useState({ assignments: [], quizzes: [], events: [], downloads: [] })
  const [loading, setLoading]   = useState(false)
  const [saving,  setSaving]    = useState(false)

  /* ── Form states ── */
  const [aForm, setAForm] = useState({ courseId: "", title: "", description: "", points: 100, dueDate: "" })
  const [qForm, setQForm] = useState({
    courseId: "", title: "", timeLimit: "15 min", passingScore: 70,
    questions: [{ questionText: "", options: ["", "", "", ""], correctOption: 0 }]
  })
  const [eForm, setEForm] = useState({ courseId: "", title: "", date: "", time: "", type: "class", meetLink: "" })
  const [dForm, setDForm] = useState({ courseId: "", name: "", category: "Slides", size: "1.0 MB", fileUrl: "" })
  const [dMode, setDMode]   = useState("url")   // "url" | "file"
  const [dFile, setDFile]   = useState(null)     // selected File object
  const [dDrag, setDDrag]   = useState(false)    // drag-over state
  const fileRef             = useRef(null)

  /* ── Load courses & existing records ── */
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [cRes, aRes, qRes, eRes, dRes] = await Promise.all([
        API.get("/admin/courses-list"),
        API.get("/admin/lms-content/assignments"),
        API.get("/admin/lms-content/quizzes"),
        API.get("/admin/lms-content/events"),
        API.get("/admin/lms-content/downloads"),
      ])
      setCourses(cRes.data.courses || [])
      setRecords({
        assignments: aRes.data.assignments || [],
        quizzes:     qRes.data.quizzes     || [],
        events:      eRes.data.events      || [],
        downloads:   dRes.data.downloads   || [],
      })
    } catch {
      // courses-list always works; individual ones may 404 if not yet wired
      try {
        const cRes = await API.get("/admin/courses-list")
        setCourses(cRes.data.courses || [])
      } catch {}
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  /* ── Handlers ── */
  const submit = async (e, fn) => { e.preventDefault(); setSaving(true); try { await fn() } finally { setSaving(false) } }

  const handleAssignment = () => submit(window.event || { preventDefault: () => {} }, async () => {
    if (!aForm.courseId || !aForm.title || !aForm.dueDate) return toast.error("Fill in course, title and due date")
    await API.post("/admin/assignments", aForm)
    toast.success("Assignment created and pushed to enrolled students!")
    setAForm(prev => ({ ...prev, title: "", description: "", dueDate: "" }))
    load()
  })

  const handleQuiz = () => submit(window.event || { preventDefault: () => {} }, async () => {
    if (!qForm.courseId || !qForm.title) return toast.error("Fill in course and title")
    const bad = qForm.questions.some(q => !q.questionText.trim() || q.options.some(o => !o.trim()))
    if (bad) return toast.error("Complete all question texts and options")
    await API.post("/admin/quizzes", qForm)
    toast.success("Quiz published to enrolled students!")
    setQForm(prev => ({ ...prev, title: "", questions: [{ questionText: "", options: ["", "", "", ""], correctOption: 0 }] }))
    load()
  })

  const handleEvent = () => submit(window.event || { preventDefault: () => {} }, async () => {
    if (!eForm.courseId || !eForm.title || !eForm.date || !eForm.time) return toast.error("Fill in all required fields")
    await API.post("/admin/events", eForm)
    toast.success("Event scheduled on student calendars!")
    setEForm(prev => ({ ...prev, title: "", date: "", time: "", meetLink: "" }))
    load()
  })

  const handleDownload = async (e) => {
    e.preventDefault()
    if (!dForm.courseId || !dForm.name) return toast.error("Select a course and enter a resource name")
    if (dMode === "url" && !dForm.fileUrl) return toast.error("Paste a valid file URL")
    if (dMode === "file" && !dFile) return toast.error("Choose a file to upload")
    setSaving(true)
    try {
      if (dMode === "file") {
        const fd = new FormData()
        fd.append("courseId",  dForm.courseId)
        fd.append("name",      dForm.name)
        fd.append("category",  dForm.category)
        fd.append("size",      dForm.size)
        fd.append("file",      dFile)
        await API.post("/admin/downloads", fd, { headers: { "Content-Type": "multipart/form-data" } })
      } else {
        await API.post("/admin/downloads", dForm)
      }
      toast.success("Resource published to enrolled students!")
      setDForm(prev => ({ ...prev, name: "", fileUrl: "", size: "1.0 MB" }))
      setDFile(null)
      load()
    } catch {
      toast.error("Failed to publish resource")
    } finally {
      setSaving(false)
    }
  }

  const addQuestion = () =>
    setQForm(prev => ({ ...prev, questions: [...prev.questions, { questionText: "", options: ["", "", "", ""], correctOption: 0 }] }))
  const removeQuestion = idx =>
    setQForm(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }))
  const setQText = (idx, val) => {
    const q = [...qForm.questions]; q[idx].questionText = val; setQForm(prev => ({ ...prev, questions: q }))
  }
  const setQOpt = (idx, oi, val) => {
    const q = [...qForm.questions]; q[idx].options[oi] = val; setQForm(prev => ({ ...prev, questions: q }))
  }

  const currentTab = TABS.find(t => t.id === tab)

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">LMS Content Manager</h2>
          <p className="text-sm text-gray-400 mt-0.5">Create and publish course assignments, quizzes, schedules and resources</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--primary)] transition">
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Tab Pills */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm ${
              tab === t.id
                ? `bg-gradient-to-r ${t.color} text-white shadow-lg scale-105`
                : "bg-white text-gray-500 border border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <FiLoader className="animate-spin" size={22} /> Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Create Form (3 cols) ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Form header */}
              <div className={`bg-gradient-to-r ${currentTab.color} px-6 py-5 text-white`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                    <currentTab.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Create {currentTab.label.replace(/s$/, "")}</h3>
                    <p className="text-white/70 text-xs">Instantly pushed to all enrolled students</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* No courses warning */}
                {courses.length === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 text-xs rounded-xl border border-amber-100">
                    <FiAlertCircle size={14} /> No LMS courses found. Create courses first under "LMS Courses".
                  </div>
                )}

                {/* ══ ASSIGNMENTS FORM ══ */}
                {tab === "assignments" && (
                  <form onSubmit={e => { e.preventDefault(); handleAssignment() }} className="space-y-4">
                    <Field label="Course"><CourseSelect courses={courses} value={aForm.courseId} onChange={v => setAForm(p => ({ ...p, courseId: v }))} /></Field>
                    <Field label="Title">
                      <input className={inp} placeholder="e.g. Calculus Problem Set 1" required value={aForm.title} onChange={e => setAForm(p => ({ ...p, title: e.target.value }))} />
                    </Field>
                    <Field label="Description">
                      <textarea className={inp} rows={3} placeholder="Describe the assignment tasks..." value={aForm.description} onChange={e => setAForm(p => ({ ...p, description: e.target.value }))} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Points">
                        <input className={inp} type="number" min="1" max="1000" value={aForm.points} onChange={e => setAForm(p => ({ ...p, points: +e.target.value }))} />
                      </Field>
                      <Field label="Due Date">
                        <input className={inp} type="date" required value={aForm.dueDate} onChange={e => setAForm(p => ({ ...p, dueDate: e.target.value }))} />
                      </Field>
                    </div>
                    <button type="submit" disabled={saving || courses.length === 0} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg transition">
                      {saving ? <FiLoader className="animate-spin" size={16} /> : <FiPlus size={16} />} Publish Assignment
                    </button>
                  </form>
                )}

                {/* ══ QUIZZES FORM ══ */}
                {tab === "quizzes" && (
                  <form onSubmit={e => { e.preventDefault(); handleQuiz() }} className="space-y-4">
                    <Field label="Course"><CourseSelect courses={courses} value={qForm.courseId} onChange={v => setQForm(p => ({ ...p, courseId: v }))} /></Field>
                    <Field label="Quiz Title">
                      <input className={inp} placeholder="e.g. Limits & Derivatives Quiz" required value={qForm.title} onChange={e => setQForm(p => ({ ...p, title: e.target.value }))} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Time Limit">
                        <input className={inp} placeholder="e.g. 20 min" value={qForm.timeLimit} onChange={e => setQForm(p => ({ ...p, timeLimit: e.target.value }))} />
                      </Field>
                      <Field label="Passing Score (%)">
                        <input className={inp} type="number" min="1" max="100" value={qForm.passingScore} onChange={e => setQForm(p => ({ ...p, passingScore: +e.target.value }))} />
                      </Field>
                    </div>

                    {/* Questions */}
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {qForm.questions.map((q, qi) => (
                        <div key={qi} className="p-4 border border-gray-200 rounded-2xl bg-gray-50 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-gray-500 uppercase">Q{qi + 1}</span>
                            {qForm.questions.length > 1 && (
                              <button type="button" onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-600 transition">
                                <FiTrash2 size={13} />
                              </button>
                            )}
                          </div>
                          <input className={inp} placeholder="Question text..." required value={q.questionText} onChange={e => setQText(qi, e.target.value)} />
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-1.5">
                                <button type="button" onClick={() => { const nq = [...qForm.questions]; nq[qi].correctOption = oi; setQForm(p => ({ ...p, questions: nq })) }}
                                  className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition ${q.correctOption === oi ? "border-emerald-500 bg-emerald-500 text-white" : "border-gray-300"}`}>
                                  {q.correctOption === oi && <FiCheck size={10} />}
                                </button>
                                <input className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white" placeholder={`Option ${oi + 1}`} required value={opt} onChange={e => setQOpt(qi, oi, e.target.value)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={addQuestion} className="w-full py-2 border-2 border-dashed border-purple-300 text-purple-500 rounded-xl text-xs font-bold hover:bg-purple-50 transition flex items-center justify-center gap-1">
                      <FiPlus size={13} /> Add Question
                    </button>
                    <button type="submit" disabled={saving || courses.length === 0} className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg transition">
                      {saving ? <FiLoader className="animate-spin" size={16} /> : <FiZap size={16} />} Publish Quiz
                    </button>
                  </form>
                )}

                {/* ══ CALENDAR FORM ══ */}
                {tab === "calendar" && (
                  <form onSubmit={e => { e.preventDefault(); handleEvent() }} className="space-y-4">
                    <Field label="Course"><CourseSelect courses={courses} value={eForm.courseId} onChange={v => setEForm(p => ({ ...p, courseId: v }))} /></Field>
                    <Field label="Event Title">
                      <input className={inp} placeholder="e.g. Live Class: Integration Techniques" required value={eForm.title} onChange={e => setEForm(p => ({ ...p, title: e.target.value }))} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Date"><input className={inp} type="date" required value={eForm.date} onChange={e => setEForm(p => ({ ...p, date: e.target.value }))} /></Field>
                      <Field label="Time"><input className={inp} type="time" required value={eForm.time} onChange={e => setEForm(p => ({ ...p, time: e.target.value }))} /></Field>
                    </div>
                    <Field label="Event Type">
                      <select className={sel} value={eForm.type} onChange={e => setEForm(p => ({ ...p, type: e.target.value }))}>
                        <option value="class">Live Class</option>
                        <option value="exam">Exam</option>
                        <option value="deadline">Deadline</option>
                        <option value="workshop">Workshop</option>
                      </select>
                    </Field>
                    <Field label="Meet Link (optional)">
                      <input className={inp} placeholder="https://meet.google.com/..." value={eForm.meetLink} onChange={e => setEForm(p => ({ ...p, meetLink: e.target.value }))} />
                    </Field>
                    <button type="submit" disabled={saving || courses.length === 0} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg transition">
                      {saving ? <FiLoader className="animate-spin" size={16} /> : <FiCalendar size={16} />} Schedule Event
                    </button>
                  </form>
                )}

                {/* ══ DOWNLOADS FORM ══ */}
                {tab === "downloads" && (
                  <form onSubmit={handleDownload} className="space-y-4">
                    <Field label="Course"><CourseSelect courses={courses} value={dForm.courseId} onChange={v => setDForm(p => ({ ...p, courseId: v }))} /></Field>
                    <Field label="Resource Name">
                      <input className={inp} placeholder="e.g. Lecture Notes – Week 3.pdf" required value={dForm.name} onChange={e => setDForm(p => ({ ...p, name: e.target.value }))} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Category">
                        <select className={sel} value={dForm.category} onChange={e => setDForm(p => ({ ...p, category: e.target.value }))}>
                          <option>Slides</option>
                          <option>Datasets</option>
                          <option>Assignments</option>
                          <option>Notes</option>
                          <option>Other</option>
                        </select>
                      </Field>
                      <Field label="File Size">
                        <input className={inp} placeholder="Auto-detected on upload" value={dForm.size}
                          onChange={e => setDForm(p => ({ ...p, size: e.target.value }))}
                          disabled={dMode === "file" && !!dFile} />
                      </Field>
                    </div>

                    {/* ── Mode Toggle ── */}
                    <div className="flex rounded-xl overflow-hidden border border-gray-200 text-xs font-bold">
                      <button type="button"
                        onClick={() => { setDMode("url"); setDFile(null) }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 transition ${
                          dMode === "url" ? "bg-orange-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}>
                        <FiLink size={13} /> Paste URL
                      </button>
                      <button type="button"
                        onClick={() => { setDMode("file"); setDForm(p => ({ ...p, fileUrl: "" })) }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 transition border-l border-gray-200 ${
                          dMode === "file" ? "bg-orange-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}>
                        <FiUploadCloud size={13} /> Upload File
                      </button>
                    </div>

                    {/* ── URL mode ── */}
                    {dMode === "url" && (
                      <>
                        <Field label="File URL">
                          <input className={inp} type="url"
                            placeholder="https://drive.google.com/file/... or /uploads/..."
                            value={dForm.fileUrl}
                            onChange={e => setDForm(p => ({ ...p, fileUrl: e.target.value }))} />
                        </Field>
                        <p className="text-[11px] text-gray-400 -mt-2 flex items-center gap-1">
                          <FiBook size={11} /> Google Drive, Cloudinary, Dropbox, or any direct link.
                        </p>
                      </>
                    )}

                    {/* ── File upload mode ── */}
                    {dMode === "file" && (
                      <div
                        onDragOver={e => { e.preventDefault(); setDDrag(true) }}
                        onDragLeave={() => setDDrag(false)}
                        onDrop={e => {
                          e.preventDefault(); setDDrag(false)
                          const f = e.dataTransfer.files[0]
                          if (f) {
                            setDFile(f)
                            const mb = (f.size / (1024 * 1024)).toFixed(1)
                            setDForm(p => ({ ...p, size: `${mb} MB`, name: p.name || f.name }))
                          }
                        }}
                        onClick={() => fileRef.current?.click()}
                        className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${
                          dDrag ? "border-orange-400 bg-orange-50" : dFile ? "border-emerald-400 bg-emerald-50" : "border-gray-300 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/40"
                        }`}
                      >
                        <input ref={fileRef} type="file" className="hidden"
                          onChange={e => {
                            const f = e.target.files[0]
                            if (f) {
                              setDFile(f)
                              const mb = (f.size / (1024 * 1024)).toFixed(1)
                              setDForm(p => ({ ...p, size: `${mb} MB`, name: p.name || f.name }))
                            }
                          }}
                        />
                        {dFile ? (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <FiFile size={20} className="text-emerald-600" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-emerald-700 truncate max-w-xs">{dFile.name}</p>
                              <p className="text-xs text-emerald-500">{(dFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <button type="button" onClick={e => { e.stopPropagation(); setDFile(null) }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition">
                              <FiX size={12} />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                              <FiUploadCloud size={20} className="text-orange-500" />
                            </div>
                            <p className="text-sm font-bold text-gray-600">Click or drag & drop</p>
                            <p className="text-xs text-gray-400">PDF, PPT, DOCX, MP4, ZIP · Max 100 MB</p>
                          </>
                        )}
                      </div>
                    )}

                    <button type="submit" disabled={saving || courses.length === 0} className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg transition">
                      {saving ? <FiLoader className="animate-spin" size={16} /> : <FiUploadCloud size={16} />}
                      {dMode === "file" ? "Upload & Publish Resource" : "Publish Resource"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Existing Records (2 cols) ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-black text-sm text-gray-700">Published {currentTab.label}</h4>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold">
                  {tab === "assignments" ? records.assignments.length
                    : tab === "quizzes"   ? records.quizzes.length
                    : tab === "calendar"  ? records.events.length
                    :                       records.downloads.length} total
                </span>
              </div>
              <div className="p-4 space-y-2 max-h-[520px] overflow-y-auto">

                {tab === "assignments" && (records.assignments.length === 0
                  ? <p className="text-xs text-gray-400 text-center py-8">No assignments yet</p>
                  : records.assignments.map(a => (
                    <RecordRow key={a._id} icon={FiClipboard} title={a.title}
                      sub={`${a.courseId?.title || "Course"} · Due ${a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "—"}`}
                      badge={`${a.points} pts`} badgeCls="bg-blue-50 text-blue-600" />
                  ))
                )}

                {tab === "quizzes" && (records.quizzes.length === 0
                  ? <p className="text-xs text-gray-400 text-center py-8">No quizzes yet</p>
                  : records.quizzes.map(q => (
                    <RecordRow key={q._id} icon={FiZap} title={q.title}
                      sub={`${q.courseId?.title || "Course"} · ${q.questions?.length || 0} questions`}
                      badge={`${q.passingScore}% pass`} badgeCls="bg-purple-50 text-purple-600" />
                  ))
                )}

                {tab === "calendar" && (records.events.length === 0
                  ? <p className="text-xs text-gray-400 text-center py-8">No events yet</p>
                  : records.events.map(ev => (
                    <RecordRow key={ev._id} icon={FiCalendar} title={ev.title}
                      sub={`${ev.courseId?.title || "Course"} · ${ev.date} ${ev.time}`}
                      badge={ev.type} badgeCls="bg-emerald-50 text-emerald-600" />
                  ))
                )}

                {tab === "downloads" && (records.downloads.length === 0
                  ? <p className="text-xs text-gray-400 text-center py-8">No resources yet</p>
                  : records.downloads.map(d => (
                    <RecordRow key={d._id} icon={FiDownload} title={d.name}
                      sub={`${d.courseId?.title || "Course"} · ${d.category}`}
                      badge={d.size} badgeCls="bg-orange-50 text-orange-600" />
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
