import { useEffect, useRef, useState } from "react";
import {
  FiUserPlus, FiCalendar, FiMonitor, FiCheckSquare,
  FiTrendingUp, FiAward, FiArrowRight, FiZap
} from "react-icons/fi";

const steps = [
  {
    icon: <FiUserPlus />,
    title: "Sign Up Free",
    desc: "Create your student account in under 2 minutes — no credit card needed.",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.35)",
    tag: "Step 01",
  },
  {
    icon: <FiCalendar />,
    title: "Book a Session",
    desc: "Browse verified PhD Tutors & book a live class at your convenient time.",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.35)",
    tag: "Step 02",
  },
  {
    icon: <FiMonitor />,
    title: "Live Virtual Class",
    desc: "Join your interactive classroom with HD video, digital whiteboard & chat.",
    color: "#06B6D4",
    glow: "rgba(6,182,212,0.35)",
    tag: "Step 03",
  },
  {
    icon: <FiCheckSquare />,
    title: "Practice & Quizzes",
    desc: "Test & reinforce concepts with AI-adaptive quizzes after each session.",
    color: "#10B981",
    glow: "rgba(16,185,129,0.35)",
    tag: "Step 04",
  },
  {
    icon: <FiTrendingUp />,
    title: "AI Analytics",
    desc: "Review your personalized dashboard & receive AI improvement tips.",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.35)",
    tag: "Step 05",
  },
  {
    icon: <FiAward />,
    title: "Get Certified",
    desc: "Earn an accredited digital certificate to showcase on LinkedIn & CV.",
    color: "#F472B6",
    glow: "rgba(244,114,182,0.35)",
    tag: "Step 06",
  },
];

export default function LearningRoadmap() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "var(--section-bg-alt)" }}
    >
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] orb-blue opacity-15 dark:opacity-20" />
      <div className="absolute top-1/4 right-10 w-80 h-80 orb-purple opacity-15 dark:opacity-20" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top divider glow */}
      <div className="absolute top-0 left-0 right-0 h-px glow-divider" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-20">
          <div className="section-pill mx-auto w-fit mb-4">
            <FiZap size={12} /> Your Learning Journey
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-4 leading-tight">
            From Zero to <span className="grad-text">Certified Expert</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
            A clear, structured 6-step path designed to take you from beginner to master with confidence.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">

          {/* Desktop Connecting Line */}
          <div className="absolute top-[56px] left-8 right-8 hidden lg:block z-0 pointer-events-none">
            <div className="h-0.5 w-full relative bg-[var(--border)] rounded-full">
              {visible && (
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: "100%",
                    height: "2px",
                    background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #06B6D4, #10B981, #F59E0B, #F472B6)",
                    boxShadow: "0 0 16px rgba(6,182,212,0.6)",
                    animation: "roadmap-line 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                  }}
                />
              )}
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((step, i) => {
              const isHovered = hoveredIdx === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="group flex flex-col items-center text-center transition-all duration-300"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
                  }}
                >
                  {/* Step Node */}
                  <div className="relative mb-6">
                    {/* Glow ring */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{
                        background: step.glow,
                        filter: "blur(12px)",
                        transform: "scale(1.5)",
                      }}
                    />

                    {/* Circle icon */}
                    <div
                      className="relative w-24 h-24 rounded-3xl flex items-center justify-center text-3xl z-10 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: isHovered
                          ? `linear-gradient(135deg, ${step.color}, ${step.color}90)`
                          : "var(--card-bg)",
                        border: `1.5px solid ${isHovered ? step.color : "var(--card-border)"}`,
                        color: isHovered ? "#ffffff" : step.color,
                        backdropFilter: "blur(16px)",
                        boxShadow: isHovered ? `0 10px 30px ${step.glow}` : "var(--shadow-sm)",
                      }}
                    >
                      {step.icon}
                    </div>

                    {/* Step tag badge */}
                    <div
                      className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white z-20 shadow-lg"
                      style={{
                        background: step.color,
                        boxShadow: `0 2px 10px ${step.color}60`,
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div
                    className="w-full p-5 rounded-3xl transition-all duration-300 flex flex-col items-center flex-1"
                    style={{
                      background: isHovered ? "var(--surface-alt)" : "var(--card-bg)",
                      border: `1px solid ${isHovered ? step.color + "40" : "var(--card-border)"}`,
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest mb-1"
                      style={{ color: step.color }}
                    >
                      {step.tag}
                    </span>
                    <h3 className="font-bold text-[var(--text-primary)] text-base mb-2 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[var(--text-muted)] text-xs leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA below roadmap */}
        <div className="text-center mt-16">
          <a
            href="/register"
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl font-bold text-white text-sm transition-all duration-300 hover:scale-105 btn-ripple"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              boxShadow: "0 0 30px rgba(6,182,212,0.35)",
            }}
          >
            Start Your Journey Free <FiArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
