import PricingComponent from "../components/home/Pricing";

export default function Pricing() {
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
            Simple & Transparent
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight dark:text-white">
            Plans for Every <br />
            <span className="grad-text">Learning Goal</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Choose a plan that fits your needs. Whether you're a student looking for guidance or a professor looking to teach, we have a transparent pricing model for you.
          </p>
        </div>
      </section>
      
      <PricingComponent />
      
      <section className="py-24 bg-[var(--surface-alt)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[var(--surface)] border border-slate-100 dark:border-white/10">
              <h3 className="font-bold mb-2 dark:text-white">Can I cancel my subscription?</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Yes, you can cancel your subscription at any time from your dashboard settings. You will retain access until the end of your billing period.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[var(--surface)] border border-slate-100 dark:border-white/10">
              <h3 className="font-bold mb-2 dark:text-white">Are there any hidden fees?</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">No hidden fees. The price you see is the price you pay. Tutor session rates are clearly listed on every professor's profile.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
