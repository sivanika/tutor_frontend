import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { FiSearch, FiMapPin, FiUser, FiLock } from "react-icons/fi";

export default function BrowseStudents() {
  const [students, setStudents] = useState([]);
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ subject: "", level: "" });
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/browse");
      setStudents(res.data.students || []);
      setQuota(res.data.professorQuota || null);
    } catch (err) {
      console.error("Fetch students error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const term = search.toLowerCase();
    const safeName = s.name || "";
    const nameMatch = safeName.toLowerCase().includes(term);
    
    // Filter by search bar
    if (search && !nameMatch) return false;
    
    // Filter by subject/specializations
    if (filters.subject) {
      let hasSubject = false;
      if (Array.isArray(s.specializations)) {
        hasSubject = s.specializations.some((subj) => 
          subj.toLowerCase().includes(filters.subject.toLowerCase())
        );
      } else if (typeof s.specializations === "string") {
        hasSubject = s.specializations.toLowerCase().includes(filters.subject.toLowerCase());
      }
      if (!hasSubject) return false;
    }
    
    // Filter by level
    if (filters.level && s.gradeLevel !== filters.level) return false;
    
    return true;
  });

  const getProfileLimit = () => {
    if (!quota) return 5;
    const tier = (quota.planTier || quota.subscriptionTier || "").toLowerCase();
    if (tier.includes("premium") || tier === "499") return 30; // 499 rs
    if (tier.includes("basic") || tier === "99") return 15; // 99 rs
    return 5; // free trial
  };

  const limit = getProfileLimit();
  const viewedCount = quota?.viewedStudents?.length || 0;
  const isLimitReached = viewedCount >= limit;

  return (
    <div className="space-y-6 max-w-6xl animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Browse Students</h2>
          <p className="text-sm text-gray-500 mt-1">Discover students looking for tutoring in your subjects.</p>
        </div>
      </div>

      {/* Usage Banner */}
      {!loading && quota && (
        <div className={`rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border ${isLimitReached ? 'bg-red-50 border-red-200' : 'bg-[#FF4E9B]/5 border-[#FF4E9B]/20'}`}>
          <div>
            <p className={`font-bold text-sm ${isLimitReached ? 'text-red-700' : 'text-[#1a0e33] dark:text-white'}`}>
              Student Profile Views: {viewedCount} / {limit}
            </p>
            <p className={`text-xs mt-1 ${isLimitReached ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
              {isLimitReached ? 'You have reached your limit. Upgrade to view more profiles.' : `You can view ${Math.max(0, limit - viewedCount)} more student profiles with your current plan.`}
            </p>
          </div>
          {isLimitReached && (
            <button
              onClick={() => navigate("/payment?plan=premium&returnTo=professor")}
              className="px-4 py-2 bg-[#FF4E9B] text-white text-sm font-bold rounded-lg hover:bg-[#e63e88] transition-colors"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <FiSearch className="text-[#FF4E9B]" />
          Search & Filters
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF4E9B]/40 bg-gray-50 focus:bg-white transition-all shadow-sm"
          />
          <select
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF4E9B]/40 focus:outline-none transition shadow-sm"
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          >
            <option value="">All Subjects</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="physics">Physics</option>
            <option value="english">English</option>
            <option value="history">History</option>
          </select>
          <select
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF4E9B]/40 focus:outline-none transition shadow-sm"
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          >
            <option value="">All Levels</option>
            <option value="High School">High School</option>
            <option value="College">College</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin w-10 h-10 rounded-full border-4 border-[#FF4E9B] border-t-transparent" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-gray-800 font-bold text-lg">No students found</h3>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* Results Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s, idx) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Header: Avatar, Name & Level */}
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0"
                  style={{ background: `hsl(${(idx * 73) % 360}, 65%, 55%)` }}
                >
                  {s.name?.[0]?.toUpperCase() || "S"}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-800 text-lg truncate">{s.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <FiMapPin size={12} className="text-[#FF4E9B]" /> 
                    <span className="truncate">{s.school || "No school listed"}</span>
                  </div>
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Level</span>
                  <div className="mt-1">
                    <span className="inline-block px-2.5 py-1 bg-purple-50 text-[#6A11CB] text-xs font-bold rounded-lg border border-purple-100">
                      {s.gradeLevel || "Not specified"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Needs Help With</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {Array.isArray(s.specializations) && s.specializations.length > 0 ? (
                      s.specializations.map((subj, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                          {subj}
                        </span>
                      ))
                    ) : typeof s.specializations === "string" && s.specializations.trim() !== "" ? (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                        {s.specializations}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No subjects specified</span>
                    )}
                  </div>
                </div>

                {s.learningGoals && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Learning Goals</span>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {s.learningGoals}
                    </p>
                  </div>
                )}
              </div>

              {/* Action */}
              {(() => {
                const hasViewed = quota?.viewedStudents?.includes(s._id);
                if (!hasViewed && isLimitReached) {
                  return (
                    <button
                      onClick={() => navigate("/payment?plan=premium&returnTo=professor")}
                      className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300
                        bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    >
                      <FiLock size={16} />
                      Unlock Profile
                    </button>
                  );
                }
                
                return (
                  <button
                    onClick={() => navigate(`/student/${s._id}`)}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300
                      bg-gray-50 text-[#FF4E9B] hover:bg-[#FF4E9B] hover:text-white group-hover:shadow-md border border-[#FF4E9B]/20 hover:border-transparent"
                  >
                    <FiUser size={16} />
                    {hasViewed ? "View Profile Again" : "View Profile"}
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
