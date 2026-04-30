import { Link } from "react-router-dom";
import { FiTarget, FiAward, FiTrendingUp, FiZap, FiCheckCircle, FiLinkedin, FiLayers } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";


const PHILOSOPHY = [
    {
        title: "Student-First Approach",
        desc: "Every feature we build starts with one question: 'How does this help the student learn better?'",
        icon: <FiTarget />
    },
    {
        title: "Quality Over Quantity",
        desc: "We manually verify every professor to ensure the highest standard of academic guidance.",
        icon: <FiAward />
    },
    {
        title: "Empowering Educators",
        desc: "We provide professors with modern tools to manage their schedules and grow their impact.",
        icon: <FiTrendingUp />
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
                                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl animate-pulse"><FiZap /></div>

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
                                <div className="text-4xl mb-6 text-[var(--primary)]">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-4 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="py-32 bg-slate-50 dark:bg-[var(--surface-alt)] relative overflow-hidden">
                {/* Decorative backgrounds */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--primary)]/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 text-[var(--primary)] dark:text-[var(--accent)] text-xs font-bold tracking-wider uppercase mb-6">
                            Leadership
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white">The Minds Behind <span className="grad-text">TutorHours</span></h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                            Our leadership team brings together decades of academic excellence and technological innovation to redefine the learning ecosystem.
                        </p>
                    </div>

                    {/* CEO & CTO Profiles */}
                    <div className="space-y-24">
                        {/* CEO Profile */}
                        <div className="group">
                            <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-stretch">
                                <div className="w-full lg:w-1/3 aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                                    <img 
                                        src="/team/ceo.jpg" 
                                        alt="Prof. V M Venkateswara Rao" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Founder & CEO</p>
                                        <p className="text-xl font-bold">Prof. V M Venkateswara Rao</p>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="mb-6">
                                        <div className="text-[var(--primary)] text-sm font-bold uppercase tracking-tighter mb-2">Position 01 · Top Leadership</div>
                                        <h3 className="text-3xl font-bold dark:text-white">Prof. V M Venkateswara Rao</h3>
                                        <p className="text-slate-500 dark:text-[var(--accent)] font-medium">Founder, Director & CEO · TutorHours.com</p>
                                    </div>
                                    
                                    <div className="relative mb-8">
                                        <FaQuoteLeft className="absolute -top-4 -left-4 text-4xl text-[var(--primary)]/10" />
                                        <p className="text-lg italic text-slate-700 dark:text-slate-300 pl-4 border-l-4 border-[var(--primary)]">
                                            "A capable person must receive the recognition and payment they truly deserve — no hidden charges, no compromises, no middlemen taking what belongs to the educator."
                                        </p>
                                    </div>

                                    <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
                                        <p>V. M. Venkateswara Rao is a visionary academic leader with over 20 years of experience in education, administration, and digital transformation. With a strong foundation in engineering education and institutional leadership, he identified the growing need for a structured, transparent, and technology-driven learning ecosystem — a vision that led to the creation of TutorHours.com.</p>
                                        <p>Throughout his career, he has demonstrated excellence in academic administration as a Head of Department and Chief Examination Officer, introducing efficient, digitized processes that enhanced operational accuracy and institutional trust. His deep involvement in student counselling and career guidance has impacted thousands of learners, empowering them to make informed academic and professional decisions.</p>
                                        <p>Recognizing the widening gap between traditional education and modern learning demands, he channelled his expertise into building a scalable online platform that prioritizes accessibility, quality, and trust. TutorHours.com is his commitment — a unified platform integrating learning, hiring, and career insights with a relentless focus on user-centric design and full transparency.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            "Head of Department", "Chief Examination Officer", 
                                            "Career Guidance Expert", "Digital Transformation Leader", 
                                            "Educator Since 2007"
                                        ].map((cert, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                <FiCheckCircle className="text-[var(--primary)]" /> {cert}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTO Profile */}
                        <div className="group">
                            <div className="flex flex-col lg:flex-row-reverse gap-12 items-center lg:items-stretch">
                                <div className="w-full lg:w-1/3 aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                                    <img 
                                        src="/team/cto.jpg" 
                                        alt="Dr. V. V. Sujatha" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Chief Technology Officer</p>
                                        <p className="text-xl font-bold">Dr. V. V. Sujatha</p>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="mb-6">
                                        <div className="text-[var(--accent)] text-sm font-bold uppercase tracking-tighter mb-2">Position 02 · Technology Leadership</div>
                                        <h3 className="text-3xl font-bold dark:text-white">Dr. V. V. Sujatha</h3>
                                        <p className="text-slate-500 dark:text-[var(--accent)] font-medium">Chief Technology Officer · TutorHours.com</p>
                                    </div>
                                    
                                    <div className="relative mb-8">
                                        <FaQuoteLeft className="absolute -top-4 -left-4 text-4xl text-[var(--accent)]/10" />
                                        <p className="text-lg italic text-slate-700 dark:text-slate-300 pl-4 border-l-4 border-[var(--accent)]">
                                            "Technology must serve education — not the other way around. My goal is to build systems that are intelligent, accessible, and deeply human in their impact."
                                        </p>
                                    </div>

                                    <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
                                        <p>Dr. V. V. Sujatha is a distinguished academician, researcher, and technology leader holding a Ph.D. in Wireless Communications, with extensive experience in engineering education and research innovation. Her transition from academia to digital e-learning reflects a forward-thinking approach to bridging the gap between traditional education and modern, technology-driven learning environments.</p>
                                        <p>With decades of leadership as Principal, Dean Academics, and Head of Department, she has consistently driven academic excellence and institutional growth. She has authored numerous international journal publications, books, and patents, cementing her standing as a credible contributor to the global research community. As a recognized Ph.D. guide, she has mentored scholars and fostered a vibrant culture of innovation.</p>
                                        <p>At TutorHours, Dr. Sujatha leads the development of scalable, intelligent, and user-centric technology solutions. Her expertise ensures the platform remains robust, secure, and aligned with the evolving needs of learners and educators worldwide.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            "Ph.D. – Wireless Communications", "Former Principal & Dean Academics", 
                                            "International Publications & Patents", "Ph.D. Research Guide", 
                                            "EdTech Innovator"
                                        ].map((cert, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                <FiCheckCircle className="text-[var(--accent)]" /> {cert}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Hierarchy */}
            <section className="py-32 bg-white dark:bg-[var(--surface)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/3">
                            <h2 className="text-3xl font-black mb-4 dark:text-white">Leadership Hierarchy</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">The pillars that support our vision and operations.</p>
                            <div className="p-8 rounded-3xl bg-[var(--primary)]/5 dark:bg-white/05 border border-[var(--primary)]/10">
                                <FiLayers className="text-4xl text-[var(--primary)] mb-4" />
                                <h4 className="font-bold dark:text-white mb-2">Unwavering Commitment</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Our leaders work in synergy to uphold the promise of transparency, accessibility, and quality for every educator and learner globally.</p>
                            </div>
                        </div>
                        <div className="flex-1 space-y-8">
                            {[
                                {
                                    id: "01",
                                    role: "Founder · Director · CEO",
                                    name: "Prof. V M Venkateswara Rao",
                                    desc: "Visionary founder with 17+ years in education. Drives strategic direction, platform transparency, and educator empowerment across all global operations."
                                },
                                {
                                    id: "02",
                                    role: "Chief Technology Officer",
                                    name: "Dr. V. V. Sujatha",
                                    desc: "Ph.D.-level technology leader shaping the platform's digital architecture, research-driven innovations, and future-ready learning infrastructure."
                                },
                                {
                                    id: "03",
                                    role: "Operations & Community Lead",
                                    name: "V. V. Dethya Rao",
                                    desc: "Leads regional growth, tutor community management, and daily operations — upholding the founder's promise of transparency for every educator and learner."
                                }
                            ].map((level, i) => (
                                <div key={i} className="flex gap-6 p-8 rounded-3xl border border-slate-100 dark:border-white/10 hover:border-[var(--primary)]/30 transition-all group">
                                    <div className="text-4xl font-black text-slate-200 dark:text-white/10 group-hover:text-[var(--primary)] transition-colors">{level.id}</div>
                                    <div>
                                        <div className="text-[var(--primary)] text-xs font-bold uppercase tracking-widest mb-1">{level.role}</div>
                                        <h4 className="text-xl font-bold dark:text-white mb-2">{level.name}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{level.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
