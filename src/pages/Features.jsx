import FeaturesComponent from "../components/home/Features";
import CourseCategories from "../components/home/CourseCategories";
import LearningRoadmap from "../components/home/LearningRoadmap";
import CTA from "../components/home/CTA";
import { FiZap } from "react-icons/fi";

export default function Features() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(139,92,246,0.3) 0%, rgba(59,130,246,0.15) 40%, transparent 70%), var(--hero-section)" }}>
        <div className="absolute -top-20 right-1/4 w-96 h-96 orb-purple opacity-20 dark:opacity-30" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 orb-cyan opacity-15 dark:opacity-20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="section-pill mx-auto w-fit mb-6 animate-fadeIn">
            <FiZap size={12} /> Platform Capabilities
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[var(--text-primary)] leading-tight animate-slideUp">
            Powerful Tools for <span className="grad-text">Modern</span> <br />
            Learning &amp; Teaching
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed animate-slideUp delay-200">
            Discover the next-generation features designed to connect verified professors with students
            in a seamless, secure, and highly interactive environment.
          </p>
        </div>
      </section>

      <FeaturesComponent />
      <CourseCategories />
      <LearningRoadmap />
      <CTA />
    </div>
  );
}
