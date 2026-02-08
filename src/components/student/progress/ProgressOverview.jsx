export default function ProgressOverview({ sessions }) {
  const totalSessions = sessions.length
  const completed = sessions.filter(
    s => new Date(`${s.date} ${s.time}`) <= new Date()
  ).length

  const completion = totalSessions === 0
    ? 0
    : Math.round((completed / totalSessions) * 100)

  // Fake avg score for now (later connect quiz engine)
  const avgScore = totalSessions ? 80 + (totalSessions % 10) : 0

  const hoursLearned = completed * 1.5   // assume 1.5h per session

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card title="Course Completion" value={`${completion}%`} />
      <Card title="Average Score" value={`${avgScore}%`} />
      <Card title="Sessions Completed" value={completed} />
      <Card title="Hours Learned" value={hoursLearned} />
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-[var(--light)] p-6 rounded-lg text-center">
      <h2 className="text-3xl font-bold text-[var(--primary)]">
        {value}
      </h2>
      <p className="text-gray-600">{title}</p>
    </div>
  )
}
