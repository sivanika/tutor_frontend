import { useEffect, useState, useCallback } from "react"
import API, { getFileUrl } from "../../services/api"
import {
  FiSearch, FiX, FiUser, FiMail, FiPhone, FiBook,
  FiCalendar, FiCreditCard, FiFilter, FiChevronRight,
  FiAlertCircle, FiLoader, FiCheckCircle, FiSlash,
  FiAlertTriangle, FiRefreshCw, FiLink, FiUploadCloud, FiFile
} from "react-icons/fi"
import toast from "react-hot-toast"

const TIER_STYLES = {
  premium:         { label: "Premium",         cls: "bg-purple-50 text-[var(--primary)] border-purple-100" },
  free_trial:      { label: "Free Trial",      cls: "bg-blue-50 text-[var(--primary)] border-blue-100" },
  pay_per_session: { label: "Pay Per Session", cls: "bg-amber-50 text-amber-600 border-amber-100" },
  null:            { label: "No Plan",         cls: "bg-gray-100 text-gray-400 border-gray-200" },
}
const getTierInfo = (tier) => TIER_STYLES[tier] || { label: tier || "No Plan", cls: "bg-gray-100 text-gray-400 border-gray-200" }

const STATUS_STYLES = {
  active:   { cls: "bg-emerald-50 text-emerald-600 border border-emerald-100", dot: "bg-emerald-400" },
  disabled: { cls: "bg-amber-50 text-amber-600 border border-amber-100",   dot: "bg-amber-400" },
  banned:   { cls: "bg-red-50 text-red-600 border border-red-100",         dot: "bg-red-400" },
}
const getStatusStyle = (s) => STATUS_STYLES[s] || STATUS_STYLES.active

function getInitials(name, email) {
  if (name) return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  return email?.[0]?.toUpperCase() || "S"
}

/* ─── Student Detail Modal ─── */
function StudentDetailModal({ student: initialStudent, onClose, onStatusChange }) {
  const [student, setStudent] = useState(initialStudent)
  const [saving, setSaving] = useState(null)
  const [plans, setPlans] = useState([])
  const [activeTab, setActiveTab] = useState("profile") // "profile" or "control"

  // Academic Dashboard Control States
  const [academicData, setAcademicData] = useState(null)
  const [loadingAcademics, setLoadingAcademics] = useState(false)
  const [activeSubPanel, setActiveSubPanel] = useState("attendance") // attendance, assignments, quizzes, calendar, downloads

  // Creation/Action Form States
  const [attendanceForm, setAttendanceForm] = useState({ sessionTitle: "", status: "present", progress: 100 })
  const [assignmentForm, setAssignmentForm] = useState({ courseId: "", title: "", description: "", points: 100, dueDate: "" })
  const [quizForm, setQuizForm] = useState({
    courseId: "",
    title: "",
    timeLimit: "15 min",
    passingScore: 70,
    questions: [{ questionText: "", options: ["", "", "", ""], correctOption: 0 }]
  })
  const [eventForm, setEventForm] = useState({ courseId: "", title: "", date: "", time: "", type: "class", meetLink: "" })
  const [downloadForm, setDownloadForm] = useState({ courseId: "", name: "", category: "Slides", size: "1.5 MB", fileUrl: "" })

  const [gradingForm, setGradingForm] = useState({ submissionId: null, grade: "", feedback: "" })
  const [certMode, setCertMode] = useState("url") // "url" | "file"
  const [certFile, setCertFile] = useState(null)

  const loadAcademics = async () => {
    try {
      setLoadingAcademics(true)
      const res = await API.get(`/admin/student/${student._id}/academics`)
      setAcademicData(res.data)
      
      // Auto-select first course if available
      const courseIds = res.data.enrollments?.map(e => e.courseId?._id).filter(Boolean) || []
      if (courseIds.length > 0) {
        setAssignmentForm(prev => ({ ...prev, courseId: courseIds[0] }))
        setQuizForm(prev => ({ ...prev, courseId: courseIds[0] }))
        setEventForm(prev => ({ ...prev, courseId: courseIds[0] }))
        setDownloadForm(prev => ({ ...prev, courseId: courseIds[0] }))
      }
    } catch {
      toast.error("Failed to load academic records")
    } finally {
      setLoadingAcademics(false)
    }
  }

  useEffect(() => {
    API.get(`/admin/student/${initialStudent._id}`)
      .then(r => setStudent(r.data))
      .catch(() => {})
      
    API.get("/subscriptions/admin/plans")
      .then(r => setPlans(r.data))
      .catch(() => {})
  }, [initialStudent._id])

  useEffect(() => {
    if (activeTab === "control") {
      loadAcademics()
    }
  }, [activeTab])

  const initials = getInitials(student.name, student.email)
  const tierInfo = getTierInfo(student.subscriptionTier)
  const statusInfo = getStatusStyle(student.status)

  const handleStatus = async (newStatus) => {
    setSaving(newStatus)
    try {
      await API.put(`/admin/user-status/${student._id}`, { status: newStatus })
      setStudent(s => ({ ...s, status: newStatus }))
      onStatusChange?.()
      toast.success(`Student ${newStatus === "active" ? "activated" : newStatus === "disabled" ? "disabled" : "banned"}`)
    } catch {
      toast.error("Failed to update status")
    } finally {
      setSaving(null)
    }
  }

  const handlePlanChange = async (planId) => {
    try {
      await API.put(`/subscriptions/admin/users/${student._id}/plan`, { planId: planId || null })
      toast.success("Plan updated manually")
      const r = await API.get(`/admin/student/${student._id}`)
      setStudent(r.data)
      onStatusChange?.()
    } catch {
      toast.error("Failed to update plan")
    }
  }

  // ────────────── Action Submissions ──────────────

  const handleLogAttendance = async (e) => {
    e.preventDefault()
    try {
      await API.post(`/admin/student/${student._id}/attendance`, attendanceForm)
      toast.success("Attendance marked and student notified!")
      setAttendanceForm({ sessionTitle: "", status: "present", progress: 100 })
      loadAcademics()
    } catch {
      toast.error("Failed to mark attendance")
    }
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    if (!assignmentForm.courseId || !assignmentForm.title || !assignmentForm.dueDate) {
      return toast.error("Please fill in course, title, and due date")
    }
    try {
      await API.post("/admin/assignments", assignmentForm)
      toast.success("Assignment created and student notified!")
      setAssignmentForm(prev => ({ ...prev, title: "", description: "", points: 100, dueDate: "" }))
      loadAcademics()
    } catch {
      toast.error("Failed to create assignment")
    }
  }

  const handleGradeAssignment = async (e) => {
    e.preventDefault()
    if (!gradingForm.grade) return toast.error("Please enter a grade")
    try {
      await API.put(`/admin/student/${student._id}/assignments/${gradingForm.submissionId}/grade`, {
        grade: gradingForm.grade,
        feedback: gradingForm.feedback
      })
      toast.success("Submission graded and student notified!")
      setGradingForm({ submissionId: null, grade: "", feedback: "" })
      loadAcademics()
    } catch {
      toast.error("Failed to grade submission")
    }
  }

  const handleCreateQuiz = async (e) => {
    e.preventDefault()
    if (!quizForm.courseId || !quizForm.title) {
      return toast.error("Please select a course and enter a title")
    }
    // Basic validation: ensure options are filled
    const invalidQ = quizForm.questions.some(q => !q.questionText || q.options.some(o => !o))
    if (invalidQ) return toast.error("Please fill in all questions and options")

    try {
      await API.post("/admin/quizzes", quizForm)
      toast.success("Quiz assessment published successfully!")
      // Reset form
      setQuizForm(prev => ({
        ...prev,
        title: "",
        questions: [{ questionText: "", options: ["", "", "", ""], correctOption: 0 }]
      }))
      loadAcademics()
    } catch {
      toast.error("Failed to publish quiz")
    }
  }

  const handleAddQuestion = () => {
    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, { questionText: "", options: ["", "", "", ""], correctOption: 0 }]
    }))
  }

  const handleRemoveQuestion = (idx) => {
    if (quizForm.questions.length === 1) return
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }))
  }

  const handleQuizQuestionChange = (qIdx, field, val) => {
    const nextQ = [...quizForm.questions]
    nextQ[qIdx][field] = val
    setQuizForm(prev => ({ ...prev, questions: nextQ }))
  }

  const handleQuizOptionChange = (qIdx, optIdx, val) => {
    const nextQ = [...quizForm.questions]
    nextQ[qIdx].options[optIdx] = val
    setQuizForm(prev => ({ ...prev, questions: nextQ }))
  }

  const handleResetQuizAttempts = async (quizId) => {
    if (!window.confirm("Are you sure you want to reset this student's attempts for this quiz?")) return
    try {
      await API.delete(`/admin/student/${student._id}/quizzes/${quizId}/attempts`)
      toast.success("Quiz attempts reset and student updated!")
      loadAcademics()
    } catch {
      toast.error("Failed to reset quiz attempts")
    }
  }

  const handleScheduleEvent = async (e) => {
    e.preventDefault()
    if (!eventForm.courseId || !eventForm.title || !eventForm.date || !eventForm.time) {
      return toast.error("Please fill in course, title, date, and time")
    }
    try {
      await API.post("/admin/events", eventForm)
      toast.success("Event scheduled on student calendar!")
      setEventForm(prev => ({ ...prev, title: "", date: "", time: "", meetLink: "" }))
      loadAcademics()
    } catch {
      toast.error("Failed to schedule calendar event")
    }
  }

  const handleAddDownload = async (e) => {
    e.preventDefault()
    if (!downloadForm.courseId || !downloadForm.name || !downloadForm.fileUrl) {
      return toast.error("Please enter course, resource name, and file URL")
    }
    try {
      await API.post("/admin/downloads", downloadForm)
      toast.success("Resource material uploaded/registered successfully!")
      setDownloadForm(prev => ({ ...prev, name: "", fileUrl: "", size: "1.5 MB" }))
      loadAcademics()
    } catch {
      toast.error("Failed to add resource download")
    }
  }

  const enrolledCourses = academicData?.enrollments?.map(e => e.courseId).filter(Boolean) || []

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-[Inter,sans-serif]">

        {/* Modal Header */}
        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold text-xl">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black">{student.name || "No name set"}</h2>
            <p className="text-white/70 text-sm font-semibold">{student.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/20 uppercase`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                {student.status || "active"}
              </span>
              <span className="text-[10px] text-white/60 font-semibold">joined {new Date(student.createdAt).toLocaleDateString("en-IN")}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition">
            <FiX size={16} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b bg-gray-50 px-6 py-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 text-xs font-black rounded-xl transition ${
              activeTab === "profile" ? "bg-[var(--primary)] text-white shadow" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Profile & Account
          </button>
          <button
            onClick={() => setActiveTab("control")}
            className={`px-4 py-2 text-xs font-black rounded-xl transition ${
              activeTab === "control" ? "bg-[var(--primary)] text-white shadow" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            LMS Dashboard Control Panel
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {activeTab === "profile" ? (
            <>
              {/* —— SUBSCRIPTION —— */}
              <Section title="Subscription & Payment" icon={FiCreditCard}>
                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5 font-bold uppercase tracking-wider">Current Plan</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border ${tierInfo.cls}`}>
                      {tierInfo.label}
                    </span>
                  </div>
                  <InfoRow label="Subscription Status" value={student.subscriptionStatus || "inactive"} />
                  <InfoRow label="Started" value={student.subscriptionStartDate
                    ? new Date(student.subscriptionStartDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                    : null} />
                  <InfoRow label="Expires" value={student.subscriptionExpiryDate
                    ? new Date(student.subscriptionExpiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                    : null} />
                  <InfoRow label="Sessions Booked" value={`${student.currentPlanSessionsBooked || 0} ${student.subscriptionPlan?.maxSessions ? `/ ${student.subscriptionPlan.maxSessions}` : ''}`} />
                  <InfoRow label="Profiles Viewed" value={`${student.viewedProfessors?.length || 0} ${student.subscriptionPlan?.maxProfileViews ? `/ ${student.subscriptionPlan.maxProfileViews}` : ''}`} />
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wide">Manual Upgrade</p>
                  <select 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#8E2DE2]"
                    onChange={(e) => handlePlanChange(e.target.value)}
                    value={student.subscriptionPlan?._id || student.subscriptionPlan || ""}
                  >
                    <option value="">No Plan</option>
                    {plans.map(p => <option key={p._id} value={p._id}>{p.name} (₹{p.price/100})</option>)}
                  </select>
                </div>

                {(student.razorpayPaymentId || student.razorpayOrderId) && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wide">Razorpay Transaction IDs</p>
                    {student.razorpayPaymentId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-semibold">Payment ID</span>
                        <code className="bg-purple-50 text-[var(--primary)] px-2 py-0.5 rounded font-mono">{student.razorpayPaymentId}</code>
                      </div>
                    )}
                    {student.razorpayOrderId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-semibold">Order ID</span>
                        <code className="bg-blue-50 text-[var(--primary)] px-2 py-0.5 rounded font-mono">{student.razorpayOrderId}</code>
                      </div>
                    )}
                  </div>
                )}
              </Section>

              {/* —— STUDENT PROFILE —— */}
              <Section title="Academic Profile" icon={FiBook}>
                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                  <InfoRow icon={FiCalendar} label="Date of Birth" value={student.birthDate} />
                  <InfoRow label="Grade / Level" value={student.gradeLevel} />
                  <InfoRow label="School / Institution" value={student.school} />
                  <InfoRow label="Location" value={student.location} />
                </div>
                {student.learningGoals && (
                  <TextBlock label="Learning Goals" value={student.learningGoals} />
                )}
                {student.professorPreferences && (
                  <TextBlock label="Professor Preferences" value={student.professorPreferences} />
                )}
              </Section>

              {/* —— PARENT / GUARDIAN —— */}
              {(student.parentName || student.parentEmail || student.parentPhone) && (
                <Section title="Parent / Guardian" icon={FiPhone}>
                  <div className="grid sm:grid-cols-2 gap-3 mt-2">
                    <InfoRow label="Name" value={student.parentName} />
                    <InfoRow icon={FiMail} label="Email" value={student.parentEmail} />
                    <InfoRow icon={FiPhone} label="Phone" value={student.parentPhone} />
                    <InfoRow label="Relationship" value={student.parentRelationship} />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-semibold">Parental Consent:</span>
                    {student.parentConsent
                      ? <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><FiCheckCircle size={11} /> Given</span>
                      : <span className="text-xs text-red-500 font-bold flex items-center gap-1"><FiAlertCircle size={11} /> Not given</span>}
                  </div>
                </Section>
              )}
            </>
          ) : (
            /* ── CONTROL PANEL TAB ── */
            <div className="space-y-4">
              {loadingAcademics ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                  <FiLoader className="animate-spin" size={24} />
                  <p className="text-xs font-semibold">Loading student data...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                  {/* Left Sidebar Sub-tabs */}
                  <div className="md:col-span-1 flex flex-col gap-1 border-r pr-4" style={{ borderColor: "var(--border-soft)" }}>
                    {[
                      { id: "attendance",  label: "Attendance Log" },
                      { id: "assignments", label: "Grading" },
                      { id: "quizzes",     label: "Quiz Attempts" },
                      { id: "certificate", label: "Certificate" },
                    ].map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => { setActiveSubPanel(sub.id); setGradingForm({ submissionId: null, grade: "", feedback: "" }) }}
                        className={`text-left px-3 py-2 text-xs font-black rounded-xl transition ${
                          activeSubPanel === sub.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[10px] text-amber-700 leading-relaxed">
                      <p className="font-black uppercase mb-1">To create content</p>
                      <p>Use <strong>LMS Content</strong> in the sidebar to publish assignments, quizzes, schedules &amp; resources.</p>
                    </div>
                  </div>

                  {/* Right Sub-Panel Content */}
                  <div className="md:col-span-3 space-y-4">
                    {enrolledCourses.length === 0 && (
                      <div className="p-4 bg-yellow-50 text-yellow-700 text-xs rounded-2xl flex items-center gap-2 border border-yellow-100">
                        <FiAlertTriangle size={16}/>
                        <span>This student is not enrolled in any LMS courses yet.</span>
                      </div>
                    )}

                    {/* ── ATTENDANCE LOG ── */}
                    {activeSubPanel === "attendance" && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-700">Attendance Log</h4>
                        <form onSubmit={handleLogAttendance} className="p-4 bg-gray-50 rounded-2xl border space-y-3">
                          <p className="text-xs font-black text-gray-400 uppercase">Log Session</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                              <input type="text" placeholder="Session Name (e.g. Limits Introduction Class)" required
                                value={attendanceForm.sessionTitle}
                                onChange={e => setAttendanceForm(prev => ({ ...prev, sessionTitle: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-xl text-xs bg-white" />
                            </div>
                            <select value={attendanceForm.status}
                              onChange={e => setAttendanceForm(prev => ({ ...prev, status: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-xl text-xs bg-white">
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                            </select>
                            <input type="number" placeholder="Progress %" min="0" max="100" required
                              value={attendanceForm.progress}
                              onChange={e => setAttendanceForm(prev => ({ ...prev, progress: Number(e.target.value) }))}
                              className="w-full px-3 py-2 border rounded-xl text-xs bg-white" />
                          </div>
                          <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-black rounded-xl">Log Attendance</button>
                        </form>
                        <div className="space-y-2">
                          <p className="text-xs font-black text-gray-400 uppercase">History ({academicData?.attendance?.length || 0})</p>
                          {!academicData?.attendance?.length
                            ? <p className="text-xs text-gray-400">No attendance logs yet.</p>
                            : <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                {academicData.attendance.map(att => (
                                  <div key={att._id} className="flex justify-between items-center p-3 rounded-xl border text-xs bg-white">
                                    <div>
                                      <p className="font-bold text-gray-700">{att.session?.title || "Class Session"}</p>
                                      <p className="text-[10px] text-gray-400">Progress: {att.progress}%</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${att.status === "present" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{att.status}</span>
                                  </div>
                                ))}
                              </div>
                          }
                        </div>
                      </div>
                    )}

                    {/* ── GRADING ── */}
                    {activeSubPanel === "assignments" && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-700">Assignment Submissions &amp; Grading</h4>
                        {gradingForm.submissionId && (
                          <form onSubmit={handleGradeAssignment} className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-3">
                            <div className="flex justify-between items-center">
                              <p className="text-xs font-black text-purple-700 uppercase">Grade Submission</p>
                              <button type="button" onClick={() => setGradingForm({ submissionId: null, grade: "", feedback: "" })} className="text-purple-400 hover:text-purple-600 font-bold text-xs">Cancel</button>
                            </div>
                            <input type="text" placeholder="Grade (e.g. 95/100)" required
                              value={gradingForm.grade}
                              onChange={e => setGradingForm(prev => ({ ...prev, grade: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-xl text-xs bg-white" />
                            <textarea placeholder="Feedback comments..." rows={2}
                              value={gradingForm.feedback}
                              onChange={e => setGradingForm(prev => ({ ...prev, feedback: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-xl text-xs bg-white" />
                            <button type="submit" className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl">Save Grade</button>
                          </form>
                        )}
                        <div className="space-y-2">
                          <p className="text-xs font-black text-gray-400 uppercase">Submissions ({academicData?.assignments?.length || 0})</p>
                          {!academicData?.assignments?.length
                            ? <p className="text-xs text-gray-400">No assignments assigned yet. Use <strong>LMS Content</strong> to create them.</p>
                            : <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                                {academicData.assignments.map(ass => {
                                  const sub = academicData?.submissions?.find(s => String(s.assignmentId) === String(ass._id))
                                  return (
                                    <div key={ass._id} className="p-3 rounded-xl border text-xs bg-white space-y-2">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-bold text-gray-700">{ass.title}</p>
                                          <p className="text-[10px] text-gray-400">Due: {new Date(ass.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${sub ? (sub.status === "graded" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600") : "bg-yellow-50 text-yellow-600"}`}>{sub ? sub.status : "pending"}</span>
                                      </div>
                                      {sub && (
                                        <div className="p-2 bg-gray-50 rounded-lg border text-[11px] space-y-1">
                                          <p className="text-gray-500 truncate"><strong>URL:</strong> <a href={sub.contentUrl} target="_blank" rel="noreferrer" className="underline text-blue-500">{sub.contentUrl}</a></p>
                                          {sub.grade && <p className="text-gray-700"><strong>Grade:</strong> {sub.grade}</p>}
                                          {sub.feedback && <p className="text-gray-600"><strong>Feedback:</strong> {sub.feedback}</p>}
                                          {sub.status === "submitted" && (
                                            <button onClick={() => setGradingForm({ submissionId: sub._id, grade: "", feedback: "" })}
                                              className="mt-1 px-2.5 py-1 bg-purple-600 text-white font-bold rounded-lg text-[10px]">Grade Student</button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                          }
                        </div>
                      </div>
                    )}

                    {/* ── QUIZ ATTEMPTS ── */}
                    {activeSubPanel === "quizzes" && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-700">Quiz Attempt History</h4>
                        <div className="space-y-2">
                          <p className="text-xs font-black text-gray-400 uppercase">Quizzes ({academicData?.quizzes?.length || 0})</p>
                          {!academicData?.quizzes?.length
                            ? <p className="text-xs text-gray-400">No quizzes assigned yet. Use <strong>LMS Content</strong> to create them.</p>
                            : <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                                {academicData.quizzes.map(q => {
                                  const attempts = academicData?.quizAttempts?.filter(a => String(a.quizId) === String(q._id)) || []
                                  const best = attempts.reduce((b, c) => (!b || c.score > b.score) ? c : b, null)
                                  return (
                                    <div key={q._id} className="p-3 rounded-xl border text-xs bg-white">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-bold text-gray-700">{q.title}</p>
                                          <p className="text-[10px] text-gray-400">{q.questions?.length || 0} questions · Pass: {q.passingScore}%</p>
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{attempts.length} attempt{attempts.length !== 1 ? "s" : ""}</span>
                                      </div>
                                      {best && (
                                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${best.passed ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>Best: {best.score}% — {best.passed ? "PASSED" : "FAILED"}</span>
                                          <button type="button" onClick={() => handleResetQuizAttempts(q._id)} className="text-red-500 hover:text-red-600 text-[10px] font-bold underline">Reset All Attempts</button>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                          }
                        </div>
                      </div>
                    )}

                    {/* ── CERTIFICATE ── */}
                    {activeSubPanel === "certificate" && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-700">Issue Certificate</h4>
                        <form onSubmit={async e => {
                          e.preventDefault()
                          const courseId = e.target.courseId.value
                          const certUrl  = e.target.certUrl?.value || ""
                          if (!courseId) return toast.error("Select a course")
                          if (certMode === "file" && !certFile) return toast.error("Select a certificate PDF")
                          try {
                            if (certMode === "file") {
                              const fd = new FormData()
                              fd.append("studentId", student._id)
                              fd.append("courseId", courseId)
                              fd.append("file", certFile)
                              await API.post("/admin/certificates/issue", fd, { headers: { "Content-Type": "multipart/form-data" } })
                            } else {
                              await API.post("/admin/certificates/issue", { studentId: student._id, courseId, certificateUrl: certUrl })
                            }
                            toast.success("Certificate issued to student!")
                            setCertFile(null)
                            if (e.target.certUrl) e.target.certUrl.value = ""
                            loadAcademics()
                          } catch (err) {
                            toast.error(err?.response?.data?.message || "Failed to issue certificate")
                          }
                        }} className="p-4 bg-gray-50 rounded-2xl border space-y-3">
                          <p className="text-xs font-black text-gray-400 uppercase">Issue New Certificate</p>
                          <select name="courseId" required className="w-full px-3 py-2 border rounded-xl text-xs bg-white font-semibold">
                            <option value="">— Select Course —</option>
                            {enrolledCourses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                          </select>

                          {/* ── Mode Toggle ── */}
                          <div className="flex rounded-xl overflow-hidden border border-gray-200 text-xs font-bold">
                            <button type="button" onClick={() => { setCertMode("url"); setCertFile(null) }}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition ${certMode === "url" ? "bg-emerald-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                              <FiLink size={13} /> URL
                            </button>
                            <button type="button" onClick={() => setCertMode("file")}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition border-l border-gray-200 ${certMode === "file" ? "bg-emerald-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                              <FiUploadCloud size={13} /> Upload File
                            </button>
                          </div>

                          {certMode === "url" ? (
                            <input name="certUrl" type="url" placeholder="Certificate PDF URL (optional)" className="w-full px-3 py-2 border rounded-xl text-xs bg-white" />
                          ) : (
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  {certFile ? (
                                    <>
                                      <FiFile size={20} className="text-emerald-500 mb-1" />
                                      <p className="text-xs text-emerald-600 font-bold max-w-[200px] truncate">{certFile.name}</p>
                                    </>
                                  ) : (
                                    <>
                                      <FiUploadCloud size={20} className="text-gray-400 mb-1" />
                                      <p className="text-xs text-gray-500 font-semibold">Click to upload PDF</p>
                                    </>
                                  )}
                                </div>
                                <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={e => setCertFile(e.target.files[0])} />
                              </label>
                            </div>
                          )}

                          <button type="submit" disabled={enrolledCourses.length === 0}
                            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                            🎓 Issue Certificate
                          </button>
                        </form>
                        <div className="space-y-2">
                          <p className="text-xs font-black text-gray-400 uppercase">Issued ({academicData?.certificates?.length || 0})</p>
                          {!academicData?.certificates?.length
                            ? <p className="text-xs text-gray-400">No certificates issued yet.</p>
                            : <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                                {academicData.certificates.map(cert => (
                                  <div key={cert._id} className="p-3 rounded-xl border text-xs bg-white flex justify-between items-center">
                                    <div>
                                      <p className="font-bold text-gray-700">{cert.courseId?.title || "Course"}</p>
                                      <p className="text-[10px] text-gray-400">Issued: {new Date(cert.issuedDate).toLocaleDateString()} · Code: {cert.uniqueCode}</p>
                                    </div>
                                    {cert.certificateUrl
                                      ? <a href={getFileUrl(cert.certificateUrl)} target="_blank" rel="noreferrer" className="text-emerald-600 font-bold hover:underline text-[10px]">View PDF</a>
                                      : <span className="text-gray-400 text-[10px]">No PDF</span>}
                                  </div>
                                ))}
                              </div>
                          }
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer — Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0">
          <div className="flex gap-2">
            <ActionBtn
              onClick={() => handleStatus("active")}
              loading={saving === "active"}
              disabled={student.status === "active"}
              icon={FiCheckCircle}
              label="Activate"
              cls="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
            />
            <ActionBtn
              onClick={() => handleStatus("disabled")}
              loading={saving === "disabled"}
              disabled={student.status === "disabled"}
              icon={FiAlertTriangle}
              label="Disable"
              cls="bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100"
            />
            <ActionBtn
              onClick={() => handleStatus("banned")}
              loading={saving === "banned"}
              disabled={student.status === "banned"}
              icon={FiSlash}
              label="Ban"
              cls="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
            />
          </div>
          <button onClick={onClose} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white hover:shadow-md hover:-translate-y-0.5 transition-all">
            <FiX size={14} /> Close
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── UI Helper Components ─── */
function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500">
          <Icon size={18} />
        </div>
        <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</span>
      <span className="text-sm font-semibold text-gray-800 truncate" title={String(value)}>{value || "—"}</span>
    </div>
  )
}

function TextBlock({ label, value }) {
  return (
    <div className="mt-4 p-4 bg-white border border-gray-100 rounded-2xl">
      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 block">{label}</span>
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  )
}

/* ─── Action Button ─── */
function ActionBtn({ onClick, loading, disabled, icon: Icon, label, cls }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${cls} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? <FiLoader className="animate-spin" size={13} /> : <Icon size={13} />}
      {label}
    </button>
  )
}

/* ─── Main AdminStudents Component ─── */
export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState(null)

  const loadStudents = async () => {
    try {
      const res = await API.get("/admin/students")
      setStudents(res.data)
    } catch (e) {
      toast.error("Failed to load students")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStudents() }, [])

  const handleStatusChange = async (studentId, status) => {
    try {
      await API.put(`/admin/student/${studentId}/status`, { status })
      toast.success("Student status updated")
      loadStudents()
      if (selectedStudent?._id === studentId) {
        setSelectedStudent(prev => ({ ...prev, status }))
      }
    } catch (e) {
      toast.error("Failed to update status")
    }
  }

  const filtered = students.filter(s => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false
    if (search && !s.name?.toLowerCase().includes(search.toLowerCase()) && !s.email?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">Full registered student list, academic dashboard controls, and profile details</p>
        </div>
        <button onClick={loadStudents} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--primary)] transition">
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition" />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" size={16}/>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <FiLoader className="animate-spin" size={24} />
              <p className="text-sm">Loading students...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                <FiUser size={24} className="text-gray-300" />
              </div>
              <p className="text-sm">No students found matching your criteria</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="py-3.5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">Student</th>
                  <th className="py-3.5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">Status</th>
                  <th className="py-3.5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">Joined</th>
                  <th className="py-3.5 px-6 border-b border-gray-100"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 text-sm">
                {filtered.map(s => {
                  const sStyle = getStatusStyle(s.status)
                  return (
                    <tr key={s._id} className="hover:bg-gray-50/50 transition group cursor-pointer" onClick={() => setSelectedStudent(s)}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 border border-blue-200 text-blue-600 flex items-center justify-center font-black text-sm shrink-0">
                            {getInitials(s.name, s.email)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{s.name}</p>
                            <p className="text-xs text-gray-500">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${sStyle.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sStyle.dot}`}></span>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-medium">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition ml-auto">
                          <FiChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
          onStatusChange={handleStatusChange} 
        />
      )}
    </div>
  )
}
