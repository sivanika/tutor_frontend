export default function TutorFilters({ filters, setFilters, onApply }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h3 className="text-lg font-bold text-[var(--primary)] mb-4">
        🔍 Search Filters
      </h3>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={filters.level}
          onChange={e =>
            setFilters({ ...filters, level: e.target.value })
          }
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filters.subject}
          onChange={e =>
            setFilters({ ...filters, subject: e.target.value })
          }
        >
          <option value="">All Subjects</option>
          <option value="Math">Mathematics</option>
          <option value="CS">Computer Science</option>
          <option value="Physics">Physics</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filters.time}
          onChange={e =>
            setFilters({ ...filters, time: e.target.value })
          }
        >
          <option value="">Any Time</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>

      <button
        onClick={onApply}
        className="bg-[var(--accent)] text-white px-5 py-2 rounded hover:bg-[var(--secondary)]"
      >
        Apply Filters
      </button>
    </div>
  )
}
