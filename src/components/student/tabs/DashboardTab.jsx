import { useEffect, useState, useRef } from "react"
import API from "../../../services/api"
import socket from "../../../services/socket"
import { useAuth } from "../../../context/AuthContext"
import {
  FiBook, FiClock, FiCheckCircle, FiArrowUpRight, FiCalendar,
  FiVideo, FiExternalLink, FiSearch, FiAlertCircle, FiZap,
  FiBookOpen, FiAward, FiStar, FiTarget, FiTrendingUp, FiPlay
} from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS, LineElement, PointElement,
  LinearScale, CategoryScale, Tooltip, Legend, Filler,
} from "chart.js"

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler)

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good Morning"
  if (h < 17) return "Good Afternoon"
  return "Good Evening"
}

/* ── Animated counter ── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 30)
    const id = setInterval(() => {
      start = Math.min(start + step, target)
      setVal(start)
      if (start >= target) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [target])
  return <span>{val}{suffix}</span>
}

/* ── Activity calendar (GitHub style) ── */
function ActivityCalendar({ sessions }) {
  const weeks = 16
  const days  = 7
  const today = new Date()

  const activityMap = {}
  sessions.forEach(s => {
    const d = new Date(s.date)
    const key = d.toDateString()
    activityMap[key] = (activityMap[key] || 0) + 1
  })

  const cells = []
  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < days; d++) {
      const date = new Date(today)
      date.setDate(today.getDate() - w * 7 - (days - 1 - d))
      const count = activityMap[date.toDateString()] || 0
      const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 3 ? 3 : 4
      cells.push({ date, level })
    }
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-1 min-w-max">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: days }).map((_, d) => {
              const cell = cells[w * days + d]
              return (
                <div
                  key={d}
                  title={`${cell.date.toLocaleDateString()} – ${activityMap[cell.date.toDateString()] || 0} sessions`}
                  className={`activity-cell ${cell.level > 0 ? `activity-l${cell.level}` : ""}`}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardTab({ onTabChange }) {
  const [sessions, setSessions]           = useState([])
  const [subscription, setSubscription]   = useState(null)
  const [stats, setStats]                 = useState(null)
  const [lastActive, setLastActive]       = useState(null)
  const [loading, setLoading]             = useState(true)
  const { user }  = useAuth()
  const navigate  = useNavigate()

  const fetchSubscription = async () => {
    try { const r = await API.get("/payment/subscription"); setSubscription(r.data) } catch {}
  }
  const fetchSessions = async () => {
    try {
      const r = await API.get("/sessions/enrolled")
      setSessions(r.data)
    } catch (e) { console.error(e) }
  }
  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const r = await API.get("/lms/dashboard/stats")
      setStats(r.data.stats)
      setLastActive(r.data.lastActive)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    const handleUpdate = () => {
      fetchSessions()
      fetchSubscription()
      fetchDashboardStats()
    }
    handleUpdate()
    socket.connect()
    socket.on("dashboard:update", handleUpdate)
    return () => {
      socket.off("dashboard:update", handleUpdate)
    }
  }, [])

  const now              = new Date()
  const upcoming         = sessions.filter(s => s.myStatus === "enrolled" && new Date(`${s.date} ${s.time}`) > now)
  const completed        = sessions.filter(s => s.myStatus === "completed")
  const nameDisplay      = user?.name || user?.email?.split("@")[0] || "Student"
  const completionPct    = sessions.length ? Math.round((completed.length / sessions.length) * 100) : 78

  const STATS = [
    { label: "Total Courses",      value: stats?.totalCourses || 0, suffix: "",    icon: "📚", sub: "Enrolled",       grad: "from-blue-500 to-indigo-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { label: "Completed Courses",  value: stats?.completed || 0, suffix: "",    icon: "🏆", sub: "Finished",       grad: "from-green-500 to-emerald-600", bg: "bg-green-50 dark:bg-green-950/40" },
    { label: "In Progress Courses",value: stats?.inProgress || 0, suffix: "",    icon: "⚡", sub: "Active learning", grad: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
    { label: "Upcoming Live Sessions", value: upcoming.length || 0, suffix: "", icon: "🎯", sub: "Scheduled class", grad: "from-purple-500 to-indigo-600", bg: "bg-purple-50 dark:bg-purple-950/40" },
    { label: "Certificates Earned",value: stats?.certificates || 0, suffix: "",  icon: "🏅", sub: "Verifiable PDF",  grad: "from-rose-500 to-pink-500", bg: "bg-rose-50 dark:bg-rose-950/40" },
    { label: "Learning Hours",     value: stats?.learningHours || 0, suffix: "h",icon: "⏱", sub: "Total watch time", grad: "from-teal-500 to-cyan-500", bg: "bg-teal-50 dark:bg-teal-950/40" },
    { label: "Assignments",        value: stats?.assignments?.total || 0,           suffix: "",  icon: "📋", sub: `${stats?.assignments?.pending || 0} Pending`,      grad: "from-violet-500 to-purple-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
    { label: "Quizzes",            value: stats?.quizzes?.passed || 0,              suffix: "",  icon: "🔥", sub: `${stats?.quizzes?.attempts || 0} Attempts`,         grad: "from-yellow-500 to-amber-500", bg: "bg-yellow-50 dark:bg-yellow-950/40" },
    { label: "Attendance",         value: stats?.attendance || 0,                   suffix: "%", icon: "📈", sub: stats?.attendance >= 90 ? "Excellent" : "Needs Improvement", grad: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  ]

  const ACHIEVEMENTS = [
    { emoji: "🏅", title: "First Course",  unlocked: true },
    { emoji: "🔥", title: "7-Day Streak",  unlocked: true },
    { emoji: "🎯", title: "100 Lessons",   unlocked: completed.length >= 5 },
    { emoji: "⭐", title: "Quiz Master",   unlocked: completed.length >= 10 },
    { emoji: "🏆", title: "Top Learner",   unlocked: completed.length >= 20 },
  ]

  const DAILY_GOALS = [
    { label: "Watch 2 Lessons",    done: true },
    { label: "Complete Quiz",      done: completed.length > 0 },
    { label: "Submit Assignment",  done: false },
  ]

  const progressData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
    datasets: [{
      label: "Progress",
      data: [18, 35, 42, 60, 68, 75, completionPct],
      borderColor: "#2563EB",
      backgroundColor: "rgba(37,99,235,0.08)",
      tension: 0.45, fill: true,
      pointBackgroundColor: "#2563EB",
      pointRadius: 4, pointHoverRadius: 6,
    }],
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-10 h-10 rounded-full border-4 border-[var(--primary)] border-t-transparent"/>
    </div>
  )

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ══ HERO SECTION ══ */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl" style={{ background: "var(--grad-hero)", minHeight: 200 }}>
        {/* Floating blobs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full opacity-20 animate-blob"
          style={{ background: "radial-gradient(circle, #A78BFA, transparent)" }}/>
        <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full opacity-15 animate-float2"
          style={{ background: "radial-gradient(circle, #60A5FA, transparent)" }}/>
        <div className="absolute top-4 right-1/4 w-24 h-24 rounded-full opacity-20 animate-float"
          style={{ background: "radial-gradient(circle, #F472B6, transparent)" }}/>

        <div className="relative z-10 p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">{getGreeting()} 👋</p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{nameDisplay}</h2>
            <p className="text-blue-100/80 text-sm mb-5">Continue your learning journey today.</p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100 text-xs font-semibold">Overall Course Progress</span>
                <span className="text-white font-black text-sm">{completionPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-300 to-purple-300 progress-bar-fill"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            {/* Daily goals */}
            <div className="space-y-1.5 mb-5">
              <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">Today's Goals</p>
              {DAILY_GOALS.map(g => (
                <div key={g.label} className="flex items-center gap-2 text-sm">
                  <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[11px] ${g.done ? "bg-green-400 text-white" : "bg-white/20 text-white/50"}`}>
                    {g.done ? "✓" : "○"}
                  </span>
                  <span className={g.done ? "text-green-200 line-through" : "text-white/80"}>{g.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onTabChange?.("courses")}
              className="btn-ripple inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-black text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <FiPlay size={14}/> Continue Learning
            </button>
          </div>

          {/* Right: circular progress */}
          <div className="hidden md:flex flex-col items-center justify-center gap-3">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-36 h-36 -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10"/>
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke="url(#heroGrad)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionPct / 100)}`}
                  style={{ transition: "stroke-dashoffset 1.5s ease" }}
                />
                <defs>
                  <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA"/>
                    <stop offset="100%" stopColor="#C084FC"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-black text-2xl">{completionPct}%</span>
                <span className="text-blue-200 text-xs">Complete</span>
              </div>
            </div>
            <div className="flex gap-2">
              {[{ v: sessions.length || 8, l: "Courses" }, { v: completed.length, l: "Done" }, { v: 12, l: "Day Streak" }].map(it => (
                <div key={it.l} className="text-center bg-white/10 rounded-xl px-3 py-2">
                  <div className="text-white font-black text-lg leading-none">{it.v}</div>
                  <div className="text-blue-200 text-[10px] mt-0.5">{it.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ CONTINUE LEARNING SECTION ══ */}
      {lastActive && (
        <div className="card p-5 border border-[var(--primary)]/15 relative overflow-hidden bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-8 -mt-8 pointer-events-none"/>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white shrink-0 shadow">
                📚
              </div>
              <div>
                <span className="text-[9px] font-black tracking-widest text-blue-600 uppercase bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                  Continue Learning
                </span>
                <h3 className="font-black text-sm mt-1" style={{ color: "var(--text-primary)" }}>
                  {lastActive.courseId?.title}
                </h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {lastActive.courseId?.subject} · Instructor: {lastActive.courseId?.instructor || "Academy Team"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="w-28 shrink-0">
                <div className="flex justify-between text-[10px] font-black mb-1" style={{ color: "var(--text-muted)" }}>
                  <span>PROGRESS</span>
                  <span>{lastActive.progressPercentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${lastActive.progressPercentage}%` }}/>
                </div>
              </div>
              <button
                onClick={() => navigate(`/courses/${lastActive.courseId?._id}/learn`)}
                className="btn-ripple px-4 py-2 rounded-xl text-white text-xs font-black bg-gradient-to-r from-blue-500 to-indigo-600 shadow hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ STAT CARDS ══ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {STATS.map(({ label, value, suffix, icon, sub, grad, bg }, i) => (
          <div
            key={label}
            className={`card card-lift p-5 animate-slideUp delay-${(i + 1) * 50} cursor-pointer`}
            onClick={() => {}}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center text-xl`}>
                {icon}
              </div>
            </div>
            <div className="text-3xl font-black mb-0.5" style={{ color: "var(--text-primary)" }}>
              <Counter target={value} suffix={suffix}/>
            </div>
            <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{label}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{sub}</div>
            <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${grad}`}/>
          </div>
        ))}
      </div>

      {/* ══ SUBSCRIPTION BANNER ══ */}
      {subscription?.subscriptionPlan && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                <FiZap size={16} className="text-violet-600"/>
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                  {subscription.subscriptionPlan.name} Plan
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Active · Expires {subscription.subscriptionExpiryDate
                    ? new Date(subscription.subscriptionExpiryDate).toLocaleDateString("en-IN")
                    : "N/A"}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/payment")}
              className="text-xs font-bold text-white px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:shadow-md transition"
            >
              Upgrade ↗
            </button>
          </div>
          <div className="space-y-3">
            {subscription.subscriptionPlan.maxSessions != null && (
              <ProgressRow
                label="Sessions Booked"
                used={subscription.currentPlanSessionsBooked}
                max={subscription.subscriptionPlan.maxSessions}
                color="from-blue-500 to-indigo-500"
              />
            )}
            {subscription.subscriptionPlan.maxProfileViews != null && (
              <ProgressRow
                label="Profiles Viewed"
                used={subscription.viewedProfessorsCount}
                max={subscription.subscriptionPlan.maxProfileViews}
                color="from-violet-500 to-purple-500"
              />
            )}
          </div>
        </div>
      )}

      {/* ══ UPCOMING SESSIONS ══ */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="card p-6">
          <SectionHeader icon={<FiCalendar className="text-blue-500"/>} title="Upcoming Sessions" badge={`${upcoming.length} scheduled`} badgeColor="bg-blue-50 text-blue-600"/>
          {upcoming.length === 0 ? (
            <EmptyState icon={<FiCalendar size={32}/>} title="No upcoming sessions" desc="Browse tutors to schedule your first session" action="Find Tutors" onAction={() => onTabChange?.("tutors")}/>
          ) : (
            <div className="space-y-2.5 mt-4">
              {upcoming.slice(0,4).map(s => <SessionRow key={s._id} session={s} type="upcoming"/>)}
            </div>
          )}
        </div>

        <div className="card p-6">
          <SectionHeader icon={<FiCheckCircle className="text-green-500"/>} title="Completed Sessions" badge={`${completed.length} done`} badgeColor="bg-green-50 text-green-600"/>
          {completed.length === 0 ? (
            <EmptyState icon={<FiCheckCircle size={32}/>} title="No completed sessions" desc="Your completed sessions will appear here"/>
          ) : (
            <div className="space-y-2.5 mt-4">
              {completed.slice(0,4).map(s => <SessionRow key={s._id} session={s} type="completed"/>)}
            </div>
          )}
        </div>
      </div>

      {/* ══ PROGRESS CHART ══ */}
      <div className="card p-6 animate-slideUp">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Learning Progress</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Your performance over time</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
            {completionPct}% overall
          </span>
        </div>
        <div className="h-48">
          <Line
            data={progressData}
            options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1e293b", padding: 10, cornerRadius: 10 } },
              scales: {
                y: { beginAtZero: true, max: 100, grid: { color: "rgba(0,0,0,.04)" }, ticks: { color: "#9ca3af", font: { size: 11 }, callback: v => `${v}%` } },
                x: { grid: { display: false }, ticks: { color: "#9ca3af", font: { size: 11 } } },
              },
            }}
          />
        </div>
      </div>

      {/* ══ ACTIVITY CALENDAR ══ */}
      <div className="card p-6">
        <SectionHeader icon={<FiTrendingUp className="text-blue-500"/>} title="Learning Activity" badge="Last 16 Weeks" badgeColor="bg-blue-50 text-blue-600"/>
        <div className="mt-4">
          <ActivityCalendar sessions={sessions}/>
          <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Less</span>
            {[0,1,2,3,4].map(l => (
              <div key={l} className={`activity-cell ${l > 0 ? `activity-l${l}` : ""}`}/>
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* ══ ACHIEVEMENTS ══ */}
      <div className="card p-6">
        <SectionHeader icon={<FiAward className="text-amber-500"/>} title="Achievements" badge={`${ACHIEVEMENTS.filter(a => a.unlocked).length}/${ACHIEVEMENTS.length} Earned`} badgeColor="bg-amber-50 text-amber-600"/>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
          {ACHIEVEMENTS.map((a, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all ${
                a.unlocked
                  ? "bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-100 hover:shadow-md hover:-translate-y-0.5"
                  : "opacity-40 grayscale"
              } cursor-default`}
              style={{ border: a.unlocked ? undefined : "1px solid var(--border-soft)" }}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-[10px] font-bold" style={{ color: "var(--text-primary)" }}>{a.title}</span>
              {a.unlocked && (
                <span className="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-bold">Earned</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Empty enrolled state */}
      {sessions.length === 0 && (
        <div className="card p-10 text-center animate-slideUp">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <FiBookOpen size={28} className="text-blue-500"/>
          </div>
          <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>No sessions enrolled yet</h3>
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>Browse available tutors and enroll in your first session!</p>
          <button
            onClick={() => onTabChange?.("tutors")}
            className="btn-ripple inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all"
            style={{ background: "var(--grad-primary)" }}
          >
            <FiSearch size={14}/> Browse Tutors
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ── */
function SectionHeader({ icon, title, badge, badgeColor }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-bold flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
        {icon}{title}
      </h3>
      {badge && <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>{badge}</span>}
    </div>
  )
}

function EmptyState({ icon, title, desc, action, onAction }) {
  return (
    <div className="text-center py-8 mt-3">
      <div className="flex justify-center mb-2 opacity-30" style={{ color: "var(--text-muted)" }}>{icon}</div>
      <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-muted)" }}>{title}</p>
      <p className="text-xs mb-3" style={{ color: "var(--text-light)" }}>{desc}</p>
      {action && (
        <button
          onClick={onAction}
          className="text-xs font-bold px-3 py-1.5 rounded-xl text-white"
          style={{ background: "var(--grad-primary)" }}
        >{action}</button>
      )}
    </div>
  )
}

function SessionRow({ session, type }) {
  const isUpcoming = type === "upcoming"
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl transition hover:bg-[var(--surface-alt)] group">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isUpcoming ? "bg-blue-50" : "bg-green-50"}`}>
        {isUpcoming
          ? <FiVideo size={14} className="text-blue-600"/>
          : <FiCheckCircle size={14} className="text-green-600"/>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-xs truncate" style={{ color: "var(--text-primary)" }}>{session.title}</p>
        <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
          {session.professor?.name} · {session.date} {session.time}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isUpcoming ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
          {isUpcoming ? "Upcoming" : "Done"}
        </span>
        {isUpcoming && session.meetLink && (
          <a href={session.meetLink} target="_blank" rel="noreferrer"
            className="p-1.5 rounded-lg bg-[var(--surface-alt)] hover:bg-blue-50 hover:text-blue-600 transition">
            <FiExternalLink size={11}/>
          </a>
        )}
      </div>
    </div>
  )
}

function ProgressRow({ label, used, max, color }) {
  const pct = Math.min(100, Math.round((used / max) * 100))
  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
        <span>{label}</span>
        <span className="font-bold">{used} / {max}</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: "var(--surface-alt)" }}>
        <div className={`h-full rounded-full bg-gradient-to-r ${color} progress-bar-fill`} style={{ width: `${pct}%` }}/>
      </div>
    </div>
  )
}
