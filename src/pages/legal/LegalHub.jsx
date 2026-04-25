import { Link } from "react-router-dom";

const docs = [
    {
        title: "Terms of Service",
        description: "Your rights and responsibilities when using TutorHours.",
        icon: "📜",
        path: "/terms",
        updated: "March 2025",
    },
    {
        title: "Privacy Policy",
        description: "How we collect, use, and protect your personal data under the DPDP Act 2023.",
        icon: "🔒",
        path: "/privacy",
        updated: "March 2025",
    },
    {
        title: "Refund Policy",
        description: "Our cancellation and refund process for sessions and subscriptions.",
        icon: "💸",
        path: "/refund-policy",
        updated: "March 2025",
    },
    {
        title: "Cookie Policy",
        description: "What cookies we use and how you can manage your preferences.",
        icon: "🍪",
        path: "/cookie-policy",
        updated: "March 2025",
    },
    {
        title: "Tutor Agreement",
        description: "Terms governing tutors who list their services on TutorHours.",
        icon: "🎓",
        path: "/tutor-agreement",
        updated: "March 2025",
    },
    {
        title: "Institution Agreement",
        description: "Terms for schools, colleges, and institutions using TutorHours services.",
        icon: "🏫",
        path: "/institution-agreement",
        updated: "March 2025",
    },
];

export default function LegalHub() {
    return (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0f0720] dark:via-[#130a2e] dark:to-[#0a0418]">
            {/* Hero Banner */}
            <div className="relative overflow-hidden pt-32 pb-16 px-6 text-center">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="/academic_hero_banner.png" 
                    alt="Banner" 
                    className="w-full h-full object-cover opacity-20 dark:opacity-40 brightness-[0.9] dark:brightness-[0.7]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)]/20 via-[var(--surface)]/80 to-[var(--surface)]" />
                </div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Legal &amp; Policies</h1>
                  <p className="text-slate-600 dark:text-indigo-100 text-lg max-w-xl mx-auto">
                      Transparency and trust are core to TutorHours. Read all our policies and agreements in one place.
                  </p>
                  <Link
                      to="/"
                      className="inline-block mt-6 text-sm text-[var(--primary)] dark:text-indigo-200 hover:text-[var(--accent)] dark:hover:text-white transition underline underline-offset-4"
                  >
                      ← Back to Home
                  </Link>
                </div>
            </div>

            {/* Document Grid */}
            <div className="max-w-5xl mx-auto px-6 py-14">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs.map((doc) => (
                        <Link
                            key={doc.path}
                            to={doc.path}
                            className="group bg-white dark:bg-[var(--surface)] rounded-2xl border border-gray-100 dark:border-[var(--primary)]/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-7 flex flex-col gap-3"
                        >
                            <span className="text-4xl">{doc.icon}</span>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-[var(--accent)] transition-colors">
                                    {doc.title}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-[var(--accent)]/60 mt-1 leading-relaxed">{doc.description}</p>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-[var(--accent)]/40 mt-auto">Last updated: {doc.updated}</p>
                        </Link>
                    ))}
                </div>

                {/* Footer note */}
                <p className="text-center text-sm text-gray-400 dark:text-[var(--accent)]/50 mt-14">
                    Questions?{" "}
                    <a href="mailto:legal@tutorhours.com" className="text-indigo-600 hover:underline">
                        legal@tutorhours.com
                    </a>
                </p>
            </div>
        </div>
    );
}
