import { useEffect, useState } from "react"
import API from "../../services/api"
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiInbox,
  FiX, FiCheck, FiVideo, FiPlayCircle, FiClock, FiLayers, FiUser
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

const emptyCourse = {
  title: "",
  description: "",
  subject: "",
  instructor: "Admin / Vishidh Academy",
  thumbnailUrl: "",
  videoUrl: "",
  duration: "Self-paced",
  level: "All Levels",
  isActive: true
}

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyCourse)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [delId, setDelId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Dual input states
  const [thumbnailSourceType, setThumbnailSourceType] = useState("url") // "url" or "file"
  const [videoSourceType, setVideoSourceType] = useState("url") // "url" or "file"
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)

  const loadCourses = async () => {
    setLoading(true)
    try {
      const res = await API.get("/courses")
      setCourses(res.data || [])
    } catch (e) {
      toast.error("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const openNew = () => {
    setForm(emptyCourse)
    setThumbnailSourceType("url")
    setVideoSourceType("url")
    setThumbnailFile(null)
    setVideoFile(null)
    setEditId(null)
    setShowForm(true)
  }

  const openEdit = (course) => {
    const isLocalThumbnail = course.thumbnailUrl?.startsWith("uploads/")
    const isLocalVideo = course.videoUrl?.startsWith("uploads/")

    setForm({
      title: course.title,
      description: course.description,
      subject: course.subject,
      instructor: course.instructor || "Admin / Vishidh Academy",
      thumbnailUrl: course.thumbnailUrl || "",
      videoUrl: course.videoUrl,
      duration: course.duration || "Self-paced",
      level: course.level || "All Levels",
      isActive: course.isActive
    })
    setThumbnailSourceType(isLocalThumbnail ? "file" : "url")
    setVideoSourceType(isLocalVideo ? "file" : "url")
    setThumbnailFile(null)
    setVideoFile(null)
    setEditId(course._id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditId(null)
    setForm(emptyCourse)
    setThumbnailFile(null)
    setVideoFile(null)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.subject.trim()) {
      return toast.error("Title, Description, and Subject are required")
    }

    if (videoSourceType === "url" && !form.videoUrl.trim()) {
      return toast.error("Video URL is required")
    }
    if (videoSourceType === "file" && !videoFile && !editId) {
      return toast.error("Video file is required")
    }

    setSaving(true)
    try {
      const data = new FormData()
      data.append("title", form.title.trim())
      data.append("description", form.description.trim())
      data.append("subject", form.subject.trim())
      data.append("instructor", form.instructor.trim())
      data.append("duration", form.duration.trim())
      data.append("level", form.level)
      data.append("isActive", form.isActive)

      // Handle Thumbnail
      if (thumbnailSourceType === "url") {
        data.append("thumbnailUrl", form.thumbnailUrl.trim())
      } else if (thumbnailFile) {
        data.append("thumbnailFile", thumbnailFile)
      } else if (editId) {
        data.append("thumbnailUrl", form.thumbnailUrl)
      }

      // Handle Video
      if (videoSourceType === "url") {
        data.append("videoUrl", form.videoUrl.trim())
      } else if (videoFile) {
        data.append("videoFile", videoFile)
      } else if (editId) {
        data.append("videoUrl", form.videoUrl)
      }

      const headers = { "Content-Type": "multipart/form-data" }
      if (editId) {
        await API.put(`/courses/${editId}`, data, { headers })
        toast.success("Course updated successfully!")
      } else {
        await API.post("/courses", data, { headers })
        toast.success("Course created successfully!")
      }
      closeForm()
      loadCourses()
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save course")
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (course) => {
    try {
      const updatedStatus = !course.isActive
      // Send as simple JSON since we aren't uploading files here
      await API.put(`/courses/${course._id}`, { isActive: updatedStatus })
      setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isActive: updatedStatus } : c))
      toast.success(updatedStatus ? "Course activated" : "Course hidden")
    } catch (e) {
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return
    setDelId(id)
    try {
      await API.delete(`/courses/${id}`)
      setCourses(prev => prev.filter(c => c._id !== id))
      toast.success("Course deleted!")
    } catch (e) {
      toast.error("Failed to delete course")
    } finally {
      setDelId(null)
    }
  }

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiVideo className="text-[var(--primary)]" /> Video Courses
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage self-paced video courses for students</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold shadow-lg hover:opacity-90 transition w-full sm:w-auto"
        >
          <FiPlus size={16} /> Add Video Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Courses", value: courses.length, color: "#2563EB" },
          { label: "Active Courses", value: courses.filter(c => c.isActive).length, color: "#22c55e" },
          { label: "Hidden Courses", value: courses.filter(c => !c.isActive).length, color: "#94a3b8" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: s.color + "15", color: s.color }}>
              {s.value}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{s.label}</p>
              <p className="text-xs text-gray-400">Platform-wide</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-2xl border-t border-x border-gray-100 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by title or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-xs px-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Grid/Table List */}
      <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-4xl mb-3 text-gray-300 flex justify-center"><FiInbox /></div>
            <p className="font-medium">No courses found</p>
            <p className="text-sm mt-1">Try refining your search or add a new course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Thumbnail</th>
                  <th className="px-6 py-4">Course Info</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Duration & Level</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCourses.map(course => (
                  <tr key={course._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 shrink-0">
                      {course.thumbnailUrl ? (
                        <img
                          src={resolveMediaUrl(course.thumbnailUrl)}
                          alt={course.title}
                          className="w-16 h-10 object-cover rounded-lg bg-gray-100 border border-gray-100 shadow-sm"
                          onError={(e) => { e.target.src = "/logos/vishidh-emblem-192x192.webp" }}
                        />
                      ) : (
                        <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-500 border border-blue-100 shadow-sm">
                          <FiPlayCircle size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800 line-clamp-1">{course.title}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <FiUser size={12} /> {course.instructor || "Admin"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {course.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1 text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiClock size={12} /> {course.duration}
                        </div>
                        <div className="flex items-center gap-1 font-medium text-slate-500">
                          <FiLayers size={12} /> {course.level}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(course)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                          course.isActive ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {course.isActive ? (
                          <><FiEye size={12} /> Active</>
                        ) : (
                          <><FiEyeOff size={12} /> Hidden</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(course)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit Course"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          disabled={delId === course._id}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                          title="Delete Course"
                        >
                          {delId === course._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col animate-slideUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <FiVideo className="text-[var(--primary)]" />
                {editId ? "Edit Video Course" : "Add Video Course"}
              </h2>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Course Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Course Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Intro to Algebra"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="What will students learn in this video course?"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Subject *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="e.g. Mathematics"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Instructor</label>
                  <input
                    type="text"
                    value={form.instructor}
                    onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))}
                    placeholder="e.g. Prof. Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="e.g. 2h 15m or Self-paced"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Level</label>
                  <select
                    value={form.level}
                    onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Thumbnail Selector */}
              <div className="border border-gray-100 p-4 rounded-2xl bg-gray-50/50 space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Thumbnail Image</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="thumbnailSourceType"
                      checked={thumbnailSourceType === "url"}
                      onChange={() => setThumbnailSourceType("url")}
                    />
                    <span>Enter URL</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="thumbnailSourceType"
                      checked={thumbnailSourceType === "file"}
                      onChange={() => setThumbnailSourceType("file")}
                    />
                    <span>Upload Local File</span>
                  </label>
                </div>

                {thumbnailSourceType === "url" ? (
                  <input
                    type="text"
                    value={form.thumbnailUrl}
                    onChange={e => setForm(f => ({ ...f, thumbnailUrl: e.target.value }))}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setThumbnailFile(e.target.files[0])}
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full border border-dashed border-gray-200 p-2 rounded-xl bg-white"
                    />
                    {editId && form.thumbnailUrl?.startsWith("uploads/") && !thumbnailFile && (
                      <span className="text-[10px] text-gray-400">Current file: {form.thumbnailUrl.substring(8)}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Video Selector */}
              <div className="border border-gray-100 p-4 rounded-2xl bg-gray-50/50 space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Video Class *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="videoSourceType"
                      checked={videoSourceType === "url"}
                      onChange={() => setVideoSourceType("url")}
                    />
                    <span>Enter URL (YouTube / Vimeo / Direct link)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="videoSourceType"
                      checked={videoSourceType === "file"}
                      onChange={() => setVideoSourceType("file")}
                    />
                    <span>Upload Local Video File</span>
                  </label>
                </div>

                {videoSourceType === "url" ? (
                  <input
                    type="text"
                    value={form.videoUrl}
                    onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={e => setVideoFile(e.target.files[0])}
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full border border-dashed border-gray-200 p-2 rounded-xl bg-white"
                    />
                    {editId && form.videoUrl?.startsWith("uploads/") && !videoFile && (
                      <span className="text-[10px] text-gray-400">Current file: {form.videoUrl.substring(8)}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                  <div
                    className={`relative w-10 h-5 rounded-full transition duration-200 ${form.isActive ? "bg-green-500" : "bg-gray-200"}`}
                    onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isActive ? "translate-x-5" : ""}`} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Active (Visible to Students)</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0 bg-gray-50 rounded-b-2xl font-[Inter]">
              <button
                onClick={closeForm}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold shadow hover:opacity-95 transition disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiCheck size={16} />
                )}
                {saving ? "Saving..." : editId ? "Save Changes" : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
