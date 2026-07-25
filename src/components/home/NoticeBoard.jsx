import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
  FiBell, FiAlertTriangle, FiAward, FiInfo,
  FiCalendar, FiCheckCircle, FiStar, FiZap,
  FiTarget, FiArrowRight, FiChevronLeft, FiChevronRight, FiX,
  FiExternalLink, FiBookOpen, FiPlayCircle, FiDollarSign,
  FiUsers, FiTag
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

/* ── Card colour palette ── */
const CARD_PALETTE = [
  { color: "#06B6D4", glow: "rgba(6,182,212,0.3)" },
  { color: "#3B82F6", glow: "rgba(59,130,246,0.3)" },
  { color: "#8B5CF6", glow: "rgba(139,92,246,0.3)" },
  { color: "#10B981", glow: "rgba(16,185,129,0.3)" },
  { color: "#F59E0B", glow: "rgba(245,158,11,0.3)" },
];

/* ── Keyword → route mapping (fallback when no admin-set link) ── */
const KEYWORD_ROUTES = [
  { keywords: ["live class", "live-class", "cohort", "batch", "session", "live"],      route: "/live-classes",  label: "View Live Classes",  Icon: FiPlayCircle },
  { keywords: ["course", "curriculum", "module", "lesson", "certification", "program"], route: "/courses",       label: "Browse Courses",     Icon: FiBookOpen },
  { keywords: ["price", "pricing", "plan", "subscription", "fee", "offer", "discount"], route: "/pricing",       label: "View Pricing",       Icon: FiDollarSign },
  { keywords: ["blog", "article", "post", "news"],                                      route: "/blog",          label: "Read Blog",          Icon: FiInfo },
  { keywords: ["career", "job", "hiring", "vacancy", "recruit"],                        route: "/careers",       label: "View Careers",       Icon: FiUsers },
  { keywords: ["contact", "reach", "support", "help", "query"],                         route: "/contact",       label: "Contact Us",         Icon: FiUsers },
  { keywords: ["feature", "what's new", "update", "release"],                           route: "/features",      label: "See Features",       Icon: FiZap },
];

function detectRoute(notice) {
  // 1. Admin-set link takes priority
  if (notice.link?.trim()) return { route: notice.link.trim(), label: "Learn More", Icon: FiExternalLink };

  const haystack = `${notice.title} ${notice.text}`.toLowerCase();
  for (const { keywords, route, label, Icon } of KEYWORD_ROUTES) {
    if (keywords.some(kw => haystack.includes(kw))) return { route, label, Icon };
  }
  return null; // no route — show modal
}

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

/* ── Detail Modal (shown only when no route could be detected) ── */
function DetailModal({ notice, paletteItem, onClose, navigate }) {
  const IconComp = ICON_MAP[notice.icon] || FiBell;
  const detected = detectRoute(notice);

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

  const handleNavigate = () => {
    onClose();
    if (detected) {
      if (detected.route.startsWith("http")) window.open(detected.route, "_blank");
      else navigate(detected.route);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn"
      style={{ padding: "80px 16px 32px" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden border border-[var(--card-border)] shadow-2xl animate-slideUp flex flex-col relative mx-auto"
        style={{ background: "var(--modal-bg)" }}
        role="dialog"
      >
        {/* Header */}
        <div
          className="p-6 relative"
          style={{ background: `linear-gradient(135deg, ${paletteItem.color}25, var(--card-bg))` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg shrink-0"
                style={{ background: `${paletteItem.color}20`, border: `1px solid ${paletteItem.color}40`, color: paletteItem.color }}
              >
                <IconComp />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-lg leading-snug">{notice.title}</h3>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                  <FiCalendar size={11} /> {fmtDate(notice.createdAt)}
                </span>
              </div>
            </div>
            {notice.priority && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/30 flex items-center gap-1 shrink-0">
                <span className="live-dot" style={{ width: 5, height: 5, background: "#EF4444" }} /> Priority
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--card-bg)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center transition border border-[var(--card-border)]"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-2">
          {fullText.split("\n").map((line, i) =>
            line.trim() ? (
              <p key={i} className="text-[var(--text-muted)] text-sm leading-relaxed">{line.trim()}</p>
            ) : null
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-[var(--card-border)] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] bg-[var(--card-bg)] hover:bg-[var(--surface-alt)] transition border border-[var(--card-border)]"
          >
            Close
          </button>

          {detected && (
            <button
              onClick={handleNavigate}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${paletteItem.color}, ${paletteItem.color}cc)`, boxShadow: `0 4px 16px ${paletteItem.glow}` }}
            >
              <detected.Icon size={13} />
              {detected.label}
              <FiArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function NoticeBoard() {
  const navigate = useNavigate();
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

  /* Handle card click: redirect or open modal */
  const handleCardClick = (notice, palette) => {
    const detected = detectRoute(notice);
    if (detected) {
      if (detected.route.startsWith("http")) window.open(detected.route, "_blank");
      else navigate(detected.route);
    } else {
      setDetail({ notice, palette });
    }
  };

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
                  className="w-9 h-9 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-default"
                >
                  <FiChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  disabled={page === totalPages - 1}
                  className="w-9 h-9 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-default"
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
              <div key={i} className="h-48 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {visible.map((n, i) => {
              const globalIdx = page * PER_PAGE + i;
              const palette = CARD_PALETTE[globalIdx % CARD_PALETTE.length];
              const IconEl = ICON_MAP[n.icon] || FiBell;
              const detected = detectRoute(n);

              return (
                <article
                  key={n._id}
                  onClick={() => handleCardClick(n, palette)}
                  className="group relative rounded-3xl p-6 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
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

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 30% 20%, ${palette.color}08, transparent 65%)` }}
                  />

                  {/* Top row */}
                  <div className="relative">
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
                  <div className="relative flex items-center justify-between pt-4 mt-4 border-t border-[var(--card-border)]">
                    <span className="text-xs text-[var(--text-light)] font-medium flex items-center gap-1">
                      <FiCalendar size={11} /> {fmtDate(n.createdAt)}
                    </span>

                    {/* Action indicator */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-200 group-hover:gap-2"
                      style={{
                        background: `${palette.color}15`,
                        border: `1px solid ${palette.color}30`,
                        color: palette.color,
                      }}
                    >
                      {detected ? (
                        <>
                          <detected.Icon size={11} />
                          {detected.label}
                        </>
                      ) : (
                        <>
                          <FiInfo size={11} />
                          Read More
                        </>
                      )}
                      <FiArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
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
                  background: page === i ? "linear-gradient(90deg, #3B82F6, #06B6D4)" : "var(--card-border)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal (shown only when no route detected) */}
      {detail && (
        <DetailModal
          notice={detail.notice}
          paletteItem={detail.palette}
          onClose={() => setDetail(null)}
          navigate={navigate}
        />
      )}
    </section>
  );
}
