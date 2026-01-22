import { useEffect, useState } from "react";
import API from "../../services/api";

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
    } catch (err) {
      console.error("PROFILE SAVE ERROR:", err);
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <p className="text-gray-500">Loading profile...</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#2A4D6E]">My Public Profile</h2>

      {/* Profile Preview */}
      <div className="bg-[#F8F5F2] p-6 rounded-xl border-l-4 border-[#C76B4A]">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-[#2A4D6E] flex items-center justify-center text-white text-3xl mr-6">
            🎓
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-[#2A4D6E]">
              {profile.name}
            </h3>
            <p className="text-gray-600">{profile.headline}</p>
            <p className="text-gray-500 text-sm">
              📍 {profile.location || "Not specified"}
            </p>

            <div className="flex gap-2 mt-3 justify-center md:justify-start">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Top Rated
              </span>
              <span className="bg-[#8A4F7D] text-white px-3 py-1 rounded-full text-xs font-semibold">
                Verified Professor
              </span>
              <span className="bg-gradient-to-r from-gray-300 to-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                5+ Years Experience
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-[#2A4D6E] mb-2">
              Public Information
            </h4>
            <p><strong>Specializations:</strong> {profile.specializations}</p>
            <p><strong>Teaching Style:</strong> {profile.teachingStyle}</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#2A4D6E] mb-2">
              Student View
            </h4>
            <p><strong>Rating:</strong> 4.8 / 5</p>
            <p><strong>Response Time:</strong> Within 2 hours</p>
            <p><strong>Students Helped:</strong> {profile.studentsHelped || 0}+</p>
          </div>
        </div>

        <div className="mt-4 bg-orange-100 text-orange-700 p-3 rounded">
          Contact information is only visible after subscription.
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-[#2A4D6E] mb-4">
          Edit Profile Information
        </h3>

        {message && (
          <div
            className={`p-2 rounded mb-4 ${
              message.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Display Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Professional Headline"
            name="headline"
            value={form.headline}
            onChange={handleChange}
          />

          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Professional Bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Teaching Style"
              name="teachingStyle"
              value={form.teachingStyle}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Specializations"
              name="specializations"
              value={form.specializations}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 bg-[#C76B4A] text-white px-6 py-2 rounded-full hover:bg-[#8A4F7D] transition"
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}

/* Helpers */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#2A4D6E] mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#C76B4A]"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#2A4D6E] mb-1">
        {label}
      </label>
      <textarea
        {...props}
        rows="3"
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#C76B4A]"
      />
    </div>
  );
}
