import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Rocket,
  ArrowRight,
  Play,
  Users,
  BookOpen,
  Video,
  TrendingUp,
  Calendar,
  Award,
  Briefcase,
  ChevronRight,
  Sparkles,
  MousePointer,
  X
} from "lucide-react";

// CountUp Hook for statistics
function useCountUp(target, duration = 2000, start = true, isFloat = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      if (isFloat) {
        setValue(parseFloat((progress * target).toFixed(1)));
      } else {
        setValue(Math.floor(progress * target));
      }
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start, isFloat]);
  return value;
}

export default function Hero() {
  const navigate = useNavigate();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Statistics Animated Counters
  const countStudents = useCountUp(15, 1800);
  const countCourses = useCountUp(300, 1600);
  const countClasses = useCountUp(500, 1700);
  const countPlacement = useCountUp(95, 1500);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: custom * 0.12, ease: [0.215, 0.61, 0.355, 1] }
    })
  };

  return (
    <section className="relative text-[var(--text-primary)] min-h-screen overflow-hidden flex flex-col justify-between pt-[85px] pb-[35px] font-sans border-b border-[var(--border)]" style={{ background: "var(--hero-section)" }}>
      
      {/* ══════════════════════════════════════════════════
          LAYERED GRADIENT BACKGROUNDS & ATMOSPHERE
         ══════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Layer 2: Center Right Radial Gradient rgba(88,65,255,.22) */}
        <div
          className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-75"
          style={{
            background: "radial-gradient(circle, rgba(88,65,255,0.22) 0%, rgba(88,65,255,0.05) 50%, transparent 70%)",
            filter: "blur(90px)"
          }}
        />

        {/* Layer 3: Top Left Radial Gradient rgba(0,200,255,.10) */}
        <div
          className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(0,200,255,0.10) 0%, rgba(0,200,255,0.02) 60%, transparent 75%)",
            filter: "blur(100px)"
          }}
        />

        {/* Layer 4: Soft Purple Glow rgba(132,65,255,.15) */}
        <div
          className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full opacity-55"
          style={{
            background: "radial-gradient(circle, rgba(132,65,255,0.15) 0%, transparent 70%)",
            filter: "blur(85px)"
          }}
        />

        {/* Layer 5: Very Subtle 64px Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px"
          }}
        />

        {/* ── BACKGROUND FLOATING PARTICLES & ORBITAL DECORATIONS ── */}
        
        {/* Floating Glowing Dots & Particles */}
        {[
          { color: "#06D6FF", top: "15%", left: "12%", size: 6, delay: 0 },
          { color: "#A855F7", top: "25%", left: "85%", size: 8, delay: 2 },
          { color: "#3B82F6", top: "65%", left: "8%", size: 7, delay: 4 },
          { color: "#10B981", top: "75%", left: "92%", size: 6, delay: 1 },
          { color: "#8441FF", top: "40%", left: "48%", size: 5, delay: 3 },
        ].map((pt, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: pt.top,
              left: pt.left,
              width: pt.size,
              height: pt.size,
              backgroundColor: pt.color,
              boxShadow: `0 0 16px ${pt.color}`
            }}
            animate={{
              y: [0, -18, 0],
              x: [0, 10, 0],
              scale: [1, 1.25, 1],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{
              duration: 18 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pt.delay
            }}
          />
        ))}

        {/* Curved SVG Orbital Line */}
        <svg className="absolute top-1/4 left-1/3 w-[600px] h-[600px] opacity-10 pointer-events-none stroke-purple-400" fill="none">
          <ellipse cx="300" cy="300" rx="280" ry="140" strokeWidth="1.5" strokeDasharray="8 8" />
        </svg>

        {/* Bottom Left Blue Glowing Sphere */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-[#2563EB]/30 to-[#06D6FF]/20 blur-2xl pointer-events-none"
        />

        {/* Bottom Right Purple Glowing Cube Accent */}
        <motion.div
          animate={{ rotate: [0, 360], y: [0, -12, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-12 w-16 h-16 rounded-2xl border border-purple-500/20 bg-purple-900/10 backdrop-blur-md pointer-events-none shadow-[0_0_30px_rgba(168,85,247,0.15)]"
        />

      </div>

      {/* ══════════════════════════════════════════════════
          MAIN CONTAINER (MAX WIDTH 1440PX)
         ══════════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full relative z-10 my-auto">
        
        {/* 2 Column Grid Layout: Left 46% | Right 54% */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 lg:gap-8 items-center">
          
          {/* ══════════════════════════════════════════════════
              LEFT CONTENT COLUMN (46% - 4.6/10 Grid)
             ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-6 text-center sm:text-left flex flex-col items-center sm:items-start">
            
            {/* Small Badge: Rounded Pill */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="
                inline-flex items-center gap-2.5 h-[42px] px-4 py-2 rounded-[999px]
                bg-[var(--surface)] border border-[var(--secondary)]/25
                backdrop-blur-md shadow-[0_4px_20px_rgba(37,99,235,0.15)]
                hover:border-[var(--secondary)]/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]
                transition-all duration-300 cursor-default group
              "
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#A855F7] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Rocket className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[13px] sm:text-[14px] font-semibold text-[var(--text-muted)] tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>
                India's Next-Generation Learning Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-[28px] xs:text-[32px] sm:text-[46px] lg:text-[54px] xl:text-[58px] font-[900] leading-[1.1] tracking-[-1px] sm:tracking-[-2.5px] text-[var(--text-primary)]"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              <span className="block">Upgrade Your Skills.</span>
              <span className="block bg-gradient-to-r from-[#3B82F6] via-[#A855F7] to-[#06D6FF] bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto] filter drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                Build Real Projects.
              </span>
              <span className="block">Become Future Ready.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-[14px] sm:text-[17px] lg:text-[18px] text-[var(--text-muted)] font-normal leading-[1.6] sm:leading-[1.7] max-w-[540px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Learn from industry experts through live classes, practical projects, AI-powered learning, and placement support to build a successful career.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto"
            >
              {/* Primary Button */}
              <button
                onClick={() => navigate("/register")}
                className="
                  w-full sm:w-auto h-[46px] sm:h-[48px] px-[24px] sm:px-[28px] rounded-[14px] font-semibold text-[14px] sm:text-[15px] text-white
                  bg-gradient-to-r from-[#2563EB] to-[#7C3AED]
                  shadow-[0_0_25px_rgba(37,99,235,0.35)]
                  hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]
                  active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer
                "
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary Button */}
              <button
                onClick={() => setIsDemoOpen(true)}
                className="
                  w-full sm:w-auto h-[46px] sm:h-[48px] px-[20px] sm:px-[24px] rounded-[14px] font-medium text-[14px] sm:text-[15px]
                  text-[var(--text-muted)] hover:text-[var(--text-primary)]
                  bg-[var(--surface-alt)] border border-[var(--border)]
                  hover:bg-[var(--surface)] hover:border-[var(--secondary)]/40
                  transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group
                "
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <div className="w-6 h-6 rounded-full bg-[var(--secondary)]/20 text-[var(--secondary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo Class</span>
              </button>
            </motion.div>

            {/* Statistics Section (4 Columns) */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[var(--border)] w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-center text-left"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {/* Item 1 */}
              <div className="border-r border-[var(--border)] pr-2 sm:pr-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3B82F6]" />
                  <span className="text-[17px] sm:text-[24px] font-extrabold text-[var(--text-primary)]">{countStudents}K+</span>
                </div>
                <p className="text-[11px] sm:text-[12px] text-[var(--text-muted)] font-medium">Active Students</p>
              </div>

              {/* Item 2 */}
              <div className="sm:border-r border-[var(--border)] pr-2 sm:pr-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A855F7]" />
                  <span className="text-[17px] sm:text-[24px] font-extrabold text-[var(--text-primary)]">{countCourses}+</span>
                </div>
                <p className="text-[11px] sm:text-[12px] text-[var(--text-muted)] font-medium">Skill Courses</p>
              </div>

              {/* Item 3 */}
              <div className="border-r border-[var(--border)] pr-2 sm:pr-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#06D6FF]" />
                  <span className="text-[17px] sm:text-[24px] font-extrabold text-[var(--text-primary)]">{countClasses}+</span>
                </div>
                <p className="text-[11px] sm:text-[12px] text-[var(--text-muted)] font-medium">Live Classes</p>
              </div>

              {/* Item 4 */}
              <div className="pl-1 sm:pl-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10B981]" />
                  <span className="text-[17px] sm:text-[24px] font-extrabold text-[var(--text-primary)]">{countPlacement}%</span>
                </div>
                <p className="text-[11px] sm:text-[12px] text-[var(--text-muted)] font-medium">Placement Rate</p>
              </div>
            </motion.div>

          </div>


          {/* ══════════════════════════════════════════════════
              RIGHT SIDE COLUMN (54% - 5.4/10 Grid)
              Main Visual & Floating Cards
             ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 sm:pt-6 lg:pt-0 my-4 sm:my-0">
            
            {/* 3 Glowing Concentric Orbital Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="w-[260px] h-[260px] sm:w-[480px] sm:h-[480px] rounded-full border-2 border-indigo-400/[0.12] border-dashed"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                className="absolute w-[220px] h-[220px] sm:w-[420px] sm:h-[420px] rounded-full border-2 border-purple-400/[0.12]"
              />
              <div className="absolute w-[180px] h-[180px] sm:w-[360px] sm:h-[360px] rounded-full border-2 border-cyan-400/[0.10]" />
            </div>

            {/* Sparkle Icon Above Image */}
            <div className="absolute top-2 right-4 sm:right-8 text-[#06D6FF] animate-pulse z-20">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Main Visual: Circle Avatar */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[210px] h-[210px] xs:w-[240px] xs:h-[240px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px] rounded-full bg-gradient-to-tr from-[#2563EB]/40 via-[#7C3AED]/30 to-[#06D6FF]/30 p-2 sm:p-3 shadow-[0_0_90px_rgba(99,102,241,0.22)] flex items-center justify-center"
            >
              {/* Inner Circle Frame */}
              <div className="w-full h-full rounded-full border-4 border-white/10 shadow-2xl overflow-hidden relative bg-[#0B132B]">
                <img
                  src="/logos/hero.png"
                  alt="Student Visual"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 opacity-95"
                />
              </div>

              {/* ── CARD 1 (TOP RIGHT): LIVE CLASS TODAY ── */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="
                  absolute -top-2 -right-2 sm:-right-4 bg-[var(--surface)] backdrop-blur-[18px]
                  border border-[var(--card-border)] rounded-[14px] sm:rounded-[18px] p-2.5 sm:p-3 shadow-2xl z-30 max-w-[170px] sm:max-w-[200px]
                  hover:-translate-y-1 hover:border-blue-400/40 transition-all duration-300 scale-90 sm:scale-100
                "
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold text-red-500 dark:text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Live Class
                    </span>
                    <h4 className="text-[11px] sm:text-xs font-bold text-[var(--text-primary)] mt-0.5">React Basics</h4>
                  </div>
                </div>
              </motion.div>

              {/* ── CARD 2 (LEFT CENTER): PROGRESS 72% (Desktop / Tablet only) ── */}
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="
                  hidden sm:block absolute top-1/3 -left-6 bg-[var(--surface)] backdrop-blur-[18px]
                  border border-[var(--card-border)] rounded-[18px] p-3 shadow-2xl z-30 min-w-[160px]
                  hover:-translate-y-1 hover:border-cyan-400/40 transition-all duration-300
                "
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--accent)]" /> Progress
                  </span>
                  <span className="text-[11px] font-black text-[var(--accent)]">72%</span>
                </div>
                <div className="w-full bg-[var(--surface-alt)] h-2 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-[#3B82F6] to-[#06D6FF] h-full rounded-full w-[72%] shadow-[0_0_10px_rgba(6,214,255,0.5)]" />
                </div>
              </motion.div>

              {/* ── CARD 3 (RIGHT MIDDLE): CERTIFICATE EARNED (Desktop / Tablet only) ── */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4.8, ease: "easeInOut", repeat: Infinity, delay: 1.2 }}
                className="
                  hidden sm:block absolute bottom-16 -right-6 bg-[var(--surface)] backdrop-blur-[18px]
                  border border-[var(--card-border)] rounded-[18px] p-3 shadow-2xl z-30 max-w-[190px]
                  hover:-translate-y-1 hover:border-amber-400/40 transition-all duration-300
                "
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider">Certificate Earned</span>
                    <h4 className="text-[11px] font-bold text-[var(--text-primary)] leading-tight">Full Stack Dev</h4>
                  </div>
                </div>
              </motion.div>

              {/* ── CARD 4 (BOTTOM LEFT): PLACEMENT SUPPORT ── */}
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 1.6 }}
                className="
                  absolute -bottom-3 -left-2 sm:-left-4 bg-[var(--surface)] backdrop-blur-[18px]
                  border border-[var(--card-border)] rounded-[14px] sm:rounded-[18px] p-2.5 sm:p-3 shadow-2xl z-30 max-w-[160px] sm:max-w-[200px]
                  hover:-translate-y-1 hover:border-emerald-400/40 transition-all duration-300 scale-90 sm:scale-100
                "
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] sm:text-[11px] font-bold text-[var(--text-primary)] leading-tight">Placement Support</h4>
                    <p className="text-[8px] sm:text-[9px] text-[var(--text-muted)]">Top tech hiring</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/register")}
                  className="mt-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>

            </motion.div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════
            TRUST SECTION
           ══════════════════════════════════════════════════ */}
        {/* <div className="mt-12 pt-6 border-t border-[var(--border)]">
          <p className="text-center text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-light)] mb-4">
            TRUSTED BY STUDENTS &amp; LEADING TECH ORGANIZATIONS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-75 hover:opacity-100 transition-opacity">
            {["Anna University", "SRM", "VIT", "SASTRA", "TCS", "Infosys", "Zoho", "Cognizant"].map((logo, idx) => (
              <span
                key={idx}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] font-extrabold text-xs sm:text-sm tracking-wider transition-colors cursor-default"
              >
                {logo}
              </span>
            ))}
          </div>
        </div> */}

      </div>

      {/* ── SCROLL DOWN INDICATOR ── */}
      <div className="flex justify-center pt-8">
        <a
          href="#courses"
          className="flex flex-col items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-xs font-medium group animate-bounce-slow"
        >
          <MousePointer className="w-4 h-4 text-[var(--secondary)]" />
          <span>Scroll Down</span>
        </a>
      </div>

      {/* ── DEMO CLASS MODAL ── */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--overlay-bg)] backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-[var(--surface)] border border-[var(--card-border)] rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-alt)]">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-[var(--secondary)]" />
                <h3 className="text-[var(--text-primary)] font-bold text-base">Vishidh Academy — Sample Demo Class</h3>
              </div>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--surface-alt)] hover:bg-[var(--surface-2)] text-[var(--text-muted)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Demo Class"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
