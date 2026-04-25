import { FiX, FiExternalLink, FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiAward, FiBriefcase, FiDollarSign } from "react-icons/fi";

export default function ProfessorDetailsModal({ professor, onClose }) {
  if (!professor) return null;

  const initials = professor.name
    ? professor.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "P"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center font-bold text-xl">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold">{professor.name}</h2>
            <p className="text-white/70 text-sm truncate">{professor.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Personal Info */}
          <Section title="Personal Information" icon={FiUser}>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow icon={FiMail} label="Email" value={professor.email} />
              <InfoRow icon={FiPhone} label="Phone" value={professor.phone} />
              <InfoRow icon={FiMapPin} label="Country" value={professor.country} />
              <InfoRow icon={FiMapPin} label="Timezone" value={professor.timezone} />
            </div>
            {professor.bio && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Bio</p>
                <p className="text-sm text-gray-600 leading-relaxed">{professor.bio}</p>
              </div>
            )}
          </Section>

          {/* Education */}
          <Section title="Education" icon={FiBook}>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow label="Highest Degree" value={professor.highestDegree} />
              <InfoRow label="Field of Study" value={professor.fieldOfStudy} />
              <InfoRow label="University" value={professor.university} />
              <InfoRow label="Graduation Year" value={professor.graduationYear} />
            </div>
            {professor.certifications && (
              <InfoRow label="Certifications" value={professor.certifications} full />
            )}
          </Section>

          {/* Teaching */}
          <Section title="Teaching Profile" icon={FiBriefcase}>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow label="Experience" value={professor.yearsExperience ? `${professor.yearsExperience} years` : undefined} />
              <InfoRow label="Teaching Level" value={professor.teachingLevel} />
              <InfoRow icon={FiDollarSign} label="Hourly Rate" value={professor.hourlyRate ? `₹${professor.hourlyRate}` : undefined} />
            </div>
            {professor.subjects && <InfoRow label="Subjects" value={professor.subjects} full />}
            {professor.teachingPhilosophy && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Teaching Philosophy</p>
                <p className="text-sm text-gray-600 leading-relaxed">{professor.teachingPhilosophy}</p>
              </div>
            )}
          </Section>

          {/* Documents */}
          {(professor.governmentId || professor.degreeCertificate || professor.videoIntroduction) && (
            <Section title="Documents & Media" icon={FiAward}>
              <div className="flex flex-wrap gap-2">
                {professor.governmentId && (
                  <DocLink href={`http://localhost:5000/${professor.governmentId}`} label="Government ID" />
                )}
                {professor.degreeCertificate && (
                  <DocLink href={`http://localhost:5000/${professor.degreeCertificate}`} label="Degree Certificate" />
                )}
                {professor.videoIntroduction && (
                  <DocLink href={`http://localhost:5000/${professor.videoIntroduction}`} label="Video Introduction" />
                )}
              </div>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <FiX size={14} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={14} className="text-[var(--primary)]" />}
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, full }) {
  if (!value) return null;
  return (
    <div className={`${full ? "col-span-2" : ""}`}>
      <p className="text-xs text-gray-400 font-medium mb-0.5 flex items-center gap-1">
        {Icon && <Icon size={11} />} {label}
      </p>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  );
}

function DocLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-[var(--primary)] border border-blue-100 hover:bg-blue-100 transition"
    >
      <FiExternalLink size={12} /> {label}
    </a>
  );
}
