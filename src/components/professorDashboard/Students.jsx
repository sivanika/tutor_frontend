import { useEffect, useState } from "react";
import API from "../../services/api";
import socket from "../../services/socket";
import { FiSearch, FiMail, FiUser, FiBookOpen, FiCheckCircle, FiClock } from "react-icons/fi";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await API.get("/sessions/professor");
      const all = res.data.flatMap(session =>
        session.students.map(entry => ({
          _id: entry.student?._id || entry.student,
          name: entry.student?.name || "—",
          email: entry.student?.email || "—",
          status: entry.status || "enrolled",
          enrolledAt: entry.enrolledAt,
          completedAt: entry.completedAt,
          sessionTitle: session.title,
          level: session.level,
          sessionId: session._id,
        }))
      );
      const seen = new Set();
      const unique = [];
      for (let st of all) {
        if (st._id && !seen.has(st._id)) {
          seen.add(st._id);
          unique.push(st);
        }
      }
      setStudents(unique);
    } catch (err) {
      console.error("Fetch students error:", err.message);
    }
  };

  useEffect(() => {
    fetchStudents().finally(() => setLoading(false));
    socket.on("dashboard:update", fetchStudents);
    return () => socket.off("dashboard:update");
  }, []);

  const filtered = students.filter(
    s =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
            <FiCheckCircle size={11} /> Completed
          </span>
        );
      case "attended":
        return (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1">
            <FiCheckCircle size={11} /> Attended
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1">
            <FiClock size={11} /> Enrolled
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 rounded-full border-4 border-[#6A11CB] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">My Students</h2>
          <p className="text-sm text-gray-400">{students.length} enrolled across all sessions</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Empty state */}
      {students.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">👥</div>
          <h3 className="text-gray-600 font-semibold">No students yet</h3>
          <p className="text-sm text-gray-400 mt-1">Students will appear here after they enroll in your sessions.</p>
        </div>
      )}

      {/* Student grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s, idx) => (
            <div
              key={`${s._id}-${s.sessionId}`}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-0.5"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0"
                  style={{ background: `hsl(${(idx * 53) % 360}, 65%, 55%)` }}
                >
                  {s.name?.[0]?.toUpperCase() || <FiUser />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">{s.name || "—"}</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                    <FiMail size={11} /> {s.email}
                  </p>
                </div>
              </div>

              {/* Session info */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FiBookOpen size={12} className="text-indigo-400 shrink-0" />
                  <span className="truncate">{s.sessionTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Level</span>
                  <span className="text-xs font-semibold text-[#6A11CB] bg-purple-50 px-2 py-0.5 rounded-full">
                    {s.level}
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <div className="mt-4 flex items-center justify-between">
                {getStatusBadge(s.status)}
                <div className="flex gap-1 text-gray-300">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-60" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {search && filtered.length === 0 && students.length > 0 && (
        <div className="text-center py-10 text-gray-400">
          <FiSearch size={32} className="mx-auto mb-2 opacity-40" />
          <p>No students match "<strong>{search}</strong>"</p>
        </div>
      )}
    </div>
  );
}
