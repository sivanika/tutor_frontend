import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  FiBell, FiAlertTriangle, FiAward, FiInfo,
  FiCalendar, FiCheckCircle, FiStar, FiZap,
  FiTarget, FiArrowRight, FiChevronLeft, FiChevronRight, FiX
} from "react-icons/fi";
import { SlRocket } from "react-icons/sl";

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
};

/* ── Card colour palette for dark aurora ── */
const CARD_PALETTE = [
  { color: "#06B6D4", glow: "rgba(6,182,212,0.3)" },
  { color: "#3B82F6", glow: "rgba(59,130,246,0.3)" },
  { color: "#8B5CF6", glow: "rgba(139,92,246,0.3)" },
  { color: "#10B981", glow: "rgba(16,185,129,0.3)" },
  { color: "#F59E0B", glow: "rgba(245,158,11,0.3)" },
];

function cleanText(str = "") {
  return str
    .replace(/[\u{1F300}-\u{1FAFF}✅☑️✔️☑📌📢🔔📅💡⭐🏆]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function preview(str) {
  const s = cleanText(str);
  const first = s.split(/[.!?]\s/)[0] || s;
  return first.length > 110 ? first.slice(0, 107) + "…" : first;
}

function fmtDate(ts) {
  return new Date(ts || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ── Detail Modal ── */
function DetailModal({ notice, paletteItem, onClose }) {
  const IconComp = ICON_MAP[notice.icon] || FiBell;

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const fullText = cleanText(notice.text);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-slideUp flex flex-col relative"
        style={{ background: "#080d1a" }}
        role="dialog"
      >
        {/* Header */}
        <div
          className="p-6 relative text-white"
          style={{ background: `linear-gradient(135deg, ${paletteItem.color}30, rgba(5,8,22,0.9))` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg"
                style={{ background: `${paletteItem.color}20`, border: `1px solid ${paletteItem.color}40`, color: paletteItem.color }}
              >
                <IconComp />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-snug">{notice.title}</h3>
                <span className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                  <FiCalendar size={11} /> {fmtDate(notice.createdAt)}
                </span>
              </div>
            </div>
            {notice.priority && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/30 flex items-center gap-1">
                <span className="live-dot" style={{ width: 5, height: 5, background: "#EF4444" }} /> Priority
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/05 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {fullText.split("\n").map((line, i) =>
            line.trim() ? (
              <p key={i} className="text-white/70 text-sm leading-relaxed">{line.trim()}</p>
            ) : null
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/08 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white/70 bg-white/05 hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState(null);

  const PER_PAGE = 3;

  useEffect(() => {
    API.get("/announcements")
      .then((r) => setNotices(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && notices.length === 0) return null;

  const totalPages = Math.ceil(notices.length / PER_PAGE);
  const visible = notices.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section className="relative py-16 overflow-hidden" style={{ background: "var(--section-bg)" }}>
      {/* Glow divider */}
      <div className="absolute top-0 left-0 right-0 h-px glow-divider" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl text-[var(--accent)]"
              style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", boxShadow: "0 0 20px rgba(6,182,212,0.2)" }}
            >
              <FiBell />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight">Announcements</h2>
              <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                {loading ? "Loading announcements..." : `${notices.length} active notice${notices.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20">
              Latest
            </span>
            {!loading && totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  disabled={page === 0}
                  className="w-9 h-9 rounded-xl border border-white/10 bg-white/04 text-white/60 hover:text-white hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-default"
                >
                  <FiChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  disabled={page === totalPages - 1}
                  className="w-9 h-9 rounded-xl border border-white/10 bg-white/04 text-white/60 hover:text-white hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-default"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-3xl border border-white/06 bg-white/02 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {visible.map((n, i) => {
              const globalIdx = page * PER_PAGE + i;
              const palette = CARD_PALETTE[globalIdx % CARD_PALETTE.length];
              const IconEl = ICON_MAP[n.icon] || FiBell;

              return (
                <article
                  key={n._id}
                  className="group relative rounded-3xl p-6 overflow-hidden flex flex-col justify-between transition-all duration-350 hover:-translate-y-1.5"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {/* Top color bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${palette.color}, transparent)` }}
                  />

                  {/* Top row */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
                        style={{
                          background: `${palette.color}15`,
                          border: `1px solid ${palette.color}30`,
                          color: palette.color,
                        }}
                      >
                        <IconEl />
                      </div>
                      {n.priority && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/25 flex items-center gap-1">
                          <span className="live-dot" style={{ width: 4, height: 4, background: "#EF4444" }} /> Priority
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-[var(--text-primary)] text-base mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="text-[var(--text-muted)] text-xs leading-relaxed line-clamp-3">
                      {preview(n.text)}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border)]">
                    <span className="text-xs text-[var(--text-light)] font-medium flex items-center gap-1">
                      <FiCalendar size={11} /> {fmtDate(n.createdAt)}
                    </span>
                    <button
                      onClick={() => setDetail({ notice: n, palette })}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                      style={{
                        background: `${palette.color}15`,
                        border: `1px solid ${palette.color}30`,
                        color: palette.color,
                      }}
                      title="View details"
                    >
                      <FiArrowRight size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination Dots */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: page === i ? "24px" : "8px",
                  height: "8px",
                  background: page === i ? "linear-gradient(90deg, #3B82F6, #06B6D4)" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detail && (
        <DetailModal
          notice={detail.notice}
          paletteItem={detail.palette}
          onClose={() => setDetail(null)}
        />
      )}
    </section>
  );
}
