import { useEffect, useState } from "react";
import API from "../../services/api";

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
    return <p className="text-gray-500">Loading credentials...</p>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#2A4D6E]">
        Academic Credentials
      </h2>

      {message && (
        <div
          className={`p-3 rounded ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Education */}
      <Section title="Education">
        <Grid>
          <Input
            label="Highest Degree"
            name="degree"
            value={form.degree}
            onChange={handleChange}
          />
          <Input
            label="Field of Study"
            name="field"
            value={form.field}
            onChange={handleChange}
          />
          <Input
            label="Institution"
            name="institution"
            value={form.institution}
            onChange={handleChange}
          />
          <Input
            label="Year of Graduation"
            name="graduationYear"
            value={form.graduationYear}
            onChange={handleChange}
          />
        </Grid>
      </Section>

      {/* Professional Experience */}
      <Section title="Professional Experience">
        <Grid>
          <Input
            label="Years of Teaching Experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
          />
          <Input
            label="Current Position"
            name="currentPosition"
            value={form.currentPosition}
            onChange={handleChange}
          />
          <Input
            label="Current Institution"
            name="currentInstitution"
            value={form.currentInstitution}
            onChange={handleChange}
          />
        </Grid>
      </Section>

      {/* Subjects & Specializations */}
      <Section title="Subjects & Specializations">
        <Textarea
          label="Subjects You Teach (comma separated)"
          name="subjects"
          value={form.subjects}
          onChange={handleChange}
        />
        <Textarea
          label="Areas of Specialization"
          name="specializations"
          value={form.specializations}
          onChange={handleChange}
        />
      </Section>

      {/* Certifications & Awards */}
      <Section title="Certifications & Awards">
        <Textarea
          label="Professional Certifications"
          name="certifications"
          value={form.certifications}
          onChange={handleChange}
        />
        <Textarea
          label="Awards & Honors"
          name="awards"
          value={form.awards}
          onChange={handleChange}
        />
      </Section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#C76B4A] text-white px-6 py-2 rounded-full hover:bg-[#8A4F7D] transition"
      >
        {saving ? "Saving..." : "Save Credentials"}
      </button>

      {/* Credential Preview */}
      <div className="bg-[#F8F5F2] p-6 rounded-xl border-l-4 border-[#2A4D6E]">
        <h3 className="text-lg font-bold text-[#2A4D6E] mb-3">
          Credential Preview (Student View)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <strong>Education:</strong>{" "}
              {form.degree} in {form.field}, {form.institution}
            </p>
            <p>
              <strong>Experience:</strong> {form.experience}
            </p>
            <p>
              <strong>Position:</strong> {form.currentPosition} at{" "}
              {form.currentInstitution}
            </p>
          </div>
          <div>
            <p>
              <strong>Subjects:</strong> {form.subjects}
            </p>
            <p>
              <strong>Specializations:</strong> {form.specializations}
            </p>
          </div>
        </div>
        <div className="mt-3 bg-blue-100 text-blue-700 p-2 rounded text-sm">
          Detailed certifications and awards are only visible to subscribed
          students.
        </div>
      </div>
    </div>
  );
}

/* UI Helpers */

function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold text-[#2A4D6E] mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}

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
