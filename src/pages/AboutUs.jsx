import { Link } from "react-router-dom";

const PHILOSOPHY = [
    {
        title: "Student-First Approach",
        desc: "Every feature we build starts with one question: 'How does this help the student learn better?'",
        icon: "🎯"
    },
    {
        title: "Quality Over Quantity",
        desc: "We manually verify every professor to ensure the highest standard of academic guidance.",
        icon: "💎"
    },
    {
        title: "Empowering Educators",
        desc: "We provide professors with modern tools to manage their schedules and grow their impact.",
        icon: "🚀"
    }
];

export default function AboutUs() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="/academic_hero_banner.png" 
                    alt="Banner" 
                    className="w-full h-full object-cover opacity-20 dark:opacity-40 brightness-[0.9] dark:brightness-[0.7]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)]/20 via-[var(--surface)]/80 to-[var(--surface)]" />
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 text-[var(--primary)] dark:text-[var(--accent)] text-xs font-bold tracking-wider uppercase mb-6 animate-fadeIn">
                        Our Mission
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight dark:text-white">
                        Democratizing <span className="grad-text">Expert</span> <br />
                        Education Globally
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
                        TutorHours was born from a simple observation: finding high-quality academic help shouldn't be a hurdle. We connect curious minds with verified experts.
                    </p>
                    
                    {/* Stats placeholder or image */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
                        {[
                            { label: "Founded", value: "2023" },
                            { label: "Tutors", value: "500+" },
                            { label: "Students", value: "10k+" },
                            { label: "Hours", value: "50k+" },
                        ].map((stat, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-white dark:bg-white/05 border border-slate-100 dark:border-white/10 shadow-sm">
                                <div className="text-3xl font-extrabold grad-text mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 bg-slate-50 dark:bg-[var(--surface-alt)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white leading-tight">
                                The Story Behind <br />
                                <span className="text-[var(--primary)]">TutorHours</span>
                            </h2>
                            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    Started by a group of former educators and tech enthusiasts, TutorHours set out to solve the fragmentation in the online tutoring space. We saw talented professors struggling to manage students, and students spending hours trying to find reliable help.
                                </p>
                                <p>
                                    We built a platform that handles the scheduling, payments, and virtual classroom logistics, allowing professors to focus on what they do best: teaching.
                                </p>
                                <div className="pt-4">
                                    <Link to="/register" className="inline-flex items-center gap-2 text-[var(--primary)] font-bold hover:gap-3 transition-all underline underline-offset-8 decoration-[var(--primary)]/30">
                                        Join our journey as a student or tutor →
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full aspect-video rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl animate-pulse">✨</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 dark:text-white">Our Core Philosophy</h2>
                        <p className="text-slate-500 dark:text-slate-400">Values that guide every decision we make</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {PHILOSOPHY.map((item, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-[var(--surface)] border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-all duration-300">
                                <div className="text-4xl mb-6">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-4 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
