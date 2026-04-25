import FeaturesComponent from "../components/home/Features";

export default function Features() {
  return (
    <div>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/academic_hero_banner.png" 
            alt="Banner" 
            className="w-full h-full object-cover opacity-20 dark:opacity-40 brightness-[0.9] dark:brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)]/20 via-[var(--surface)]/80 to-[var(--surface)]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 text-[var(--primary)] dark:text-[var(--accent)] text-xs font-bold tracking-wider uppercase mb-6">
            Platform Capabilities
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight dark:text-white">
            Powerful Tools for <span className="grad-text">Modern</span> <br />
            Learning & Teaching
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover the next-generation features designed to connect verified professors with students in a seamless, secure, and highly interactive environment.
          </p>
        </div>
      </section>
      
      <FeaturesComponent />
      
      {/* Additional feature details could go here */}
      <section className="py-24 bg-slate-50 dark:bg-[var(--surface-alt)]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 dark:text-white">Ready to experience these features?</h2>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 rounded-xl grad-bg text-white font-bold shadow-lg hover:scale-105 transition-all">
              Get Started Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
