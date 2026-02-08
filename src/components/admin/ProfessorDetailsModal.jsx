export default function ProfessorDetailsModal({ professor, onClose }) {
  if (!professor) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">Professor Profile Details</h2>

        <div className="space-y-2">
          <p><b>Name:</b> {professor.name}</p>
          <p><b>Email:</b> {professor.email}</p>
          <p><b>Phone:</b> {professor.phone}</p>
          <p><b>Country:</b> {professor.country}</p>
          <p><b>Timezone:</b> {professor.timezone}</p>
          <p><b>Bio:</b> {professor.bio}</p>

          <hr />

          <p><b>Highest Degree:</b> {professor.highestDegree}</p>
          <p><b>Field of Study:</b> {professor.fieldOfStudy}</p>
          <p><b>University:</b> {professor.university}</p>
          <p><b>Graduation Year:</b> {professor.graduationYear}</p>
          <p><b>Certifications:</b> {professor.certifications}</p>

          <hr />

          <p><b>Experience:</b> {professor.yearsExperience} years</p>
          <p><b>Teaching Level:</b> {professor.teachingLevel}</p>
          <p><b>Subjects:</b> {professor.subjects}</p>
          <p><b>Teaching Philosophy:</b> {professor.teachingPhilosophy}</p>
          <p><b>Hourly Rate:</b> ₹{professor.hourlyRate}</p>

          <hr />

          {professor.governmentId && (
            <p>
              <a
                href={`http://localhost:5000/${professor.governmentId}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Government ID
              </a>
            </p>
          )}

          {professor.degreeCertificate && (
            <p>
              <a
                href={`http://localhost:5000/${professor.degreeCertificate}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Degree Certificate
              </a>
            </p>
          )}

          {professor.videoIntroduction && (
            <p>
              <a
                href={`http://localhost:5000/${professor.videoIntroduction}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Video Introduction
              </a>
            </p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
