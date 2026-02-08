import API from "../../../services/api";

export default function ProfilePreview({ formData, restart }) {

  async function handleSubmit() {
    try {
      const form = new FormData();

      // BASIC
      form.append("firstName", formData.firstName || "");
      form.append("lastName", formData.lastName || "");
      form.append("email", formData.email || "");
      form.append("phone", formData.phone || "");
      form.append("country", formData.country || "");
      form.append("timezone", formData.timezone || "");
      form.append("bio", formData.bio || "");

      // ACADEMIC
      form.append("highestDegree", formData.highestDegree || "");
      form.append("fieldOfStudy", formData.fieldOfStudy || "");
      form.append("university", formData.university || "");
      form.append("graduationYear", formData.graduationYear || "");
      form.append("specializations", formData.specializations || "");
      form.append("certifications", formData.certifications || "");

      // EXPERIENCE
      form.append("yearsExperience", formData.yearsExperience || "");
      form.append("teachingLevel", formData.teachingLevel || "");
      form.append("subjects", formData.subjects || "");
      form.append("teachingPhilosophy", formData.teachingPhilosophy || "");
      form.append("hourlyRate", formData.hourlyRate || "");

      // OBJECT
      form.append("availability", JSON.stringify(formData.availability || {}));

      // BOOLEANS
      form.append("terms", formData.terms ? "true" : "false");
      form.append("consent", formData.consent ? "true" : "false");

      // FILES
      if (formData.profilePhoto) {
        form.append("profilePhoto", formData.profilePhoto);
      }

      if (formData.degreeCertificate) {
        form.append("degreeCertificate", formData.degreeCertificate);
      }

      if (formData.governmentId) {
        form.append("governmentId", formData.governmentId);
      }

      if (formData.videoIntroduction) {
        form.append("videoIntroduction", formData.videoIntroduction);
      }

      // 🔥 IMPORTANT FIX: use API (not fetch)
      const { data } = await API.post("/professors", form);

      alert("✅ Profile submitted successfully!");
      console.log("Professor Submit Response:", data);

    } catch (err) {
      console.error("Professor Submit Error:", err);
      alert(err.response?.data?.message || "❌ Submission failed");
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={
            formData.profilePhoto
              ? URL.createObjectURL(formData.profilePhoto)
              : "https://via.placeholder.com/100"
          }
          className="w-28 h-28 rounded-full border-4 border-blue-600 object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold text-blue-700">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-gray-600">{formData.fieldOfStudy} Professor</p>
          <p className="text-sm text-gray-500">
            {formData.country} ({formData.timezone})
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <p><b>Email:</b> {formData.email}</p>
        <p><b>Phone:</b> {formData.phone}</p>
        <p><b>Education:</b> {formData.highestDegree}</p>
        <p><b>University:</b> {formData.university}</p>
        <p><b>Experience:</b> {formData.yearsExperience}</p>
        <p><b>Hourly Rate:</b> ${formData.hourlyRate}/hr</p>
      </div>

      <div className="mt-4">
        <p className="font-bold">Bio</p>
        <p className="text-gray-700">{formData.bio}</p>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={restart}
          className="px-6 py-3 bg-gray-300 rounded-xl font-semibold hover:bg-gray-400 transition"
        >
          Edit Again
        </button>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition"
        >
          ✅ Confirm & Submit
        </button>
      </div>
    </div>
  );
}
