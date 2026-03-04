function VerificationPending() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">Profile Submitted</h2>
        <p>Your profile is under admin review. You will be notified once approved.</p>
      </div>
    </div>
  );
}

export default VerificationPending;
