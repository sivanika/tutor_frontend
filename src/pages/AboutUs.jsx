import { Link } from "react-router-dom";
import { FiTarget, FiAward, FiTrendingUp, FiCheckCircle, FiLinkedin, FiLayers, FiZap } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";

const PHILOSOPHY = [
  {
    title: "Student-First Approach",
    desc: "Every feature we build starts with one question: 'How does this help the student learn better?'",
    icon: <FiTarget />,
    color: "#3B82F6",
  },
  {
    title: "Quality Over Quantity",
    desc: "We manually verify every professor to ensure the highest standard of academic guidance.",
    icon: <FiAward />,
    color: "#8B5CF6",
  },
  {
    title: "Empowering Educators",
    desc: "We provide professors with modern tools to manage their schedules and grow their impact.",
    icon: <FiTrendingUp />,
    color: "#06B6D4",
  },
];

const LEADERS = [
  {
    id: "01",
    role: "Founder · Director · CEO",
    name: "Prof. V M Venkateswara Rao",
    desc: "Visionary founder with 17+ years in education. Drives strategic direction, platform transparency, and educator empowerment across all global operations.",
    color: "#3B82F6",
  },
  {
    id: "02",
    role: "Chief Technology Officer",
    name: "Dr. V. V. Sujatha",
    desc: "Ph.D.-level technology leader shaping the platform's digital architecture, research-driven innovations, and future-ready learning infrastructure.",
    color: "#8B5CF6",
  },
  {
    id: "03",
    role: "Operations & Community Lead",
    name: "V. V. Dethya Rao",
    desc: "Leads regional growth, tutor community management, and daily operations — upholding the founder's promise of transparency for every educator and learner.",
    color: "#06B6D4",
  },
];

export default function AboutUs() {
  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── Hero ── */}
      <section
        className="relative pt-36 pb-28 overflow-hidden"
        style={{ background: "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(42,77,110,0.4) 0%, rgba(59,130,246,0.1) 50%, transparent 70%), var(--hero-section)" }}
      >
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full animate-float3" style={{ background: "radial-gradient(circle, rgba(42,77,110,0.3), transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-20 w-96 h-96 orb-purple opacity-15 dark:opacity-25" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="section-pill mx-auto w-fit mb-6 animate-fadeIn">Our Mission</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[var(--text-primary)] leading-tight animate-slideUp">
            Democratizing <span className="grad-text">Expert</span> <br />
            Education Globally
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed mb-14 animate-slideUp delay-200">
            VishidhAcademy was born from a simple observation: finding high-quality academic help shouldn't be a hurdle. We connect curious minds with verified experts.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slideUp delay-300">
            {[
              { label: "Founded", value: "2023", color: "#3B82F6" },
              { label: "Tutors", value: "500+", color: "#8B5CF6" },
              { label: "Students", value: "20k+", color: "#06B6D4" },
              { label: "Sessions", value: "50k+", color: "#10B981" },
            ].map((s, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl text-center"
                style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", backdropFilter: "blur(16px)" }}
              >
                <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section className="py-24" style={{ background: "var(--section-bg-alt)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1">
              <div className="section-pill w-fit mb-5">Our Story</div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-[var(--text-primary)] leading-tight">
                The Story Behind <br />
                <span className="grad-text">VishidhAcademy</span>
              </h2>
              <div className="space-y-5 text-[var(--text-muted)] text-sm leading-relaxed">
                <p>Started by a group of former educators and tech enthusiasts, VishidhAcademy set out to solve the fragmentation in the online tutoring space. We saw talented professors struggling to manage students, and students spending hours trying to find reliable help.</p>
                <p>We built a platform that handles the scheduling, payments, and virtual classroom logistics, allowing professors to focus on what they do best: teaching.</p>
              </div>
              <div className="mt-7">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 8px 24px rgba(6,182,212,0.25)" }}
                >
                  Join our journey <FiZap size={14} />
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="flex-1 w-full aspect-video rounded-3xl relative overflow-hidden group" style={{ maxWidth: 520 }}>
              <div
                className="absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                style={{ background: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80') center/cover" }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(42,77,110,0.7), rgba(6,182,212,0.3))" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl animate-pulse" style={{ background: "rgba(6,182,212,0.2)", border: "1px solid rgba(6,182,212,0.4)", backdropFilter: "blur(8px)" }}>
                  <FiZap />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 px-4 py-2 rounded-2xl text-xs font-bold text-white" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Est. 2023 · Pune, India 🇮🇳
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Philosophy Section ── */}
      <section className="py-24" style={{ background: "var(--section-bg)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-pill mx-auto w-fit mb-4">Core Philosophy</div>
            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-4">
              Values that Guide <span className="grad-text">Every Decision</span>
            </h2>
            <p className="text-[var(--text-muted)] max-w-xl mx-auto">Our principles define how we build, grow, and serve.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PHILOSOPHY.map((item, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl overflow-hidden relative transition-all duration-350 hover:-translate-y-2 cursor-default"
                style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", backdropFilter: "blur(16px)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-5 transition-all duration-300 group-hover:scale-110" style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">{item.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership Profiles ── */}
      <section className="py-24" style={{ background: "var(--section-bg-alt)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-pill mx-auto w-fit mb-4">Leadership</div>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
              The Minds Behind <span className="grad-text">VishidhAcademy</span>
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Our leadership team brings together decades of academic excellence and technological innovation.
            </p>
          </div>

          {/* CEO */}
          <div className="group mb-16">
            <div className="flex flex-col lg:flex-row gap-10 items-center p-8 rounded-3xl" style={{ background: "var(--card-bg)", border: "1px solid rgba(59,130,246,0.15)", backdropFilter: "blur(16px)" }}>
              <div className="w-full lg:w-72 flex-shrink-0 aspect-[4/5] rounded-3xl overflow-hidden relative" style={{ boxShadow: "0 20px 60px rgba(59,130,246,0.2)" }}>
                <img src="/team/ceo.jpg" alt="Prof. V M Venkateswara Rao" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,8,22,0.8), transparent 60%)" }} />
                <div className="absolute bottom-5 left-5">
                  <p className="text-xs text-[#3B82F6] font-bold uppercase tracking-widest mb-1">Founder &amp; CEO</p>
                  <p className="text-white font-bold text-sm">Prof. V M Venkateswara Rao</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[#3B82F6] text-xs font-bold uppercase tracking-widest mb-2">Position 01 · Top Leadership</div>
                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-1">Prof. V M Venkateswara Rao</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6">Founder, Director &amp; CEO · VishidhAcademy.com</p>
                <blockquote className="relative pl-5 border-l-2 border-[#3B82F6] mb-6">
                  <FaQuoteLeft className="absolute -top-2 -left-2 text-[#3B82F6]/20 text-2xl" />
                  <p className="text-[var(--text-muted)] italic text-sm leading-relaxed">
                    "A capable person must receive the recognition and payment they truly deserve — no hidden charges, no compromises, no middlemen taking what belongs to the educator."
                  </p>
                </blockquote>
                <div className="space-y-3 text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                  <p>V. M. Venkateswara Rao is a visionary academic leader with over 20 years of experience in education, administration, and digital transformation. With a strong foundation in engineering education and institutional leadership, he identified the growing need for a structured, transparent, and technology-driven learning ecosystem.</p>
                  <p>His deep involvement in student counselling and career guidance has impacted thousands of learners, empowering them to make informed academic and professional decisions.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Head of Department", "Chief Examination Officer", "Career Guidance Expert", "Digital Transformation Leader", "Educator Since 2007"].map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <FiCheckCircle className="text-[#3B82F6] flex-shrink-0" size={12} /> {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTO */}
          <div className="group mb-16">
            <div className="flex flex-col lg:flex-row-reverse gap-10 items-center p-8 rounded-3xl" style={{ background: "var(--card-bg)", border: "1px solid rgba(139,92,246,0.15)", backdropFilter: "blur(16px)" }}>
              <div className="w-full lg:w-72 flex-shrink-0 aspect-[4/5] rounded-3xl overflow-hidden relative" style={{ boxShadow: "0 20px 60px rgba(139,92,246,0.2)" }}>
                <img src="/team/cto.jpg" alt="Dr. V. V. Sujatha" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,8,22,0.8), transparent 60%)" }} />
                <div className="absolute bottom-5 left-5">
                  <p className="text-xs text-[#8B5CF6] font-bold uppercase tracking-widest mb-1">Chief Technology Officer</p>
                  <p className="text-white font-bold text-sm">Dr. V. V. Sujatha</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[#8B5CF6] text-xs font-bold uppercase tracking-widest mb-2">Position 02 · Technology Leadership</div>
                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-1">Dr. V. V. Sujatha</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6">Chief Technology Officer · VishidhAcademy.com</p>
                <blockquote className="relative pl-5 border-l-2 border-[#8B5CF6] mb-6">
                  <FaQuoteLeft className="absolute -top-2 -left-2 text-[#8B5CF6]/20 text-2xl" />
                  <p className="text-[var(--text-muted)] italic text-sm leading-relaxed">
                    "Technology must serve education — not the other way around. My goal is to build systems that are intelligent, accessible, and deeply human in their impact."
                  </p>
                </blockquote>
                <div className="space-y-3 text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                  <p>Dr. V. V. Sujatha is a distinguished academician, researcher, and technology leader holding a Ph.D. in Wireless Communications, with extensive experience in engineering education and research innovation.</p>
                  <p>With decades of leadership as Principal, Dean Academics, and Head of Department, she has driven academic excellence and authored numerous international publications and patents.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Ph.D. – Wireless Communications", "Former Principal & Dean Academics", "International Publications & Patents", "Ph.D. Research Guide", "EdTech Innovator"].map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <FiCheckCircle className="text-[#8B5CF6] flex-shrink-0" size={12} /> {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Leadership Hierarchy */}
          <div className="flex flex-col lg:flex-row gap-12 mt-20">
            <div className="lg:w-1/3">
              <h2 className="text-2xl font-black text-[var(--text-primary)] mb-3">Leadership Hierarchy</h2>
              <p className="text-[var(--text-muted)] text-sm mb-6">The pillars that support our vision and operations.</p>
              <div className="p-6 rounded-3xl" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                <FiLayers className="text-[#06B6D4] text-xl mb-3" />
                <h4 className="font-bold text-[var(--text-primary)] mb-2 text-sm">Unwavering Commitment</h4>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">Our leaders work in synergy to uphold the promise of transparency, accessibility, and quality for every educator and learner globally.</p>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {LEADERS.map((l, i) => (
                <div
                  key={i}
                  className="flex gap-5 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-0.5 group"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", backdropFilter: "blur(16px)" }}
                >
                  <div className="text-4xl font-black opacity-20 group-hover:opacity-40 transition-opacity" style={{ color: l.color }}>{l.id}</div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: l.color }}>{l.role}</div>
                    <h4 className="text-base font-bold text-[var(--text-primary)] mb-1">{l.name}</h4>
                    <p className="text-[var(--text-muted)] text-xs leading-relaxed">{l.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
