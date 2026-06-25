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
        const fetchPost = async () => {
            try {
                const res = await API.get(`/blog/${id}`);
                setPost(res.data);
            } catch (err) {
                setError("Failed to load blog post");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="w-10 h-10 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-24 gap-4">
                <p className="text-lg text-slate-500 dark:text-slate-400">{error || "Post not found"}</p>
                <Link
                    to="/blog"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition"
                >
                    <FiArrowLeft /> Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Hero / Cover Image */}
            <section className="relative pt-28 pb-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {post.img ? (
                        <img
                            src={media(post.img)}
                            alt={post.title}
                            className="w-full h-full object-cover opacity-25 dark:opacity-30 brightness-[0.9] dark:brightness-[0.6]"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/10 to-indigo-500/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)]/30 via-[var(--surface)]/80 to-[var(--surface)]" />
                </div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:gap-3 transition-all mb-8"
                    >
                        <FiArrowLeft /> Back to Blog
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 text-[var(--primary)] dark:text-[var(--accent)] text-xs font-bold tracking-wider uppercase">
                            {post.category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold dark:text-white leading-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-2">
                            <FiUser size={14} /> {post.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <FiCalendar size={14} /> {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-2">
                            <FiTag size={14} /> {post.category}
                        </span>
                    </div>
                </div>
            </section>

            {/* Cover Image (full display) */}
            {post.img && (
                <div className="max-w-4xl mx-auto px-6 -mt-4 mb-10">
                    <div className="rounded-3xl overflow-hidden border border-slate-100 dark:border-white/10 shadow-xl">
                        <img
                            src={media(post.img)}
                            alt={post.title}
                            className="w-full h-auto max-h-[500px] object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-6 pb-20">
                {/* Excerpt as lead paragraph */}
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 font-medium border-l-4 border-[var(--primary)] pl-6 py-2 bg-[var(--primary)]/5 rounded-r-xl">
                    {post.excerpt}
                </p>

                {/* Full content */}
                {post.content ? (
                    <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </div>
                ) : (
                    <p className="text-slate-400 dark:text-slate-500 italic text-center py-12">
                        Full article content coming soon...
                    </p>
                )}

                {/* Divider & Back */}
                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[var(--surface-alt)] border border-slate-200 dark:border-white/10 text-sm font-bold text-[var(--primary)] hover:shadow-lg hover:gap-3 transition-all"
                    >
                        <FiArrowLeft /> Back to All Articles
                    </Link>
                </div>
            </article>
        </div>
    );
}
