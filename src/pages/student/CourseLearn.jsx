import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../../services/api"
import {
  FiChevronLeft, FiPlay, FiFileText, FiAward,
  FiCheckCircle, FiCircle, FiChevronRight, FiChevronDown,
  FiMenu, FiX, FiCheck
} from "react-icons/fi"
import toast from "react-hot-toast"

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"
const media = (url) => !url ? "" : url.startsWith("uploads/") ? `${API_BASE}/${url}` : url

export default function CourseLearn() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState(null)
  const [progress, setProgress] = useState({}) // { [lessonId]: completed }
  const [progressPct, setProgressPct] = useState(0)
  const [expandedModules, setExpandedModules] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const videoRef = useRef(null)

  // Load course content & progress
  const loadData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        API.get(`/lms/courses/${id}`),
        API.get(`/lms/progress/${id}`),
      ])
      
      const courseData = cRes.data.course
      const modulesData = cRes.data.modules || []
      
      setCourse(courseData)
      setModules(modulesData)
      setProgressPct(pRes.data.progressPercentage || 0)
      
      const progMap = {}
      ;(pRes.data.progressRecords || []).forEach(r => {
        progMap[r.lessonId] = r.completed
      })
      setProgress(progMap)

      // Auto-expand first module
      if (modulesData.length > 0) {
        setExpandedModules(prev => ({ [modulesData[0]._id]: true, ...prev }))
        // Auto-select first lesson if none active
        if (!activeLesson && modulesData[0].lessons?.length > 0) {
          setActiveLesson(modulesData[0].lessons[0])
        }
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load course")
      navigate("/student/dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) loadData()
  }, [id])

  // Track video progress
  useEffect(() => {
    const video = videoRef.current
    if (!video || !activeLesson || activeLesson.type !== "video") return

    let lastUpdated = 0
    const handleTimeUpdate = () => {
      const current = Math.floor(video.currentTime)
      const duration = Math.floor(video.duration)
      if (duration > 0 && current - lastUpdated >= 10) {
        lastUpdated = current
        updateVideoProgress(current, duration)
      }
    }

    const handleEnded = () => {
      const duration = Math.floor(video.duration)
      updateVideoProgress(duration, duration)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
    }
  }, [activeLesson])

  const updateVideoProgress = async (watched, total) => {
    try {
      const res = await API.post("/lms/progress/video", {
        lessonId: activeLesson._id,
        courseId: id,
        watchedSeconds: watched,
        totalSeconds: total,
      })
      if (res.data.autoCompleted && !progress[activeLesson._id]) {
        toast.success("Lesson completed! 🎉")
        loadData()
      }
    } catch (e) {
      console.error("Progress save failed:", e)
    }
  }

  const markComplete = async () => {
    if (!activeLesson) return
    try {
      const res = await API.post("/lms/progress/mark", {
        lessonId: activeLesson._id,
        courseId: id,
      })
      toast.success("Lesson marked as complete ✓")
      loadData()
    } catch {
      toast.error("Failed to update progress")
    }
  }

  // Helpers to get YouTube/Vimeo embed
  const getEmbedUrl = (url) => {
    if (!url) return ""
    const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const ytMatch = url.match(ytReg)
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&rel=0`
    }
    const vimeoReg = /vimeo\.com\/(\d+)/
    const vimeoMatch = url.match(vimeoReg)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    }
    return url
  }

  const isEmbeddable = (url) => {
    if (!url) return false
    return url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden text-gray-100 font-[Inter,sans-serif]">
      {/* ── Sidebar ── */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-80 flex flex-col bg-gray-900 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"}
      `}>
        {/* Course Header */}
        <div className="p-4 border-b border-gray-800">
          <button onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white mb-3">
            <FiChevronLeft /> Back to Dashboard
          </button>
          <h1 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">{course?.title}</h1>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
              <span>COURSE PROGRESS</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* Modules Tree */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {modules.map((mod, mIdx) => {
            const isExp = !!expandedModules[mod._id]
            return (
              <div key={mod._id} className="space-y-1">
                <button
                  onClick={() => setExpandedModules(prev => ({ ...prev, [mod._id]: !isExp }))}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left bg-gray-800/40 hover:bg-gray-800 transition text-xs font-bold text-gray-300">
                  <span className="truncate">{mIdx + 1}. {mod.title}</span>
                  {isExp ? <FiChevronDown /> : <FiChevronRight />}
                </button>

                {isExp && (
                  <div className="pl-3 space-y-0.5">
                    {mod.lessons?.map(l => {
                      const isAct = activeLesson?._id === l._id
                      const isComp = !!progress[l._id]
                      return (
                        <button key={l._id} onClick={() => setActiveLesson(l)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition ${
                            isAct
                              ? "bg-blue-600 text-white font-semibold"
                              : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
                          }`}>
                          {isComp
                            ? <FiCheckCircle className={isAct ? "text-white" : "text-green-500"} size={13} />
                            : <FiCircle className="text-gray-600" size={13} />
                          }
                          {l.type === "video" ? <FiPlay size={11} className="shrink-0" /> : <FiFileText size={11} className="shrink-0" />}
                          <span className="truncate flex-1">{l.title}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Header */}
        <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-800 shrink-0 bg-gray-900/40">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition shrink-0">
            {sidebarOpen ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Currently learning</span>
            <h2 className="font-bold text-sm sm:text-base text-white truncate">{activeLesson?.title || "Select a lesson"}</h2>
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto w-full space-y-6 flex-1 flex flex-col justify-between">
              {/* Media viewer */}
              <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl shrink-0">
                {activeLesson.type === "video" ? (
                  isEmbeddable(activeLesson.contentUrl) ? (
                    <iframe
                      src={getEmbedUrl(activeLesson.contentUrl)}
                      title={activeLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={media(activeLesson.contentUrl)}
                      controls
                      autoPlay
                      className="absolute inset-0 w-full h-full"
                    />
                  )
                ) : activeLesson.type === "pdf" ? (
                  <iframe
                    src={media(activeLesson.contentUrl)}
                    title={activeLesson.title}
                    className="absolute inset-0 w-full h-full border-0 bg-white"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                    <div>
                      <FiAward size={48} className="text-blue-500 mx-auto mb-3" />
                      <h3 className="font-bold text-lg">Quiz Lesson</h3>
                      <p className="text-xs text-gray-400 mt-1">Quizzes and activities are self-verified for this lesson module.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson details / manual complete */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 mt-4 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lesson description</h4>
                    <p className="text-sm text-gray-300 mt-1 leading-relaxed">{activeLesson.description || "No description provided for this lesson."}</p>
                  </div>
                  {(!progress[activeLesson._id]) && (
                    <button onClick={markComplete}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow transition shrink-0">
                      <FiCheck size={14} /> Mark as Complete
                    </button>
                  )}
                  {progress[activeLesson._id] && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-500 bg-green-500/10 px-3.5 py-1.5 rounded-xl border border-green-500/20 shrink-0">
                      ✓ Lesson Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-6">
              <div>
                <FiPlay size={48} className="text-gray-700 mx-auto mb-3" />
                <p className="font-semibold text-gray-500">No active lesson selected</p>
                <p className="text-xs text-gray-400 mt-1">Select a lesson from the left side menu to begin learning.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
