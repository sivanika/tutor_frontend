import { useEffect, useState } from "react"
import API from "../../services/api"
import { useNavigate } from "react-router-dom"
import {
  FiSearch, FiBookOpen, FiClock, FiLayers, FiTag,
  FiCheckCircle, FiLoader, FiAlertCircle, FiStar, FiX,
  FiBook, FiAward, FiChevronDown, FiChevronRight, FiPlay
} from "react-icons/fi"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"
const media = (url) => !url ? "" : url.startsWith("uploads/") ? `${API_BASE}/${url}` : url

const LEVEL_COLORS = {
  "All Levels": "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300",
  Beginner: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-450",
  Intermediate: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  Advanced: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
}

const ENROLL_STATUS = {
  applied:   { label: "Application Pending", color: "text-yellow-600 bg-yellow-50/50 border-yellow-200 dark:text-yellow-500 dark:bg-yellow-950/20 dark:border-yellow-900/50", icon: FiLoader },
  approved:  { label: "Enrolled",            color: "text-green-600 bg-green-50/50 border-green-200 dark:text-green-400 dark:bg-green-950/20 dark:border-green-900/50",  icon: FiCheckCircle },
  rejected:  { label: "Application Rejected",color: "text-red-500 bg-red-50/50 border-red-200 dark:text-red-400 dark:bg-red-950/20 dark:border-red-900/50",   icon: FiAlertCircle },
  completed: { label: "Completed",           color: "text-blue-600 bg-blue-50/50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-900/50",     icon: FiStar },
}

function CourseCard({ course, enrollmentStatus, onApply, applying, onSelect }) {
  const sc = enrollmentStatus ? ENROLL_STATUS[enrollmentStatus] : null
  const Icon = sc?.icon

  return (
    <div 
      onClick={() => onSelect(course)}
      className="bg-white dark:bg-[var(--surface-alt)] rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        {course.thumbnailUrl
          ? <img src={media(course.thumbnailUrl)} alt={course.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              onError={e => e.target.style.display = "none"} />
          : <div className="w-full h-full flex items-center justify-center">
              <FiBookOpen size={40} className="text-blue-200 dark:text-slate-700" />
            </div>
        }
        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow ${
            course.price > 0 ? "bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100" : "bg-green-500 text-white"
          }`}>
            {course.price > 0 ? `₹${course.price}` : "Free"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[course.level] || LEVEL_COLORS["All Levels"]}`}>
            {course.level}
          </span>
          {course.category && (
            <span className="text-xs text-gray-400 dark:text-slate-400 flex items-center gap-1"><FiTag size={10} />{course.category}</span>
          )}
        </div>

        <h3 className="font-bold text-gray-800 dark:text-white mb-1 line-clamp-2 leading-snug">{course.title}</h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">{course.description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500 mb-4">
          <span className="flex items-center gap-1"><FiClock size={11} />{course.duration}</span>
          <span className="flex items-center gap-1"><FiLayers size={11} />{course.subject}</span>
        </div>

        {/* CTA */}
        <div className="mt-auto" onClick={e => e.stopPropagation()}>
          {sc ? (
            <div className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold ${sc.color}`}>
              <Icon size={13} className="shrink-0" /> 
              {sc.label}
            </div>
          ) : (
            <button onClick={() => onApply(course._id)} disabled={applying === course._id}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-blue-500/10">
              {applying === course._id
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <FiBookOpen size={14} />}
              {applying === course._id ? "Applying..." : "Apply Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BrowseCourses() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [myEnrollments, setMyEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [applying, setApplying] = useState(null)

  // Course Details Modal State
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedCourseModules, setSelectedCourseModules] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [expandedModules, setExpandedModules] = useState({})

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [cRes, eRes] = await Promise.all([
        API.get("/lms/courses"),
        API.get("/lms/enrollments/my").catch(() => ({ data: { enrollments: [] } })),
      ])
      setCourses(cRes.data.courses || [])
      setMyEnrollments(eRes.data.enrollments || [])
    } catch { toast.error("Failed to load courses") }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const apply = async (courseId) => {
    if (!user) { navigate("/login"); return }
    setApplying(courseId)
    try {
      await API.post("/lms/enroll", { courseId })
      toast.success("Application submitted! Waiting for admin approval.")
      const eRes = await API.get("/lms/enrollments/my")
      setMyEnrollments(eRes.data.enrollments || [])
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to apply")
    } finally { setApplying(null) }
  }

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course)
    setLoadingDetails(true)
    setExpandedModules({})
    try {
      const res = await API.get(`/lms/courses/${course._id}`)
      setSelectedCourseModules(res.data.modules || [])
      if (res.data.modules?.length > 0) {
        // Expand the first module by default
        setExpandedModules({ [res.data.modules[0]._id]: true })
      }
    } catch {
      toast.error("Failed to load course details")
    } finally {
      setLoadingDetails(false)
    }
  }

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }))
  }

  const enrollMap = {}
  myEnrollments.forEach(e => { if (e.courseId) enrollMap[e.courseId._id] = e.status })

  const categories = ["all", ...new Set(courses.map(c => c.category).filter(Boolean))]
  const levels = ["all", "Beginner", "Intermediate", "Advanced", "All Levels"]

  const filtered = courses.filter(c => {
    const q = search.toLowerCase()
    const matchQ = c.title.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    const matchL = filterLevel === "all" || c.level === filterLevel
    const matchC = filterCategory === "all" || c.category === filterCategory
    return matchQ && matchL && matchC
  })

  const selectedCourseStatus = selectedCourse ? enrollMap[selectedCourse._id] : null
  const scDetail = selectedCourseStatus ? ENROLL_STATUS[selectedCourseStatus] : null
  const ScIcon = scDetail?.icon

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--secondary)] text-gray-800 dark:text-slate-100 transition-colors duration-500">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-slate-900 dark:to-slate-950 text-white px-6 py-12 text-center border-b border-blue-500/10 dark:border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">Browse Courses</h1>
        <p className="text-blue-100 dark:text-slate-350 text-sm sm:text-base max-w-lg mx-auto">
          Explore structured courses created by our expert instructors. Apply and start learning today.
        </p>
        <div className="mt-6 max-w-md mx-auto relative">
          <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search courses, subjects..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 border border-transparent dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* My Enrolled Courses Section */}
        {user && myEnrollments.length > 0 && (
          <div className="mb-10 animate-fadeIn">
            <h2 className="text-sm font-extrabold text-gray-700 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiAward className="text-blue-600 dark:text-blue-400" /> My Enrolled Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myEnrollments.map(e => {
                const c = e.courseId
                if (!c) return null
                const sc = ENROLL_STATUS[e.status] || ENROLL_STATUS.applied
                const Icon = sc.icon

                return (
                  <div key={e._id} className="bg-white dark:bg-[var(--surface-alt)] rounded-2xl border border-gray-150/80 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
                    {/* Thumbnail */}
                    <div className="relative h-36 bg-blue-50 dark:bg-slate-900">
                      {c.thumbnailUrl ? (
                        <img src={media(c.thumbnailUrl)} alt={c.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-300 dark:text-slate-700">
                          <FiBookOpen size={36} />
                        </div>
                      )}
                      {/* Status badge */}
                      <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${sc.color}`}>
                        <Icon size={10} /> {sc.label}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-bold text-gray-800 dark:text-white line-clamp-1">{c.title}</h4>
                      <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">{c.subject} · {c.level}</p>

                      {/* Progress bar */}
                      {e.status === "approved" || e.status === "completed" ? (
                        <div className="mt-4 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-slate-500">
                            <span>PROGRESS</span>
                            <span>{e.progressPercentage || 0}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-150 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${e.progressPercentage || 0}%` }} />
                          </div>
                        </div>
                      ) : null}

                      {/* CTA Button */}
                      <div className="mt-4 pt-4 border-t border-gray-55 dark:border-slate-800 flex items-center justify-between shrink-0">
                        {e.status === "approved" || e.status === "completed" ? (
                          <button onClick={() => navigate(`/courses/${c._id}/learn`)}
                            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5">
                            <FiPlay size={12} /> Continue learning
                          </button>
                        ) : e.status === "rejected" ? (
                          <div className="w-full text-center text-xs text-red-500 italic bg-red-50 dark:bg-red-950/20 p-2 rounded-xl border border-red-100 dark:border-red-900/50">
                            {e.rejectionReason || "Application rejected by admin"}
                          </div>
                        ) : (
                          <div className="w-full text-center text-xs text-yellow-600 italic bg-yellow-50/50 dark:bg-yellow-950/20 p-2 rounded-xl border border-yellow-100 dark:border-yellow-900/50 flex items-center justify-center gap-1.5">
                            <FiClock size={12} /> Waiting for admin approval
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="border-b border-gray-200/60 dark:border-slate-800 my-8" />
          </div>
        )}

        {/* Catalog Header */}
        <h2 className="text-sm font-extrabold text-gray-700 dark:text-slate-200 uppercase tracking-wider mb-4">Course Catalog</h2>
        
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400 self-center">Level:</span>
            {levels.map(l => (
              <button key={l} onClick={() => setFilterLevel(l)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition capitalize ${
                  filterLevel === l ? "bg-blue-600 text-white shadow" : "bg-white dark:bg-[var(--surface-alt)] text-gray-500 dark:text-slate-300 border border-gray-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                }`}>
                {l === "all" ? "All Levels" : l}
              </button>
            ))}
          </div>
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 ml-auto">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 self-center">Category:</span>
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition capitalize ${
                    filterCategory === cat ? "bg-indigo-600 text-white shadow" : "bg-white dark:bg-[var(--surface-alt)] text-gray-500 dark:text-slate-300 border border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                  }`}>
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results label */}
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
          {loading ? "Loading..." : `${filtered.length} course${filtered.length !== 1 ? "s" : ""} found`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-slate-500">
            <FiBookOpen size={48} className="mx-auto mb-4 text-gray-200 dark:text-slate-800" />
            <p className="font-semibold text-lg">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                enrollmentStatus={enrollMap[course._id] || null}
                onApply={apply}
                applying={applying}
                onSelect={handleSelectCourse}
              />
            ))}
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[var(--surface)] border dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-slideUp overflow-hidden">
            {/* Header */}
            <div className="relative h-48 sm:h-60 bg-gradient-to-r from-blue-700 to-indigo-900 text-white flex-shrink-0">
              {selectedCourse.thumbnailUrl && (
                <img src={media(selectedCourse.thumbnailUrl)} alt={selectedCourse.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <button 
                onClick={() => setSelectedCourse(null)} 
                className="absolute top-4 right-4 p-2 rounded-full bg-black/35 hover:bg-black/50 text-white dark:bg-white/10 dark:hover:bg-white/20 transition z-10"
              >
                <FiX size={18} />
              </button>

              <div className="absolute bottom-6 left-6 right-6 z-10 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${LEVEL_COLORS[selectedCourse.level] || LEVEL_COLORS["All Levels"]}`}>
                    {selectedCourse.level}
                  </span>
                  {selectedCourse.category && (
                    <span className="text-xs font-medium text-white/80 bg-white/10 dark:bg-slate-900/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <FiTag size={11} /> {selectedCourse.category}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight">{selectedCourse.title}</h2>
                <div className="flex items-center gap-4 text-xs text-white/70">
                  <span className="flex items-center gap-1"><FiClock size={12} /> {selectedCourse.duration}</span>
                  <span className="flex items-center gap-1"><FiLayers size={12} /> {selectedCourse.subject}</span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Details column */}
              <div className="md:col-span-3 space-y-6">
                <div>
                  <h3 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">About this Course</h3>
                  <p className="text-sm text-gray-650 dark:text-slate-300 leading-relaxed whitespace-pre-line">{selectedCourse.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-slate-800 pt-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Instructor</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 mt-0.5">{selectedCourse.instructor || "Admin"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Price</p>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-slate-105 mt-0.5">{selectedCourse.price > 0 ? `₹${selectedCourse.price}` : "Free"}</p>
                  </div>
                </div>
              </div>

              {/* Right Syllabus column */}
              <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-gray-150/60 dark:border-slate-800/80 pt-6 md:pt-0 md:pl-6 space-y-4">
                <div>
                  <h3 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">Course Curriculum</h3>
                  
                  {loadingDetails ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : selectedCourseModules.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Syllabus is being updated.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedCourseModules.map((mod, index) => {
                        const isExpanded = !!expandedModules[mod._id]
                        return (
                          <div key={mod._id} className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-[var(--surface-alt)]">
                            <button 
                              onClick={() => toggleModule(mod._id)}
                              className="w-full flex items-center justify-between px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                            >
                              <span className="truncate">{index + 1}. {mod.title}</span>
                              {isExpanded ? <FiChevronDown size={14} className="text-gray-400" /> : <FiChevronRight size={14} className="text-gray-400" />}
                            </button>

                            {isExpanded && (
                              <div className="bg-white dark:bg-[var(--surface)] border-t border-gray-55 dark:border-slate-800 p-2 space-y-1">
                                {mod.lessons?.length === 0 ? (
                                  <p className="text-[10px] text-gray-400 italic px-2">No lessons in this module.</p>
                                ) : (
                                  mod.lessons.map(lesson => (
                                    <div key={lesson._id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-slate-800/40 text-gray-600 dark:text-slate-300 transition">
                                      <FiPlay size={10} className="text-blue-500 flex-shrink-0" />
                                      <span className="truncate flex-1">{lesson.title}</span>
                                      <span className="text-[9px] text-gray-400 uppercase font-semibold">{lesson.type}</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-[var(--surface-alt)] flex items-center justify-end gap-3 flex-shrink-0">
              <button 
                onClick={() => setSelectedCourse(null)} 
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-slate-400 hover:bg-gray-250 dark:hover:bg-slate-800 transition"
              >
                Close
              </button>

              {scDetail ? (
                <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold ${scDetail.color}`}>
                  <ScIcon size={12} className="shrink-0" /> 
                  {scDetail.label}
                </div>
              ) : (
                <button 
                  onClick={() => {
                    apply(selectedCourse._id)
                    setSelectedCourse(null)
                  }} 
                  disabled={applying === selectedCourse._id}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-xs font-bold shadow hover:opacity-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {applying === selectedCourse._id
                    ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    : <FiBookOpen size={12} />
                  }
                  Apply for Course
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
