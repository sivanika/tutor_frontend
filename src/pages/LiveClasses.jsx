import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUsers, FiClock, FiCalendar, FiPlayCircle,
  FiArrowRight, FiStar, FiAlertCircle, FiRefreshCw, FiList, FiZap
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

/* ── Gradient CSS map ─────────────────────────────── */
const GRADIENTS = [
  "linear-gradient(135deg, #3B82F6, #06B6D4)",
  "linear-gradient(135deg, #8B5CF6, #3B82F6)",
  "linear-gradient(135deg, #06B6D4, #10B981)",
  "linear-gradient(135deg, #F59E0B, #EF4444)",
  "linear-gradient(135deg, #A78BFA, #8B5CF6)",
  "linear-gradient(135deg, #F472B6, #A78BFA)",
];

/* ── Detail Modal ─────────────────────────────────── */
function DetailModal({ cls, onClose, onEnrol }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        className="rounded-3xl w-full max-w-3xl overflow-hidden my-4 border border-[var(--card-border)] shadow-2xl relative"
        style={{ background: "var(--modal-bg)" }}
      >
        {/* Colored Hero */}
        <div
          className="px-8 py-8 relative text-white"
          style={{ background: cls.gradient || GRADIENTS[0] }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-white/70 hover:text-white text-3xl leading-none"
          >×</button>
          <span className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-3 border border-white/10">
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            {cls.category} · {cls.level}
          </span>
          <h2 className="text-2xl font-black leading-tight mb-3 text-white">{cls.title}</h2>
          <p className="text-white/90 max-w-xl text-sm leading-relaxed">{cls.longDesc || cls.shortDesc}</p>
          <div className="flex flex-wrap gap-5 mt-5 text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1.5"><FiCalendar size={14}/> Starts {cls.startDate}</span>
            <span className="flex items-center gap-1.5"><FiClock size={14}/> {cls.durationWeeks} weeks</span>
            <span className="flex items-center gap-1.5"><FiUsers size={14}/> {cls.seatsLeft} seats left</span>
            {cls.rating > 0 && (
              <span className="flex items-center gap-1.5"><FiStar size={14} className="fill-current text-yellow-300"/> {cls.rating}★ ({cls.ratingCount})</span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-7 space-y-6">
          {/* Schedule */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Schedule</h4>
            <p className="text-sm font-semibold text-white">{cls.schedule}</p>
          </div>

          {/* Prerequisites */}
          {cls.prerequisites?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Prerequisites</h4>
              <ul className="space-y-1">
                {cls.prerequisites.map((p, i) => (
                  <li key={i} className="text-sm text-white/70 pl-4 relative before:absolute before:left-0 before:content-['•'] before:text-[var(--accent)]">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Syllabus */}
          {cls.syllabus?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Week-by-week Syllabus</h4>
              <div className="divide-y divide-white/06">
                {cls.syllabus.map((week) => (
                  <div key={week.week} className="flex gap-4 py-3">
                    <span className="font-mono text-xs font-bold text-[var(--accent)] w-16 shrink-0 pt-0.5">WK {week.week}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{week.topic}</p>
                      {week.details && <p className="text-xs text-white/40 mt-0.5">{week.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructor */}
          <div className="flex gap-4 items-center p-4 rounded-2xl" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 border border-[var(--accent)]/30 text-[var(--accent)] font-black flex items-center justify-center text-lg">
              {cls.instructor?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)] text-sm">{cls.instructor}</p>
              <p className="text-xs text-[var(--text-muted)]">{cls.instructorRole}</p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]">
            <div>
              <p className="text-2xl font-black text-[var(--text-primary)]">
                ₹{cls.price?.toLocaleString("en-IN")}
              </p>
              {cls.mrp > cls.price && (
                <s className="text-xs text-[var(--text-muted)]">₹{cls.mrp?.toLocaleString("en-IN")}</s>
              )}
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 4px 20px rgba(6,182,212,0.3)" }}
              onClick={() => onEnrol(cls._id)}
            >
              Enrol Now <FiArrowRight />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Page ─────────────────────────────────────── */
export default function LiveClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const fetchClasses = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await API.get("/live-classes");
      setClasses(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Live classes fetch error:", err);
      setError("Could not load live classes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchClasses();
    const interval = setInterval(() => { if (isMounted) fetchClasses(true); }, 15000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const categories = ["All", ...new Set(classes.map(c => c.category))];
  const visible = filter === "All" ? classes : classes.filter(c => c.category === filter);

  const totalSeats = classes.reduce((a, c) => a + (c.seatsLeft || 0), 0);
  const avgRating = classes.length
    ? (classes.reduce((a, c) => a + (c.rating || 0), 0) / classes.length).toFixed(1)
    : "—";

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(42,77,110,0.4) 0%, rgba(6,182,212,0.1) 50%, transparent 70%), var(--hero-section)" }}>
        <div className="absolute -top-20 left-1/4 w-96 h-96 orb-blue opacity-20 dark:opacity-30" />
        <div className="absolute top-1/2 right-0 w-80 h-80 orb-purple opacity-15 dark:opacity-20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="section-pill mx-auto w-fit mb-6 animate-fadeIn">
            <span className="live-dot" style={{ width: 6, height: 6 }} /> Live Classes
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[var(--text-primary)] leading-tight animate-slideUp">
            Learn Live, With a <br />
            <span className="grad-text">Mentor &amp; Cohort</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed mb-12 animate-slideUp delay-200">
            Fixed-schedule batches with weekly sessions, project reviews and direct mentor feedback. Seats are limited — every session is recorded for enrolled students.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slideUp delay-300">
            {[
              { label: "Cohorts open", value: classes.length, color: "#3B82F6" },
              { label: "Seats remaining", value: totalSeats, color: "#06B6D4" },
              { label: "Average rating", value: `${avgRating}★`, color: "#F59E0B" },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-3xl text-center" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", backdropFilter: "blur(16px)" }}>
                <div className="text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter Bar ──────────────────────────────── */}
      <div className="sticky top-[68px] z-40 py-4 border-b border-[var(--card-border)] backdrop-blur-2xl" style={{ background: "var(--overlay-bg)" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  filter === cat
                    ? "bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
                style={filter !== cat ? { background: "var(--card-bg)", border: "1px solid var(--card-border)" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1.5">
            <FiRefreshCw size={12} className="animate-spin text-[var(--accent)]" style={{ animationDuration: '3s' }} />
            Live data
          </span>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12 pb-24">

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center py-20 text-center text-[var(--text-muted)]">
            <FiAlertCircle size={40} className="text-red-400 mb-3" />
            <p className="font-semibold mb-2">{error}</p>
            <button onClick={() => fetchClasses()} className="mt-2 px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-bold">
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-3xl p-6 animate-pulse space-y-4" style={{ border: "1px solid var(--card-border)", background: "var(--card-bg)" }}>
                <div className="h-40 rounded-2xl" style={{ background: "var(--surface-alt)" }} />
                <div className="h-5 rounded-lg w-3/4" style={{ background: "var(--surface-alt)" }} />
                <div className="h-4 rounded-lg w-1/2" style={{ background: "var(--surface-alt)" }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && visible.length === 0 && (
          <div className="text-center py-24 rounded-3xl" style={{ border: "1px dashed var(--card-border)", background: "var(--card-bg)" }}>
            <FiList size={48} className="text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              {filter === "All" ? "No live classes available right now" : `No live classes in "${filter}"`}
            </h3>
            <p className="text-[var(--text-muted)] text-sm mb-6">
              {filter !== "All" ? "Try a different category." : "New cohorts are added regularly. Check back soon!"}
            </p>
            {filter !== "All" && (
              <button onClick={() => setFilter("All")} className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-bold">
                View All Cohorts
              </button>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && visible.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {visible.map((cls, idx) => (
                <motion.div
                  key={cls._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-3xl overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-350 cursor-pointer group"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", backdropFilter: "blur(16px)" }}
                  onClick={() => setSelected(cls)}
                >
                  {/* Thumb */}
                  <div
                    className="h-44 flex items-center justify-center relative overflow-hidden"
                    style={{ background: cls.gradient || GRADIENTS[idx % GRADIENTS.length] }}
                  >
                    <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                      {cls.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white/80 text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                      {cls.level}
                    </span>
                    <FiPlayCircle className="text-white/80 text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1 gap-3">
                    <h3 className="font-bold text-lg leading-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {cls.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                      {cls.shortDesc}
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs text-[var(--text-muted)] font-medium mt-1">
                      <span className="flex items-center gap-1.5"><FiCalendar size={11} className="text-[var(--accent)]" /> Starts {cls.startDate}</span>
                      <span className="flex items-center gap-1.5"><FiClock size={11} className="text-[var(--accent)]" /> {cls.durationWeeks} weeks</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--card-border)]">
                      <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/20 border border-[var(--accent)]/30 text-[var(--accent)] font-bold flex items-center justify-center text-xs shrink-0">
                        {cls.instructor?.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-primary)]">{cls.instructor}</span>
                        {cls.instructorRole && (
                          <p className="text-[10px] text-[var(--text-muted)] leading-none">{cls.instructorRole}</p>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-[var(--card-border)] flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <strong className="font-black text-xl text-[var(--text-primary)]">
                          ₹{cls.price?.toLocaleString("en-IN")}
                        </strong>
                        {cls.mrp > cls.price && (
                          <s className="text-xs text-[var(--text-muted)]">₹{cls.mrp?.toLocaleString("en-IN")}</s>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-bold ${cls.seatsLeft <= 5 ? "text-red-400" : cls.seatsLeft <= 15 ? "text-amber-400" : "text-emerald-400"}`}>
                          {cls.seatsLeft} seats left
                        </span>
                        {cls.rating > 0 && (
                          <span className="text-[11px] text-amber-400 font-bold">{cls.rating}★ ({cls.ratingCount})</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── CTA Band ────────────────────────────────── */}
      <section className="py-20 border-t border-[var(--card-border)]" style={{ background: "var(--section-bg-alt)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-black text-3xl mb-3 text-[var(--text-primary)]">
            Prefer to learn at your own pace?
          </h2>
          <p className="text-[var(--text-muted)] text-base max-w-xl mx-auto mb-8">
            Every live subject here is also available as a self-paced recorded course.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white text-sm transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 8px 24px rgba(6,182,212,0.25)" }}
          >
            Browse Recorded Courses →
          </Link>
        </div>
      </section>

      {/* ── Detail Modal ────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <DetailModal
            cls={selected}
            onClose={() => setSelected(null)}
            onEnrol={(id) => {
              setSelected(null);
              navigate(`/payment/live-class/${id}`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
