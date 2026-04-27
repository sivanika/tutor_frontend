import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema } from "../validation/schemas";
import { useState } from "react";
import { FiBriefcase, FiCalendar, FiSun, FiSunrise, FiSunset, FiMoon } from "react-icons/fi";


const SUBJECTS = [
  "Mathematics","Physics","Chemistry","Biology","Computer Science",
  "English Language","English Literature","History","Geography","Economics",
  "Accountancy","Business Studies","Political Science","Psychology","Sociology",
  "Philosophy","Statistics","Environmental Science","Physical Education",
  "Music","Fine Arts","French","Spanish","German","Hindi","Tamil",
  "Telugu","Kannada","Malayalam","Sanskrit","Other",
];

const AVAIL_OPTIONS = [
  { key: "weekdays",  label: "Weekdays",  icon: <FiCalendar />, desc: "Mon – Fri" },
  { key: "weekends",  label: "Weekends",  icon: <FiSun />,      desc: "Sat & Sun" },
  { key: "mornings",  label: "Morning",   icon: <FiSunrise />,  desc: "6 AM – 12 PM" },
  { key: "afternoons",label: "Afternoon", icon: <FiSun />,      desc: "12 PM – 5 PM" },
  { key: "evenings",  label: "Evening",   icon: <FiMoon />,     desc: "5 PM – 10 PM" },
];


const inputCls = `
  w-full px-4 py-3 rounded-xl text-sm text-slate-800
  bg-white border border-slate-200
  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
  placeholder-slate-300 transition-all duration-200 shadow-sm hover:border-indigo-300
`;

function Field({ label, error, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function SubjectDropdown({ label, value, onChange, exclude, required, hint }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = SUBJECTS.filter(
    (s) => s !== exclude && s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left text-sm transition-all duration-200 shadow-sm
          ${value ? "text-slate-800" : "text-slate-300"}
          ${open
            ? "border-indigo-400 ring-2 ring-indigo-100 bg-white"
            : "border-slate-200 bg-white hover:border-indigo-300"}`}
      >
        <span>{value || `Select ${label}…`}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              type="text"
              placeholder="Search subjects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {!required && (
              <li>
                <button type="button" onClick={() => { onChange(""); setOpen(false); setSearch(""); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-50">
                  — None (optional) —
                </button>
              </li>
            )}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-slate-400 text-center">No subjects found</li>
            )}
            {filtered.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => { onChange(s); setOpen(false); setSearch(""); }}
                  className={`w-full text-left px-4 py-2 text-sm transition
                    ${value === s ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}>
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

export default function StepExperience({ formData, setFormData, next, prev }) {
  const [primarySubject, setPrimarySubject] = useState(formData.primarySubject || "");
  const [secondarySubject, setSecondarySubject] = useState(formData.secondarySubject || "");

  const { register, handleSubmit, formState: { errors }, setValue, watch, setError, clearErrors } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      ...formData,
      subjects:
        formData.subjects ||
        [formData.primarySubject, formData.secondarySubject].filter(Boolean).join(", ") ||
        "",
    },
  });

  const availability = watch("availability");

  const toggle = (key) => {
    setValue("availability", { ...availability, [key]: !availability?.[key] }, { shouldValidate: true });
  };

  const handlePrimaryChange = (val) => {
    setPrimarySubject(val);
    const combined = [val, secondarySubject].filter(Boolean).join(", ");
    setValue("subjects", combined, { shouldValidate: true });
    setFormData(prev => ({ ...prev, primarySubject: val, subjects: combined }));
    if (val) clearErrors("subjects");
  };

  const handleSecondaryChange = (val) => {
    setSecondarySubject(val);
    const combined = [primarySubject, val].filter(Boolean).join(", ");
    setValue("subjects", combined, { shouldValidate: true });
    setFormData(prev => ({ ...prev, secondarySubject: val, subjects: combined }));
  };

  const onSubmit = (data) => {
    if (!primarySubject) {
      setError("subjects", { message: "Primary subject is required" });
      return;
    }
    setFormData({
      ...formData, ...data,
      primarySubject, secondarySubject,
      subjects: [primarySubject, secondarySubject].filter(Boolean).join(", "),
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xl shadow-lg shadow-amber-200">
          <FiBriefcase />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Teaching Experience</h2>
          <p className="text-xs text-slate-400 mt-0.5">Your expertise, subjects, and availability</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Years + Level */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Years of Experience" error={errors.yearsExperience?.message}>
            <input {...register("yearsExperience")} className={inputCls} placeholder="e.g. 5" />
          </Field>
          <Field label="Teaching Level" error={errors.teachingLevel?.message}>
            <input {...register("teachingLevel")} className={inputCls} placeholder="e.g. High School, University" />
          </Field>
        </div>

        {/* Subjects */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Subjects You Teach</p>
          <input type="hidden" {...register("subjects")} />

          <SubjectDropdown
            label="Primary Subject"
            required
            hint="The main subject you specialise in"
            value={primarySubject}
            exclude={secondarySubject}
            onChange={handlePrimaryChange}
          />
          <SubjectDropdown
            label="Secondary Subject"
            required={false}
            hint="Optional — a second subject you can teach"
            value={secondarySubject}
            exclude={primarySubject}
            onChange={handleSecondaryChange}
          />

          {errors.subjects && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.subjects.message}
            </p>
          )}
        </div>

        {/* Hourly rate */}
        <Field label="Hourly Rate (₹)" error={errors.hourlyRate?.message}>
          <input {...register("hourlyRate")} className={inputCls} placeholder="e.g. 500" />
        </Field>

        {/* Availability */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Your Availability</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AVAIL_OPTIONS.map(({ key, label, emoji, desc }) => {
              const active = availability?.[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className={`p-4 rounded-xl border-2 flex flex-col items-start gap-1 transition-all duration-200
                    ${active
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-[1.02]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="font-semibold text-sm leading-tight">{label}</span>
                  <span className={`text-xs leading-tight ${active ? "text-indigo-200" : "text-slate-400"}`}>{desc}</span>
                </button>
              );
            })}
          </div>
          {errors.availability && (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.availability.message}
            </p>
          )}
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between mt-8">
        <button type="button" onClick={prev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button type="submit"
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all">
          Continue
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
