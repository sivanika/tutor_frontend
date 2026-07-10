import { useEffect, useState } from "react"
import API from "../../../services/api"
import socket from "../../../services/socket"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from "chart.js"
import {
  FiTrendingUp, FiClock, FiCheckCircle, FiTarget, FiAward,
  FiStar, FiZap, FiSun, FiLock, FiBook, FiCalendar
} from "react-icons/fi"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

/* ── Circular progress ring ── */
function Ring({ pct, size = 100, stroke = 9, children }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,.06)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB"/>
            <stop offset="100%" stopColor="#8B5CF6"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

export default function ProgressTab() {
  const [sessions, setSessions] = useState([])
  const [certs,    setCerts]    = useState([])
  const [loading, setLoading]   = useState(true)
  const [period, setPeriod]     = useState("Weekly")

  const fetchData = async () => {
    try {
      setLoading(true)
      const [sRes, cRes] = await Promise.all([
        API.get("/sessions/enrolled"),
        API.get("/lms/certificates/my").catch(() => ({ data: { certificates: [] } })),
      ])
      setSessions(sRes.data)
      setCerts(cRes.data.certificates || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchData()
    socket.connect(); socket.on("dashboard:update", fetchData)
    return () => { socket.off("dashboard:update", fetchData) }
  }, [])

  const now              = new Date()
  const completed        = sessions.filter(s => new Date(`${s.date} ${s.time}`) <= now)
  const upcoming         = sessions.filter(s => new Date(`${s.date} ${s.time}`) > now)
  const completionPct    = sessions.length ? Math.round((completed.length / sessions.length) * 100) : 0
  const avgScore         = 80 + (completed.length % 10)
  const hoursLearned     = (completed.length * 1.5).toFixed(1)

  /* Subject chart */
  const subMap = { Mathematics: 0, "Computer Science": 0, Physics: 0, Other: 0 }
  sessions.forEach(s => {
    const t = s.title.toLowerCase()
    if (t.includes("math") || t.includes("algebra")) subMap["Mathematics"]++
    else if (t.includes("python") || t.includes("data") || t.includes("algorithm")) subMap["Computer Science"]++
    else if (t.includes("physics")) subMap["Physics"]++
    else subMap["Other"]++
  })

  const chartData = {
    labels: Object.keys(subMap),
    datasets: [{
      label: "Sessions",
      data: Object.values(subMap),
      backgroundColor: ["rgba(37,99,235,.8)", "rgba(139,92,246,.8)", "rgba(34,197,94,.8)", "rgba(245,158,11,.8)"],
      borderRadius: 10, borderSkipped: false,
    }],
  }

  const ACHIEVEMENTS = [
    { title: "Consistent Learner", desc: "Complete 5 sessions",      unlocked: completed.length >= 5,  icon: FiStar,  color: "from-yellow-400 to-orange-400" },
    { title: "Session Champion",   desc: "Complete 10 sessions",     unlocked: completed.length >= 10, icon: FiAward, color: "from-blue-400 to-cyan-500" },
    { title: "Learning Star",      desc: "Complete 20 sessions",     unlocked: completed.length >= 20, icon: FiZap,   color: "from-orange-400 to-red-400" },
    { title: "Early Bird",         desc: "Attend 3 morning sessions", unlocked: completed.filter(s => s.time?.includes("AM")).length >= 3, icon: FiSun, color: "from-sky-400 to-blue-500" },
  ]

  const GOALS = [
    { title: "Complete Linear Algebra",   progress: Math.min(completionPct, 100),             color: "from-blue-500 to-indigo-500" },
    { title: "Master Python Programming", progress: Math.min(40 + completed.length * 5, 100), color: "from-violet-500 to-purple-500" },
    { title: "Improve Algorithms",        progress: Math.min(50 + completed.length * 3, 100), color: "from-rose-500 to-pink-500" },
  ]

  const STAT_CARDS = [
    { label: "Course Completion", value: `${completionPct}%`, icon: FiTrendingUp, grad: "from-blue-500 to-indigo-600",   bg: "bg-blue-50",   tc: "text-blue-600" },
    { label: "Average Score",     value: `${avgScore}%`,      icon: FiStar,       grad: "from-violet-500 to-purple-600", bg: "bg-violet-50", tc: "text-violet-600" },
    { label: "Sessions Completed", value: completed.length,    icon: FiCheckCircle, grad: "from-green-400 to-emerald-500", bg: "bg-green-50", tc: "text-green-600" },
    { label: "Hours Learned",     value: `${hoursLearned}h`,  icon: FiClock,      grad: "from-amber-400 to-yellow-500",  bg: "bg-amber-50",  tc: "text-amber-600" },
  ]

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="animate-spin w-12 h-12 rounded-full border-4 border-[var(--primary)] border-t-transparent"/>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading your progress…</p>
    </div>
  )

  if (sessions.length === 0) return (
    <div className="card p-12 text-center animate-fadeIn max-w-md mx-auto mt-16">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
        <FiTrendingUp size={36} className="text-white"/>
      </div>
      <h3 className="text-xl font-black mb-2" style={{ color: "var(--text-primary)" }}>No Progress Yet</h3>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Start enrolling in sessions to track your learning journey and earn achievements!
      </p>
    </div>
  )

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl" style={{ background: "var(--grad-hero)" }}>
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #A78BFA, transparent)" }}/>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-blue-200 text-sm mb-1">Your Learning Journey</p>
            <h2 className="text-2xl font-black mb-1">My Progress Overview</h2>
            <p className="text-blue-100/80 text-sm">
              You've completed <span className="text-white font-black">{completed.length} sessions</span> and earned{" "}
              <span className="text-purple-200 font-black">{ACHIEVEMENTS.filter(a => a.unlocked).length} achievements</span>.
            </p>
            {/* Period selector */}
            <div className="flex gap-2 mt-4">
              {["Daily","Weekly","Monthly","Yearly"].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${period === p ? "bg-white text-blue-700 shadow" : "bg-white/15 text-white/70 hover:bg-white/25"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <Ring pct={completionPct} size={110} stroke={10}>
            <span className="text-white font-black text-xl">{completionPct}%</span>
            <span className="text-blue-200 text-[10px]">Done</span>
          </Ring>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, grad, bg, tc }, i) => (
          <div key={label} className={`card card-lift p-5 animate-slideUp delay-${(i+1)*100}`}>
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className={tc}/>
            </div>
            <div className="text-3xl font-black mb-0.5" style={{ color: "var(--text-primary)" }}>{value}</div>
            <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{label}</div>
            <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${grad}`}/>
          </div>
        ))}
      </div>

      {/* ── Chart + Achievements ── */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Bar Chart */}
        <div className="card p-6">
          <h3 className="font-bold mb-1 text-sm" style={{ color: "var(--text-primary)" }}>Subject Performance</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Sessions per subject</p>
          <div className="h-56">
            <Bar data={chartData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1e293b", padding: 10, cornerRadius: 8 } },
              scales: {
                y: { beginAtZero: true, grid: { color: "rgba(0,0,0,.04)" }, ticks: { color: "#9ca3af", font: { size: 11 } } },
                x: { grid: { display: false }, ticks: { color: "#9ca3af", font: { size: 11 } } },
              },
            }}/>
          </div>
        </div>

        {/* Achievements */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Achievements</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">
              {ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length} Earned
            </span>
          </div>
          <div className="space-y-2.5">
            {ACHIEVEMENTS.map((a, i) => {
              const Icon = a.icon
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  a.unlocked ? "bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-sm" : "opacity-50"
                }`} style={{ border: a.unlocked ? undefined : "1px solid var(--border-soft)" }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    a.unlocked ? `bg-gradient-to-br ${a.color}` : "bg-gray-100"
                  }`}>
                    {a.unlocked ? <Icon size={18} className="text-white"/> : <FiLock size={15} className="text-gray-400"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{a.title}</h4>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{a.desc}</p>
                  </div>
                  {a.unlocked && (
                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">Earned</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Goals + Certificates ── */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Goals */}
        <div className="card p-6">
          <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Learning Goals</h3>
          <div className="space-y-5">
            {GOALS.map((g, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{g.title}</h4>
                  <span className="text-sm font-black" style={{ color: "var(--text-primary)" }}>{g.progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                  <div className={`h-full rounded-full bg-gradient-to-r ${g.color} progress-bar-fill`} style={{ width: `${g.progress}%` }}/>
                </div>
                <div className="flex justify-between mt-1.5 text-xs" style={{ color: "var(--text-light)" }}>
                  <span>{g.progress < 30 ? "Just started" : g.progress < 70 ? "In progress" : "Almost there!"}</span>
                  <span>{100 - g.progress}% remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>LMS Certificates</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
              {certs.length} earned
            </span>
          </div>
          {certs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FiAward size={32} style={{ color: "var(--text-light)" }} className="mb-2"/>
              <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>No certificates yet</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-light)" }}>Finish any course to 100% to earn yours.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certs.map(c => (
                <div key={c._id} className="flex items-center justify-between p-3.5 rounded-xl border hover:shadow-sm transition"
                  style={{ border: "1px solid var(--border-soft)", background: "var(--surface-alt)" }}>
                  <div>
                    <h4 className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>{c.courseId?.title}</h4>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Code: <code className="font-mono">{c.uniqueCode}</code>
                    </p>
                    <p className="text-[9px] mt-1" style={{ color: "var(--text-light)" }}>
                      Issued: {new Date(c.issuedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const w = window.open("", "_blank")
                      w.document.write(`<html><head><title>Certificate – ${c.courseId?.title}</title></head><body style="display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f3f4f6;font-family:system-ui">
                        <div style="width:800px;padding:48px;background:#fff;border:12px solid #1e3a8a;border-radius:8px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.15)">
                          <div style="font-size:22px;font-weight:900;color:#1e3a8a;letter-spacing:2px;text-transform:uppercase;margin-bottom:32px">VishidhAcademy</div>
                          <div style="font-size:12px;letter-spacing:6px;color:#9ca3af;text-transform:uppercase;font-weight:700">Certificate of Completion</div>
                          <div style="font-size:42px;font-weight:900;color:#111;margin:24px 0 8px">Student Learner</div>
                          <div style="font-size:14px;color:#4b5563;margin-bottom:32px">for successfully completing<br><b>${c.courseId?.title}</b></div>
                          <div style="font-family:monospace;font-size:11px;color:#9ca3af">Verification: ${c.uniqueCode}</div>
                        </div></body></html>`)
                      w.document.close(); w.print()
                    }}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
