import {
  FiHash, FiCode, FiActivity, FiGlobe, FiBarChart2,
  FiLayers, FiBookOpen, FiAward
} from "react-icons/fi";

const categories = [
  {
    icon: <FiHash />,
    title: "Mathematics",
    students: "4,200+",
    duration: "60 min avg",
    difficulty: "All Levels",
    diffColor: "#3B82F6",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.3)",
    desc: "Calculus, Algebra, Statistics & more",
  },
  {
    icon: <FiActivity />,
    title: "Physics",
    students: "2,800+",
    duration: "75 min avg",
    difficulty: "Intermediate",
    diffColor: "#8B5CF6",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.3)",
    desc: "Mechanics, Electromagnetism, Quantum",
  },
  {
    icon: <FiCode />,
    title: "Programming & CS",
    students: "6,100+",
    duration: "90 min avg",
    difficulty: "Beginner",
    diffColor: "#10B981",
    color: "#06B6D4",
    glow: "rgba(6,182,212,0.3)",
    desc: "Python, JavaScript, Data Structures",
  },
  {
    icon: <FiLayers />,
    title: "Chemistry",
    students: "1,900+",
    duration: "60 min avg",
    difficulty: "Advanced",
    diffColor: "#EF4444",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.3)",
    desc: "Organic, Inorganic, Physical Chem",
  },
  {
    icon: <FiGlobe />,
    title: "English & Languages",
    students: "3,500+",
    duration: "45 min avg",
    difficulty: "Beginner",
    diffColor: "#10B981",
    color: "#10B981",
    glow: "rgba(16,185,129,0.3)",
    desc: "Grammar, Writing, IELTS / TOEFL",
  },
  {
    icon: <FiBarChart2 />,
    title: "Data Analytics",
    students: "2,200+",
    duration: "90 min avg",
    difficulty: "Intermediate",
    diffColor: "#8B5CF6",
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.3)",
    desc: "SQL, Power BI, Python Analytics",
  },
  {
    icon: <FiLayers />,
    title: "UI/UX Design",
    students: "1,600+",
    duration: "60 min avg",
    difficulty: "Beginner",
    diffColor: "#10B981",
    color: "#F472B6",
    glow: "rgba(244,114,182,0.3)",
    desc: "Figma, User Research, Prototyping",
  },
  {
    icon: <FiAward />,
    title: "Test Prep / Exams",
    students: "5,400+",
    duration: "120 min avg",
    difficulty: "Advanced",
    diffColor: "#EF4444",
    color: "#FB923C",
    glow: "rgba(251,146,60,0.3)",
    desc: "JEE, NEET, SAT, CAT, UPSC & more",
  },
];

export default function CourseCategories() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--section-bg)" }}
    >
      {/* Background orbs */}
      <div className="absolute top-1/3 -left-20 w-96 h-96 orb-blue opacity-20 dark:opacity-40" />
      <div className="absolute bottom-0 right-0 w-80 h-80 orb-purple opacity-15 dark:opacity-30" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-14">
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group relative rounded-3xl p-6 overflow-hidden cursor-pointer transition-all duration-350 hover:-translate-y-2"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Hover glow bg */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(ellipse at 30% 30%, ${cat.glow.replace('0.3', '0.1')}, transparent 65%)` }}
              />

              {/* Top color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }}
              />

              {/* Icon */}
              <div
                className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${cat.color}15`,
                  border: `1px solid ${cat.color}30`,
                  color: cat.color,
                  boxShadow: `0 0 20px ${cat.color}20`,
                }}
              >
                {cat.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-[var(--text-primary)] text-base mb-1 relative">{cat.title}</h3>
              <p className="text-[var(--text-muted)] text-xs mb-4 relative">{cat.desc}</p>

              {/* Meta */}
              <div className="relative space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-light)]">Students</span>
                  <span className="text-[var(--text-muted)] font-semibold">{cat.students}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-light)]">Session</span>
                  <span className="text-[var(--text-muted)] font-semibold">{cat.duration}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-light)]">Level</span>
                  <span
                    className="font-bold text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: `${cat.diffColor}18`,
                      color: cat.diffColor,
                      border: `1px solid ${cat.diffColor}30`,
                    }}
                  >
                    {cat.difficulty}
                  </span>
                </div>
              </div>

              {/* Hover CTA */}
              <div
                className="relative mt-4 pt-3 border-t border-white/05 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="text-xs font-semibold" style={{ color: cat.color }}>View Courses</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke={cat.color} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
