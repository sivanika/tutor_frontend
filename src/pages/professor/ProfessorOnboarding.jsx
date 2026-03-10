import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

import StepPersonal from "./components/StepPersonal";
import StepAcademic from "./components/StepAcademic";
import StepExperience from "./components/StepExperience";
import StepVerification from "./components/StepVerification";
import ProfilePreview from "./components/ProfilePreview";
import ProfessorPaymentStep from "./components/ProfessorPaymentStep";
import TutorAgreementModal from "./components/TutorAgreementModal";

export default function ProfessorOnboarding() {
  const [step, setStep] = useState(1);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    timezone: "",
    bio: "",
    profilePhoto: null,
    highestDegree: "",
    fieldOfStudy: "",
    university: "",
    graduationYear: "",
    specializations: "",
    certifications: "",
    degreeCertificate: null,
    yearsExperience: "",
    teachingLevel: "",
    subjects: "",
    primarySubject: "",
    secondarySubject: "",
    teachingPhilosophy: "",
    hourlyRate: "",
    availability: {
      weekdays: false,
      weekends: false,
      mornings: false,
      afternoons: false,
      evenings: false,
    },
    governmentId: null,
    videoIntroduction: null,
    terms: false,
    consent: false,
  });

  const steps = ["Personal", "Academic", "Experience", "Verification", "Preview", "Plan"];

  /* ── Submit profile to backend BEFORE showing payment ── */
  const submitProfileThenPay = async () => {
    setSavingProfile(true);
    const loadingToast = toast.loading("Saving your profile...");

    try {
      const form = new FormData();

      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("country", formData.country);
      form.append("timezone", formData.timezone);
      form.append("bio", formData.bio);

      form.append("highestDegree", formData.highestDegree);
      form.append("fieldOfStudy", formData.fieldOfStudy);
      form.append("university", formData.university);
      form.append("graduationYear", formData.graduationYear);
      form.append("specializations", formData.specializations);
      form.append("certifications", formData.certifications);

      form.append("yearsExperience", formData.yearsExperience);
      form.append("teachingLevel", formData.teachingLevel);
      form.append(
        "subjects",
        formData.subjects ||
        [formData.primarySubject, formData.secondarySubject]
          .filter(Boolean)
          .join(", ")
      );
      form.append("primarySubject", formData.primarySubject || "");
      form.append("secondarySubject", formData.secondarySubject || "");
      form.append("teachingPhilosophy", formData.teachingPhilosophy);
      form.append("hourlyRate", formData.hourlyRate);
      form.append("availability", JSON.stringify(formData.availability));

      if (formData.profilePhoto) form.append("profilePhoto", formData.profilePhoto);
      if (formData.degreeCertificate) form.append("degreeCertificate", formData.degreeCertificate);
      if (formData.governmentId) form.append("governmentId", formData.governmentId);
      if (formData.videoIntroduction) form.append("videoIntroduction", formData.videoIntroduction);

      await API.post("/professors", form);

      // Mark profile as completed in localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        userInfo.user.profileCompleted = true;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

      toast.success("Profile saved! Now activate your listing.", { id: loadingToast });
      setStep(6); // advance to payment step
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Profile save failed. Please try again.",
        { id: loadingToast }
      );
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col items-center justify-center px-4 py-10">

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
        Professor Profile Setup
      </h1>
      <p className="text-gray-600 mb-10 text-center">
        Complete your details to get verified and start teaching
      </p>

      {/* Stepper */}
      <div className="flex w-full max-w-5xl mb-8">
        {steps.map((label, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${step > index ? "bg-indigo-600" : "bg-gray-300"
                }`}
            />
            <p
              className={`mt-2 text-sm font-semibold ${step === index + 1 ? "text-indigo-600" : "text-gray-500"
                }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-3xl shadow-2xl">

        {step === 1 && (
          <StepPersonal
            formData={formData}
            setFormData={setFormData}
            next={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepAcademic
            formData={formData}
            setFormData={setFormData}
            next={() => setStep(3)}
            prev={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepExperience
            formData={formData}
            setFormData={setFormData}
            next={() => setStep(4)}
            prev={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <StepVerification
            formData={formData}
            setFormData={setFormData}
            next={() => setStep(5)}
            prev={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <ProfilePreview
            formData={formData}
            restart={() => setStep(1)}
            submit={() => setShowAgreementModal(true)}   /* show agreement first */
          />
        )}

        {/* Step 6: Payment / Plan Activation */}
        {step === 6 && (
          <ProfessorPaymentStep />
        )}

      </div>

      {/* Tutor Agreement Modal — shown before profile submit */}
      {showAgreementModal && (
        <TutorAgreementModal
          onAccept={() => {
            setShowAgreementModal(false);
            submitProfileThenPay();
          }}
        />
      )}

      {/* Saving overlay */}
      {savingProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <svg className="animate-spin h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="font-semibold text-indigo-700">Saving your profile...</p>
          </div>
        </div>
      )}
    </div>
  );
}
