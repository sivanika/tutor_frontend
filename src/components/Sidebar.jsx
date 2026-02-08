import { Link } from "react-router-dom"

function Sidebar({ role }) {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-8">Portal</h2>

      <nav className="flex flex-col gap-4">
        {role === "student" && (
          <>
            <Link
              to="/student/dashboard"
              className="hover:text-blue-400"
            >
              Dashboard
            </Link>

            <Link
              to="/student/sessions"
              className="hover:text-blue-400"
            >
              Sessions
            </Link>
            <Link to="/chat">Chat</Link>

          </>
        )}

        {role === "professor" && (
          <>
            <Link
              to="/professor/dashboard"
              className="hover:text-green-400"
            >
              Dashboard
            </Link>

            <Link
              to="/professor/create-session"
              className="hover:text-green-400"
            >
              Create Session
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}

export default Sidebar
