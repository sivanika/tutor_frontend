import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema } from "../validation/schemas";
import { useState } from "react";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English Language",
  "English Literature",
  "History",
  "Geography",
  "Economics",
  "Accountancy",
  "Business Studies",
  "Political Science",
  "Psychology",
  "Sociology",
  "Philosophy",
  "Statistics",
  "Environmental Science",
  "Physical Education",
  "Music",
  "Fine Arts",
  "French",
  "Spanish",
  "German",
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Sanskrit",
  "Other",
];

function SubjectDropdown({ label, value, onChange, exclude, required, hint }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = SUBJECTS.filter(
    (s) =>
      s !== exclude &&
      s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-left text-sm transition
          ${value ? "text-gray-800" : "text-gray-400"}
          ${open ? "border-indigo-500 ring-2 ring-indigo-200 bg-white" : "border-gray-300 bg-gray-50 hover:bg-white"}`}
      >
        <span>{value || `Select ${label}`}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              placeholder="Search subjects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Options */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {/* Clear option (only for optional) */}
            {!required && (
              <li>
                <button
                  type="button"
                  onClick={() => { onChange(""); setOpen(false); setSearch(""); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-50"
                >
                  — None (optional) —
                </button>
              </li>
            )}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No subjects found</li>
            )}
            {filtered.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => { onChange(s); setOpen(false); setSearch(""); }}
                  className={`w-full text-left px-4 py-2 text-sm transition
                    ${value === s ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function StepExperience({
  formData,
  setFormData,
  next,
  prev,
}) {
  // Local state for the two subject dropdowns (managed outside RHF)
  const [primarySubject, setPrimarySubject] = useState(formData.primarySubject || "");
  const [secondarySubject, setSecondarySubject] = useState(formData.secondarySubject || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      ...formData,
      // Pre-populate subjects so Zod validation passes if already filled
      subjects: formData.subjects ||
        [formData.primarySubject, formData.secondarySubject].filter(Boolean).join(", ") ||
        "",
    },
  });

  const availability = watch("availability");

  const toggle = (key) => {
    const updated = {
      ...availability,
      [key]: !availability?.[key],
    };
    setValue("availability", updated, { shouldValidate: true });
  };

  // When primary subject changes, also keep the hidden `subjects` RHF field in sync
  const handlePrimaryChange = (val) => {
    setPrimarySubject(val);
    // Build combined string for Zod validation
    const combined = [val, secondarySubject].filter(Boolean).join(", ");
    setValue("subjects", combined, { shouldValidate: true });
    setFormData(prev => ({
      ...prev,
      primarySubject: val,
      subjects: combined,
    }));
    if (val) clearErrors("subjects");
  };

  const handleSecondaryChange = (val) => {
    setSecondarySubject(val);
    const combined = [primarySubject, val].filter(Boolean).join(", ");
    setValue("subjects", combined, { shouldValidate: true });
    setFormData(prev => ({
      ...prev,
      secondarySubject: val,
      subjects: combined,
    }));
  };

  const onSubmit = (data) => {
    // Extra guard: make sure primarySubject is filled
    if (!primarySubject) {
      setError("subjects", { message: "Primary subject is required" });
      return;
    }

    setFormData({
      ...formData,
      ...data,
      primarySubject,
      secondarySubject,
      subjects: [primarySubject, secondarySubject].filter(Boolean).join(", "),
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold">Teaching Experience</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <input
            {...register("yearsExperience")}
            className="opt-input"
            placeholder="Years of Experience"
          />
          <p className="text-red-500 text-sm">{errors.yearsExperience?.message}</p>
        </div>

        <div>
          <input
            {...register("teachingLevel")}
            className="opt-input"
            placeholder="Teaching Level (e.g. High School, University)"
          />
          <p className="text-red-500 text-sm">{errors.teachingLevel?.message}</p>
        </div>
      </div>

      {/* ── Subject Dropdowns ── */}
      <div className="space-y-4">
        <p className="font-semibold text-gray-800">Subjects You Teach</p>

        {/* Hidden input keeps the subjects value in RHF / Zod pipeline */}
        <input type="hidden" {...register("subjects")} />

        {/* Primary Subject */}
        <SubjectDropdown
          label="Primary Subject"
          required
          hint="The main subject you specialise in"
          value={primarySubject}
          exclude={secondarySubject}
          onChange={handlePrimaryChange}
        />

        {/* Secondary Subject */}
        <SubjectDropdown
          label="Secondary Subject"
          required={false}
          hint="Optional — a second subject you can teach"
          value={secondarySubject}
          exclude={primarySubject}
          onChange={handleSecondaryChange}
        />

        {errors.subjects && (
          <p className="text-red-500 text-xs">{errors.subjects.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("hourlyRate")}
          className="opt-input"
          placeholder="Hourly Rate (₹)"
        />
        <p className="text-red-500 text-sm">{errors.hourlyRate?.message}</p>
      </div>

      {/* Availability */}
      <div>
        <p className="font-semibold mb-3">Availability</p>

        <div className="grid grid-cols-2 gap-4">
          {Object.keys(availability || {}).map((i) => (
            <label key={i} className="flex gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={availability[i]}
                onChange={() => toggle(i)}
              />
              {i.charAt(0).toUpperCase() + i.slice(1)}
            </label>
          ))}
        </div>

        <p className="text-red-500 text-sm">{errors.availability?.message}</p>
      </div>

      <div className="flex justify-between pt-6">
        <button type="button" onClick={prev} className="btn-secondary">
          ← Back
        </button>

        <button
          type="submit"
          className="btn-primary"
        >
          Next →
        </button>
      </div>
    </form>
  );
}
