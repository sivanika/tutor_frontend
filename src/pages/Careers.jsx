import { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiCheckCircle, FiBriefcase, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import toast from "react-hot-toast";

const TYPE_COLORS = {
  "Full-time": "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  "Part-time": "bg-blue-500/10 border-blue-500/30 text-blue-400",
  "Contract": "bg-amber-500/10 border-amber-500/30 text-amber-400",
  "Internship": "bg-purple-500/10 border-purple-500/30 text-purple-400",
};

const MODE_COLORS = {
  "Remote": "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  "Hybrid": "bg-violet-500/10 border-violet-500/30 text-violet-400",
  "On-site": "bg-white/05 border-white/10 text-white/70",
};

/* ─── Application Modal ──────────────────────────────────────── */
function ApplicationModal({ position, onClose }) {
  const [form, setForm] = useState({ 
    name: "", email: "", phone: "", location: "",
    experience: "", employer: "", notice: "", linkedin: "", cover: "" 
  });
  const [cvFile, setCvFile] = useState(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      toast.error("Please upload your resume / CV.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());
      formData.append("location", form.location.trim());
      formData.append("experience", form.experience);
      formData.append("employer", form.employer.trim());
      formData.append("notice", form.notice.trim());
      formData.append("linkedin", form.linkedin.trim());
      formData.append("coverLetter", form.cover.trim());
      formData.append("positionId", position._id);
      formData.append("positionTitle", position.title);
      formData.append("resume", cvFile);

      await API.post("/careers/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSent(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="rounded-3xl border border-[var(--card-border)] shadow-2xl w-full max-w-2xl overflow-hidden my-6 relative"
        style={{ background: "var(--modal-bg)" }}
      >
        <div className="p-6 md:p-8 border-b border-[var(--card-border)] flex justify-between items-start" style={{ background: "linear-gradient(135deg, rgba(42,77,110,0.4), rgba(6,182,212,0.1))" }}>
          <div>
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Application Form</span>
            <h3 className="text-2xl font-black text-[var(--text-primary)] mt-1">{position.title}</h3>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-2xl leading-none"><FiX /></button>
        </div>

        <div className="p-6 md:p-8">
          {sent ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
                ✓
              </div>
              <h4 className="text-2xl font-black text-[var(--text-primary)] mb-2">Application Received!</h4>
              <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto mb-6">
                Thank you for applying to VishidhAcademy. Our talent team will review your application and reach out if your profile fits our current opening.
              </p>
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Full Name *</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)]/40 placeholder:text-[var(--text-muted)]" style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)]/40 placeholder:text-[var(--text-muted)]" style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)]/40 placeholder:text-[var(--text-muted)]" style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Location *</label>
                  <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Pune, India" className="w-full px-4 py-3 rounded-xl text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)]/40 placeholder:text-[var(--text-muted)]" style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Total Exp (Years) *</label>
                  <input required type="number" min="0" step="0.5" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="3" className="w-full px-4 py-3 rounded-xl text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)]/40 placeholder:text-[var(--text-muted)]" style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Current Employer</label>
                  <input type="text" value={form.employer} onChange={e => setForm({...form, employer: e.target.value})} placeholder="Company Name" className="w-full px-4 py-3 rounded-xl text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)]/40 placeholder:text-[var(--text-muted)]" style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Notice Period</label>
                  <input type="text" value={form.notice} onChange={e => setForm({...form, notice: e.target.value})} placeholder="30 days" className="w-full px-4 py-3 rounded-xl text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)]/40 placeholder:text-[var(--text-muted)]" style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Resume / CV *</label>
                <label className="rounded-xl p-5 text-center cursor-pointer block hover:border-[var(--accent)]/40 transition-colors" style={{ border: "1px dashed var(--card-border)", background: "var(--input-bg)" }}>
                  <div className="text-xl mb-1">📄</div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">Click to upload your Resume</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">PDF or DOCX (max 5MB)</div>
                  <input type="file" required accept=".pdf,.doc,.docx" className="hidden" onChange={e => setCvFile(e.target.files[0])} />
                </label>
                {cvFile && <div className="mt-2 text-xs text-emerald-400 font-semibold">✓ {cvFile.name}</div>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Cover Letter (Optional)</label>
                <textarea rows="3" value={form.cover} onChange={e => setForm({...form, cover: e.target.value})} placeholder="Tell us why you'd be a great fit..." className="w-full px-4 py-3 rounded-xl text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)]/40 placeholder:text-[var(--text-muted)] resize-none" style={{ background: "var(--input-bg)", border: "1px solid var(--card-border)" }} />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input type="checkbox" required id="consentCheck" className="mt-1 accent-[var(--accent)]" />
                <label htmlFor="consentCheck" className="text-xs text-[var(--text-muted)] leading-snug">I confirm the above information is accurate and consent to VishidhAcademy processing my application.</label>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105" style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 4px 20px rgba(6,182,212,0.3)" }}>
                {submitting ? "Submitting..." : "Submit Application →"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Careers Page ──────────────────────────────────────── */
export default function Careers() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPos, setSelectedPos] = useState(null);
  const [applyPos, setApplyPos] = useState(null);

  useEffect(() => {
    API.get("/careers/positions")
      .then(res => setPositions(res.data || []))
      .catch(() => console.error("Failed to load careers"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.1) 50%, transparent 70%), var(--hero-section)" }}>
        <div className="absolute -top-20 right-1/4 w-96 h-96 orb-purple opacity-20 dark:opacity-30" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 orb-cyan opacity-15 dark:opacity-20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="section-pill mx-auto w-fit mb-6 animate-fadeIn">Join Our Team</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[var(--text-primary)] leading-tight animate-slideUp">
            Build the Future of <br />
            <span className="grad-text">AI Education</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed animate-slideUp delay-200">
            We're on a mission to connect millions of students with verified professors. Come do the best work of your career.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-8 flex items-center gap-2">
          <FiBriefcase className="text-[var(--accent)]" /> Open Positions
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        ) : positions.length > 0 ? (
          <div className="space-y-4">
            {positions.map((pos) => {
              const mode = pos.mode || (pos.location?.toLowerCase().includes("remote") ? "Remote" : "On-site");
              return (
                <div
                  key={pos._id}
                  className="rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", backdropFilter: "blur(16px)" }}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${TYPE_COLORS[pos.type] || "bg-white/05 border-white/10 text-white/60"}`}>
                        {pos.type}
                      </span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${MODE_COLORS[mode] || MODE_COLORS["On-site"]}`}>
                        {mode}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{pos.title}</h3>
                    <p className="text-[var(--text-muted)] text-sm line-clamp-2 max-w-xl">{pos.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] pt-1">
                      <span className="flex items-center gap-1"><FiMapPin size={11} /> {pos.location || mode}</span>
                      <span className="flex items-center gap-1"><FiDollarSign size={11} /> {pos.salary || "Competitive"}</span>
                      <span className="flex items-center gap-1"><FiUsers size={11} /> {pos.openings || 1} openings</span>
                    </div>
                  </div>

                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => setApplyPos(pos)}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 4px 16px rgba(6,182,212,0.25)" }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl" style={{ border: "1px dashed var(--card-border)", background: "var(--card-bg)" }}>
            <p className="text-[var(--text-muted)] text-lg font-semibold">No open positions currently</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Check back soon or send your resume to support@vishidhacademy.com</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {applyPos && <ApplicationModal position={applyPos} onClose={() => setApplyPos(null)} />}
      </AnimatePresence>
    </div>
  );
}
