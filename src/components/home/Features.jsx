export default function Features() {
  const features = [
    {
      icon: "🎓",
      title: "Verified Professors",
      desc: "Learn from experienced and certified educators with proven teaching skills.",
    },
    {
      icon: "💻",
      title: "Virtual Classroom",
      desc: "Live video, screen share, whiteboard & recording for interactive learning.",
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      desc: "Monitor performance, analytics, and improvement over time.",
    },
    {
      icon: "🗓️",
      title: "Flexible Scheduling",
      desc: "Book sessions anytime that fit your personal schedule.",
    },
    {
      icon: "🔐",
      title: "Secure Payments",
      desc: "Safe and encrypted transactions for worry-free payments.",
    },
    {
      icon: "🌍",
      title: "Learn Anywhere",
      desc: "Access classes from mobile, tablet, or desktop worldwide.",
    },
  ];

  return (
    <section
      id="features"
      className="
        relative py-24
        bg-slate-50
        dark:bg-gradient-to-b dark:from-slate-900 dark:to-black
        transition-colors duration-500
      "
    >
      {/* Section heading */}
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl font-extrabold mb-4 text-slate-800 dark:text-slate-100">
          Why Choose ProfessorOn?
        </h2>

        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Everything you need for a modern learning experience —
          secure, interactive, and efficient.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {features.map((feature, i) => (
          <div
            key={i}
            className="
              group relative
              p-8 rounded-2xl

              bg-white
              dark:bg-slate-900/80

              border border-slate-200 dark:border-slate-800
              shadow-md dark:shadow-black/30

              backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
            "
          >
            {/* Icon */}
            <div
              className="
                w-14 h-14 flex items-center justify-center
                text-xl rounded-xl

                bg-slate-100 dark:bg-slate-800
                text-slate-700 dark:text-slate-200

                mb-5
                group-hover:scale-105
                transition
              "
            >
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
