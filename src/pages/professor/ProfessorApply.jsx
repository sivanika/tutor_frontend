import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProfessorApply() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    subjectExpertise: "",
    yearsExperience: "",
    preferredPayout: "",
    email: "",
    phone: "",
    background: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Application submitted successfully!");
      setLoading(false);
      navigate("/professor/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] text-white flex flex-col items-center justify-center p-6 font-[Inter,sans-serif]">
      {/* Navbar Minimal */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
          <span className="w-8 h-8 rounded-xl bg-[#c9a227] flex items-center justify-center text-white text-sm">
            T
          </span>
          TutorHours
        </Link>
        <Link to="/professor/dashboard" className="px-5 py-2 text-sm font-semibold bg-[#c9a227] text-white rounded-lg hover:opacity-90">
          Back to Dashboard
        </Link>
      </nav>

      {/* Header Container */}
      <div className="max-w-2xl text-center mt-20 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-[#dedede] leading-tight tracking-tight">
          Apply to Teach.<br />
          Earn on Your Terms.
        </h1>
        <p className="text-[#a1a1aA] text-sm leading-relaxed max-w-lg mx-auto">
          Join our commission-based program. No subscription fees — you teach, we handle student matching, you get paid.
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-3xl bg-[#130b24] p-8 md:p-10 rounded-3xl relative border border-white/5 shadow-2xl">
        {/* Subtle top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-80" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FULL NAME */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">
                FULL NAME
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                <input
                  type="text"
                  required
                  placeholder="Dr. Priya Sharma"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a0f30] border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-gray-300 placeholder-gray-600 transition"
                />
              </div>
            </div>

            {/* SUBJECT EXPERTISE */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">
                SUBJECT EXPERTISE
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📚</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Differential Equations, ML"
                  value={form.subjectExpertise}
                  onChange={(e) => setForm({ ...form, subjectExpertise: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a0f30] border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-gray-300 placeholder-gray-600 transition"
                />
              </div>
            </div>

            {/* YEARS OF EXPERIENCE */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">
                YEARS OF EXPERIENCE
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 8"
                value={form.yearsExperience}
                onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
                className="w-full px-4 py-3 bg-[#1a0f30] border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-gray-300 placeholder-gray-600 transition"
              />
            </div>

            {/* PREFERRED PAYOUT */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">
                PREFERRED PAYOUT
              </label>
              <select
                required
                value={form.preferredPayout}
                onChange={(e) => setForm({ ...form, preferredPayout: e.target.value })}
                className="w-full px-4 py-3 bg-[#1a0f30] border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-gray-300 appearance-none transition"
              >
                <option value="" disabled hidden>Select preference...</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* EMAIL ADDRESS */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
                <input
                  type="email"
                  required
                  placeholder="you@university.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a0f30] border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-gray-300 placeholder-gray-600 transition"
                />
              </div>
            </div>

            {/* PHONE / WHATSAPP */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">
                PHONE / WHATSAPP
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📞</span>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a0f30] border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-gray-300 placeholder-gray-600 transition"
                />
              </div>
            </div>
          </div>

          {/* TEACHING BACKGROUND & MOTIVATION */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">
              TEACHING BACKGROUND & MOTIVATION
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell us about your teaching philosophy, current position, and what motivates you to join TutorHours..."
              value={form.background}
              onChange={(e) => setForm({ ...form, background: e.target.value })}
              className="w-full px-4 py-3 bg-[#1a0f30] border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-gray-300 placeholder-gray-600 resize-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-sm text-[#0f0720] bg-teal-400 hover:bg-teal-300 transition-all duration-200 shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:opacity-75 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              "Submit Application →"
            )}
          </button>

          {/* Disclaimer */}
          <p className="text-center text-[11px] text-gray-500 pt-2 pb-1 leading-relaxed">
            By applying, you agree to our{" "}
            <Link to="/terms" className="text-teal-500 hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/commission-policy" className="text-teal-500 hover:underline">Commission Policy</Link>.
            <br className="hidden md:block" />
            We typically respond within 48 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
