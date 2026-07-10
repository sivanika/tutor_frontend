import { useState, useEffect } from "react"
import { FiDownload, FiFileText, FiSearch } from "react-icons/fi"
import API, { getFileUrl } from "../../../services/api"
import socket from "../../../services/socket"
import toast from "react-hot-toast"

export default function DownloadsTab() {
  const [search, setSearch] = useState("")
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDownloads = async () => {
    try {
      setLoading(true)
      const res = await API.get("/lms/student/downloads")
      setDownloads(res.data.downloads || [])
    } catch (e) {
      toast.error("Failed to load downloads")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDownloads()
    socket.on("dashboard:update", (data) => {
      if (data.type === "downloads") {
        loadDownloads()
      }
    })
    return () => {
      socket.off("dashboard:update")
    }
  }, [])

  const filtered = downloads.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.course.toLowerCase().includes(search.toLowerCase())
  )

  const handleDownload = (dl) => {
    toast.success(`Starting download: ${dl.name}`)
    // Open in a new tab to initiate download
    window.open(getFileUrl(dl.fileUrl), "_blank")
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #fff, transparent)" }}/>
        <h2 className="text-xl md:text-2xl font-black">Downloads</h2>
        <p className="text-blue-100 text-sm mt-1 max-w-md">
          Access course datasets, resource files, lecture notes, and PDFs.
        </p>
      </div>

      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter resources by course or file name..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition focus:border-[var(--primary)]"
          style={{ background: "var(--surface)", borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <FiFileText className="mx-auto text-gray-300 mb-2" size={32}/>
            <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>No files found</p>
          </div>
        ) : (
          filtered.map(dl => (
            <div key={dl._id} className="card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FiFileText size={16}/>
                </div>
                <div>
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full uppercase">
                    {dl.course}
                  </span>
                  <h4 className="font-bold text-xs mt-1 truncate max-w-xs sm:max-w-md" style={{ color: "var(--text-primary)" }}>{dl.name}</h4>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Category: {dl.category} · Size: {dl.size}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(dl)}
                className="p-2.5 rounded-xl border flex items-center justify-center transition hover:bg-[var(--surface-alt)] animate-pulse"
                style={{ borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
                title="Download File"
              >
                <FiDownload size={14}/>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
