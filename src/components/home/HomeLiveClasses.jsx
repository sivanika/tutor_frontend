import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlayCircle, FiClock, FiCalendar, FiUsers,
  FiArrowRight, FiZap, FiStar, FiChevronRight
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";

const GRADIENTS = [
  "linear-gradient(135deg, #3B82F6, #06B6D4)",
  "linear-gradient(135deg, #8B5CF6, #3B82F6)",
  "linear-gradient(135deg, #06B6D4, #10B981)",
  "linear-gradient(135deg, #F59E0B, #EF4444)",
  "linear-gradient(135deg, #A78BFA, #8B5CF6)",
  "linear-gradient(135deg, #F472B6, #A78BFA)",
];

function LiveClassMiniCard({ cls, idx, onClick }) {
  const grad = cls.gradient || GRADIENTS[idx % GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.06 }}
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Gradient header strip */}
      <div
        className="relative h-28 flex items-center justify-center overflow-hidden shrink-0"
        style={{ background: grad }}
      >
        {/* Category badge */}
        <span className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/10">
          {cls.category}
        </span>
        {/* Level badge */}
        <span className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md text-white/80 text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/10">
          {cls.level}
        </span>
        {/* Play icon */}
        <FiPlayCircle
          size={32}
          className="text-white/80 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
        />
        {/* Seats urgency indicator */}
        {cls.seatsLeft <= 5 && (
          <span className="absolute bottom-2 left-2.5 bg-red-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
            Only {cls.seatsLeft} left
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-[var(--text-primary)] text-sm leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
          {cls.title}
        </h3>
        <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed flex-1">
          {cls.shortDesc}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[var(--text-muted)] font-medium">
          <span className="flex items-center gap-1">
            <FiCalendar size={10} className="text-[var(--accent)]" />
            {cls.startDate}
          </span>
          <span className="flex items-center gap-1">
            <FiClock size={10} className="text-[var(--accent)]" />
            {cls.durationWeeks}w
          </span>
          <span className="flex items-center gap-1">
            <FiUsers size={10} className="text-[var(--accent)]" />
            {cls.seatsLeft} seats
          </span>
          {cls.rating > 0 && (
            <span className="flex items-center gap-0.5 text-amber-400 font-bold ml-auto">
              <FiStar size={9} fill="currentColor" /> {cls.rating}
            </span>
          )}
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--card-border)]">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0"
            style={{ background: grad }}
          >
            {cls.instructor?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[var(--text-primary)] truncate">{cls.instructor}</p>
          </div>
          <span className="ml-auto text-xl font-black" style={{ color: "var(--text-primary)", fontSize: "0.85rem" }}>
            ₹{cls.price?.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomeLiveClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/live-classes")
      .then(res => setClasses(res.data || []))
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && classes.length === 0) return null;

  const displayed = classes.slice(0, 6);

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--section-bg-alt)" }}
    >
      {/* Decorative orbs */}
      <div className="absolute top-0 right-1/4 w-72 h-72 orb-blue opacity-15 dark:opacity-25" />
      <div className="absolute bottom-0 left-0 w-64 h-64 orb-purple opacity-10 dark:opacity-20" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="section-pill w-fit mb-4">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              Live Classes
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)]">
              Learn Live,{" "}
              <span className="grad-text">With a Mentor</span>
            </h2>
            <p className="text-[var(--text-muted)] mt-3 max-w-lg">
              Fixed-schedule cohorts with real-time feedback, weekly sessions and recorded replays.
            </p>
          </div>
          <button
            onClick={() => navigate("/live-classes")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 shrink-0"
            style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 8px 24px rgba(6,182,212,0.25)" }}
          >
            View All Live Classes <FiChevronRight size={16} />
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
              >
                <div className="h-28" style={{ background: "var(--surface-alt)" }} />
                <div className="p-3.5 space-y-2">
                  <div className="h-4 rounded-lg w-3/4" style={{ background: "var(--surface-alt)" }} />
                  <div className="h-3 rounded-lg w-full" style={{ background: "var(--surface-alt)" }} />
                  <div className="h-3 rounded-lg w-2/3" style={{ background: "var(--surface-alt)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards grid */}
        {!loading && displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayed.map((cls, idx) => (
              <LiveClassMiniCard
                key={cls._id}
                cls={cls}
                idx={idx}
                onClick={() => navigate("/live-classes")}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA strip */}
        {!loading && displayed.length > 0 && (
          <div
            className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}
              >
                <FiZap size={18} />
              </div>
              <div>
                <p className="font-bold text-[var(--text-primary)] text-sm">
                  {classes.length} live cohorts open for enrollment
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Seats fill fast — every session is recorded for enrolled students.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/live-classes")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 shrink-0"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)" }}
            >
              Explore All Cohorts <FiArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
