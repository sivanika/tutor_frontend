import { useEffect, useState } from "react"
import API, { getFileUrl } from "../../../services/api"
import { FiAward, FiDownload, FiShare2, FiCheckCircle } from "react-icons/fi"
import toast from "react-hot-toast"

export default function CertificatesTab() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadCerts = async () => {
    try {
      const res = await API.get("/lms/certificates/my")
      setCerts(res.data.certificates || [])
    } catch (e) {
      toast.error("Failed to load certificates")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCerts()
  }, [])

  const handleDownload = (cert) => {
    // Open certUrl if present or show toast
    if (cert.certificateUrl) {
      window.open(getFileUrl(cert.certificateUrl), "_blank")
    } else {
      toast.success(`Downloading Certificate ${cert.uniqueCode}...`)
    }
  }

  const handleShare = (cert) => {
    const text = `I just earned my certificate for ${cert.courseId?.title || "Course"} on VishidhAcademy! ID: ${cert.uniqueCode}`
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`, "_blank")
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
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #fff, transparent)" }}/>
        <h2 className="text-xl md:text-2xl font-black">My Certificates</h2>
        <p className="text-amber-100 text-sm mt-1 max-w-md">
          Verifiable credentials earned through completed courses.
        </p>
      </div>

      {certs.length === 0 ? (
        <div className="card p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <FiAward size={28} className="text-amber-400"/>
          </div>
          <h3 className="font-black text-lg mb-1" style={{ color: "var(--text-primary)" }}>No Certificates Yet</h3>
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>Complete 100% of any course's lessons to unlock and generate a certificate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map(cert => (
            <div key={cert._id} className="card p-6 flex flex-col justify-between border border-amber-100 dark:border-amber-950/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <FiCheckCircle size={10}/> Verifiable
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-mono">{cert.uniqueCode}</span>
                </div>
                <h4 className="font-black text-lg leading-snug mb-1" style={{ color: "var(--text-primary)" }}>
                  {cert.courseId?.title || "LMS Course"}
                </h4>
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                  Issued on: {new Date(cert.issuedDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3 mt-4 border-t pt-4" style={{ borderColor: "var(--border-soft)" }}>
                <button
                  onClick={() => handleDownload(cert)}
                  className="flex-1 btn-ripple py-2 rounded-xl text-white text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center gap-1.5 shadow"
                >
                  <FiDownload size={13}/> Download PDF
                </button>
                <button
                  onClick={() => handleShare(cert)}
                  className="px-3 py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[var(--surface-alt)] transition"
                  style={{ borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
                >
                  <FiShare2 size={13}/> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
