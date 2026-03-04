import { useState } from "react";
import { Link } from "react-router-dom";

const POSITIONS = [
    {
        id: 1,
        title: "Technical Support Specialist",
        type: "Full-time",
        location: "Remote",
        dept: "Support",
        description:
            "Help students and professors resolve platform issues, troubleshoot technical problems, and ensure a smooth learning experience. You will triage support tickets, maintain FAQs, and liaise with the engineering team.",
        skills: ["Customer support", "Basic troubleshooting", "Communication", "Ticketing systems"],
    },
    {
        id: 2,
        title: "Senior Technical Support Engineer",
        type: "Full-time",
        location: "Hybrid",
        dept: "Support",
        description:
            "Own complex technical issues escalated from Tier-1 support. Debug API problems, assist with account integrations, write internal runbooks, and mentor junior support staff.",
        skills: ["REST APIs", "Node.js basics", "MongoDB", "Debugging", "Mentoring"],
    },
    {
        id: 3,
        title: "Support Operations Analyst",
        type: "Part-time",
        location: "Remote",
        dept: "Support",
        description:
            "Analyse support data, identify recurring pain points, build dashboards for KPIs (response time, CSAT), and recommend process improvements to reduce ticket volume.",
        skills: ["Data analysis", "Excel / Sheets", "Reporting", "Process improvement"],
    },
    {
        id: 4,
        title: "Platform QA Tester",
        type: "Contract",
        location: "Remote",
        dept: "Quality Assurance",
        description:
            "Write and execute test cases for new features, perform regression testing, and help maintain a bug-free tutoring platform for thousands of students and professors.",
        skills: ["Manual testing", "Bug reporting", "Selenium basics", "Attention to detail"],
    },
];

const BENEFITS = [
    { icon: "🌍", title: "Remote-friendly", desc: "Work from anywhere — fully async friendly culture" },
    { icon: "📈", title: "Growth paths", desc: "Clear career ladders and quarterly promotion reviews" },
    { icon: "🎓", title: "Learning budget", desc: "₹25,000/year for courses, books, and conferences" },
    { icon: "🏥", title: "Health cover", desc: "Comprehensive health insurance for you and dependants" },
    { icon: "⏰", title: "Flexible hours", desc: "Core hours 10am–4pm IST, rest is up to you" },
    { icon: "🤝", title: "Impact", desc: "Directly improve education for thousands of learners" },
];

function ApplicationModal({ position, onClose }) {
    const [form, setForm] = useState({ name: "", email: "", cover: "" });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production wire this to your API
        setSent(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] px-7 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-white/70 text-xs font-medium">Apply for</p>
                        <h3 className="text-white font-bold text-lg">{position.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white text-2xl leading-none">×</button>
                </div>

                {sent ? (
                    <div className="px-7 py-12 text-center">
                        <div className="text-5xl mb-4">🎉</div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">Application Received!</h4>
                        <p className="text-gray-500 text-sm mb-6">We'll review your application and reach out within 5–7 business days.</p>
                        <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white font-semibold text-sm">Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                            <input
                                required
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Jane Smith"
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/40 bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="jane@example.com"
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/40 bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Cover Letter</label>
                            <textarea
                                required
                                rows={4}
                                value={form.cover}
                                onChange={e => setForm({ ...form, cover: e.target.value })}
                                placeholder="Tell us why you'd be a great fit..."
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/40 bg-gray-50 resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#6A11CB] to-[#2575FC] hover:opacity-90 transition"
                        >
                            Submit Application →
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

const TYPE_COLORS = {
    "Full-time": "bg-green-100 text-green-700",
    "Part-time": "bg-blue-100 text-blue-700",
    "Contract": "bg-orange-100 text-orange-700",
};

export default function Careers() {
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("All");

    const departments = ["All", ...new Set(POSITIONS.map(p => p.dept))];
    const visible = filter === "All" ? POSITIONS : POSITIONS.filter(p => p.dept === filter);

    return (
        <div className="min-h-screen bg-gray-50 font-[Inter,sans-serif]">

            {/* ── Navbar strip ── */}
            <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 text-[#6A11CB] font-bold text-lg">
                    <span className="w-8 h-8 rounded-xl bg-[#FF4E9B] flex items-center justify-center text-white text-sm">T</span>
                    TutorHours
                </Link>
                <span className="ml-auto text-sm text-gray-400">Careers</span>
            </header>

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#6A11CB] via-[#4423B8] to-[#2575FC] text-white px-6 py-20 text-center">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #FF4E9B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06B6D4 0%, transparent 40%)" }} />
                <div className="relative max-w-3xl mx-auto">
                    <span className="inline-block bg-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                        We're hiring! Join the team 🚀
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                        Build the Future of<br />
                        <span className="text-[#FF4E9B]">Education Together</span>
                    </h1>
                    <p className="text-white/70 text-lg max-w-lg mx-auto mb-8">
                        Join TutorHours and help thousands of students connect with world-class professors. We're looking for passionate people to grow our Technical Support team.
                    </p>
                    <a href="#openings" className="inline-block bg-white text-[#6A11CB] font-bold px-8 py-3.5 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        View Open Roles
                    </a>
                </div>
            </section>

            {/* ── Benefits ── */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Why TutorHours?</h2>
                <p className="text-gray-400 text-sm text-center mb-10">We invest in our people so they can invest in our mission</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {BENEFITS.map(({ icon, title, desc }) => (
                        <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="text-3xl mb-3">{icon}</div>
                            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                            <p className="text-sm text-gray-500">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Open Positions ── */}
            <section id="openings" className="max-w-5xl mx-auto px-6 pb-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Open Positions</h2>
                <p className="text-gray-400 text-sm mb-6">Showing {visible.length} role{visible.length !== 1 ? "s" : ""}</p>

                {/* Filter pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {departments.map(dept => (
                        <button
                            key={dept}
                            onClick={() => setFilter(dept)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition
                ${filter === dept ? "bg-[#6A11CB] text-white shadow" : "bg-white text-gray-600 border border-gray-200 hover:border-[#6A11CB] hover:text-[#6A11CB]"}`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>

                {/* Position cards */}
                <div className="space-y-4">
                    {visible.map(pos => (
                        <div key={pos.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h3 className="font-bold text-gray-800 text-lg">{pos.title}</h3>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[pos.type]}`}>
                                            {pos.type}
                                        </span>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                                            {pos.location}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{pos.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {pos.skills.map(skill => (
                                            <span key={skill} className="text-xs bg-purple-50 text-[#6A11CB] px-2.5 py-1 rounded-full font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelected(pos)}
                                    className="shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                    bg-gradient-to-r from-[#6A11CB] to-[#2575FC] hover:opacity-90
                    hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Application Modal */}
            {selected && (
                <ApplicationModal position={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
}
