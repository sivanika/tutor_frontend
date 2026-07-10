import { useEffect, useState } from "react"
import API from "../../services/api"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiSearch, FiBookOpen, FiClock, FiLayers, FiTag,
  FiCheckCircle, FiLoader, FiAlertCircle, FiStar, FiX,
  FiAward, FiChevronDown, FiChevronRight, FiPlay,
  FiUsers, FiVideo, FiTrendingUp, FiFilter, FiHeart
} from "react-icons/fi"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { resolveMediaUrl } from "../../utils/media"

const LEVEL_COLORS = {
  "All Levels": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Beginner: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Intermediate: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Advanced: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
}

const ENROLL_STATUS = {
  applied:   { label: "Pending", color: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800/50", icon: FiLoader },
  approved:  { label: "Enrolled", color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800/50",  icon: FiCheckCircle },
  rejected:  { label: "Rejected", color: "text-red-500 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800/50",   icon: FiAlertCircle },
  completed: { label: "Completed", color: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800/50",     icon: FiAward },
}

// Stats Data
const STATS = [
  { value: "150+", label: "Expert Courses", icon: FiVideo },
  { value: "25+", label: "Industry Trainers", icon: FiAward },
  { value: "10K+", label: "Active Students", icon: FiUsers },
  { value: "4.9★", label: "Average Rating", icon: FiStar },
]

// Mock Categories for visuals (can map to real categories later)
const CATEGORY_CARDS = [
  { icon: "💻", name: "Programming", count: "120" },
  { icon: "🤖", name: "Artificial Intelligence", count: "35" },
  { icon: "📊", name: "Data Science", count: "40" },
  { icon: "🌐", name: "Web Development", count: "65" },
  { icon: "☁️", name: "Cloud Computing", count: "25" },
]

function CourseCard({ course, enrollmentStatus, onEnroll, onSelect }) {
  const sc = enrollmentStatus ? ENROLL_STATUS[enrollmentStatus] : null
  const Icon = sc?.icon

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => onSelect(course)}
      className="bg-white dark:bg-[#1E293B] rounded-[16px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer overflow-hidden relative"
    >
      {/* Top section: Thumbnail */}
      <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {course.thumbnailUrl ? (
          <img 
            src={resolveMediaUrl(course.thumbnailUrl)} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => e.target.style.display = "none"} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2563EB]/10 to-[#1D4ED8]/10">
            <FiBookOpen size={48} className="text-[#2563EB]/40 dark:text-slate-600" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.price === 0 && (
            <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
              Free
            </span>
          )}
          {course.isBestseller && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
              Best Seller
            </span>
          )}
        </div>
        
        {/* Wishlist */}
        <button className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-400 hover:text-rose-500 rounded-full shadow-sm backdrop-blur-sm transition-colors z-10" onClick={(e) => e.stopPropagation()}>
          <FiHeart size={16} />
        </button>
      </div>

      {/* Middle section: Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-medium text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/10 dark:bg-[#2563EB]/20 px-2 py-0.5 rounded-md">
            {course.category || "General"}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${LEVEL_COLORS[course.level] || LEVEL_COLORS["All Levels"]}`}>
            {course.level}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1.5 line-clamp-2 leading-snug group-hover:text-[#2563EB] transition-colors">{course.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{course.description}</p>
        
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
          By <span className="font-medium text-slate-700 dark:text-slate-300">{course.instructor || "Vishidh Academy Expert"}</span>
        </p>

        {/* Rating (Mocked if not present) */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex text-amber-400">
            {[1,2,3,4,5].map(i => <FiStar key={i} size={12} fill="currentColor" className={i===5 ? "opacity-40" : ""} />)}
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">4.8</span>
          <span className="text-xs text-slate-400">(1.2k)</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5"><FiClock size={14} />{course.duration}</span>
          <span className="flex items-center gap-1.5"><FiLayers size={14} />{course.subject}</span>
        </div>

        {/* Bottom CTA */}
        <div className="mt-auto flex items-center justify-between" onClick={e => e.stopPropagation()}>
          <div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {course.price > 0 ? `₹${course.price}` : "Free"}
            </div>
            {course.oldPrice > 0 && (
              <div className="text-[10px] text-slate-400 line-through">₹{course.oldPrice}</div>
            )}
          </div>

          {sc ? (
            <div className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-bold ${sc.color}`}>
              <Icon size={14} className="shrink-0" /> 
              {sc.label}
            </div>
          ) : (
            <button onClick={() => onEnroll(course._id)}
              className="py-2 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors shadow-sm shadow-blue-500/20">
              Enroll
            </button>
          )}
        </div>
      </div>
    </motion.div>
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
        user ? API.get("/lms/enrollments/my").catch(() => ({ data: { enrollments: [] } })) : Promise.resolve({ data: { enrollments: [] } }),
      ])
      setCourses(cRes.data.courses || [])
      setMyEnrollments(eRes.data.enrollments || [])
    } catch { toast.error("Failed to load courses") }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchAll()
  }, [user])

  const enroll = (courseId) => {
    if (!user) { navigate("/login"); return }
    navigate(`/payment/course/${courseId}`)
  }

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course)
    setLoadingDetails(true)
    setExpandedModules({})
    try {
      const res = await API.get(`/lms/courses/${course._id}`)
      setSelectedCourseModules(res.data.modules || [])
      if (res.data.modules?.length > 0) {
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 font-inter">
      
      {/* ─── PREMIUM HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Subtle Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#2563EB]/10 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#1D4ED8]/5 to-transparent rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">Professional</span> Courses
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-xl">
                Master industry-ready skills through expert-designed courses, hands-on projects, and interactive learning paths.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-10 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <FiCheckCircle className="text-[#2563EB] shrink-0" size={20}/> Lifetime Access
                </div>
                <div className="flex items-center gap-2.5">
                  <FiAward className="text-[#2563EB] shrink-0" size={20}/> Industry Certificates
                </div>
                <div className="flex items-center gap-2.5">
                  <FiLayers className="text-[#2563EB] shrink-0" size={20}/> Practical Projects
                </div>
                <div className="flex items-center gap-2.5">
                  <FiUsers className="text-[#2563EB] shrink-0" size={20}/> Expert Mentors
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  Explore Courses
                </button>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700 aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                {/* Abstract Premium Graphic placeholder - replace with actual artwork later */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-64 h-64 bg-gradient-to-tr from-[#2563EB] to-purple-500 rounded-[40px] rotate-12 opacity-80 blur-lg animate-pulse" />
                   <div className="absolute inset-0 backdrop-blur-[40px] bg-white/30 dark:bg-slate-900/40" />
                   <div className="relative bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 w-72 transform -rotate-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                        <FiTrendingUp className="text-[#2563EB] dark:text-[#60A5FA]" size={24}/>
                      </div>
                      <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded mb-2" />
                      <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded mb-4" />
                      <div className="h-2 w-full bg-slate-50 dark:bg-slate-800/50 rounded" />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SEARCH & FILTERS SECTION ─── */}
      <section id="search-section" className="relative z-20 -mt-8 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-[#1E293B] rounded-[24px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-4 sm:p-6">
          <div className="relative">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, technologies, instructors..."
              className="w-full pl-14 pr-6 py-4 rounded-xl text-lg bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-[#2563EB] transition-all"
            />
          </div>
          
          {/* Filter Chips */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 min-w-[80px]">
                <FiFilter /> Filters
              </div>
              
              <div className="flex flex-wrap gap-3">
                {/* Level Dropdown Simulator (Using chips for better UX based on requirements) */}
                <select 
                  value={filterLevel} 
                  onChange={e => setFilterLevel(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  {levels.map(l => <option key={l} value={l}>{l === "all" ? "All Levels" : l}</option>)}
                </select>

                <select 
                  value={filterCategory} 
                  onChange={e => setFilterCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm"
            >
              <stat.icon className="mx-auto text-[#2563EB] mb-3" size={32} />
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TOP CATEGORIES ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Top Categories</h2>
        </div>
        <div className="flex overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 gap-4 hide-scrollbar">
          {CATEGORY_CARDS.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setFilterCategory(cat.name)}
              className="flex-shrink-0 w-64 p-5 text-left bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#2563EB]/30 transition-all group"
            >
              <div className="text-3xl mb-4 bg-slate-50 dark:bg-slate-900 w-14 h-14 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{cat.name}</h3>
              <p className="text-sm text-slate-500">{cat.count} Courses</p>
            </button>
          ))}
        </div>
      </section>

      {/* ─── COURSE CATALOG ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">All Courses</h2>
            <p className="text-slate-500 mt-2">
              {loading ? "Loading catalog..." : `Showing ${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-100 dark:border-slate-800"
          >
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Courses Found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Try changing your filters or search keyword to find what you're looking for.</p>
            <button 
              onClick={() => { setSearch(""); setFilterLevel("all"); setFilterCategory("all") }}
              className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((course, i) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  enrollmentStatus={enrollMap[course._id] || null}
                  onEnroll={enroll}
                  onSelect={handleSelectCourse}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ─── NEWSLETTER SECTION ─── */}
      <section className="bg-white dark:bg-[#1E293B] border-t border-slate-200 dark:border-slate-800 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Stay Updated</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
            Get notified when new courses launch. Join our newsletter to receive the latest updates and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed successfully!"); }}>
            <input 
              type="email" 
              required
              placeholder="Email Address" 
              className="flex-1 px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <button type="submit" className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ─── COURSE DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#0F172A] border dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="relative h-48 md:h-64 bg-[#1E293B] text-white flex-shrink-0">
                {selectedCourse.thumbnailUrl && (
                  <img src={resolveMediaUrl(selectedCourse.thumbnailUrl)} alt={selectedCourse.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                
                <button 
                  onClick={() => setSelectedCourse(null)} 
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition z-10"
                >
                  <FiX size={20} />
                </button>

                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-md ${LEVEL_COLORS[selectedCourse.level] || LEVEL_COLORS["All Levels"]}`}>
                      {selectedCourse.level}
                    </span>
                    {selectedCourse.category && (
                      <span className="text-xs font-medium text-white/80 bg-white/10 backdrop-blur-md px-3 py-1 rounded-md flex items-center gap-1.5">
                        <FiTag size={12} /> {selectedCourse.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black leading-tight mb-3">{selectedCourse.title}</h2>
                  <div className="flex items-center gap-6 text-sm text-slate-300">
                    <span className="flex items-center gap-2"><FiClock /> {selectedCourse.duration}</span>
                    <span className="flex items-center gap-2"><FiLayers /> {selectedCourse.subject}</span>
                    <span className="flex items-center gap-2"><FiUsers /> {selectedCourse.instructor || "Expert"}</span>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Details column */}
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">About This Course</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line text-[15px]">
                      {selectedCourse.description}
                    </p>
                  </section>

                  <section className="bg-slate-50 dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Course Highlights</h3>
                    <ul className="grid sm:grid-cols-2 gap-4">
                      <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <FiCheckCircle className="text-[#2563EB] shrink-0 mt-0.5" /> 100% Online & Self-paced
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <FiCheckCircle className="text-[#2563EB] shrink-0 mt-0.5" /> Shareable Certificate
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <FiCheckCircle className="text-[#2563EB] shrink-0 mt-0.5" /> Assignments & Projects
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <FiCheckCircle className="text-[#2563EB] shrink-0 mt-0.5" /> English & localized subtitles
                      </li>
                    </ul>
                  </section>
                </div>

                {/* Right Syllabus column */}
                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm sticky top-0">
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                      {selectedCourse.price > 0 ? `₹${selectedCourse.price}` : "Free"}
                    </div>
                    <div className="text-sm text-slate-500 mb-6">One-time payment for full access</div>
                    
                    {scDetail ? (
                      <div className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl border text-sm font-bold ${scDetail.color}`}>
                        <ScIcon size={16} className="shrink-0" /> 
                        {scDetail.label}
                      </div>
                    ) : (
                      <button 
                        onClick={() => { enroll(selectedCourse._id); setSelectedCourse(null); }} 
                        className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-colors shadow-lg shadow-blue-500/25 flex justify-center items-center gap-2"
                      >
                        Enroll Now
                      </button>
                    )}

                    <div className="mt-8">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Course Content</h3>
                      {loadingDetails ? (
                        <div className="flex justify-center py-6">
                          <FiLoader className="animate-spin text-slate-400" size={24} />
                        </div>
                      ) : selectedCourseModules.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">Syllabus is being updated.</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedCourseModules.map((mod, index) => {
                            const isExpanded = !!expandedModules[mod._id]
                            return (
                              <div key={mod._id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                <button 
                                  onClick={() => toggleModule(mod._id)}
                                  className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                >
                                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-left">
                                    Module {index + 1}: {mod.title}
                                  </span>
                                  {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                                </button>
                                
                                {isExpanded && (
                                  <div className="p-3 bg-white dark:bg-[#1E293B] space-y-2">
                                    {mod.lessons?.length === 0 ? (
                                      <p className="text-xs text-slate-400 italic">No lessons</p>
                                    ) : (
                                      mod.lessons.map(lesson => (
                                        <div key={lesson._id} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                          <FiPlay className="text-[#2563EB] shrink-0" size={14} />
                                          <span className="truncate flex-1">{lesson.title}</span>
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
