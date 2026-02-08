export default function LearningGoals() {
  const goals = [
    { title: "Complete Math Course", progress: 65 },
    { title: "Master Python Programming", progress: 40 },
    { title: "Improve Algorithms", progress: 75 },
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold text-[var(--primary)] mb-4">
        📚 Learning Goals
      </h3>

      {goals.map((g, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between">
            <h4 className="font-semibold">{g.title}</h4>
            <span>{g.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded mt-1">
            <div
              className="h-full bg-[var(--success)] rounded"
              style={{ width: `${g.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
