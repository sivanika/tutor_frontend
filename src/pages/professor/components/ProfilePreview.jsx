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

      // ✅ FIX: Update local storage so AuthContext knows we are done
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (storedUserInfo) {
        const updatedUserInfo = {
          ...storedUserInfo,
          user: {
            ...storedUserInfo.user,
            profileCompleted: true,
            isVerified: false // usually false after initial submit
          }
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      }

      alert("✅ Profile submitted successfully!");
      console.log("Professor Submit Response:", data);

      // Redirect to dashboard (or verification pending)
      // We need to import useNavigate first
      window.location.href = "/professor/dashboard";

    } catch (err) {
      console.error("Professor Submit Error:", err);
      alert(err.response?.data?.message || "❌ Submission failed");
    }
  }

 return (
  <div
    className="
      bg-white/90 dark:bg-slate-900/80
      backdrop-blur-2xl
      p-8 rounded-2xl
      border border-slate-200 dark:border-slate-800
      shadow-xl dark:shadow-black/40
      transition-colors
    "
  >
    {/* Header */}
    <div className="flex flex-col md:flex-row items-center gap-6">
      <img
        src={
          formData.profilePhoto
            ? URL.createObjectURL(formData.profilePhoto)
            : "https://via.placeholder.com/100"
        }
        className="
          w-28 h-28 rounded-full
          border-4 border-slate-300 dark:border-slate-700
          object-cover
          shadow-md
        "
      />

      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {formData.firstName} {formData.lastName}
        </h2>

        <p className="text-slate-600 dark:text-slate-400">
          {formData.fieldOfStudy} Professor
        </p>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {formData.country} ({formData.timezone})
        </p>
      </div>
    </div>

    {/* Info Grid */}
    <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
      <p className="text-slate-700 dark:text-slate-300">
        <b>Email:</b> {formData.email}
      </p>
      <p className="text-slate-700 dark:text-slate-300">
        <b>Phone:</b> {formData.phone}
      </p>
      <p className="text-slate-700 dark:text-slate-300">
        <b>Education:</b> {formData.highestDegree}
      </p>
      <p className="text-slate-700 dark:text-slate-300">
        <b>University:</b> {formData.university}
      </p>
      <p className="text-slate-700 dark:text-slate-300">
        <b>Experience:</b> {formData.yearsExperience}
      </p>
      <p className="text-slate-700 dark:text-slate-300">
        <b>Hourly Rate:</b> ${formData.hourlyRate}/hr
      </p>
    </div>

    {/* Bio */}
    <div className="mt-6">
      <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
        Bio
      </p>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {formData.bio}
      </p>
    </div>

    {/* Buttons */}
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <button
        onClick={restart}
        className="
          px-6 py-3 rounded-xl font-semibold

          bg-slate-200 text-slate-800
          hover:bg-slate-300

          dark:bg-slate-800 dark:text-slate-200
          dark:hover:bg-slate-700

          transition
        "
      >
        Edit Again
      </button>

      <button
        onClick={handleSubmit}
        className="
          px-6 py-3 rounded-xl font-bold

          bg-slate-900 text-white
          hover:bg-black

          dark:bg-slate-100 dark:text-black
          dark:hover:bg-white

          shadow-md
          hover:shadow-xl
          hover:-translate-y-0.5
          transition-all duration-200
        "
      >
        Confirm & Submit
      </button>
    </div>
  </div>
);
}
