export default function VerificationStatus({ submitted }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl mb-6 border ${
        submitted
          ? "bg-green-50 border-green-300 text-success"
          : "bg-yellow-50 border-yellow-300 text-warning"
      }`}
    >
      <i
        className={`fas text-xl ${
          submitted ? "fa-check-circle" : "fa-clock"
        }`}
      ></i>

      <span className="font-medium">
        {submitted
          ? "Profile submitted for verification. Our team will review it."
          : "Your profile is pending verification. Please complete all sections."}
      </span>
    </div>
  );
}
