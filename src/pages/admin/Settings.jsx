import { useState, useEffect } from "react"
import API from "../../services/api"
import { FiUser, FiMail, FiSave, FiLoader, FiCheckCircle, FiAlertCircle, FiSettings } from "react-icons/fi"

export default function Settings() {
  const storedUser = JSON.parse(localStorage.getItem("user"))

  const [form, setForm] = useState({ name: "", email: "" })
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (storedUser) {
      setForm({ name: storedUser.name, email: storedUser.email })
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    try {
      const res = await API.put("/admin/update-profile", form)
      setMessage("Profile updated successfully")
      localStorage.setItem("user", JSON.stringify(res.data.user))
    } catch (err) {
      setMessage("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const initials = form.name
    ? form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "A"

  return (
    <div className="space-y-5 max-w-xl animate-fadeIn">

      {/* ─── Header ─── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-sm text-gray-400 mt-0.5">Manage your admin account configuration</p>
      </div>

      {/* ─── Admin Profile Card ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <FiUser size={15} className="text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Admin Profile</h3>
            <p className="text-xs text-gray-400">Update your name and email address</p>
          </div>
        </div>

        <div className="p-6">
          {/* Avatar preview */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{form.name || "Admin"}</p>
              <p className="text-sm text-gray-400">{form.email}</p>
              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[var(--primary)] border border-purple-100">
                Administrator
              </span>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 text-sm ${
              message.includes("success")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}>
              {message.includes("success")
                ? <FiCheckCircle size={15} />
                : <FiAlertCircle size={15} />}
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Admin Name
              </label>
              <div className="relative">
                <FiUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <FiMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {saving ? (
                  <><FiLoader size={14} className="animate-spin" /> Saving...</>
                ) : (
                  <><FiSave size={14} /> Update Profile</>
                )}
              </button>
              <p className="text-xs text-gray-400">Changes apply immediately</p>
            </div>
          </form>
        </div>
      </div>

      {/* ─── Future Settings ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <FiSettings size={15} className="text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Future Configurations</h3>
            <p className="text-xs text-gray-400">Planned features coming soon</p>
          </div>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            {["Change password", "System maintenance mode", "Email notification settings", "Theme preferences"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-500">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
