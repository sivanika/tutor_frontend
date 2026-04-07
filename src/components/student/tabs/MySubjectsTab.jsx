import { useState, useEffect, useCallback } from "react"
import {
  FiPlus, FiTrash2, FiEdit2, FiEye, FiEyeOff,
  FiUsers, FiBook, FiClock, FiDollarSign, FiSearch,
  FiX, FiCheck, FiAlertCircle, FiStar, FiChevronRight,
  FiBookOpen, FiCode, FiGlobe, FiZap, FiCpu, FiAward,
} from "react-icons/fi"
import API from "../../../services/api"
import socket from "../../../services/socket"

/* ─── CSS injected once ─────────────────────────────────────── */
const STYLES = `
@keyframes ms-fadeIn  { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
@keyframes ms-slideUp { from { opacity:0; transform:translateY(40px) } to { opacity:1; transform:translateY(0) } }
@keyframes ms-toast   { 0%,100% { opacity:0; transform:translateX(40px) } 10%,85% { opacity:1; transform:translateX(0) } }

.ms-fade   { animation: ms-fadeIn  .35s ease both }
.ms-modal  { animation: ms-slideUp .3s  ease both }
.ms-toast  { animation: ms-toast  3.5s ease both }

.ms-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(106,17,203,.12) }
.ms-card { transition: transform .25s ease, box-shadow .25s ease }

.ms-toggle-on  { background: linear-gradient(135deg,#6A11CB,#2575FC) }
.ms-toggle-off { background: #e5e7eb }

.ms-pill-active { background:linear-gradient(135deg,#6A11CB,#2575FC); color:#fff; border-color:transparent }
.ms-pill:hover  { border-color:#6A11CB; color:#6A11CB }

.ms-overlay { backdrop-filter:blur(4px); background:rgba(0,0,0,.45) }
`

/* ─── Static data ────────────────────────────────────────────── */
const SUBJECT_POOL = [
  { id: "math",      name: "Mathematics",        icon: "📐", emoji: FiBook    },
  { id: "python",    name: "Python",             icon: "🐍", emoji: FiCode    },
  { id: "physics",   name: "Physics",            icon: "⚛️", emoji: FiZap     },
  { id: "ds",        name: "Data Structures",    icon: "🌳", emoji: FiCpu     },
  { id: "web",       name: "Web Development",    icon: "🌐", emoji: FiGlobe   },
  { id: "ml",        name: "Machine Learning",   icon: "🤖", emoji: FiAward   },
  { id: "dsa",       name: "Algorithms",         icon: "🔬", emoji: FiBookOpen},
  { id: "dbms",      name: "DBMS",               icon: "🗄️", emoji: FiBook    },
  { id: "os",        name: "Operating Systems",  icon: "💻", emoji: FiCpu     },
  { id: "english",   name: "English",            icon: "📖", emoji: FiBookOpen},
  { id: "chemistry", name: "Chemistry",          icon: "🧪", emoji: FiZap     },
  { id: "economics", name: "Economics",          icon: "📈", emoji: FiGlobe   },
]

/* ─── Status badge ───────────────────────────────────────────── */
const STATUS_MAP = {
  Open:    { bg: "#dcfce7", text: "#16a34a", dot: "#22c55e" },
  Pending: { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
  Engaged: { bg: "#fee2e2", text: "#dc2626", dot: "#ef4444" },
}

function StatusBadge({ status }) {
  const c = STATUS_MAP[status] || STATUS_MAP.Open
  return (
    <span style={{ background: c.bg, color: c.text, display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700 }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot, display:"inline-block" }} />
      {status}
    </span>
  )
}

/* ─── Toggle switch ──────────────────────────────────────────── */
function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{ width:40, height:22, borderRadius:999, border:"none", cursor:"pointer", position:"relative", flexShrink:0, transition:"background .2s" }}
      className={on ? "ms-toggle-on" : "ms-toggle-off"}
      title={on ? "Visible to professors" : "Hidden from professors"}
    >
      <span style={{ position:"absolute", top:3, left: on ? 20 : 3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.2)" }} />
    </button>
  )
}

/* ─── Star rating ────────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <span style={{ color:"#f59e0b", fontSize:12, letterSpacing:1 }}>
      {"★".repeat(Math.round(rating || 0))}{"☆".repeat(5 - Math.round(rating || 0))}
      <span style={{ color:"#6b7280", fontWeight:600, marginLeft:4 }}>{(rating || 0).toFixed(1)}</span>
    </span>
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */
export default function MySubjectsTab() {
  /* ─── Inject CSS once ─── */
  useEffect(() => {
    if (document.getElementById("ms-styles")) return
    const s = document.createElement("style")
    s.id = "ms-styles"
    s.textContent = STYLES
    document.head.appendChild(s)
  }, [])

  /* ─── State ─── */
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,         setFilter]         = useState("All")
  const [toasts,         setToasts]         = useState([])
  const [showAddModal,   setShowAddModal]   = useState(false)
  const [subjectSearch,  setSubjectSearch]  = useState("")
  const [isCustomMode,   setIsCustomMode]   = useState(false)
  const [reqModal,       setReqModal]       = useState(null)   // { subjectId, mode:"create"|"edit" }
  const [reqForm,        setReqForm]        = useState({ topic:"", description:"", time:"", budget:"" })
  const [reqModal2Show,  setReqModal2Show]  = useState(null)   // subject id for professor requests modal

  /* ─── Fetch Data ─── */
  const fetchSubjects = async () => {
    try {
      const res = await API.get("/student-subjects")
      setSubjects(res.data)
    } catch (err) {
      toast(err.response?.data?.message || "Failed to fetch subjects", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
    socket.on("notification", (data) => {
      // In a real app, we might check if notification is relevant to subjects
      fetchSubjects()
    })
    return () => {
      socket.off("notification")
    }
  }, [])

  /* ─── Toast helper ─── */
  const toast = useCallback((msg, type = "success") => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3600)
  }, [])

  /* ─── Derived state ─── */
  const stats = {
    total:   subjects.length,
    open:    subjects.filter(s => s.status === "Open").length,
    pending: subjects.filter(s => s.status === "Pending").length,
    engaged: subjects.filter(s => s.status === "Engaged").length,
  }

  const filtered = filter === "All" ? subjects : subjects.filter(s => s.status === filter)
  const available = SUBJECT_POOL.filter(p => !subjects.find(s => s.subjectId === p.id))
  const searchedPool = subjectSearch
    ? available.filter(s => s.name.toLowerCase().includes(subjectSearch.toLowerCase()))
    : available

  /* ─── Actions ─── */
  const deleteSubject = async (id) => {
    try {
      await API.delete(`/student-subjects/${id}`)
      setSubjects(s => s.filter(x => x._id !== id))
      toast("Subject removed.", "warning")
    } catch (err) {
      toast("Failed to delete subject", "error")
    }
  }

  const toggleVisible = async (id, currentVal) => {
    try {
      const res = await API.patch(`/student-subjects/${id}/visibility`, { visible: !currentVal })
      setSubjects(s => s.map(x => x._id === id ? res.data : x))
      toast("Visibility updated.")
    } catch (err) {
      toast("Failed to update visibility", "error")
    }
  }

  const addSubject = async (sub) => {
    try {
      const res = await API.post("/student-subjects", {
        subjectId: sub.id,
        name: sub.name,
        icon: sub.icon
      })
      setSubjects(s => [...s, res.data])
      setShowAddModal(false)
      setSubjectSearch("")
      toast(`"${sub.name}" added!`)
    } catch (err) {
      toast(err.response?.data?.message || "Failed to add subject", "error")
    }
  }

  const addCustomSubject = async (name) => {
    if (!name.trim()) return
    const sub = {
      id: "custom-" + name.toLowerCase().trim().replace(/\s+/g, '-'),
      name: name.trim(),
      icon: "📚" // Default icon for custom subjects
    }
    await addSubject(sub)
  }

  const openReqModal = (subjectId, mode) => {
    const sub = subjects.find(s => s._id === subjectId)
    setReqForm(sub?.requirement || { topic:"", description:"", time:"", budget:"" })
    setReqModal({ subjectId, mode })
  }

  const saveRequirement = async () => {
    if (!reqForm.topic.trim()) { toast("Topic is required.", "error"); return }
    try {
      const res = await API.put(`/student-subjects/${reqModal.subjectId}/requirement`, reqForm)
      setSubjects(s => s.map(x => x._id === reqModal.subjectId ? res.data : x))
      setReqModal(null)
      toast("Requirement saved!")
    } catch (err) {
      toast("Failed to save requirement", "error")
    }
  }

  const acceptProfessor = async (subjectId, requestId) => {
    try {
      const res = await API.post(`/student-subjects/${subjectId}/requests/${requestId}/accept`)
      setSubjects(s => s.map(x => x._id === subjectId ? res.data : x))
      setReqModal2Show(null)
      toast("Professor accepted!")
    } catch (err) {
      toast("Failed to accept professor", "error")
    }
  }

  const rejectProfessor = async (subjectId, requestId, profName) => {
    try {
      const res = await API.post(`/student-subjects/${subjectId}/requests/${requestId}/reject`)
      setSubjects(s => s.map(x => x._id === subjectId ? res.data : x))
      toast(`${profName} rejected.`, "warning")
    } catch (err) {
      toast("Failed to reject professor", "error")
    }
  }

  const simulateProfessorRequest = async (subjectId) => {
    try {
      const res = await API.post(`/student-subjects/${subjectId}/simulate-request`)
      setSubjects(s => s.map(x => x._id === subjectId ? res.data : x))
      toast("Request simulated!")
    } catch (err) {
      toast(err.response?.data?.message || "Simulation failed", "error")
    }
  }

  /* ─── Prof requests for this subject ─── */
  const getProfessors = (subjectId) => {
    const sub = subjects.find(s => s._id === subjectId)
    return sub?.requests || []
  }

  /* ════════════════════════════════════════ RENDER ══════════════ */
  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh" }}>
        <div className="animate-spin w-10 h-10 rounded-full border-4 border-[#6A11CB] border-t-transparent" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth:1100, marginInline:"auto", fontFamily:"Inter,sans-serif" }}>

      {/* ── TOAST STACK ── */}
      <div style={{ position:"fixed", top:20, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:10 }}>
        {toasts.map(t => (
          <div key={t.id} className="ms-toast" style={{
            background: t.type === "success" ? "linear-gradient(135deg,#6A11CB,#2575FC)"
                      : t.type === "warning" ? "linear-gradient(135deg,#f59e0b,#ef4444)"
                      : "linear-gradient(135deg,#ef4444,#dc2626)",
            color:"#fff", padding:"12px 20px", borderRadius:14,
            boxShadow:"0 8px 32px rgba(0,0,0,.18)", fontSize:13, fontWeight:600,
            display:"flex", alignItems:"center", gap:8, minWidth:220, maxWidth:320
          }}>
            {t.type === "success" ? <FiCheck size={15}/> : <FiAlertCircle size={15}/>}
            {t.msg}
          </div>
        ))}
      </div>

      {/* ── STATS ROW ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Total Subjects", value:stats.total,   color:"from-[#6A11CB] to-[#2575FC]", bg:"#f5f3ff", tc:"#6A11CB", icon:"📚" },
          { label:"Open",           value:stats.open,    color:"from-green-400 to-emerald-500", bg:"#dcfce7", tc:"#16a34a", icon:"🟢" },
          { label:"Pending",        value:stats.pending, color:"from-amber-400 to-orange-500",  bg:"#fef3c7", tc:"#d97706", icon:"🟡" },
          { label:"Engaged",        value:stats.engaged, color:"from-red-400 to-rose-500",      bg:"#fee2e2", tc:"#dc2626", icon:"🔴" },
        ].map(s => (
          <div key={s.label} className="ms-fade" style={{ background:"#fff", borderRadius:18, padding:"18px 20px", boxShadow:"0 2px 12px rgba(0,0,0,.06)", border:"1px solid #f1f5f9" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ width:38, height:38, borderRadius:12, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{s.icon}</div>
              <span style={{ fontSize:11, color:"#9ca3af", fontWeight:600 }}>LIVE</span>
            </div>
            <div style={{ fontSize:30, fontWeight:800, color:"#1e293b", lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#64748b", fontWeight:600, marginTop:4 }}>{s.label}</div>
            <div style={{ height:3, borderRadius:4, marginTop:12, background:`linear-gradient(90deg,${s.tc},${s.tc}88)` }} />
          </div>
        ))}
      </div>

      {/* ── TOOLBAR ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:22 }}>
        <div style={{ display:"flex", gap:8 }}>
          {["All","Open","Pending","Engaged"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding:"7px 18px", borderRadius:999, fontSize:12, fontWeight:700, border:"2px solid",
                cursor:"pointer", transition:"all .2s",
                ...(filter === f
                  ? { background:"linear-gradient(135deg,#6A11CB,#2575FC)", color:"#fff", borderColor:"transparent" }
                  : { background:"#fff", color:"#64748b", borderColor:"#e2e8f0" }
                )
              }}
            >
              {f}
              {f !== "All" && <span style={{ marginLeft:5, opacity:.7 }}>({stats[f.toLowerCase()]})</span>}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 20px", borderRadius:12, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#6A11CB,#2575FC)", color:"#fff", fontWeight:700, fontSize:13, boxShadow:"0 4px 14px rgba(106,17,203,.3)", transition:"all .2s" }}
          onMouseEnter={e => e.currentTarget.style.transform="scale(1.04)"}
          onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
        >
          <FiPlus size={15}/> Add Subject
        </button>
      </div>

      {/* ── SUBJECT CARDS GRID ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px", background:"#fff", borderRadius:20, border:"2px dashed #e2e8f0" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
          <p style={{ fontWeight:700, color:"#374151", fontSize:16 }}>No subjects found</p>
          <p style={{ color:"#9ca3af", fontSize:13, marginTop:4 }}>Try a different filter or add a new subject.</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:18 }}>
          {filtered.map((sub, i) => (
            <SubjectCard
              key={sub._id}
              sub={sub}
              delay={i * 60}
              onDelete={() => deleteSubject(sub._id)}
              onToggle={() => toggleVisible(sub._id, sub.visible)}
              onCreateReq={() => openReqModal(sub._id, "create")}
              onEditReq={() => openReqModal(sub._id, "edit")}
              onRequests={() => setReqModal2Show(sub._id)}
              onSimulate={() => simulateProfessorRequest(sub._id)}
            />
          ))}
        </div>
      )}

      {/* ─────────────────── MODALS ─────────────────── */}

      {/* ADD SUBJECT MODAL */}
      {showAddModal && (
        <ModalBackdrop onClose={() => { setShowAddModal(false); setSubjectSearch(""); setIsCustomMode(false); }}>
          <div className="ms-modal" style={{ background:"#fff", borderRadius:22, padding:28, width:"100%", maxWidth:500, maxHeight:"80vh", display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <h2 style={{ fontWeight:800, fontSize:18, color:"#1e293b", margin:0 }}>Add a Subject</h2>
                <p style={{ fontSize:12, color:"#9ca3af", margin:"4px 0 0" }}>Pick from available subjects below</p>
              </div>
              <CloseBtn onClose={() => { setShowAddModal(false); setSubjectSearch("") }} />
            </div>

            {!isCustomMode ? (
              <>
                {/* search */}
                <div style={{ position:"relative" }}>
                  <FiSearch style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }} size={15}/>
                  <input
                    autoFocus
                    placeholder="Search subjects…"
                    value={subjectSearch}
                    onChange={e => setSubjectSearch(e.target.value)}
                    style={{ width:"100%", padding:"9px 12px 9px 36px", borderRadius:12, border:"1.5px solid #e2e8f0", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}
                  />
                </div>

                {/* pill grid */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:10, overflowY:"auto", maxHeight:340, padding:2 }}>
                  {searchedPool.length === 0 ? (
                    <div style={{ width:"100%", textAlign:"center", padding:"30px 10px", background:"#f8fafc", borderRadius:16, border:"1px solid #e2e8f0" }}>
                      <p style={{ color:"#9ca3af", fontSize:13, margin:"0 0 16px" }}>No matching standard subjects found.</p>
                      <button
                        onClick={() => setIsCustomMode(true)}
                        style={{ ...btnPrimary, marginInline:"auto", padding:"8px 20px" }}
                      >
                        <FiPlus size={14}/> Add Custom Subject
                      </button>
                    </div>
                  ) : (
                    <>
                      {searchedPool.map(s => (
                        <button
                          key={s.id}
                          onClick={() => addSubject(s)}
                          className="ms-pill"
                          style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", borderRadius:999, border:"1.5px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", fontSize:13, fontWeight:600, color:"#374151", transition:"all .18s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor="#6A11CB"; e.currentTarget.style.color="#6A11CB"; e.currentTarget.style.background="#f5f3ff" }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#374151"; e.currentTarget.style.background="#f8fafc" }}
                        >
                          <span style={{ fontSize:16 }}>{s.icon}</span> {s.name}
                        </button>
                      ))}
                      {/* Explicit "Other" button */}
                      <button
                        onClick={() => setIsCustomMode(true)}
                        style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", borderRadius:999, border:"1.5px solid #6A11CB", background:"#fff", color:"#6A11CB", cursor:"pointer", fontSize:13, fontWeight:700 }}
                      >
                        <FiPlus size={14}/> Other / Custom
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="ms-fade" style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:8 }}>Subject Name</label>
                  <input
                    autoFocus
                    placeholder="Enter your subject name…"
                    value={subjectSearch}
                    onChange={e => setSubjectSearch(e.target.value)}
                    style={{ ...inputStyle, width:"100%" }}
                  />
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => setIsCustomMode(false)} style={{ ...btnSecondary, flex:1 }}>Back</button>
                  <button 
                    onClick={() => addCustomSubject(subjectSearch)} 
                    style={{ ...btnPrimary, flex:2 }}
                    disabled={!subjectSearch.trim()}
                  >
                    Add Subject
                  </button>
                </div>
              </div>
            )}
          </div>
        </ModalBackdrop>
      )}

      {/* REQUIREMENT MODAL */}
      {reqModal && (
        <ModalBackdrop onClose={() => setReqModal(null)}>
          <div className="ms-modal" style={{ background:"#fff", borderRadius:22, padding:28, width:"100%", maxWidth:480, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <h2 style={{ fontWeight:800, fontSize:18, color:"#1e293b", margin:0 }}>
                  {reqModal.mode === "create" ? "Create Requirement" : "Edit Requirement"}
                </h2>
                <p style={{ fontSize:12, color:"#9ca3af", margin:"4px 0 0" }}>
                  {subjects.find(s => s._id === reqModal.subjectId)?.name}
                </p>
              </div>
              <CloseBtn onClose={() => setReqModal(null)} />
            </div>

            <FormField label="Topic / Chapter *" icon={<FiBook size={13}/>}>
              <input
                autoFocus
                placeholder="e.g. Chapter 5: Recursion"
                value={reqForm.topic}
                onChange={e => setReqForm({ ...reqForm, topic: e.target.value })}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Description" icon={<FiEdit2 size={13}/>}>
              <textarea
                rows={3}
                placeholder="Describe what you need help with…"
                value={reqForm.description}
                onChange={e => setReqForm({ ...reqForm, description: e.target.value })}
                style={{ ...inputStyle, resize:"vertical", lineHeight:1.6 }}
              />
            </FormField>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <FormField label="Preferred Time" icon={<FiClock size={13}/>}>
                <input
                  placeholder="e.g. Weekdays 5–7 PM"
                  value={reqForm.time}
                  onChange={e => setReqForm({ ...reqForm, time: e.target.value })}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Budget ₹/hr (optional)" icon={<FiDollarSign size={13}/>}>
                <input
                  placeholder="e.g. 300"
                  value={reqForm.budget}
                  onChange={e => setReqForm({ ...reqForm, budget: e.target.value })}
                  style={inputStyle}
                />
              </FormField>
            </div>

            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button onClick={() => setReqModal(null)} style={{ ...btnSecondary, flex:1 }}>Cancel</button>
              <button onClick={saveRequirement} style={{ ...btnPrimary, flex:2 }}>
                <FiCheck size={14}/> Save Requirement
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* PROFESSOR REQUESTS MODAL */}
      {reqModal2Show && (
        <ModalBackdrop onClose={() => setReqModal2Show(null)}>
          <div className="ms-modal" style={{ background:"#fff", borderRadius:22, padding:28, width:"100%", maxWidth:520, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <h2 style={{ fontWeight:800, fontSize:18, color:"#1e293b", margin:0 }}>Professor Requests</h2>
                <p style={{ fontSize:12, color:"#9ca3af", margin:"4px 0 0" }}>
                  {subjects.find(s => s._id === reqModal2Show)?.name} · {getProfessors(reqModal2Show).filter(r => r.status === 'pending').length} applicants
                </p>
              </div>
              <CloseBtn onClose={() => setReqModal2Show(null)} />
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {getProfessors(reqModal2Show).map(req => (
                <div key={req._id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderRadius:16, border:"1.5px solid #f1f5f9", background:"#fafafa" }}>
                  <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#6A11CB,#2575FC)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, flexShrink:0 }}>
                    {req.professor?.name?.[0]?.toUpperCase() || "P"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:700, color:"#1e293b", fontSize:14, margin:"0 0 2px" }}>{req.professor?.name}</p>
                    <Stars rating={req.professor?.rating} />
                    <p style={{ fontSize:11, color:"#9ca3af", margin:"2px 0 0" }}>{req.professor?.headline || "Experienced Professor"}</p>
                  </div>
                  {req.status === 'pending' ? (
                    <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                      <button
                        onClick={() => rejectProfessor(reqModal2Show, req._id, req.professor?.name)}
                        style={{ padding:"6px 12px", borderRadius:10, border:"1.5px solid #fca5a5", background:"#fff", color:"#dc2626", fontSize:12, fontWeight:700, cursor:"pointer" }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => acceptProfessor(reqModal2Show, req._id)}
                        style={{ padding:"6px 14px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#6A11CB,#2575FC)", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}
                      >
                        Accept
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize:12, fontWeight:700, color: req.status === 'accepted' ? '#16a34a' : '#dc2626', textTransform:'capitalize' }}>
                      {req.status}
                    </span>
                  )}
                </div>
              ))}
              {getProfessors(reqModal2Show).length === 0 && (
                <p style={{ textAlign:"center", color:"#9ca3af", fontSize:13, padding:"20px 0" }}>No professors have applied yet.</p>
              )}
            </div>

            <button onClick={() => setReqModal2Show(null)} style={{ ...btnSecondary, width:"100%" }}>Close</button>
          </div>
        </ModalBackdrop>
      )}
    </div>
  )
}

/* ─── SubjectCard ────────────────────────────────────────────── */
function SubjectCard({ sub, delay, onDelete, onToggle, onCreateReq, onEditReq, onRequests, onSimulate }) {
  const req = sub.requirement
  const pendingRequests = (sub.requests || []).filter(r => r.status === 'pending').length

  return (
    <div
      className="ms-card ms-fade"
      style={{ background:"#fff", borderRadius:20, border:"1.5px solid #f1f5f9", padding:"20px 22px", display:"flex", flexDirection:"column", gap:14, animationDelay:`${delay}ms` }}
    >
      {/* Header row */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
            {sub.icon}
          </div>
          <div>
            <p style={{ fontWeight:800, color:"#1e293b", fontSize:15, margin:0 }}>{sub.name}</p>
            <div style={{ marginTop:4 }}><StatusBadge status={sub.status} /></div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Toggle on={sub.visible} onChange={onToggle} />
          <button onClick={onDelete} style={{ background:"none", border:"none", cursor:"pointer", color:"#f87171", padding:4, borderRadius:8, display:"flex", transition:"background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background="#fee2e2"}
            onMouseLeave={e => e.currentTarget.style.background="none"}
          >
            <FiTrash2 size={15}/>
          </button>
        </div>
      </div>

      {/* Visibility label */}
      <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color: sub.visible ? "#16a34a" : "#9ca3af" }}>
        {sub.visible ? <FiEye size={12}/> : <FiEyeOff size={12}/>}
        {sub.visible ? "Visible to professors" : "Hidden from professors"}
      </div>

      {/* Requirement preview */}
      <div style={{ background:"#f8fafc", borderRadius:12, padding:"12px 14px", border:"1px solid #f1f5f9" }}>
        {req && req.topic ? (
          <div>
            <p style={{ fontSize:11, color:"#9ca3af", fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:.5 }}>Requirement</p>
            <p style={{ fontSize:13, fontWeight:700, color:"#374151", margin:"0 0 4px" }}>{req.topic}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
              {req.time && (
                <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#2575FC", fontWeight:600 }}>
                  <FiClock size={10}/> {req.time}
                </span>
              )}
              {req.budget && (
                <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#6A11CB", fontWeight:600 }}>
                  ₹{req.budget}/hr
                </span>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:6, color:"#9ca3af" }}>
            <FiAlertCircle size={13}/>
            <span style={{ fontSize:12 }}>No requirement set — add one so professors can find you!</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {sub.status !== "Engaged" && (
          req && req.topic ? (
            <button onClick={onEditReq} style={{ ...smallBtn, borderColor:"#6A11CB", color:"#6A11CB", flex:1 }}
              onMouseEnter={e => { e.currentTarget.style.background="#6A11CB"; e.currentTarget.style.color="#fff" }}
              onMouseLeave={e => { e.currentTarget.style.background="#f5f3ff"; e.currentTarget.style.color="#6A11CB" }}
            >
              <FiEdit2 size={12}/> Edit Req.
            </button>
          ) : (
            <button onClick={onCreateReq} style={{ ...smallBtn, borderColor:"#2575FC", color:"#2575FC", background:"#eff6ff", flex:1 }}
              onMouseEnter={e => { e.currentTarget.style.background="#2575FC"; e.currentTarget.style.color="#fff" }}
              onMouseLeave={e => { e.currentTarget.style.background="#eff6ff"; e.currentTarget.style.color="#2575FC" }}
            >
              <FiPlus size={12}/> Create Req.
            </button>
          )
        )}
        {(sub.status === "Open" || sub.status === "Pending") && (
          <>
            <button onClick={onRequests} style={{ ...smallBtn, borderColor: pendingRequests > 0 ? "#f59e0b" : "#e2e8f0", color: pendingRequests > 0 ? "#d97706" : "#64748b", background: pendingRequests > 0 ? "#fef3c7" : "#f8fafc", flex:1, position:'relative' }}
              onMouseEnter={e => { if(pendingRequests > 0) { e.currentTarget.style.background="#f59e0b"; e.currentTarget.style.color="#fff" } }}
              onMouseLeave={e => { if(pendingRequests > 0) { e.currentTarget.style.background="#fef3c7"; e.currentTarget.style.color="#d97706" } }}
            >
              <FiUsers size={12}/> Requests
              {pendingRequests > 0 && (
                <span style={{ position:'absolute', top:-6, right:-6, background:'#ef4444', color:'#fff', width:18, height:18, borderRadius:'50%', fontSize:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, border:'2px solid #fff' }}>
                  {pendingRequests}
                </span>
              )}
            </button>
            <button
               onClick={onSimulate}
               style={{ ...smallBtn, borderColor: "#e2e8f0", color: "#64748b", background: "#f8fafc", flex:0.4, minWidth:40 }}
               title="Dev: Simulate Professor Request"
            >
              <FiZap size={12}/>
            </button>
          </>
        )}
        {sub.status === "Engaged" && (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"7px 14px", borderRadius:10, background:"#fee2e2", color:"#dc2626", fontSize:12, fontWeight:700 }}>
            <FiCheck size={12}/> Engaged & Locked
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Helpers ────────────────────────────────────────────────── */
function ModalBackdrop({ children, onClose }) {
  return (
    <div
      className="ms-overlay"
      onClick={onClose}
      style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

function CloseBtn({ onClose }) {
  return (
    <button onClick={onClose} style={{ background:"#f1f5f9", border:"none", width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#64748b", flexShrink:0 }}>
      <FiX size={15}/>
    </button>
  )
}

function FormField({ label, icon, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"flex", alignItems:"center", gap:5 }}>
        {icon} {label}
      </label>
      {children}
    </div>
  )
}

/* ─── Style objects ───────────────────── */
const inputStyle = {
  width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #e2e8f0",
  fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box",
  transition:"border-color .15s", color:"#1e293b",
}

const btnPrimary = {
  display:"flex", alignItems:"center", justifyContent:"center", gap:7,
  padding:"11px 20px", borderRadius:12, border:"none", cursor:"pointer",
  background:"linear-gradient(135deg,#6A11CB,#2575FC)", color:"#fff",
  fontWeight:700, fontSize:13, fontFamily:"inherit",
}

const btnSecondary = {
  display:"flex", alignItems:"center", justifyContent:"center",
  padding:"11px 20px", borderRadius:12, border:"1.5px solid #e2e8f0",
  cursor:"pointer", background:"#fff", color:"#64748b",
  fontWeight:700, fontSize:13, fontFamily:"inherit",
}

const smallBtn = {
  display:"flex", alignItems:"center", justifyContent:"center", gap:5,
  padding:"7px 14px", borderRadius:10, border:"1.5px solid",
  cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit",
  background:"#f5f3ff", transition:"all .18s",
}
