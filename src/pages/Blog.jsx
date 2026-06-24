import { useState, useEffect } from "react";
import { FiSearch, FiFrown } from "react-icons/fi";
import API from "../services/api";

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCat, setActiveCat] = useState("All");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await API.get("/blog");
                setPosts(res.data || []);
            } catch {
                console.error("Failed to load blog posts");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Build category list dynamically from fetched posts
    const categories = ["All", ...new Set(posts.map(p => p.category))];

    const filtered = posts.filter(p => 
        (activeCat === "All" || p.category === activeCat) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
    );

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

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
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Latest updates, educational tips, and stories from the VishidhAcademy community.</p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 bg-white dark:bg-[var(--surface-alt)] p-6 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm">
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
                        <span className="absolute left-3.5 top-3 text-slate-400"><FiSearch /></span>

                    </div>
                </div>

                {/* Blog Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(post => (
                            <article key={post._id} className="group flex flex-col bg-white dark:bg-[var(--surface-alt)] rounded-[2.5rem] border border-slate-100 dark:border-white/10 overflow-hidden hover:shadow-2xl hover:shadow-[var(--primary)]/10 transition-all duration-500 hover:-translate-y-2">
                                <div className="relative h-48 overflow-hidden">
                                    {post.img ? (
                                        <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/20 to-indigo-500/20 flex items-center justify-center">
                                            <span className="text-4xl opacity-30">📝</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-[var(--surface)]/80 backdrop-blur-md text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                                        <span>{formatDate(post.createdAt)}</span>
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
                        <div className="text-5xl mb-4 text-slate-300"><FiFrown className="inline-block" /></div>

                        <h3 className="text-xl font-bold dark:text-white">No articles found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or category filters.</p>
                    </div>
                )}
            </div>
        </div>
    </>
    );
}
