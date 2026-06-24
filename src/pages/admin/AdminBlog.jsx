import { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import { media } from "../../utils/media";
import toast from "react-hot-toast";
import {
  FiEdit3, FiSearch, FiInbox, FiTrash2, FiPlus, FiEdit2,
  FiToggleLeft, FiToggleRight, FiEye, FiEyeOff, FiImage,
  FiCalendar, FiUser, FiTag, FiFileText, FiX, FiUpload, FiLink,
} from "react-icons/fi";

const CATEGORIES = ["Education", "Guides", "Tech", "Math", "News", "Tips", "Research"];

const EMPTY_POST = {
  title: "",
  excerpt: "",
  content: "",
  category: "Education",
  author: "",
  img: "",
  isPublished: true,
};

/* ── Blog Post Form Modal ── */
function BlogModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY_POST);
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState(initial?.img || "");
  const [imgMode, setImgMode] = useState("url"); // "url" | "file"
  const [coverFile, setCoverFile] = useState(null);
  const fileInputRef = useRef(null);
  const isEdit = !!initial?._id;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (coverFile) {
        // Use FormData for file upload
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("excerpt", form.excerpt);
        fd.append("content", form.content);
        fd.append("category", form.category);
        fd.append("author", form.author);
        fd.append("isPublished", form.isPublished);
        fd.append("coverImage", coverFile);

        if (isEdit) {
          const res = await API.put(`/blog/${initial._id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          onSave(res.data, "edit");
          toast.success("Blog post updated");
        } else {
          const res = await API.post("/blog", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          onSave(res.data, "add");
          toast.success("Blog post created");
        }
      } else {
        // JSON body (URL mode or no image)
        if (isEdit) {
          const res = await API.put(`/blog/${initial._id}`, form);
          onSave(res.data, "edit");
          toast.success("Blog post updated");
        } else {
          const res = await API.post("/blog", form);
          onSave(res.data, "add");
          toast.success("Blog post created");
        }
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save blog post");
    } finally {
      setSaving(false);
    }
  };

  const f = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [k]: val }));
    if (k === "img") setPreviewImg(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setCoverFile(null);
    setPreviewImg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[var(--primary)] to-indigo-700 text-white shrink-0">
          <div className="flex items-center gap-2">
            <FiEdit3 size={18} />
            <h3 className="font-bold text-lg">{isEdit ? "Edit Blog Post" : "Create New Blog Post"}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl transition">
            <FiX size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <FiFileText size={12} /> Title *
            </label>
            <input
              required
              value={form.title}
              onChange={f("title")}
              placeholder="Enter blog post title..."
              className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)]/40 transition"
            />
          </div>

          {/* Category + Author row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <FiTag size={12} /> Category *
              </label>
              <select
                value={form.category}
                onChange={f("category")}
                className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 transition bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <FiUser size={12} /> Author *
              </label>
              <input
                required
                value={form.author}
                onChange={f("author")}
                placeholder="Dr. Jane Doe"
                className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 transition"
              />
            </div>
          </div>

          {/* Cover Image — Mode Toggle + Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <FiImage size={12} /> Cover Image
              </label>
              <div className="flex bg-gray-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setImgMode("url"); setCoverFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    imgMode === "url"
                      ? "bg-white text-[var(--primary)] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiLink size={11} /> URL
                </button>
                <button
                  type="button"
                  onClick={() => { setImgMode("file"); setForm(p => ({ ...p, img: "" })); setPreviewImg(coverFile ? URL.createObjectURL(coverFile) : ""); }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    imgMode === "file"
                      ? "bg-white text-[var(--primary)] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiUpload size={11} /> Upload
                </button>
              </div>
            </div>

            {imgMode === "url" ? (
              <input
                value={form.img}
                onChange={f("img")}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 transition"
              />
            ) : (
              <div className="relative">
                <label
                  className={`flex flex-col items-center justify-center w-full py-5 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    coverFile
                      ? "border-green-300 bg-green-50/50"
                      : "border-gray-200 bg-gray-50 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {coverFile ? (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <FiImage size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 truncate max-w-xs">{coverFile.name}</p>
                        <p className="text-xs text-gray-400">{(coverFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <FiUpload size={20} className="text-gray-400 mb-1.5" />
                      <p className="text-sm font-medium text-gray-500">Click to upload cover image</p>
                      <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                    </>
                  )}
                </label>
                {coverFile && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-500 transition"
                  >
                    <FiX size={12} />
                  </button>
                )}
              </div>
            )}

            {/* Preview */}
            {previewImg && (
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 h-32">
                <img
                  src={previewImg}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewImg("")}
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Excerpt / Summary *
            </label>
            <textarea
              required
              rows={2}
              value={form.excerpt}
              onChange={f("excerpt")}
              placeholder="A brief summary shown on the blog listing page..."
              className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 transition resize-none"
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Full Content
            </label>
            <textarea
              rows={6}
              value={form.content}
              onChange={f("content")}
              placeholder="Write the full blog article content here..."
              className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 transition resize-none leading-relaxed"
            />
          </div>

          {/* Published Toggle */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={f("isPublished")}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] peer-checked:after:translate-x-full after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform after:shadow-sm" />
            </label>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {form.isPublished ? "Published" : "Draft"}
              </p>
              <p className="text-xs text-gray-400">
                {form.isPublished ? "This post is visible on the public blog page" : "This post is hidden from the public blog page"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary)] to-indigo-700 rounded-xl hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-[var(--primary)]/20"
            >
              {saving ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Admin Blog Component ── */
export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modal, setModal] = useState(null); // null | "new" | post-object
  const [actionId, setActionId] = useState(null);

  /* Fetch all posts (admin view — includes drafts) */
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/blog/admin/all");
      setPosts(res.data || []);
    } catch {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* Save handler from modal */
  const handleSave = (post, mode) => {
    if (mode === "add") setPosts((p) => [post, ...p]);
    else setPosts((p) => p.map((x) => (x._id === post._id ? post : x)));
  };

  /* Toggle publish/draft */
  const handleTogglePublish = async (post) => {
    setActionId(post._id);
    try {
      const res = await API.put(`/blog/${post._id}/toggle-publish`);
      setPosts((p) => p.map((x) => (x._id === post._id ? res.data : x)));
      toast.success(res.data.isPublished ? "Post published" : "Post set to draft");
    } catch {
      toast.error("Failed to toggle status");
    } finally {
      setActionId(null);
    }
  };

  /* Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this blog post?")) return;
    setActionId(id);
    try {
      await API.delete(`/blog/${id}`);
      setPosts((p) => p.filter((x) => x._id !== id));
      toast.success("Blog post deleted");
    } catch {
      toast.error("Failed to delete blog post");
    } finally {
      setActionId(null);
    }
  };

  /* Filtering */
  const allCategories = ["All", ...new Set(posts.map((p) => p.category))];

  const filtered = posts.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    const matchCat = filterCat === "All" || p.category === filterCat;
    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Published" && p.isPublished) ||
      (filterStatus === "Draft" && !p.isPublished);
    return matchSearch && matchCat && matchStatus;
  });

  /* Stats */
  const stats = [
    { label: "Total Posts", value: posts.length, color: "#2563EB", icon: FiFileText },
    { label: "Published", value: posts.filter((p) => p.isPublished).length, color: "#22c55e", icon: FiEye },
    { label: "Drafts", value: posts.filter((p) => !p.isPublished).length, color: "#eab308", icon: FiEyeOff },
    { label: "Categories", value: new Set(posts.map((p) => p.category)).size, color: "#8b5cf6", icon: FiTag },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiEdit3 className="text-[var(--primary)]" /> Blog Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit, and manage blog posts displayed on the public blog page
          </p>
        </div>
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-indigo-700 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-[var(--primary)]/20"
        >
          <FiPlus size={16} /> New Blog Post
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: s.color + "15", color: s.color }}
            >
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        {/* Search */}
        <div className="relative sm:max-w-xs w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Category filter */}
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 bg-white"
          >
            {allCategories.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
            ))}
          </select>

          {/* Status filter */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            {["All", "Published", "Draft"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === s
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FiInbox size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-semibold text-gray-500">No blog posts found</p>
          <p className="text-sm text-gray-400 mt-1">
            {posts.length === 0
              ? 'Click "New Blog Post" to create your first article'
              : "Try adjusting your search or filters"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((post) => (
            <div
              key={post._id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                post.isPublished ? "border-gray-100" : "border-amber-200/60 bg-amber-50/30"
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                {post.img && (
                  <div className="sm:w-48 h-36 sm:h-auto shrink-0 overflow-hidden">
                    <img
                      src={media(post.img)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                  <div>
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600">
                        {post.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          post.isPublished
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiUser size={11} /> {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar size={11} />{" "}
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center justify-end gap-1.5 p-4 border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50/50">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    disabled={actionId === post._id}
                    className={`p-2.5 rounded-xl transition disabled:opacity-40 ${
                      post.isPublished
                        ? "text-green-600 hover:bg-green-50"
                        : "text-amber-500 hover:bg-amber-50"
                    }`}
                    title={post.isPublished ? "Unpublish" : "Publish"}
                  >
                    {post.isPublished ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                  </button>
                  <button
                    onClick={() => setModal(post)}
                    className="p-2.5 rounded-xl text-blue-600 hover:bg-blue-50 transition"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={actionId === post._id}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <BlogModal
          initial={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
