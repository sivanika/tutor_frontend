import { useEffect, useState, useRef } from "react"
import API from "../../../services/api"
import {
  FiSearch, FiClock, FiLayers, FiUser, FiPlay, FiX,
  FiBookOpen, FiInbox, FiVideo, FiTrendingUp,
  FiChevronDown, FiCheck
} from "react-icons/fi"
import toast from "react-hot-toast"

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"

const resolveMediaUrl = (url) => {
  if (!url) return ""
  if (url.startsWith("uploads/")) {
    return `${BACKEND_URL}/${url.replace(/\\/g, "/")}`
  }
  return url
}

// Custom Dropdown Component for rich UI/UX
function CustomDropdown({ value, onChange, options, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  return (
    <div className="relative w-full sm:w-48" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2.5 w-full bg-gray-50 border border-gray-200 hover:border-blue-400 hover:bg-blue-50/20 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 transition-all duration-200 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="text-gray-400 shrink-0" size={14} />}
          <span className="truncate">{selectedOption.label}</span>
        </div>
        <FiChevronDown
          size={14}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "transform rotate-180 text-blue-500" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-1.5 animate-fadeIn min-w-[180px]">
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-left text-xs font-semibold transition duration-150 ${
                  isSelected
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <FiCheck className="text-blue-600 shrink-0" size={12} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CoursesTab() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [activeCourse, setActiveCourse] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses")
        setCourses(res.data || [])
      } catch (e) {
        toast.error("Failed to load courses")
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Helper to parse YouTube and Vimeo URLs into secure embed links
  const getEmbedUrl = (url) => {
    if (!url) return ""

    // YouTube regex
    const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const ytMatch = url.match(ytReg)
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&rel=0`
    }

    // Vimeo regex
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

  // Extract unique subjects for dropdown filter
  const subjectsList = ["All", ...new Set(courses.map(c => c.subject))]

  const subjectOptions = subjectsList.map(subj => ({
    value: subj,
    label: subj === "All" ? "All Category" : `${subj} Category`
  }))

  const levelOptions = [
    { value: "All", label: "All Levels" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" }
  ]

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === "All" || course.subject === selectedSubject
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel
    return matchesSearch && matchesSubject && matchesLevel
  })

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none">
          <FiVideo className="w-full h-full object-contain transform translate-y-1/4 translate-x-1/4" />
        </div>
        <div className="space-y-2 text-center md:text-left z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Expand Your Knowledge</h2>
          <p className="text-blue-100 text-sm md:text-base font-medium max-w-md">
            Dive into our collection of self-paced video courses created by elite tutors. Study anytime, anywhere.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex gap-4 shrink-0 text-center z-10">
          <div>
            <p className="text-2xl font-bold">{courses.length}</p>
            <p className="text-[10px] uppercase font-semibold text-blue-200">Courses</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-2xl font-bold">100%</p>
            <p className="text-[10px] uppercase font-semibold text-blue-200">Self-Paced</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Subject Dropdown */}
          <CustomDropdown
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={subjectOptions}
            icon={FiBookOpen}
          />

          {/* Level Dropdown */}
          <CustomDropdown
            value={selectedLevel}
            onChange={setSelectedLevel}
            options={levelOptions}
            icon={FiLayers}
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
          <div className="text-4xl mb-3 text-gray-300 flex justify-center"><FiInbox /></div>
          <p className="font-semibold text-gray-700">No courses match your criteria</p>
          <p className="text-sm mt-1">Try resetting filters or searching for something else.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course._id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-gray-50 overflow-hidden shrink-0">
                {course.thumbnailUrl ? (
                  <img
                    src={resolveMediaUrl(course.thumbnailUrl)}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = "/logos/vishidh-emblem-192x192.webp" }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform duration-300">
                    <FiPlay size={40} className="opacity-80" />
                  </div>
                )}
                {/* Subject Badge */}
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  {course.subject}
                </span>

                {/* Level Badge */}
                <span className="absolute top-4 right-4 bg-gray-900/85 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow-sm">
                  {course.level}
                </span>

                {/* Duration Overlay */}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                  <FiClock size={10} /> {course.duration}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-blue-600 transition">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1.5">
                  <FiUser size={13} className="text-gray-400" />
                  <span>{course.instructor || "Admin"}</span>
                </p>
                <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed flex-1">
                  {course.description}
                </p>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between shrink-0">
                  <button
                    onClick={() => setActiveCourse(course)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-600 hover:text-white transition duration-200"
                  >
                    <FiPlay size={13} /> Watch Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {activeCourse && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/10">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 text-white shrink-0 bg-slate-950">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Streaming Class</span>
                <h3 className="font-bold text-base md:text-lg line-clamp-1 mt-0.5">{activeCourse.title}</h3>
              </div>
              <button
                onClick={() => setActiveCourse(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Video Box */}
            <div className="relative aspect-video bg-black shrink-0 w-full">
              {isEmbeddable(activeCourse.videoUrl) ? (
                <iframe
                  src={getEmbedUrl(activeCourse.videoUrl)}
                  title={activeCourse.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : (
                <video
                  src={resolveMediaUrl(activeCourse.videoUrl)}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Description Box */}
            <div className="p-6 overflow-y-auto flex-1 text-slate-300 space-y-4 bg-slate-950">
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-800/30">
                  {activeCourse.subject}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 border border-purple-800/30">
                  {activeCourse.level}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <FiClock size={13} /> {activeCourse.duration}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <FiUser size={13} /> {activeCourse.instructor || "Admin"}
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">About this course</h4>
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {activeCourse.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
