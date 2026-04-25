import ContactUsComponent from "../components/home/ContactUs";

export default function Contact() {
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
            Get in Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight dark:text-white">
            We're Here to <span className="grad-text">Help</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Have questions about the platform, pricing, or need technical support? Our team is available to assist you 24/7.
          </p>
        </div>
      </section>

      <ContactUsComponent />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-3xl mx-auto mb-6">📍</div>
            <h3 className="font-bold mb-2 dark:text-white">Our Office</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">123 Education Lane,<br />Tech City, TC 10101</p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-3xl mx-auto mb-6">📧</div>
            <h3 className="font-bold mb-2 dark:text-white">Email Us</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">support@tutorhours.com<br />info@tutorhours.com</p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-3xl mx-auto mb-6">📞</div>
            <h3 className="font-bold mb-2 dark:text-white">Call Us</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">+1 (555) 000-0000<br />Mon-Fri, 9am-6pm</p>
          </div>
        </div>
      </section>
    </div>
  );
}
