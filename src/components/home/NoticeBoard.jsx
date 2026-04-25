import { useEffect, useState } from "react"
import API from "../../services/api"

export default function NoticeBoard() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get("/announcements")
      .then((r) => setNotices(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && notices.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 transition-colors duration-500">
      <div className="
        rounded-3xl p-8 md:p-10
        bg-[var(--surface-alt)] dark:bg-[var(--surface-alt)]
        border border-[var(--primary)]/12 dark:border-[var(--primary)]/25
        shadow-lg dark:shadow-[var(--primary)]/10
      ">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl grad-bg flex items-center justify-center text-white text-xl shadow-lg shadow-[var(--primary)]/30">
            📢
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">
            Announcements
          </h2>
          <span className="ml-auto text-xs text-[var(--primary)] dark:text-[var(--accent)] bg-[var(--primary)]/10 px-3 py-1 rounded-full font-medium">
            Latest
          </span>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-2xl border bg-white dark:bg-[var(--surface)] border-[var(--primary)]/10 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          /* Cards */
          <div className="grid md:grid-cols-3 gap-5">
            {notices.map((n) => (
              <div
                key={n._id}
                className={`
                  group relative p-5 rounded-2xl border overflow-hidden
                  transition-all duration-300 hover:-translate-y-1
                  ${n.priority
                    ? "bg-[var(--accent)]/08 border-[var(--accent)]/25 dark:bg-[var(--accent)]/05 dark:border-[var(--accent)]/20"
                    : "bg-white dark:bg-[var(--surface)] border-[var(--primary)]/10 dark:border-[var(--primary)]/20"
                  }
                  hover:shadow-xl hover:shadow-[var(--primary)]/10
                `}
              >
                {/* Glow on priority */}
                {n.priority && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent)]/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="text-2xl mb-3">{n.icon || "📢"}</div>
                <h3 className={`font-bold mb-1.5 text-sm ${n.priority ? "text-[var(--accent)]" : "text-[var(--text-primary)] dark:text-white"}`}>
                  {n.title}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--text-muted)] dark:text-[var(--accent)]">
                  {n.text}
                </p>
                {n.priority && (
                  <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
                    Priority
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
