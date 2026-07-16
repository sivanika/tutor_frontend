import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../../services/api"
import {
  FiClock, FiVideo, FiLayers, FiPlay, FiBookOpen, FiInbox,
  FiCalendar, FiCheckCircle, FiLoader, FiAlertCircle,
  FiStar, FiUsers, FiExternalLink, FiClipboard
} from "react-icons/fi"
import toast from "react-hot-toast"

const GRADIENTS = [
  "linear-gradient(135deg, #1E9E8C, #12283B)",
  "linear-gradient(135deg, #2A4D6E, #F2A93B)",
  "linear-gradient(135deg, #F2A93B, #1B3A54)",
  "linear-gradient(135deg, #1E9E8C, #2A4D6E)",
  "linear-gradient(135deg, #3A6389, #E86A5C)",
  "linear-gradient(135deg, #12283B, #4F7CA3)",
];

export default function MyLiveClassesTab() {
  const navigate = useNavigate()
  const [liveClasses, setLiveClasses] = useState([])
  const [loading, setLoading]         = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const r = await API.get("/payment/live-class/enrolled")
      setLiveClasses(r.data.liveClasses || [])
    } catch { 
      toast.error("Failed to load your live classes") 
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Promo banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl" style={{ background: "linear-gradient(135deg, #0D9488, #115E59)" }}>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #2DD4BF, transparent)" }}/>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black">Live Interactive cohorts</h2>
            <p className="text-teal-100 text-sm mt-1 max-w-md">
              Learn live alongside mentors and other students. Join the schedule, complete projects and interact live.
            </p>
          </div>
          <button
            onClick={() => navigate("/live-classes")}
            className="btn-ripple shrink-0 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-teal-800 font-black text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Explore Live Classes <FiExternalLink size={14}/>
          </button>
        </div>
      </div>

      {/* Live class grid */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>My Live Cohorts</h3>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : liveClasses.length === 0 ? (
          <div className="card p-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center mx-auto mb-4">
              <FiVideo size={28} className="text-teal-500"/>
            </div>
            <h3 className="font-black text-lg mb-1" style={{ color: "var(--text-primary)" }}>No Live Classes Enrolled</h3>
            <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>Browse our live cohort catalog and enroll to attend live sessions.</p>
            <button
              onClick={() => navigate("/live-classes")}
              className="btn-ripple inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-black text-sm bg-teal-600 hover:bg-teal-700 transition"
            >
              Explore Live Classes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {liveClasses.map((c, i) => {
              if (!c) return null;
              const gradient = c.gradient || GRADIENTS[i % GRADIENTS.length];
              return (
                <div key={c._id} className="card card-lift overflow-hidden flex flex-col group border dark:border-white/10 dark:bg-[var(--surface-alt)]">
                  {/* Thumbnail Banner */}
                  <div className="relative h-40 flex items-center justify-center" style={{ background: gradient }}>
                    {/* Level Badge */}
                    <span className="absolute top-3 left-3 bg-white/90 text-[#1B3A54] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {c.level}
                    </span>
                    <span className="absolute top-3 right-3 bg-teal-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Active
                    </span>
                    <FiVideo size={40} className="text-white/30 group-hover:scale-110 transition-transform duration-500"/>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1 block">
                      {c.category}
                    </span>
                    <h4 className="font-black text-base leading-snug line-clamp-2 mb-2" style={{ color: "var(--text-primary)" }}>
                      {c.title}
                    </h4>
                    
                    <p className="text-xs line-clamp-3 mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {c.shortDesc}
                    </p>

                    {/* Schedule and instructor details */}
                    <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 text-[11px] text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar size={12} className="text-teal-600 shrink-0" />
                        <span><strong>Starts:</strong> {c.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiClock size={12} className="text-teal-600 shrink-0" />
                        <span><strong>Schedule:</strong> {c.schedule}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiUsers size={12} className="text-teal-600 shrink-0" />
                        <span><strong>Instructor:</strong> {c.instructor}</span>
                      </div>
                    </div>

                    {/* CTA to join or view link */}
                    <div className="mt-auto pt-3 border-t dark:border-white/10">
                      {c.meetingLink ? (
                        <a
                          href={c.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ripple w-full py-2.5 rounded-xl font-black text-sm text-white shadow hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700"
                        >
                          <FiPlay size={13}/> Join Live on {c.platform || "Zoom"}
                        </a>
                      ) : (
                        <div className="w-full text-center text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
                          Waiting for Class Link
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
