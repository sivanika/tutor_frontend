import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiUser, FiTag } from "react-icons/fi";
import API from "../services/api";
import { media } from "../utils/media";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get(`/blog/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => setError("Failed to load blog post"))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-10 h-10 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-[var(--text-muted)] gap-4" style={{ background: "var(--bg)" }}>
        <p className="text-lg font-semibold">{error || "Post not found"}</p>
        <Link
          to="/blog"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}
        >
          <FiArrowLeft /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(6,182,212,0.25) 0%, rgba(59,130,246,0.1) 50%, transparent 70%), var(--hero-section)" }}>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline mb-8"
          >
            <FiArrowLeft /> Back to Blog
          </Link>

          <div className="mb-4">
            <span className="inline-block px-4 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/25 text-[var(--accent)] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[var(--text-muted)] border-t border-[var(--card-border)] pt-6">
            <span className="flex items-center gap-1.5"><FiUser size={13} className="text-[var(--accent)]" /> {post.author}</span>
            <span className="flex items-center gap-1.5"><FiCalendar size={13} className="text-[var(--accent)]" /> {formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1.5"><FiTag size={13} className="text-[var(--accent)]" /> {post.category}</span>
          </div>
        </div>
      </section>

      {/* ── Cover Image ── */}
      {post.img && (
        <div className="max-w-4xl mx-auto px-6 -mt-8 mb-12 relative z-10">
          <div className="rounded-3xl overflow-hidden border border-[var(--card-border)] shadow-2xl">
            <img src={media(post.img)} alt={post.title} className="w-full max-h-[480px] object-cover" />
          </div>
        </div>
      )}

      {/* ── Body Content ── */}
      <div className="max-w-3xl mx-auto px-6 pb-24 text-[var(--text-muted)] leading-relaxed space-y-6 text-base font-normal">
        {post.content ? (
          <div className="prose prose-invert max-w-none space-y-4" dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p>{post.excerpt}</p>
        )}

        <div className="pt-12 border-t border-[var(--card-border)] mt-12 flex justify-between items-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-[var(--text-primary)] border border-[var(--card-border)] hover:border-[var(--accent)] transition-all"
          >
            ← Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}
