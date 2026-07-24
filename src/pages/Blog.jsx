import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiFrown, FiCalendar, FiUser, FiArrowRight } from "react-icons/fi";
import API from "../services/api";
import { media } from "../utils/media";

const CAT_COLORS = {
  Technology: "#3B82F6",
  Education: "#06B6D4",
  Career: "#10B981",
  Science: "#8B5CF6",
  Design: "#F472B6",
  Programming: "#06B6D4",
  Mathematics: "#F59E0B",
  Default: "#3B82F6",
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  useEffect(() => {
    API.get("/blog")
      .then((res) => setPosts(res.data || []))
      .catch(() => console.error("Failed to load blog posts"))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(posts.map((p) => p.category))];
  const filtered = posts.filter(
    (p) =>
      (activeCat === "All" || p.category === activeCat) &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt || "").toLowerCase().includes(search.toLowerCase()))
  );

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* ── Hero ── */}
      <section
        className="relative pt-36 pb-24 overflow-hidden"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(6,182,212,0.25) 0%, rgba(59,130,246,0.1) 50%, transparent 70%), var(--hero-section)" }}
      >
        <div className="absolute -top-20 left-1/4 w-96 h-96 orb-cyan opacity-20 dark:opacity-25" />
        <div className="absolute top-1/2 right-0 w-80 h-80 orb-purple opacity-15 dark:opacity-20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="section-pill mx-auto w-fit mb-6 animate-fadeIn">Our Journal</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[var(--text-primary)] leading-tight animate-slideUp">
            Insights &amp; <br />
            <span className="grad-text">Knowledge</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed animate-slideUp delay-200">
            Latest updates, educational tips, and stories from the VishidhAcademy community.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Filters Bar */}
        <div
          className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 p-5 rounded-3xl"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const color = CAT_COLORS[cat] || CAT_COLORS.Default;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={
                    activeCat === cat
                      ? { background: `linear-gradient(135deg, ${color}, ${color}80)`, color: "#fff", boxShadow: `0 4px 16px ${color}30` }
                      : { background: "var(--surface-alt)", border: "1px solid var(--card-border)", color: "var(--text-muted)" }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all"
              style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }}
            />
            <FiSearch className="absolute left-3.5 top-3 text-[var(--text-muted)]" size={14} />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => {
              const catColor = CAT_COLORS[post.category] || CAT_COLORS.Default;
              return (
                <article
                  key={post._id}
                  className="group flex flex-col rounded-3xl overflow-hidden transition-all duration-400 hover:-translate-y-2 relative"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", backdropFilter: "blur(16px)" }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {post.img ? (
                      <img
                        src={media(post.img)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${catColor}20, ${catColor}08)` }}
                      >
                        <span className="text-4xl opacity-20">📝</span>
                      </div>
                    )}
                    {/* Category badge */}
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: `${catColor}20`, border: `1px solid ${catColor}40`, color: catColor, backdropFilter: "blur(8px)" }}
                    >
                      {post.category}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4">
                      <span className="flex items-center gap-1"><FiCalendar size={10} /> {formatDate(post.createdAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--card-border)]" />
                      <span className="flex items-center gap-1"><FiUser size={10} /> {post.author}</span>
                    </div>
                    <h3
                      className="text-lg font-bold mb-3 text-[var(--text-primary)] leading-tight transition-colors duration-200"
                    >
                      {post.title}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Top accent line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl" style={{ background: `linear-gradient(90deg, transparent, ${catColor}, transparent)` }} />

                    <Link
                      to={`/blog/${post._id}`}
                      className="flex items-center gap-2 text-sm font-bold transition-all duration-200 group/link"
                      style={{ color: catColor }}
                    >
                      Read Full Article
                      <FiArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center py-24 rounded-3xl"
            style={{ background: "var(--card-bg)", border: "1px dashed var(--card-border)" }}
          >
            <FiFrown className="text-5xl text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--text-primary)]">No articles found</h3>
            <p className="text-[var(--text-muted)] mt-2 text-sm">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
