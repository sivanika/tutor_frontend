import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const items = [
    {
      title: "Professor Verification",
      path: "/admin/professors",
      icon: "🧑‍🏫",
    },
    {
      title: "User Management",
      path: "/admin/users",
      icon: "👥",
    },
    {
      title: "Admin Logs",
      path: "/admin/logs",
      icon: "📜",
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: "⚙️",
    },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
        Admin Dashboard
      </h1>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className="
              group p-6 rounded-2xl

              bg-white dark:bg-slate-900/80
              backdrop-blur-xl

              border border-slate-200 dark:border-slate-800
              shadow-md dark:shadow-black/30

              hover:-translate-y-1
              hover:shadow-xl

              transition-all duration-300
            "
          >
            {/* Icon */}
            <div
              className="
                w-12 h-12 flex items-center justify-center
                rounded-xl text-2xl mb-4

                bg-slate-100 dark:bg-slate-800
                text-slate-700 dark:text-slate-200

                group-hover:scale-105
                transition
              "
            >
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {item.title}
            </h3>

            {/* Subtext */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Open {item.title.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}