import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUsers, FiClock, FiCalendar, FiPlayCircle,
  FiArrowRight, FiStar, FiAlertCircle, FiRefreshCw, FiList
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

/* ── Gradient CSS map ─────────────────────────────── */
const GRADIENTS = [
  "linear-gradient(135deg, #1E9E8C, #12283B)",
  "linear-gradient(135deg, #2A4D6E, #F2A93B)",
  "linear-gradient(135deg, #F2A93B, #1B3A54)",
  "linear-gradient(135deg, #1E9E8C, #2A4D6E)",
  "linear-gradient(135deg, #3A6389, #E86A5C)",
  "linear-gradient(135deg, #12283B, #4F7CA3)",
];

/* ── Detail Modal ─────────────────────────────────── */
function DetailModal({ cls, onClose, onEnrol }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-[rgba(4,6,14,0.7)] backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white dark:bg-[#1B3A54] rounded-[22px] w-full max-w-3xl shadow-2xl overflow-hidden my-4"
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
          <span className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E8C] shadow-[0_0_0_3px_rgba(30,158,140,0.4)]" />
            {cls.category} · {cls.level}
          </span>
          <h2 className="text-2xl font-bold font-[Fraunces,serif] leading-tight mb-3">{cls.title}</h2>
          <p className="text-white/85 max-w-xl text-sm">{cls.longDesc || cls.shortDesc}</p>
          <div className="flex flex-wrap gap-5 mt-5 text-sm text-white/90">
            <span className="flex items-center gap-1.5"><FiCalendar size={14}/> Starts {cls.startDate}</span>
            <span className="flex items-center gap-1.5"><FiClock size={14}/> {cls.durationWeeks} weeks</span>
            <span className="flex items-center gap-1.5"><FiUsers size={14}/> {cls.seatsLeft} seats left</span>
            {cls.rating > 0 && (
              <span className="flex items-center gap-1.5"><FiStar size={14}/> {cls.rating}★ ({cls.ratingCount})</span>
            )}
          </div>
        </div>

        {/* Tabs Body */}
        <div className="p-7 space-y-6">
          {/* Schedule */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7E8FA0] mb-2">Schedule</h4>
            <p className="text-sm font-semibold text-[#142838] dark:text-[#EEF4F9]">{cls.schedule}</p>
          </div>

          {/* Prerequisites */}
          {cls.prerequisites?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#7E8FA0] mb-2">Prerequisites</h4>
              <ul className="space-y-1">
                {cls.prerequisites.map((p, i) => (
                  <li key={i} className="text-sm text-[#4C6072] dark:text-[#AFC1D1] pl-4 relative before:absolute before:left-0 before:content-['•'] before:text-[#F2A93B]">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Syllabus */}
          {cls.syllabus?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#7E8FA0] mb-3">Week-by-week Syllabus</h4>
              <div className="divide-y divide-[rgba(18,40,59,0.1)]">
                {cls.syllabus.map((week) => (
                  <div key={week.week} className="flex gap-4 py-3">
                    <span className="font-mono text-xs font-bold text-[#2A4D6E] w-16 shrink-0 pt-0.5">WK {week.week}</span>
                    <div>
                      <p className="text-sm font-bold text-[#142838] dark:text-white">{week.topic}</p>
                      {week.details && <p className="text-xs text-[#4C6072] dark:text-[#AFC1D1] mt-0.5">{week.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructor */}
          <div className="flex gap-4 items-center p-4 bg-[#E8F0F6] dark:bg-[#12283B] rounded-xl">
            <div className="w-12 h-12 rounded-full bg-[#2A4D6E] text-white font-bold flex items-center justify-center text-lg font-[Fraunces,serif]">
              {cls.instructor?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-[#142838] dark:text-white">{cls.instructor}</p>
              <p className="text-xs text-[#4C6072] dark:text-[#AFC1D1]">{cls.instructorRole}</p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-2xl font-bold font-[Fraunces,serif] text-[#142838] dark:text-white">
                ₹{cls.price?.toLocaleString("en-IN")}
              </p>
              {cls.mrp > cls.price && (
                <s className="text-xs text-[#7E8FA0]">₹{cls.mrp?.toLocaleString("en-IN")}</s>
              )}
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-[#1E9E8C] text-white rounded-xl font-bold text-sm hover:bg-[#2CBBA6] transition-all shadow-lg hover:-translate-y-0.5"
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
    <div className="bg-[#F5F9FC] dark:bg-[#12283B] min-h-screen">

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/academic_hero_banner.png" 
            alt="Banner" 
            className="w-full h-full object-cover opacity-20 dark:opacity-40 brightness-[0.9] dark:brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)]/20 via-[var(--surface)]/80 to-[var(--surface)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 text-[var(--primary)] dark:text-[var(--accent)] text-xs font-bold tracking-wider uppercase mb-6 animate-fadeIn">
            Live Classes
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight dark:text-white">
            Learn Live, With a <br />
            <span className="grad-text">Mentor & Cohort</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Fixed-schedule batches with weekly sessions, project reviews and direct mentor feedback. Seats are limited — every session is recorded for enrolled students.
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Cohorts open", value: classes.length },
              { label: "Seats remaining", value: totalSeats },
              { label: "Average rating", value: `${avgRating}★` },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white dark:bg-white/05 border border-slate-100 dark:border-white/10 shadow-sm">
                <div className="text-3xl font-extrabold grad-text mb-1">{stat.value}</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter Bar ──────────────────────────────── */}
      <div className="sticky top-[72px] lg:top-[88px] z-40 bg-[#F5F9FC] dark:bg-[#12283B] border-b border-[rgba(18,40,59,0.1)] dark:border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition-all
                  ${filter === cat
                    ? "bg-[#2A4D6E] text-white border-[#2A4D6E] shadow-md"
                    : "bg-white dark:bg-white/10 border-[rgba(18,40,59,0.18)] dark:border-white/20 text-[#4C6072] dark:text-[#AFC1D1] hover:text-[#2A4D6E] dark:hover:text-white hover:border-[#2A4D6E]"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#7E8FA0] font-medium flex items-center gap-1.5">
            <FiRefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
            Live data
          </span>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10 pb-20">

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center py-20 text-center text-[#4C6072]">
            <FiAlertCircle size={40} className="text-[#E86A5C] mb-3" />
            <p className="font-semibold mb-2">{error}</p>
            <button onClick={() => fetchClasses()} className="mt-2 px-5 py-2 rounded-xl bg-[#2A4D6E] text-white text-sm font-bold">
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1B3A54] rounded-[22px] overflow-hidden animate-pulse">
                <div className="h-40 bg-[#D0DCE8] dark:bg-[#2A4D6E]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-[#E8F0F6] dark:bg-[#2A4D6E] rounded-lg" />
                  <div className="h-4 bg-[#E8F0F6] dark:bg-[#2A4D6E] rounded-lg w-3/4" />
                  <div className="h-4 bg-[#E8F0F6] dark:bg-[#2A4D6E] rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && visible.length === 0 && (
          <div className="text-center py-20">
            <FiList size={48} className="text-[#D0DCE8] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#142838] dark:text-white mb-2">
              {filter === "All" ? "No live classes available right now" : `No live classes in "${filter}"`}
            </h3>
            <p className="text-[#4C6072] dark:text-[#AFC1D1] text-sm mb-5">
              {filter !== "All" ? "Try a different category." : "New cohorts are added regularly. Check back soon!"}
            </p>
            {filter !== "All" && (
              <button onClick={() => setFilter("All")} className="px-5 py-2.5 rounded-xl bg-[#2A4D6E] text-white text-sm font-bold">
                View All Cohorts
              </button>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && visible.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {visible.map((cls, idx) => (
                <motion.div
                  key={cls._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.07 }}
                  className="bg-white dark:bg-[#1B3A54] rounded-[22px] border border-[rgba(18,40,59,0.08)] dark:border-white/10 overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelected(cls)}
                >
                  {/* Thumb */}
                  <div
                    className="h-40 flex items-center justify-center relative"
                    style={{ background: cls.gradient || GRADIENTS[idx % GRADIENTS.length] }}
                  >
                    <span className="absolute top-3 left-3 bg-white/92 text-[#1B3A54] text-xs font-bold px-3 py-1 rounded-full">
                      {cls.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-[#12283B]/60 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {cls.level}
                    </span>
                    <FiPlayCircle className="text-white/90 text-5xl group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <h3 className="font-bold font-[Fraunces,serif] text-xl leading-tight text-[#142838] dark:text-white">
                      {cls.title}
                    </h3>
                    <p className="text-sm text-[#4C6072] dark:text-[#AFC1D1] leading-relaxed">
                      {cls.shortDesc}
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs text-[#7E8FA0] font-medium mt-1">
                      <span className="flex items-center gap-1.5"><FiCalendar size={11} /> Starts {cls.startDate}</span>
                      <span className="flex items-center gap-1.5"><FiClock size={11} /> {cls.durationWeeks} weeks</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-[#4C6072] dark:text-[#AFC1D1]">
                      <div className="w-7 h-7 rounded-full bg-[#2A4D6E] text-white font-bold flex items-center justify-center text-xs font-[Fraunces,serif] shrink-0">
                        {cls.instructor?.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-[#142838] dark:text-white">{cls.instructor}</span>
                        {cls.instructorRole && (
                          <p className="text-[11px] text-[#7E8FA0] leading-none">{cls.instructorRole}</p>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-[rgba(18,40,59,0.08)] dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <strong className="font-bold font-[Fraunces,serif] text-xl text-[#142838] dark:text-white">
                          ₹{cls.price?.toLocaleString("en-IN")}
                        </strong>
                        {cls.mrp > cls.price && (
                          <s className="text-xs text-[#7E8FA0]">₹{cls.mrp?.toLocaleString("en-IN")}</s>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-bold ${cls.seatsLeft <= 5 ? "text-[#E86A5C]" : cls.seatsLeft <= 15 ? "text-[#F2A93B]" : "text-[#1E9E8C]"}`}>
                          {cls.seatsLeft} seats left
                        </span>
                        {cls.rating > 0 && (
                          <span className="text-[11px] text-[#F2A93B] font-bold">{cls.rating}★ ({cls.ratingCount})</span>
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
      <section className="bg-white dark:bg-[#1B3A54] border-t border-[rgba(18,40,59,0.1)] dark:border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-bold font-[Fraunces,serif] text-3xl mb-4 text-[#12283B] dark:text-white">
            Prefer to learn at your own pace?
          </h2>
          <p className="text-[#4C6072] dark:text-[#AFC1D1] text-lg max-w-2xl mx-auto mb-8">
            Every live subject here is also available as a self-paced recorded course.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#2A4D6E] text-white hover:bg-[#3A6389] transition-all shadow-lg hover:-translate-y-0.5"
          >
            Browse Recorded Courses
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

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
