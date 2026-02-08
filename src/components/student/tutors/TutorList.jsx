import TutorCard from "./TutorCard"

export default function TutorList({ sessions, refresh }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map(s => (
        <TutorCard
          key={s._id}
          session={s}
          onEnroll={refresh}
        />
      ))}
    </div>
  )
}
