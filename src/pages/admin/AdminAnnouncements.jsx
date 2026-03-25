import { useEffect, useState } from "react"
import API from "../../services/api"
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiAlertCircle, FiCheck, FiX } from "react-icons/fi"
import toast from "react-hot-toast"

const ICONS = ["📢", "⚠️", "🚀", "🏆", "📌", "🎉", "💡", "🔔", "📅", "✅"]

const empty = { title: "", text: "", icon: "📢", priority: false, active: true }

export default function AdminAnnouncements() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(empty)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [delId, setDelId]       = useState(null)

  const load = async () => {
    setLoading(true)
    try { const r = await API.get("/announcements/all"); setItems(r.data || []) }
    catch { toast.error("Failed to load announcements") }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setForm(empty); setEditId(null); setShowForm(true) }
  const openEdit = (item) => {
    setForm({ title: item.title, text: item.text, icon: item.icon, priority: item.priority, active: item.active })
    setEditId(item._id); setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty) }

  const save = async () => {
    if (!form.title.trim() || !form.text.trim()) return toast.error("Title and text required")
    setSaving(true)
    try {
      if (editId) {
        await API.put(`/announcements/${editId}`, form)
        toast.success("Updated!")
      } else {
        await API.post("/announcements", form)
        toast.success("Announcement created!")
      }
      closeForm(); load()
    } catch { toast.error("Failed to save") }
    finally { setSaving(false) }
  }

  const toggleActive = async (item) => {
    try {
      await API.put(`/announcements/${item._id}`, { ...item, active: !item.active })
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, active: !i.active } : i))
    } catch { toast.error("Failed to update") }
  }

  const del = async (id) => {
    setDelId(id)
    try {
      await API.delete(`/announcements/${id}`)
      setItems(prev => prev.filter(i => i._id !== id))
      toast.success("Deleted!")
    } catch { toast.error("Failed to delete") }
    finally { setDelId(null) }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📢 Announcements</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage public announcements shown on the homepage</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-semibold shadow hover:opacity-90 transition">
          <FiPlus size={16} /> New Announcement
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: items.length, color: "#6366f1" },
          { label: "Active", value: items.filter(i => i.active).length, color: "#22c55e" },
          { label: "Priority", value: items.filter(i => i.priority).length, color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + "20" }}>
              <span style={{ color: s.color, fontWeight: 700, fontSize: 16 }}>{s.value}</span>
            </div>
            <span className="text-sm font-medium text-gray-600">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No announcements yet</p>
            <p className="text-sm mt-1">Click "New Announcement" to create one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Icon</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Text</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3.5 text-2xl">{item.icon}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-gray-800">{item.title}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell max-w-xs">
                    <span className="line-clamp-2">{item.text}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleActive(item)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${item.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.active ? <><FiEye size={11} /> Active</> : <><FiEyeOff size={11} /> Hidden</>}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    {item.priority
                      ? <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full w-fit"><FiAlertCircle size={11} /> Priority</span>
                      : <span className="text-gray-300 text-xs">—</span>
                    }
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg text-violet-600 hover:bg-violet-50 transition">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => del(item._id)} disabled={delId === item._id}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-40">
                        {delId === item._id
                          ? <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          : <FiTrash2 size={14} />
                        }
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editId ? "Edit Announcement" : "New Announcement"}</h2>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100 transition"><FiX size={16} /></button>
            </div>

            {/* Form body */}
            <div className="px-6 py-5 space-y-4">
              {/* Icon picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(ic => (
                    <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                      className={`w-9 h-9 rounded-xl text-lg transition ${form.icon === ic ? "bg-violet-100 ring-2 ring-violet-500" : "bg-gray-100 hover:bg-gray-200"}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. System Maintenance" maxLength={100}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              </div>

              {/* Text */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description *</label>
                <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="Brief description of the announcement…" rows={3} maxLength={300}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none" />
              </div>

              {/* Toggles */}
              <div className="flex gap-4">
                {[
                  { key: "active", label: "Active (visible on homepage)", icon: <FiEye size={13} /> },
                  { key: "priority", label: "Mark as Priority", icon: <FiAlertCircle size={13} /> },
                ].map(({ key, label, icon }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                    <div className={`relative w-10 h-5 rounded-full transition ${form[key] ? "bg-violet-500" : "bg-gray-200"}`}
                      onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-5" : ""}`} />
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-600">{icon} {label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={closeForm} className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition">Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-semibold shadow hover:opacity-90 transition disabled:opacity-50">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck size={14} />}
                {saving ? "Saving…" : editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
