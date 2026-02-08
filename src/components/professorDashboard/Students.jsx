import { useEffect, useState } from "react";
import API from "../../services/api";
import socket from "../../services/socket";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    const res = await API.get("/sessions/professor");

    // Collect all students from all sessions
    const all = res.data.flatMap((session) =>
      session.students.map((st) => ({
        ...st,
        sessionTitle: session.title,
        level: session.level,
        sessionId: session._id,
      }))
    );

    // Remove duplicates by student ID
    const unique = [];
    const seen = new Set();
    for (let st of all) {
      if (!seen.has(st._id)) {
        seen.add(st._id);
        unique.push(st);
      }
    }

    setStudents(unique);
  };

  useEffect(() => {
    fetchStudents().finally(() => setLoading(false));

    socket.on("dashboard:update", fetchStudents);
    return () => socket.off("dashboard:update");
  }, []);

  if (loading) return <p className="text-gray-500">Loading students...</p>;

  if (!students.length)
    return <p className="text-gray-500">No students enrolled yet.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#2A4D6E] mb-6">My Students</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {students.map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-xl p-5 shadow hover:shadow-xl transition border-l-4 border-[#4A8B6F]"
          >
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#2A4D6E] flex items-center justify-center text-white text-xl mr-4">
                👤
              </div>
              <div>
                <h4 className="font-semibold text-[#2A4D6E]">{s.name}</h4>
                <p className="text-gray-500 text-sm">{s.email}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center">
                <span className="text-[#C76B4A] mr-2">📘</span>
                <span>{s.sessionTitle}</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#C76B4A] mr-2">🎯</span>
                <span>Level: {s.level}</span>
              </div>
            </div>

            {/* Engagement Box */}
            <div className="bg-[#F8F5F2] rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-[#2A4D6E]">
                  Engagement Level
                </h4>
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                  High
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-2">
                Actively attending sessions and enrolled successfully.
              </p>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress: 80%</span>
                <span>Avg Score: 90%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
