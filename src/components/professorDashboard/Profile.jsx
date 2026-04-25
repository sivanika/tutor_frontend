import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  FiUser, FiMapPin, FiEdit3, FiSave, FiLoader,
  FiStar, FiShield, FiClock, FiUsers, FiBook,
  FiInfo, FiCheckCircle
} from "react-icons/fi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    headline: "",
    location: "",
    bio: "",
    teachingStyle: "",
    specializations: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/users/me")
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          headline: res.data.headline || "",
          location: res.data.location || "",
          bio: res.data.bio || "",
          teachingStyle: res.data.teachingStyle || "",
          specializations: res.data.specializations || "",
        });
      })
      .catch((err) => console.error("PROFILE LOAD ERROR:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await API.put("/users/profile", form);
      setMessage("Profile updated successfully!");
      setProfile(prev => ({ ...prev, ...form }));
    } catch (err) {
      console.error("PROFILE SAVE ERROR:", err);
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-10 justify-center">
        <FiLoader className="animate-spin" size={20} />
        <span className="text-sm">Loading profile...</span>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : profile.email?.[0]?.toUpperCase() || "P";

  return (
    <div className="space-y-6 max-w-5xl animate-fadeIn">
      {/* ─── Hero Card (Profile Preview) ─── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] rounded-2xl shadow-lg">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -right-2 -bottom-12 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-40 -top-6 w-20 h-20 rounded-full bg-[var(--accent)]/30" />

        <div className="relative z-10 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                <FiCheckCircle size={12} className="text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{profile.name || "Professor"}</h2>
              <p className="text-white/70 text-sm mt-0.5">{profile.headline || "Add your professional headline"}</p>
              {profile.location && (
                <p className="text-white/55 text-xs mt-1 flex items-center gap-1">
                  <FiMapPin size={11} />
                  {profile.location}
                </p>
              )}
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  <FiStar size={10} /> Top Rated
                </span>
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                  <FiShield size={10} /> Verified Professor
                </span>
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                  <FiClock size={10} /> 5+ Years Exp.
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden lg:flex gap-6 shrink-0">
              <StatPill icon={FiStar} label="Rating" value="4.8 / 5" />
              <StatPill icon={FiClock} label="Response" value="&lt;2 hrs" />
              <StatPill icon={FiUsers} label="Students" value={`${profile.studentsHelped || 0}+`} />
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="flex gap-4 mt-5 lg:hidden">
            <MiniStat label="Rating" value="4.8 / 5" />
            <MiniStat label="Response" value="< 2 hrs" />
            <MiniStat label="Students" value={`${profile.studentsHelped || 0}+`} />
          </div>
        </div>
      </div>

      {/* ─── Info Grid ─── */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Public Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <FiBook size={15} className="text-[var(--primary)]" />
            </div>
            <h4 className="font-semibold text-gray-800">Public Information</h4>
          </div>
          <div className="space-y-3">
            <InfoRow label="Specializations" value={profile.specializations || "Not specified"} />
            <InfoRow label="Teaching Style" value={profile.teachingStyle || "Not specified"} />
          </div>
        </div>

        {/* Visibility Notice */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <FiInfo size={15} className="text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">Contact Visibility</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              Your contact information is only visible to students after they subscribe to your profile.
              Keep your public information up to date to attract more students.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Edit Form ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <FiEdit3 size={15} className="text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Edit Profile Information</h3>
            <p className="text-xs text-gray-400">Update your public-facing details</p>
          </div>
        </div>

        <div className="p-6">
          {/* Message */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl mb-5 text-sm ${
              message.includes("success")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}>
              {message.includes("success")
                ? <FiCheckCircle size={15} />
                : <FiInfo size={15} />
              }
              {message}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <Input
              label="Professional Headline"
              name="headline"
              value={form.headline}
              onChange={handleChange}
              placeholder="e.g. Senior Math Professor"
            />
            <Input
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, Country"
            />

            <div className="md:col-span-2">
              <Textarea
                label="Professional Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Write a short bio that students will see on your profile..."
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Teaching Style"
                name="teachingStyle"
                value={form.teachingStyle}
                onChange={handleChange}
                placeholder="Describe how you approach teaching..."
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Specializations"
                name="specializations"
                value={form.specializations}
                onChange={handleChange}
                placeholder="e.g. Calculus, Linear Algebra, Statistics..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {saving ? (
                <><FiLoader size={15} className="animate-spin" /> Saving...</>
              ) : (
                <><FiSave size={15} /> Update Profile</>
              )}
            </button>
            <p className="text-xs text-gray-400">Changes are reflected immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
      <Icon size={14} className="text-white/70 mx-auto mb-1" />
      <div className="text-white font-bold text-sm">{value}</div>
      <div className="text-white/55 text-xs">{label}</div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 flex-1">
      <div className="text-white font-bold text-sm">{value}</div>
      <div className="text-white/55 text-xs">{label}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-700 mt-0.5">{value}</span>
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
        className="w-full border border-gray-200 bg-gray-50 px-3.5 py-2.5 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] focus:bg-white transition-all duration-200"
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
        className="w-full border border-gray-200 bg-gray-50 px-3.5 py-2.5 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] focus:bg-white transition-all duration-200 resize-none"
      />
    </div>
  );
}
