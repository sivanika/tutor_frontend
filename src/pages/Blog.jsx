import { useState } from "react";

const POSTS = [
    {
        id: 1,
        title: "How to Choose the Right Tutor for Your Engineering Degree",
        excerpt: "Finding the perfect match for complex subjects like thermodynamics or circuit theory requires a specific checklist...",
        category: "Education",
        author: "Dr. Sarah Mitchell",
        date: "Oct 24, 2023",
        img: "https://images.unsplash.com/photo-1434030216411-0bb7538aaa5d?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 2,
        title: "5 Tips for Effective Online Learning in 2023",
        excerpt: "Online learning can be challenging. We reached out to our top-performing students to find out how they stay focused and motivated.",
        category: "Guides",
        author: "James Wilson",
        date: "Oct 22, 2023",
        img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 3,
        title: "The Future of Tutoring: AI vs. Human Mentorship",
        excerpt: "While AI is making strides in automated grading, the human element of mentorship remains irreplaceable in academic success.",
        category: "Tech",
        author: "Prof. Robert Chen",
        date: "Oct 18, 2023",
        img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 4,
        title: "Understanding Complex Calculus: A Short Guide",
        excerpt: "Calculus doesn't have to be intimidating. Here's a breakdown of the core concepts that students often struggle with.",
        category: "Math",
        author: "Dr. Elena Rossi",
        date: "Oct 15, 2023",
        img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400"
    }
];

export default function Blog() {
    const [search, setSearch] = useState("");
    const categories = ["All", "Education", "Guides", "Tech", "Math"];
    const [activeCat, setActiveCat] = useState("All");

    const filtered = POSTS.filter(p => 
        (activeCat === "All" || p.category === activeCat) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <>
        <div>
                {/* Hero Section */}
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
                            Our Journal
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 dark:text-white">Insights & <span className="grad-text">Knowledge</span></h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Latest updates, educational tips, and stories from the TutorHours community.</p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 bg-slate-50 dark:bg-white/05 p-6 rounded-3xl border border-slate-100 dark:border-white/10">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCat(cat)}
                                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    activeCat === cat 
                                    ? "grad-bg text-white shadow-lg shadow-[var(--primary)]/30" 
                                    : "bg-white dark:bg-white/05 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[var(--primary)]/50 focus:outline-none dark:text-white"
                        />
                        <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
                    </div>
                </div>

                {/* Blog Grid */}
                {filtered.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(post => (
                            <article key={post.id} className="group flex flex-col bg-white dark:bg-white/05 rounded-[2.5rem] border border-slate-100 dark:border-white/10 overflow-hidden hover:shadow-2xl hover:shadow-[var(--primary)]/10 transition-all duration-500 hover:-translate-y-2">
                                <div className="relative h-48 overflow-hidden">
                                    <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-[var(--surface)]/80 backdrop-blur-md text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                                        <span>{post.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        <span>{post.author}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 dark:text-white leading-tight group-hover:text-[var(--primary)] transition-colors">{post.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <button className="flex items-center gap-2 text-sm font-bold text-[var(--primary)] hover:gap-3 transition-all">
                                        Read Full Article <span>→</span>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-white/05 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                        <div className="text-5xl mb-4">🏜️</div>
                        <h3 className="text-xl font-bold dark:text-white">No articles found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or category filters.</p>
                    </div>
                )}
            </div>
        </div>
    </>
    );
}
