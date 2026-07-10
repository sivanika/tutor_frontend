import { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import toast from "react-hot-toast";

const TYPE_COLORS = {
  "Full-time": "bg-green-100 text-green-700",
  "Part-time": "bg-blue-100 text-blue-700",
  "Contract": "bg-orange-100 text-orange-700",
  "Internship": "bg-purple-100 text-purple-700",
};

const MODE_COLORS = {
  "Remote": "bg-blue-50 text-blue-700 border border-blue-200",
  "Hybrid": "bg-purple-50 text-purple-700 border border-purple-200",
  "On-site": "bg-slate-100 text-slate-700 border border-slate-200",
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
    setSubmitting(true);
    try {
      // Still calling the existing backend API, using cover letter or default
      await API.post("/careers/apply", {
        name: form.name.trim(),
        email: form.email.trim(),
        coverLetter: form.cover.trim() || `Applied for ${position.title}. Experience: ${form.experience}yrs.`,
        positionId: position._id,
        positionTitle: position.title,
      });
      setSent(true);
    } catch (err) {
      console.error("Submit application error:", err);
      toast.error(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const mode = position.location?.toLowerCase().includes("remote") ? "Remote" 
    : position.location?.toLowerCase().includes("hybrid") ? "Hybrid" : "On-site";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-2xl shadow-[0_20px_60px_-12px_rgba(16,24,40,0.25)] overflow-hidden my-auto"
      >
        <div className="bg-gradient-to-r from-[#2F5FE0] to-[#7B4FE0] px-8 py-7 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white text-3xl leading-none transition-colors">&times;</button>
          
          <button onClick={onClose} className="text-white/85 text-xs font-semibold flex items-center gap-1.5 mb-3 hover:text-white transition-colors">
            &larr; Back to open positions
          </button>
          <div className="text-xs opacity-85 font-medium mb-1">Apply for</div>
          <h1 className="text-xl sm:text-2xl font-bold mb-3 leading-snug">{position.title}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{position.type}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{mode}</span>
          </div>
        </div>

        <div className="px-8 py-8">
          {sent ? (
            <div className="bg-[#E7F7EF] border border-[#B7E4CC] text-[#0F6B44] px-4 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 mb-4">
              <FiCheckCircle className="text-lg shrink-0" /> ✓ Application received — our team will reach out within 3–5 business days.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-[var(--ink)]">
              
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.07em] text-[#667085] font-bold mb-3">Contact details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">Full name *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Jane Smith" className="w-full px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] text-sm focus:outline-none focus:border-[#2F5FE0] focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">Email address *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="jane@example.com" className="w-full px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] text-sm focus:outline-none focus:border-[#2F5FE0] focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">Phone number *</label>
                    <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" className="w-full px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] text-sm focus:outline-none focus:border-[#2F5FE0] focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">Current location *</label>
                    <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Pune, Maharashtra" className="w-full px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] text-sm focus:outline-none focus:border-[#2F5FE0] focus:bg-white" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.07em] text-[#667085] font-bold mb-3">Experience</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">Total experience (yrs) *</label>
                    <input required type="number" min="0" step="0.5" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="3" className="w-full px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] text-sm focus:outline-none focus:border-[#2F5FE0] focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">Current employer <span className="font-medium text-[#667085]">(optional)</span></label>
                    <input type="text" value={form.employer} onChange={e => setForm({...form, employer: e.target.value})} placeholder="e.g. ABC School" className="w-full px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] text-sm focus:outline-none focus:border-[#2F5FE0] focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">Notice period <span className="font-medium text-[#667085]">(optional)</span></label>
                    <input type="text" value={form.notice} onChange={e => setForm({...form, notice: e.target.value})} placeholder="e.g. 30 days" className="w-full px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] text-sm focus:outline-none focus:border-[#2F5FE0] focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">LinkedIn / Portfolio <span className="font-medium text-[#667085]">(optional)</span></label>
                  <input type="url" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." className="w-full px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] text-sm focus:outline-none focus:border-[#2F5FE0] focus:bg-white" />
                </div>
              </div>

              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.07em] text-[#667085] font-bold mb-3">Resume & cover letter</p>
                <div className="mb-4">
                  <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">Resume / CV *</label>
                  <label className="border-[1.5px] border-dashed border-[#D0D5DD] rounded-[10px] bg-[#F2F4F7] p-6 text-center cursor-pointer block hover:border-[#2F5FE0] transition-colors">
                    <div className="text-[1.4rem] mb-1.5">📄</div>
                    <div className="text-[0.86rem] font-semibold text-[#101828]">Click to upload your CV</div>
                    <div className="text-[0.75rem] text-[#667085] mt-1">PDF or DOCX, up to 5 MB</div>
                    <input type="file" required accept=".pdf,.doc,.docx" className="hidden" onChange={e => setCvFile(e.target.files[0])} />
                  </label>
                  {cvFile && <div className="mt-2 text-[0.8rem] text-[#12895A] font-semibold">✓ {cvFile.name}</div>}
                </div>
                <div>
                  <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">Cover letter <span className="font-medium text-[#667085]">(optional)</span></label>
                  <textarea rows="4" value={form.cover} onChange={e => setForm({...form, cover: e.target.value})} placeholder="Tell us why you'd be a great fit..." className="w-full px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] text-sm focus:outline-none focus:border-[#2F5FE0] focus:bg-white resize-y" />
                </div>
              </div>

              <div className="flex items-start gap-2.5 my-[22px]">
                <input type="checkbox" required id="consentCheck" className="mt-[3px] w-4 h-4 accent-[#2F5FE0] shrink-0" />
                <label htmlFor="consentCheck" className="text-[0.8rem] text-[#475467] font-normal leading-snug">I confirm the above information is accurate and I consent to Vishidh Academy storing my application for recruitment purposes.</label>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-lg bg-[#2F5FE0] text-white font-bold text-[0.95rem] hover:bg-[#1F46B8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? "Submitting Application..." : "Submit Application →"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Job Details Modal ──────────────────────────────────────── */
function JobDetailsModal({ position, onClose, onApply }) {
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const mode = position.location?.toLowerCase().includes("remote") ? "Remote" 
    : position.location?.toLowerCase().includes("hybrid") ? "Hybrid" 
    : "On-site";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col relative"
      >
        <div className="bg-[#2563EB] px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="pr-8">
            <h3 className="text-white font-bold text-2xl mb-3">{position.title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white`}>
                {position.type}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white`}>
                {mode}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white`}>
                {position.dept}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl leading-none transition-colors">&times;</button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 font-medium font-[Poppins] mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-1.5"><FiMapPin className="text-slate-400" /> {position.location}</div>
            <div className="flex items-center gap-1.5"><FiCalendar className="text-slate-400" /> Posted {formatTimeAgo(position.createdAt)}</div>
            <div className="flex items-center gap-1.5"><FiUsers className="text-slate-400" /> {Math.floor(Math.random() * 3) + 1} Openings</div>
            <div className="flex items-center gap-1.5"><FiDollarSign className="text-slate-400" /> Competitive</div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-bold text-slate-900 mb-4 font-[Inter]">About the Role</h4>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-[Inter]">
              {position.description}
            </div>
          </div>

          {position.skills?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-bold text-slate-900 mb-4 font-[Inter]">Required Skills</h4>
              <div className="flex flex-wrap items-center gap-2">
                {position.skills.map(skill => (
                  <span key={skill} className="text-sm bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-slate-600 border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onApply(position);
            }}
            className="px-8 py-2.5 rounded-xl font-medium text-sm text-white bg-[#2563EB] hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
          >
            Apply Now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Job Card ──────────────────────────────────────── */
function JobCard({ pos, onClickApply, onClickDetails }) {
  const [expanded, setExpanded] = useState(false);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const isLongDesc = pos.description?.length > 150;
  const displayDesc = expanded || !isLongDesc ? pos.description : `${pos.description?.substring(0, 150)}...`;
  
  const MAX_SKILLS = 6;
  const visibleSkills = pos.skills?.slice(0, MAX_SKILLS) || [];
  const hiddenSkillsCount = (pos.skills?.length || 0) - MAX_SKILLS;

  // Determine work mode based on location or default to Remote if not specified
  const mode = pos.location?.toLowerCase().includes("remote") ? "Remote" 
    : pos.location?.toLowerCase().includes("hybrid") ? "Hybrid" 
    : "On-site";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px -10px rgba(37, 99, 235, 0.15)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col gap-6"
    >
      {/* First Row: Title, Badges & Buttons */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 font-[Inter] mb-3">{pos.title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${TYPE_COLORS[pos.type] || "bg-gray-100 text-gray-700"}`}>
              {pos.type}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${MODE_COLORS[mode] || MODE_COLORS["On-site"]}`}>
              {mode}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => onClickDetails(pos)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm text-[#2563EB] border-2 border-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onClickApply(pos)}
            className="relative overflow-hidden group w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-[#2563EB] hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
          >
            <span className="relative z-10">Apply Now</span>
            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-active:scale-x-100 transition-transform origin-left rounded-xl"></span>
          </button>
        </div>
      </div>

      {/* Second Row: Metadata Icons */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 font-medium font-[Poppins]">
        <div className="flex items-center gap-1.5"><FiMapPin className="text-slate-400" /> {pos.location}</div>
        <div className="flex items-center gap-1.5"><FiCalendar className="text-slate-400" /> Posted {formatTimeAgo(pos.createdAt)}</div>
        <div className="flex items-center gap-1.5"><FiUsers className="text-slate-400" /> {Math.floor(Math.random() * 3) + 1} Openings</div>
        <div className="flex items-center gap-1.5"><FiDollarSign className="text-slate-400" /> Competitive</div>
      </div>

      {/* Third Row: Description */}
      <div>
        <p className="text-slate-600 text-sm leading-relaxed font-[Inter]">
          {displayDesc}
          {isLongDesc && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="ml-2 text-[#2563EB] font-medium hover:underline"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </p>
      </div>

      {/* Fourth Row: Skills */}
      {visibleSkills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 mt-2">
          {visibleSkills.map(skill => (
            <span key={skill} className="text-xs bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full font-medium">
              {skill}
            </span>
          ))}
          {hiddenSkillsCount > 0 && (
            <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-medium">
              +{hiddenSkillsCount} More
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function Careers() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailsSelected, setDetailsSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchPositions = async () => {
      try {
        const res = await API.get("/careers/positions");
        if (isMounted) setPositions(res.data || []);
      } catch (err) {
        console.error("Failed to load positions:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPositions();
    const intervalId = setInterval(fetchPositions, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const departments = ["All", ...new Set(positions.map(p => p.dept))];
  
  const visible = positions.filter(p => {
    const matchesDept = filter === "All" || p.dept === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          p.dept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-[Inter,sans-serif]">
      
      {/* ── Filter & Search Section ── */}
      <div className="bg-white border-b border-slate-200 sticky top-[72px] lg:top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
          
          {/* Category Filters (Horizontal Scroll) */}
          <div className="flex overflow-x-auto pb-2 -mb-2 hide-scrollbar gap-3">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                  ${filter === dept
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input 
              type="text" 
              placeholder="Search jobs, skills, departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Job Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Open Positions", value: visible.length },
            { label: "Departments", value: departments.length - 1 },
            { label: "Employees", value: "120+" },
            { label: "Work Culture", value: "Remote Friendly" },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm"
            >
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm animate-pulse h-48"></div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-24 text-center bg-white rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="text-6xl mb-6 text-slate-300 flex justify-center"><FiSearch /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No matching positions found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filters or keyword search.</p>
            <button 
              onClick={() => { setFilter("All"); setSearchQuery(""); }}
              className="px-6 py-2.5 rounded-xl font-medium text-sm text-[#2563EB] border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {visible.map(pos => (
                <JobCard key={pos._id} pos={pos} onClickApply={setSelected} onClickDetails={setDetailsSelected} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Application Modal */}
      <AnimatePresence>
        {selected && (
          <ApplicationModal position={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

      {/* Job Details Modal */}
      <AnimatePresence>
        {detailsSelected && (
          <JobDetailsModal 
            position={detailsSelected} 
            onClose={() => setDetailsSelected(null)}
            onApply={setSelected} 
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

