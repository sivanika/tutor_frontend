import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-6">
        <Link
          to="/admin/professors"
          className="bg-indigo-600 text-white p-4 rounded shadow hover:bg-indigo-700"
        >
          Professor Verification
        </Link>

        <Link
          to="/admin/users"
          className="bg-green-600 text-white p-4 rounded shadow hover:bg-green-700"
        >
          User Management
        </Link>

        <Link
          to="/admin/logs"
          className="bg-orange-600 text-white p-4 rounded shadow hover:bg-orange-700"
        >
          Admin Logs
        </Link>

        <Link
          to="/admin/settings"
          className="bg-gray-600 text-white p-4 rounded shadow hover:bg-gray-700"
        >
          Settings
        </Link>
      </div>
    </div>
  );
}
