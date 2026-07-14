import { useEffect, useState, useRef } from "react"
import API from "../../services/api"
import {
  FiBell, FiAlertTriangle, FiAward, FiInfo,
  FiCalendar, FiCheckCircle, FiStar, FiZap,
  FiTarget, FiArrowRight, FiChevronLeft, FiChevronRight, FiX
} from "react-icons/fi"
import { SlRocket } from "react-icons/sl"

/* ── Icon map ── */
const ICON_MAP = {
  "📢": FiBell,
  "⚠️": FiAlertTriangle,
  "🚀": SlRocket,
  "🏆": FiAward,
  "📌": FiTarget,
  "🎉": FiZap,
  "💡": FiInfo,
  "🔔": FiBell,
  "📅": FiCalendar,
  "✅": FiCheckCircle,
  "⭐": FiStar,
}

/* ── Card colour palette ── */
const CARD_PALETTE = [
  { from: "#1E9E8C", to: "#0d6e62", light: "rgba(30,158,140,0.10)" },
  { from: "#2A4D6E", to: "#1a3248", light: "rgba(42,77,110,0.10)"  },
  { from: "#7c3aed", to: "#5b21b6", light: "rgba(124,58,237,0.10)" },
  { from: "#d97706", to: "#b45309", light: "rgba(217,119,6,0.10)"  },
  { from: "#db2777", to: "#9d174d", light: "rgba(219,39,119,0.10)" },
]

/* ── strip emojis from a string ── */
function cleanText(str = "") {
  return str
    .replace(/[\u{1F300}-\u{1FAFF}✅☑️✔️☑📌📢🔔📅💡⭐🏆]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}

/* ── short preview (~110 chars) ── */
function preview(str) {
  const s = cleanText(str)
  const first = s.split(/[.!?]\s/)[0] || s
  return first.length > 110 ? first.slice(0, 107) + "…" : first
}

/* ── format date ── */
function fmtDate(ts) {
  return new Date(ts || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  })
}

/* ────────────────────────────────
   Detail Modal
──────────────────────────────── */
function DetailModal({ notice, colors, onClose }) {
  const IconComp = ICON_MAP[notice.icon] || FiBell

  /* close on Escape */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const fullText = cleanText(notice.text)

  return (
    <div className="ndm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ndm-panel" role="dialog" aria-modal="true">

        {/* Gradient header */}
        <div className="ndm-header" style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
          <div className="ndm-header-icon">
            <IconComp size={22} />
          </div>
          <div className="ndm-header-text">
            <h2 className="ndm-title">{notice.title}</h2>
            <span className="ndm-date">
              <FiCalendar size={11} style={{ display: "inline", marginRight: 4 }} />
              {fmtDate(notice.createdAt)}
            </span>
          </div>
          {notice.priority && (
            <span className="ndm-priority-badge">
              <span className="ndm-priority-dot" /> Priority
            </span>
          )}
          <button className="ndm-close" onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="ndm-body">
          {fullText.split("\n").map((line, i) =>
            line.trim() ? <p key={i} className="ndm-paragraph">{line.trim()}</p> : null
          )}
        </div>

        {/* Footer */}
        <div className="ndm-footer">
          <button className="ndm-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────
   Skeleton Card
──────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="notice-skeleton-card">
      <div className="notice-skeleton-icon" />
      <div className="notice-skeleton-line wide" />
      <div className="notice-skeleton-line" />
      <div className="notice-skeleton-line narrow" />
    </div>
  )
}

/* ────────────────────────────────
   Single Notice Card
──────────────────────────────── */
function NoticeCard({ n, palette, index, onOpen }) {
  const IconEl = ICON_MAP[n.icon] || FiBell
  const colors = palette[index % palette.length]

  return (
    <article
      className="notice-card"
      style={{ "--card-from": colors.from, "--card-to": colors.to, "--card-light": colors.light }}
    >
      <div className="notice-card-bar" />

      {/* Icon + Priority */}
      <div className="notice-card-top">
        <span className="notice-icon-wrap"><IconEl size={18} /></span>
        {n.priority && (
          <span className="notice-priority-badge">
            <span className="notice-priority-dot" />
            Priority
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="notice-card-title">{n.title}</h3>

      {/* Preview */}
      <p className="notice-card-text">{preview(n.text)}</p>

      {/* Footer */}
      <div className="notice-card-footer">
        <span className="notice-date">
          <FiCalendar size={11} />
          {fmtDate(n.createdAt)}
        </span>
        <button
          className="notice-read-more"
          aria-label="View full details"
          title="View full details"
          onClick={() => onOpen(n, colors)}
        >
          <FiArrowRight size={13} />
        </button>
      </div>
    </article>
  )
}

/* ────────────────────────────────
   Main Export
──────────────────────────────── */
export default function NoticeBoard() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(0)
  const [detail, setDetail]   = useState(null)   // { notice, colors }
  const trackRef              = useRef(null)

  const PER_PAGE = 3

  useEffect(() => {
    API.get("/announcements")
      .then((r) => setNotices(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && notices.length === 0) return null

  const totalPages = Math.ceil(notices.length / PER_PAGE)
  const visible    = notices.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  const prev = () => setPage((p) => Math.max(0, p - 1))
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1))

  return (
    <>
      {/* ── Scoped CSS ── */}
      <style>{`
        /* Section */
        .notice-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem 5rem;
        }

        /* Header */
        .notice-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .notice-header-icon {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 0.875rem;
          background: linear-gradient(135deg, #1E9E8C, #2A4D6E);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.1rem;
          box-shadow: 0 6px 20px rgba(30,158,140,0.35);
          flex-shrink: 0;
        }
        .notice-header-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary, #0f172a);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .dark .notice-header-title { color: #f1f5f9; }
        .notice-header-sub {
          font-size: 0.8rem;
          color: var(--text-muted, #64748b);
          margin-top: 0.2rem;
          font-weight: 500;
        }
        .notice-badge {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .notice-badge-pill {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #1E9E8C;
          background: rgba(30,158,140,0.1);
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
          border: 1px solid rgba(30,158,140,0.2);
        }
        .notice-nav-btn {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 1.5px solid rgba(30,158,140,0.3);
          background: transparent;
          color: #1E9E8C;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .notice-nav-btn:hover:not(:disabled) {
          background: #1E9E8C;
          color: #fff;
          border-color: #1E9E8C;
        }
        .notice-nav-btn:disabled { opacity: 0.3; cursor: default; }

        /* Grid */
        .notice-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        @media (min-width: 1024px) {
          .notice-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* Card */
        .notice-card {
          position: relative;
          border-radius: 1.25rem;
          padding: 1.5rem;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .dark .notice-card {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.08);
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
        }
        .notice-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.1);
        }
        .dark .notice-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.4); }

        .notice-card-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--card-from), var(--card-to));
          border-radius: 1.25rem 1.25rem 0 0;
        }
        .notice-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.25rem;
        }
        .notice-icon-wrap {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.625rem;
          background: var(--card-light);
          color: var(--card-from);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .notice-priority-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #dc2626;
          background: rgba(220,38,38,0.08);
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
          border: 1px solid rgba(220,38,38,0.2);
        }
        .notice-priority-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #dc2626;
          animation: notice-pulse 1.4s infinite;
        }
        @keyframes notice-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        .notice-card-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary, #0f172a);
          line-height: 1.4;
          margin: 0;
        }
        .dark .notice-card-title { color: #f1f5f9; }
        .notice-card-text {
          font-size: 0.8rem;
          color: var(--text-muted, #64748b);
          line-height: 1.65;
          margin: 0;
          flex: 1;
        }
        .dark .notice-card-text { color: #94a3b8; }
        .notice-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(0,0,0,0.05);
        }
        .dark .notice-card-footer { border-top-color: rgba(255,255,255,0.07); }
        .notice-date {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .notice-read-more {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          border: 1.5px solid var(--card-from);
          background: transparent;
          color: var(--card-from);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .notice-read-more:hover {
          background: var(--card-from);
          color: #fff;
          transform: scale(1.1);
        }

        /* Dots */
        .notice-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 2rem;
        }
        .notice-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #cbd5e1;
          transition: all 0.3s;
          cursor: pointer;
          border: none; padding: 0;
        }
        .notice-dot.active {
          width: 20px;
          border-radius: 3px;
          background: #1E9E8C;
        }

        /* Skeleton */
        .notice-skeleton-card {
          border-radius: 1.25rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: notice-shimmer 1.5s infinite linear;
        }
        @keyframes notice-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .notice-skeleton-icon {
          width: 2.25rem; height: 2.25rem;
          border-radius: 0.625rem;
          background: rgba(0,0,0,0.07);
        }
        .notice-skeleton-line {
          height: 0.75rem;
          border-radius: 0.5rem;
          background: rgba(0,0,0,0.07);
          width: 90%;
        }
        .notice-skeleton-line.wide   { width: 80%; height: 0.9rem; }
        .notice-skeleton-line.narrow { width: 50%; }

        /* ── Detail Modal ── */
        .ndm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: ndm-fade-in 0.2s ease;
        }
        @keyframes ndm-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ndm-panel {
          background: #fff;
          border-radius: 1.5rem;
          width: 100%;
          max-width: 580px;
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.25);
          animation: ndm-slide-up 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .dark .ndm-panel {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.08);
        }
        @keyframes ndm-slide-up {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Modal header */
        .ndm-header {
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          flex-shrink: 0;
          color: #fff;
          position: relative;
        }
        .ndm-header-icon {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 0.875rem;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          backdrop-filter: blur(4px);
        }
        .ndm-header-text { flex: 1; min-width: 0; }
        .ndm-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.35;
          margin: 0 0 0.35rem;
        }
        .ndm-date {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .ndm-priority-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          background: rgba(255,255,255,0.2);
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.35);
          flex-shrink: 0;
          align-self: flex-start;
        }
        .ndm-priority-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #fff;
          animation: notice-pulse 1.4s infinite;
        }
        .ndm-close {
          position: absolute;
          top: 1rem; right: 1rem;
          width: 2rem; height: 2rem;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .ndm-close:hover { background: rgba(255,255,255,0.35); }

        /* Modal body */
        .ndm-body {
          padding: 1.75rem;
          overflow-y: auto;
          flex: 1;
        }
        .ndm-paragraph {
          font-size: 0.88rem;
          color: #334155;
          line-height: 1.8;
          margin: 0 0 0.9rem;
        }
        .dark .ndm-paragraph { color: #cbd5e1; }
        .ndm-paragraph:last-child { margin-bottom: 0; }

        /* Modal footer */
        .ndm-footer {
          padding: 1rem 1.75rem;
          border-top: 1px solid rgba(0,0,0,0.06);
          display: flex;
          justify-content: flex-end;
          flex-shrink: 0;
        }
        .dark .ndm-footer { border-top-color: rgba(255,255,255,0.07); }
        .ndm-close-btn {
          padding: 0.55rem 1.5rem;
          border-radius: 0.75rem;
          background: #f1f5f9;
          color: #475569;
          font-size: 0.82rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ndm-close-btn:hover { background: #e2e8f0; }
        .dark .ndm-close-btn { background: rgba(255,255,255,0.07); color: #94a3b8; }
        .dark .ndm-close-btn:hover { background: rgba(255,255,255,0.12); }
      `}</style>

      {/* ── Detail modal ── */}
      {detail && (
        <DetailModal
          notice={detail.notice}
          colors={detail.colors}
          onClose={() => setDetail(null)}
        />
      )}

      <section className="notice-section">

        {/* Header */}
        <div className="notice-header">
          <div className="notice-header-icon">
            <FiBell size={18} />
          </div>
          <div>
            <div className="notice-header-title">Announcements</div>
            <div className="notice-header-sub">
              {loading ? "Loading…" : `${notices.length} active notice${notices.length !== 1 ? "s" : ""}`}
            </div>
          </div>
          <div className="notice-badge">
            <span className="notice-badge-pill">Latest</span>
            {!loading && totalPages > 1 && (
              <>
                <button className="notice-nav-btn" onClick={prev} disabled={page === 0} aria-label="Previous">
                  <FiChevronLeft size={14} />
                </button>
                <button className="notice-nav-btn" onClick={next} disabled={page === totalPages - 1} aria-label="Next">
                  <FiChevronRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="notice-grid">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="notice-grid" ref={trackRef}>
            {visible.map((n, i) => {
              const globalIdx = page * PER_PAGE + i
              const colors = CARD_PALETTE[globalIdx % CARD_PALETTE.length]
              return (
                <NoticeCard
                  key={n._id}
                  n={n}
                  palette={CARD_PALETTE}
                  index={globalIdx}
                  onOpen={(notice, col) => setDetail({ notice, colors: col })}
                />
              )
            })}
          </div>
        )}

        {/* Pagination dots */}
        {!loading && totalPages > 1 && (
          <div className="notice-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`notice-dot${i === page ? " active" : ""}`}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
