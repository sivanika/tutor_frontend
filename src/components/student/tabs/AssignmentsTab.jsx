import { useState, useEffect } from "react"
import { FiClipboard, FiClock, FiCheckCircle, FiAlertCircle, FiSend, FiX, FiExternalLink } from "react-icons/fi"
import API from "../../../services/api"
import socket from "../../../services/socket"
import toast from "react-hot-toast"

export default function AssignmentsTab() {
  const [filter, setFilter] = useState("all")
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState(null)
  const [submissionUrl, setSubmissionUrl] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const loadAssignments = async () => {
    try {
      setLoading(true)
      const res = await API.get("/lms/student/assignments")
      setAssignments(res.data.assignments || [])
    } catch (e) {
      toast.error("Failed to load assignments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssignments()
    socket.on("dashboard:update", (data) => {
      if (data.type === "assignments") {
        loadAssignments()
      }
    })
    return () => {
      socket.off("dashboard:update")
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!submissionUrl.trim()) {
      return toast.error("Submission content cannot be empty")
    }
    try {
      await API.post(`/lms/student/assignments/${submittingId}/submit`, { submissionUrl })
      toast.success("Assignment submitted successfully!")
      setModalOpen(false)
      setSubmissionUrl("")
      setSubmittingId(null)
      loadAssignments()
    } catch {
      toast.error("Failed to submit assignment")
    }
  }

  const filtered = assignments.filter(a => {
    if (filter === "pending") return a.status === "pending"
    if (filter === "submitted") return a.status === "submitted" || a.status === "graded"
    return true
  })

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #fff, transparent)" }}/>
        <h2 className="text-xl md:text-2xl font-black">Assignments</h2>
        <p className="text-blue-100 text-sm mt-1 max-w-md">
          Track deadlines, submit assignments, and review instructor feedback.
        </p>
      </div>

      <div className="flex gap-2">
        {["all", "pending", "submitted"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-black capitalize transition-all ${
              filter === tab
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface-alt)] hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            style={{ color: filter === tab ? "white" : "var(--text-primary)" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <FiClipboard className="mx-auto text-gray-300 mb-2" size={32} />
          <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>No assignments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(assignment => (
            <div key={assignment._id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  assignment.status !== "pending" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                }`}>
                  <FiClipboard size={18}/>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                    {assignment.course}
                  </span>
                  <h4 className="font-black text-sm mt-1" style={{ color: "var(--text-primary)" }}>{assignment.title}</h4>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{assignment.description}</p>
                  {assignment.submissionUrl && (
                    <div className="mt-2 text-xs flex items-center gap-1 text-blue-500">
                      <span>Submitted:</span>
                      <a href={assignment.submissionUrl} target="_blank" rel="noreferrer" className="underline font-medium inline-flex items-center gap-0.5 hover:text-blue-600">
                        View Link <FiExternalLink size={10} />
                      </a>
                    </div>
                  )}
                  {assignment.feedback && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[var(--surface-alt)] text-[11px] border border-dashed" style={{ borderColor: "var(--border-soft)" }}>
                      <span className="font-black" style={{ color: "var(--text-primary)" }}>Feedback:</span>{" "}
                      <span style={{ color: "var(--text-muted)" }}>{assignment.feedback}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 shrink-0" style={{ borderColor: "var(--border-soft)" }}>
                <div className="flex items-center gap-1.5">
                  {assignment.status === "graded" ? (
                    <span className="text-[10px] font-black bg-green-50 text-green-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <FiCheckCircle size={10}/> Graded: {assignment.grade}
                    </span>
                  ) : assignment.status === "submitted" ? (
                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      <FiClock size={10}/> Submitted (Pending Grade)
                    </span>
                  ) : (
                    <span className="text-[10px] font-black bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <FiClock size={10}/> Due {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                  Points: {assignment.points}
                </span>
                {assignment.status === "pending" && (
                  <button
                    onClick={() => { setSubmittingId(assignment._id); setModalOpen(true) }}
                    className="btn-ripple mt-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1"
                  >
                    <FiSend size={10}/> Submit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[var(--surface)] w-full max-w-md rounded-2xl border p-6 relative" style={{ borderColor: "var(--border-soft)" }}>
            <button
              onClick={() => { setModalOpen(false); setSubmissionUrl("") }}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-[var(--surface-alt)] transition"
              style={{ color: "var(--text-muted)" }}
            >
              <FiX size={16}/>
            </button>
            <h3 className="font-black text-lg mb-2" style={{ color: "var(--text-primary)" }}>Submit Assignment</h3>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Provide the URL to your project (e.g. GitHub Repository, Google Drive URL, etc.) or paste your response text.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                rows={4}
                value={submissionUrl}
                onChange={e => setSubmissionUrl(e.target.value)}
                placeholder="https://github.com/username/project or paste content..."
                className="w-full p-3 rounded-xl border text-sm outline-none transition focus:border-[var(--primary)]"
                style={{ background: "var(--surface-alt)", borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
              />
              <button
                type="submit"
                className="w-full btn-ripple py-2.5 rounded-xl text-white font-black text-sm bg-gradient-to-r from-blue-500 to-indigo-600 shadow"
              >
                Submit Assignment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
