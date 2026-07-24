import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiBookOpen, FiClock, FiLayers, FiTag,
  FiCheckCircle, FiLoader, FiAlertCircle, FiStar, FiX,
  FiAward, FiChevronDown, FiChevronRight, FiPlay,
  FiUsers, FiVideo, FiTrendingUp, FiFilter, FiHeart, FiZap,
  FiCode, FiCpu, FiBarChart2, FiGlobe, FiCloud, FiActivity, FiArrowRight
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/media";

const LEVEL_COLORS = {
  "All Levels": "bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--card-border)]",
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Advanced: "bg-purple-500/10 text-purple-400 border-purple-500/30",
};

const ENROLL_STATUS = {
  applied:   { label: "Pending", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", icon: FiLoader },
  approved:  { label: "Enrolled", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: FiCheckCircle },
  rejected:  { label: "Rejected", color: "text-red-400 bg-red-500/10 border-red-500/30", icon: FiAlertCircle },
  completed: { label: "Completed", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", icon: FiAward },
};

// Stats Data
const STATS = [
  { value: "150+", label: "Expert Courses", icon: FiVideo, color: "#3B82F6" },
  { value: "25+", label: "Industry Trainers", icon: FiAward, color: "#8B5CF6" },
  { value: "20K+", label: "Active Students", icon: FiUsers, color: "#06B6D4" },
  { value: "4.9★", label: "Average Rating", icon: FiStar, color: "#F59E0B" },
];

// Modern Category Cards (React Icons instead of emojis)
const CATEGORY_CARDS = [
  { icon: FiCode, name: "Programming", count: "120", color: "#3B82F6", glow: "rgba(59,130,246,0.3)" },
  { icon: FiCpu, name: "Artificial Intelligence", count: "35", color: "#8B5CF6", glow: "rgba(139,92,246,0.3)" },
  { icon: FiBarChart2, name: "Data Science", count: "40", color: "#06B6D4", glow: "rgba(6,182,212,0.3)" },
  { icon: FiGlobe, name: "Web Development", count: "65", color: "#10B981", glow: "rgba(16,185,129,0.3)" },
  { icon: FiCloud, name: "Cloud Computing", count: "25", color: "#F59E0B", glow: "rgba(245,158,11,0.3)" },
  { icon: FiActivity, name: "Engineering & STEM", count: "50", color: "#F472B6", glow: "rgba(244,114,182,0.3)" },
];

function CourseCard({ course, enrollmentStatus, onEnroll, onSelect }) {
  const sc = enrollmentStatus ? ENROLL_STATUS[enrollmentStatus] : null;
  const Icon = sc?.icon;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => onSelect(course)}
      className="rounded-3xl border border-[var(--card-border)] overflow-hidden flex flex-col hover:border-[var(--accent)]/40 hover:shadow-2xl transition-all duration-300 group cursor-pointer relative"
      style={{ background: "var(--card-bg)", backdropFilter: "blur(16px)" }}
    >
      {/* Top section: Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-white/02">
        {course.thumbnailUrl ? (
          <img
            src={resolveMediaUrl(course.thumbnailUrl)}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => e.target.style.display = "none"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--secondary)]/20 to-[var(--accent)]/10">
            <FiBookOpen size={44} className="text-[var(--accent)]/40" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.price === 0 && (
            <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-md">
              Free
            </span>
          )}
          {course.isBestseller && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-md">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white/50 hover:text-rose-400 rounded-full backdrop-blur-md transition-colors z-10 border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <FiHeart size={15} />
        </button>
      </div>

      {/* Middle section: Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2.5 py-0.5 rounded-full">
            {course.category || "General"}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${LEVEL_COLORS[course.level] || LEVEL_COLORS["All Levels"]}`}>
            {course.level}
          </span>
        </div>

        <h3 className="font-bold text-[var(--text-primary)] text-base mb-1.5 line-clamp-2 leading-snug group-hover:text-[var(--primary)] dark:group-hover:text-[var(--accent)] transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2 leading-relaxed">{course.description}</p>

        <p className="text-[11px] text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
          By <span className="font-medium text-[var(--text-primary)]">{course.instructor || "Vishidh Academy Expert"}</span>
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map(i => (
              <FiStar key={i} size={11} fill="currentColor" className={i === 5 ? "opacity-40" : ""} />
            ))}
          </div>
          <span className="text-xs font-bold text-[var(--text-primary)]">4.8</span>
          <span className="text-xs text-[var(--text-muted)]">(1.2k)</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)] mb-4 pb-4 border-b border-[var(--card-border)]">
          <span className="flex items-center gap-1.5"><FiClock size={13} className="text-[var(--accent)]" />{course.duration}</span>
          <span className="flex items-center gap-1.5"><FiLayers size={13} className="text-[var(--accent)]" />{course.subject}</span>
        </div>

        {/* Bottom CTA */}
        <div className="mt-auto flex items-center justify-between" onClick={e => e.stopPropagation()}>
          <div>
            <div className="text-xl font-black text-[var(--text-primary)]">
              {course.price > 0 ? `₹${course.price}` : "Free"}
            </div>
            {course.oldPrice > 0 && (
              <div className="text-[10px] text-[var(--text-muted)] line-through">₹{course.oldPrice}</div>
            )}
          </div>

          {sc ? (
            <div className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl border text-xs font-bold ${sc.color}`}>
              <Icon size={14} className="shrink-0" />
              {sc.label}
            </div>
          ) : (
            <button
              onClick={() => onEnroll(course._id)}
              className="py-2 px-5 rounded-xl font-bold text-xs text-white transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 4px 16px rgba(6,182,212,0.25)" }}
            >
              Enroll
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function BrowseCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Details Modal State
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseModules, setSelectedCourseModules] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, eRes] = await Promise.all([
        API.get("/lms/courses"),
        user ? API.get("/lms/enrollments/my").catch(() => ({ data: { enrollments: [] } })) : Promise.resolve({ data: { enrollments: [] } }),
      ]);
      setCourses(cRes.data.courses || []);
      setMyEnrollments(eRes.data.enrollments || []);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [user]);

  const enroll = (courseId) => {
    if (!user) { navigate("/login"); return; }
    navigate(`/payment/course/${courseId}`);
  };

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    setLoadingDetails(true);
    setExpandedModules({});
    try {
      const res = await API.get(`/lms/courses/${course._id}`);
      setSelectedCourseModules(res.data.modules || []);
      if (res.data.modules?.length > 0) {
        setExpandedModules({ [res.data.modules[0]._id]: true });
      }
    } catch {
      toast.error("Failed to load course details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const enrollMap = {};
  myEnrollments.forEach(e => { if (e.courseId) enrollMap[e.courseId._id] = e.status; });

  const categories = ["all", ...new Set(courses.map(c => c.category).filter(Boolean))];
  const levels = ["all", "Beginner", "Intermediate", "Advanced", "All Levels"];

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchQ = c.title.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchL = filterLevel === "all" || c.level === filterLevel;
    const matchC = filterCategory === "all" || c.category === filterCategory;
    return matchQ && matchL && matchC;
  });

  const selectedCourseStatus = selectedCourse ? enrollMap[selectedCourse._id] : null;
  const scDetail = selectedCourseStatus ? ENROLL_STATUS[selectedCourseStatus] : null;
  const ScIcon = scDetail?.icon;

  return (
    <div style={{ background: "var(--bg)" }} className="min-h-screen text-[var(--text-primary)]">

      {/* Scoped CSS for scrollbar hiding */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-24 overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(59,130,246,0.3) 0%, rgba(6,182,212,0.1) 50%, transparent 70%), var(--hero-section)" }}>
        <div className="absolute -top-20 right-1/4 w-96 h-96 orb-blue opacity-20 dark:opacity-30" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 orb-purple opacity-15 dark:opacity-20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-pill w-fit mb-6 animate-fadeIn">
                <FiZap size={12} /> Expert-Led LMS Courses
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] leading-[1.1] mb-6 tracking-tight">
                Browse <span className="grad-text">Professional</span> Courses
              </h1>
              <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed max-w-xl">
                Master industry-ready skills through expert-designed courses, hands-on projects, and interactive learning paths.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10 text-sm font-semibold text-[var(--text-muted)]">
                <div className="flex items-center gap-2.5">
                  <FiCheckCircle className="text-[var(--accent)] shrink-0" size={18} /> Lifetime Access
                </div>
                <div className="flex items-center gap-2.5">
                  <FiAward className="text-[var(--accent)] shrink-0" size={18} /> Industry Certificates
                </div>
                <div className="flex items-center gap-2.5">
                  <FiLayers className="text-[var(--accent)] shrink-0" size={18} /> Practical Projects
                </div>
                <div className="flex items-center gap-2.5">
                  <FiUsers className="text-[var(--accent)] shrink-0" size={18} /> Expert Mentors
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 8px 30px rgba(6,182,212,0.3)" }}
                >
                  Explore Courses →
                </button>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] bg-white/02">
                <img
                  src="/course_hero.png"
                  alt="Browse Professional Courses Illustration"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SEARCH & FILTERS SECTION ── */}
      <section id="search-section" className="relative z-20 -mt-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-3xl p-4 sm:p-6 shadow-2xl border border-[var(--card-border)]"
          style={{ background: "var(--modal-bg)", backdropFilter: "blur(24px)" }}
        >
          <div className="relative">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={22} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, technologies, instructors..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)]/50 transition-all"
              style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }}
            />
          </div>

          {/* Filter Chips */}
          <div className="mt-5 pt-5 border-t border-[var(--card-border)]">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider min-w-[80px]">
                <FiFilter className="text-[var(--accent)]" /> Filters
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={filterLevel}
                  onChange={e => setFilterLevel(e.target.value)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/50 cursor-pointer"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }}
                >
                  {levels.map(l => <option key={l} value={l} className="bg-[var(--modal-bg)] text-[var(--text-primary)]">{l === "all" ? "All Levels" : l}</option>)}
                </select>

                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/50 cursor-pointer"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }}
                >
                  {categories.map(c => <option key={c} value={c} className="bg-[var(--modal-bg)] text-[var(--text-primary)]">{c === "all" ? "All Categories" : c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-3xl text-center animate-fadeIn"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", backdropFilter: "blur(16px)" }}
            >
              <stat.icon className="mx-auto mb-3" size={28} style={{ color: stat.color }} />
              <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TOP CATEGORIES (MODERN CARDS, NO EMOJIS, NO SCROLLBAR) ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="section-pill mb-2 w-fit">Curated Paths</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">Top Categories</h2>
          </div>
        </div>

        {/* Scrollable Container with touch scrolling */}
        <div
          className="flex overflow-x-auto gap-4 pb-4 no-scrollbar"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {CATEGORY_CARDS.map((cat, idx) => {
            const IconComponent = cat.icon;
            const isSelected = filterCategory === cat.name;
            return (
              <button
                key={idx}
                onClick={() => setFilterCategory(isSelected ? "all" : cat.name)}
                className="group flex-shrink-0 w-48 sm:w-60 p-5 sm:p-6 text-left rounded-3xl overflow-hidden relative transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                style={{
                  scrollSnapAlign: "start",
                  background: isSelected ? `${cat.color}15` : "var(--card-bg)",
                  border: `1px solid ${isSelected ? cat.color + "50" : "var(--card-border)"}`,
                  backdropFilter: "blur(16px)",
                  boxShadow: isSelected ? `0 0 24px ${cat.glow}` : "none",
                }}
              >
                {/* Accent line on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }}
                />

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${cat.color}18`,
                    border: `1px solid ${cat.color}35`,
                    color: cat.color,
                    boxShadow: `0 0 20px ${cat.glow}`,
                  }}
                >
                  <IconComponent size={20} />
                </div>

                <h3 className="font-bold text-[var(--text-primary)] text-sm sm:text-base mb-1 group-hover:text-[var(--primary)] dark:group-hover:text-[var(--accent)] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-medium flex items-center justify-between">
                  <span>{cat.count} Courses</span>
                  <FiArrowRight size={13} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: cat.color }} />
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── COURSE CATALOG ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-[var(--text-primary)]">All Courses</h2>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              {loading ? "Loading catalog..." : `Showing ${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 rounded-3xl"
            style={{ border: "1px dashed var(--card-border)", background: "var(--card-bg)" }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ border: "1px solid var(--card-border)", background: "var(--surface-alt)" }}>
              <FiSearch size={32} className="text-[var(--text-muted)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Courses Found</h3>
            <p className="text-[var(--text-muted)] text-sm mb-6 max-w-sm mx-auto">Try changing your filters or search keyword.</p>
            <button
              onClick={() => { setSearch(""); setFilterLevel("all"); setFilterCategory("all"); }}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-[var(--surface-alt)] transition"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  enrollmentStatus={enrollMap[course._id] || null}
                  onEnroll={enroll}
                  onSelect={handleSelectCourse}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ── COURSE DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="rounded-3xl border border-[var(--card-border)] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden relative"
              style={{ background: "var(--modal-bg)" }}
            >
              {/* Header */}
              <div className="relative h-48 md:h-64 flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(42,77,110,0.4), rgba(6,182,212,0.15))" }}>
                {selectedCourse.thumbnailUrl && (
                  <img src={resolveMediaUrl(selectedCourse.thumbnailUrl)} alt={selectedCourse.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--modal-bg) 0%, transparent 80%)" }} />

                <button
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-6 right-6 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition border border-white/10 z-10"
                >
                  <FiX size={18} />
                </button>

                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${LEVEL_COLORS[selectedCourse.level] || LEVEL_COLORS["All Levels"]}`}>
                      {selectedCourse.level}
                    </span>
                    {selectedCourse.category && (
                      <span className="text-xs font-semibold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <FiTag size={12} /> {selectedCourse.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] leading-tight mb-3">{selectedCourse.title}</h2>
                  <div className="flex items-center gap-6 text-xs text-[var(--text-muted)] font-medium">
                    <span className="flex items-center gap-1.5"><FiClock size={13} className="text-[var(--accent)]" /> {selectedCourse.duration}</span>
                    <span className="flex items-center gap-1.5"><FiLayers size={13} className="text-[var(--accent)]" /> {selectedCourse.subject}</span>
                    <span className="flex items-center gap-1.5"><FiUsers size={13} className="text-[var(--accent)]" /> {selectedCourse.instructor || "Expert"}</span>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Details column */}
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">About This Course</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed whitespace-pre-line text-sm">
                      {selectedCourse.description}
                    </p>
                  </section>

                  <section className="p-6 rounded-2xl" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <h3 className="font-bold text-[var(--text-primary)] mb-4 text-sm">Course Highlights</h3>
                    <ul className="grid sm:grid-cols-2 gap-4">
                      <li className="flex items-start gap-3 text-xs text-[var(--text-muted)]">
                        <FiCheckCircle className="text-[var(--accent)] shrink-0 mt-0.5" /> 100% Online &amp; Self-paced
                      </li>
                      <li className="flex items-start gap-3 text-xs text-[var(--text-muted)]">
                        <FiCheckCircle className="text-[var(--accent)] shrink-0 mt-0.5" /> Shareable Certificate
                      </li>
                      <li className="flex items-start gap-3 text-xs text-[var(--text-muted)]">
                        <FiCheckCircle className="text-[var(--accent)] shrink-0 mt-0.5" /> Assignments &amp; Projects
                      </li>
                      <li className="flex items-start gap-3 text-xs text-[var(--text-muted)]">
                        <FiCheckCircle className="text-[var(--accent)] shrink-0 mt-0.5" /> Lifetime Access to Lectures
                      </li>
                    </ul>
                  </section>
                </div>

                {/* Right Syllabus column */}
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl shadow-xl" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <div className="text-3xl font-black text-[var(--text-primary)] mb-1">
                      {selectedCourse.price > 0 ? `₹${selectedCourse.price}` : "Free"}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mb-6">One-time payment for full lifetime access</div>

                    {scDetail ? (
                      <div className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold ${scDetail.color}`}>
                        <ScIcon size={16} className="shrink-0" />
                        {scDetail.label}
                      </div>
                    ) : (
                      <button
                        onClick={() => { enroll(selectedCourse._id); setSelectedCourse(null); }}
                        className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 flex justify-center items-center gap-2"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 4px 20px rgba(6,182,212,0.3)" }}
                      >
                        Enroll Now →
                      </button>
                    )}

                    <div className="mt-8">
                      <h3 className="font-bold text-[var(--text-primary)] mb-4 text-sm">Course Content</h3>
                      {loadingDetails ? (
                        <div className="flex justify-center py-6">
                          <FiLoader className="animate-spin text-[var(--accent)]" size={22} />
                        </div>
                      ) : selectedCourseModules.length === 0 ? (
                        <p className="text-xs text-[var(--text-muted)] italic">Syllabus is being updated.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedCourseModules.map((mod, index) => {
                            const isExpanded = !!expandedModules[mod._id];
                            return (
                              <div key={mod._id} className="border border-[var(--card-border)] rounded-xl overflow-hidden">
                                <button
                                  onClick={() => toggleModule(mod._id)}
                                  className="w-full flex items-center justify-between p-3 text-xs font-bold text-[var(--text-primary)] bg-[var(--surface-alt)] hover:bg-[var(--card-border)] transition text-left"
                                >
                                  <span>Module {index + 1}: {mod.title}</span>
                                  {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                                </button>

                                {isExpanded && (
                                  <div className="p-3 space-y-1.5 border-t border-[var(--card-border)] bg-[var(--bg)]/50">
                                    {mod.lessons?.length === 0 ? (
                                      <p className="text-[11px] text-[var(--text-muted)] italic">No lessons</p>
                                    ) : (
                                      mod.lessons.map(lesson => (
                                        <div key={lesson._id} className="flex items-center gap-2 text-xs text-[var(--text-muted)] p-1.5 rounded-lg hover:text-[var(--text-primary)]">
                                          <FiPlay className="text-[var(--accent)] shrink-0" size={12} />
                                          <span className="truncate flex-1">{lesson.title}</span>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
