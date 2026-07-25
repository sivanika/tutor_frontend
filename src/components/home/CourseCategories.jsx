import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen, FiClock, FiLayers, FiArrowRight, FiStar,
  FiCode, FiCpu, FiBarChart2, FiGlobe, FiActivity, FiHash,
  FiChevronRight, FiLoader
} from "react-icons/fi";
import API from "../../services/api";
import { resolveMediaUrl } from "../../utils/media";

const CATEGORY_TABS = [
  { label: "All",               icon: FiBookOpen,  color: "#06B6D4" },
  { label: "Programming & CS",  icon: FiCode,      color: "#3B82F6" },
  { label: "Mathematics",       icon: FiHash,      color: "#8B5CF6" },
  { label: "Data Analytics",    icon: FiBarChart2, color: "#06B6D4" },
  { label: "AI & ML",           icon: FiCpu,       color: "#A78BFA" },
  { label: "Physics",           icon: FiActivity,  color: "#F472B6" },
  { label: "English & Languages", icon: FiGlobe,   color: "#10B981" },
];

const LEVEL_COLORS = {
  "All Levels":   { bg: "rgba(59,130,246,0.12)",  text: "#3B82F6",  border: "rgba(59,130,246,0.25)" },
  Beginner:       { bg: "rgba(16,185,129,0.12)",  text: "#10B981",  border: "rgba(16,185,129,0.25)" },
  Intermediate:   { bg: "rgba(139,92,246,0.12)",  text: "#8B5CF6",  border: "rgba(139,92,246,0.25)" },
  Advanced:       { bg: "rgba(239,68,68,0.12)",   text: "#EF4444",  border: "rgba(239,68,68,0.25)"  },
};

function MiniCourseCard({ course, onClick }) {
  const lc = LEVEL_COLORS[course.level] || LEVEL_COLORS["All Levels"];

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Top colour bar on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
      />

      {/* Thumbnail */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[var(--secondary)]/10 to-[var(--accent)]/10 shrink-0">
        {course.thumbnailUrl ? (
          <img
            src={resolveMediaUrl(course.thumbnailUrl)}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => e.target.style.display = "none"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiBookOpen size={32} className="text-[var(--accent)]/40" />
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {course.price === 0 && (
            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-md">
              Free
            </span>
          )}
          {course.isBestseller && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-md">
              Best Seller
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category + Level */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2 py-0.5 rounded-full truncate">
            {course.category || "General"}
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0"
            style={{ background: lc.bg, color: lc.text, borderColor: lc.border }}
          >
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[var(--text-primary)] text-sm leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
          {course.title}
        </h3>

        <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed flex-1">
          {course.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
          {course.duration && (
            <span className="flex items-center gap-1">
              <FiClock size={10} className="text-[var(--accent)]" />
              {course.duration}
            </span>
          )}
          {course.subject && (
            <span className="flex items-center gap-1">
              <FiLayers size={10} className="text-[var(--accent)]" />
              {course.subject}
            </span>
          )}
          <span className="ml-auto flex items-center gap-0.5 text-amber-400 font-bold">
            <FiStar size={10} fill="currentColor" /> 4.8
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)] mt-auto">
          <div>
            <span className="font-black text-base text-[var(--text-primary)]">
              {course.price > 0 ? `₹${course.price}` : "Free"}
            </span>
            {course.oldPrice > 0 && (
              <span className="ml-1.5 text-[10px] text-[var(--text-muted)] line-through">₹{course.oldPrice}</span>
            )}
          </div>
          <span
            className="text-[10px] font-bold flex items-center gap-1 transition-all duration-200 group-hover:gap-2"
            style={{ color: "var(--accent)" }}
          >
            Enroll <FiArrowRight size={10} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CourseCategories() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    API.get("/lms/courses")
      .then(res => setCourses(res.data.courses || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === "All"
    ? courses
    : courses.filter(c =>
        (c.category || "").toLowerCase().includes(activeTab.toLowerCase()) ||
        activeTab.toLowerCase().includes((c.category || "").toLowerCase())
      );

  const displayed = filtered.slice(0, 8);

  const handleViewAll = () => {
    if (activeTab === "All") navigate("/courses");
    else navigate(`/courses?category=${encodeURIComponent(activeTab)}`);
  };

  const handleCardClick = (course) => {
    navigate(`/courses?category=${encodeURIComponent(course.category || "")}`);
  };

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--section-bg)" }}
    >
      {/* Background orbs */}
      <div className="absolute top-1/3 -left-20 w-96 h-96 orb-blue opacity-20 dark:opacity-40" />
      <div className="absolute bottom-0 right-0 w-80 h-80 orb-purple opacity-15 dark:opacity-30" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="section-pill mx-auto w-fit mb-4">
            <FiBookOpen size={12} /> Course Categories
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
            Explore{" "}
            <span className="grad-text">Every Subject</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-lg">
            From competitive exams to creative design — find the perfect course for your goals.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORY_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={
                  isActive
                    ? { background: `${tab.color}20`, color: tab.color, border: `1px solid ${tab.color}40`, boxShadow: `0 4px 16px ${tab.color}25` }
                    : { background: "var(--card-bg)", color: "var(--text-muted)", border: "1px solid var(--card-border)" }
                }
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-3 text-[var(--text-muted)]">
            <FiLoader size={28} className="animate-spin text-[var(--accent)]" />
            <span className="text-sm">Loading courses…</span>
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayed.map(course => (
              <MiniCourseCard
                key={course._id}
                course={course}
                onClick={() => handleCardClick(course)}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && displayed.length === 0 && (
          <div className="text-center py-16 rounded-3xl" style={{ border: "1px dashed var(--card-border)", background: "var(--card-bg)" }}>
            <FiBookOpen size={40} className="text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-muted)] font-medium">No courses found in this category.</p>
            <button
              onClick={() => setActiveTab("All")}
              className="mt-4 px-5 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}
            >
              View All Courses
            </button>
          </div>
        )}

        {/* View All CTA */}
        {!loading && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-[var(--text-muted)]">
              Showing <span className="font-bold text-[var(--text-primary)]">{displayed.length}</span> of{" "}
              <span className="font-bold text-[var(--text-primary)]">{filtered.length}</span> courses
            </p>
            <button
              onClick={handleViewAll}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 8px 24px rgba(6,182,212,0.25)" }}
            >
              Browse All Courses <FiChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
