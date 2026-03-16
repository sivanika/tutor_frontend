import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  FiLoader, FiSave, FiCheckCircle, FiInfo, FiAlertCircle,
  FiBook, FiBriefcase, FiGrid, FiAward, FiEye
} from "react-icons/fi";

export default function Credentials() {
  const [form, setForm] = useState({
    degree: "",
    field: "",
    institution: "",
    graduationYear: "",
    experience: "",
    currentPosition: "",
    currentInstitution: "",
    subjects: "",
    specializations: "",
    certifications: "",
    awards: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/users/me")
      .then((res) => {
        if (res.data.credentials) {
          setForm({ ...form, ...res.data.credentials });
        }
      })
      .catch((err) => console.error("CREDENTIAL LOAD ERROR:", err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await API.put("/users/credentials", form);
      setMessage("Credentials saved successfully!");
    } catch (err) {
      console.error("SAVE CREDENTIAL ERROR:", err);
      setMessage("Failed to save credentials");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-10 justify-center">
        <FiLoader className="animate-spin" size={20} />
        <span className="text-sm">Loading credentials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-5xl animate-fadeIn">

      {/* ─── Page Header ─── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#6A11CB] to-[#2575FC] rounded-2xl p-6 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">Professor Dashboard</p>
          <h2 className="text-2xl font-bold mb-1">Academic Credentials</h2>
          <p className="text-white/60 text-sm">
            Manage your academic qualifications, experience, and certifications.
          </p>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-10 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute right-36 -top-4 w-16 h-16 rounded-full bg-[#FF4E9B]/30" />
      </div>

      {/* ─── Status Message ─── */}
      {message && (
        <div className={`flex items-center gap-2 p-3.5 rounded-xl text-sm ${
          message.includes("success")
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
            : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {message.includes("success")
            ? <FiCheckCircle size={15} className="shrink-0" />
            : <FiAlertCircle size={15} className="shrink-0" />
          }
          {message}
        </div>
      )}

      {/* ─── Education ─── */}
      <Section icon={FiBook} iconBg="bg-purple-50" iconColor="text-[#6A11CB]" title="Education" subtitle="Your highest academic qualification">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Highest Degree"
            name="degree"
            value={form.degree}
            onChange={handleChange}
            placeholder="e.g. PhD, Master's, Bachelor's"
          />
          <Input
            label="Field of Study"
            name="field"
            value={form.field}
            onChange={handleChange}
            placeholder="e.g. Mathematics, Computer Science"
          />
          <Input
            label="Institution"
            name="institution"
            value={form.institution}
            onChange={handleChange}
            placeholder="University / College name"
          />
          <Input
            label="Year of Graduation"
            name="graduationYear"
            value={form.graduationYear}
            onChange={handleChange}
            placeholder="e.g. 2018"
          />
        </div>
      </Section>

      {/* ─── Professional Experience ─── */}
      <Section icon={FiBriefcase} iconBg="bg-blue-50" iconColor="text-[#2575FC]" title="Professional Experience" subtitle="Your current role and teaching history">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Years of Teaching Experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="e.g. 7 years"
          />
          <Input
            label="Current Position"
            name="currentPosition"
            value={form.currentPosition}
            onChange={handleChange}
            placeholder="e.g. Associate Professor"
          />
          <div className="md:col-span-2">
            <Input
              label="Current Institution"
              name="currentInstitution"
              value={form.currentInstitution}
              onChange={handleChange}
              placeholder="Where do you currently teach?"
            />
          </div>
        </div>
      </Section>

      {/* ─── Subjects & Specializations ─── */}
      <Section icon={FiGrid} iconBg="bg-pink-50" iconColor="text-[#FF4E9B]" title="Subjects & Specializations" subtitle="Topics you cover in your sessions">
        <div className="space-y-4">
          <Textarea
            label="Subjects You Teach"
            name="subjects"
            value={form.subjects}
            onChange={handleChange}
            placeholder="e.g. Calculus, Linear Algebra, Statistics (comma separated)"
          />
          <Textarea
            label="Areas of Specialization"
            name="specializations"
            value={form.specializations}
            onChange={handleChange}
            placeholder="Your core expertise areas..."
          />
        </div>
      </Section>

      {/* ─── Certifications & Awards ─── */}
      <Section icon={FiAward} iconBg="bg-yellow-50" iconColor="text-yellow-500" title="Certifications & Awards" subtitle="Recognition and professional credentials">
        <div className="space-y-4">
          <Textarea
            label="Professional Certifications"
            name="certifications"
            value={form.certifications}
            onChange={handleChange}
            placeholder="List your certifications and the issuing organizations..."
          />
          <Textarea
            label="Awards & Honors"
            name="awards"
            value={form.awards}
            onChange={handleChange}
            placeholder="Academic awards, teaching recognition, research honors..."
          />
        </div>
      </Section>

      {/* ─── Save Button ─── */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white px-7 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {saving ? (
            <><FiLoader size={15} className="animate-spin" /> Saving...</>
          ) : (
            <><FiSave size={15} /> Save Credentials</>
          )}
        </button>
        <p className="text-xs text-gray-400">Updates are reflected on your public profile</p>
      </div>

      {/* ─── Preview Card ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <FiEye size={15} className="text-[#2575FC]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Student View Preview</h3>
            <p className="text-xs text-gray-400">This is how students see your credentials</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <PreviewRow label="Education" value={[form.degree, form.field, form.institution].filter(Boolean).join(" • ") || "—"} />
              <PreviewRow label="Experience" value={form.experience || "—"} />
              <PreviewRow label="Position" value={[form.currentPosition, form.currentInstitution].filter(Boolean).join(" at ") || "—"} />
            </div>
            <div className="space-y-3">
              <PreviewRow label="Subjects" value={form.subjects || "—"} />
              <PreviewRow label="Specializations" value={form.specializations || "—"} />
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2 bg-blue-50 text-blue-700 p-3.5 rounded-xl border border-blue-100 text-sm">
            <FiInfo size={15} className="shrink-0 mt-0.5" />
            <span>Detailed certifications and awards are only visible to subscribed students.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── UI Helpers ── */

function Section({ icon: Icon, iconBg, iconColor, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon size={15} className={iconColor} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div>
      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</span>
      <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{value}</p>
    </div>
  );
}

function Input({ label, placeholder, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <input
        {...props}
        placeholder={placeholder}
        className="w-full border border-gray-200 bg-gray-50 px-3.5 py-2.5 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/30 focus:border-[#6A11CB] focus:bg-white transition-all duration-200"
      />
    </div>
  );
}

function Textarea({ label, placeholder, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <textarea
        {...props}
        rows="3"
        placeholder={placeholder}
        className="w-full border border-gray-200 bg-gray-50 px-3.5 py-2.5 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A11CB]/30 focus:border-[#6A11CB] focus:bg-white transition-all duration-200 resize-none"
      />
    </div>
  );
}
