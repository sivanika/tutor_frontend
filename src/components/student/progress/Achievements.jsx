export default function Achievements({ sessions }) {
  const completed = sessions.filter(
    s => new Date(`${s.date} ${s.time}`) <= new Date()
  ).length

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold text-[var(--primary)] mb-4">
        🏆 Achievements
      </h3>

      <Achievement
        title="Consistent Learner"
        desc="Completed 5+ sessions"
        unlocked={completed >= 5}
      />
      <Achievement
        title="Session Champion"
        desc="Completed 10+ sessions"
        unlocked={completed >= 10}
      />
      <Achievement
        title="Learning Star"
        desc="Completed 20+ sessions"
        unlocked={completed >= 20}
      />
    </div>
  )
}

function Achievement({ title, desc, unlocked }) {
  return (
    <div className="flex justify-between items-center border-b py-3">
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <i
        className={`fas fa-award text-2xl ${
          unlocked ? "text-yellow-400" : "text-gray-300"
        }`}
      ></i>
    </div>
  )
}
