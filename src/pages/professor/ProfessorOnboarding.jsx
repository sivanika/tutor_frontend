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

const STEPS = [
  { label: "Personal", icon: "👤" },
  { label: "Academic", icon: "🎓" },
  { label: "Experience", icon: "💼" },
  { label: "Verify", icon: "🔐" },
  { label: "Preview", icon: "👁️" },
  { label: "Plan", icon: "⭐" },
];

function ProfStepProgress({ currentStep }) {
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  return (
    <div className="w-full mb-10">
      <div className="relative mb-6">
        <div className="absolute top-5 left-0 w-full h-1.5 bg-slate-100 rounded-full" />
        <div
          className="absolute top-5 left-0 h-1.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }}
        />
        <div className="relative flex justify-between">
          {STEPS.map(({ label, icon }, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isActive = currentStep === stepNumber;
            return (
              <div key={label} className="flex flex-col items-center" style={{ width: `${100 / STEPS.length}%` }}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-400 ring-4
                  ${isCompleted ? "bg-violet-600 text-white ring-violet-100 shadow-lg shadow-violet-200"
                    : isActive ? "bg-indigo-600 text-white ring-indigo-100 shadow-lg shadow-indigo-200 scale-110"
                      : "bg-white text-slate-400 ring-slate-100 border border-slate-200"}`}>
                  {isCompleted
                    ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    : <span>{isActive ? icon : stepNumber}</span>}
                </div>
                <span className={`mt-2.5 text-xs font-semibold tracking-wide transition-colors duration-300
                  ${isCompleted ? "text-violet-600" : isActive ? "text-indigo-600" : "text-slate-400"}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ProfessorOnboarding() {
  const [step, setStep] = useState(1);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    country: "", timezone: "", bio: "", profilePhoto: null,
    highestDegree: "", fieldOfStudy: "", university: "",
    graduationYear: "", specializations: "", certifications: "",
    degreeCertificate: null, yearsExperience: "", teachingLevel: "",
    subjects: "", primarySubject: "", secondarySubject: "",
    teachingPhilosophy: "", hourlyRate: "",
    availability: { weekdays: false, weekends: false, mornings: false, afternoons: false, evenings: false },
    governmentId: null, videoIntroduction: null, terms: false, consent: false,
  });

  const submitProfileThenPay = async () => {
    setSavingProfile(true);
    const loadingToast = toast.loading("Saving your profile…");
    try {
      const form = new FormData();
      ["firstName","lastName","email","phone","country","timezone","bio","highestDegree","fieldOfStudy",
       "university","graduationYear","specializations","certifications","yearsExperience","teachingLevel",
       "teachingPhilosophy","hourlyRate"].forEach(k => form.append(k, formData[k] || ""));
      form.append("subjects", formData.subjects || [formData.primarySubject, formData.secondarySubject].filter(Boolean).join(", "));
      form.append("primarySubject", formData.primarySubject || "");
      form.append("secondarySubject", formData.secondarySubject || "");
      form.append("availability", JSON.stringify(formData.availability));
      if (formData.profilePhoto) form.append("profilePhoto", formData.profilePhoto);
      if (formData.degreeCertificate) form.append("degreeCertificate", formData.degreeCertificate);
      if (formData.governmentId) form.append("governmentId", formData.governmentId);
      if (formData.videoIntroduction) form.append("videoIntroduction", formData.videoIntroduction);
      await API.post("/professors", form);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) { userInfo.user.profileCompleted = true; localStorage.setItem("userInfo", JSON.stringify(userInfo)); }
      toast.success("Profile saved! Now activate your listing.", { id: loadingToast });
      setStep(6);
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile save failed. Please try again.", { id: loadingToast });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30">

      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-sm">ProfessorOn</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Step <span className="text-indigo-600 font-bold">{step}</span> of {STEPS.length}
            <span className="ml-2 text-slate-300">·</span>
            <span className="ml-2 text-slate-500">{STEPS[step - 1]?.label}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {step === 1 && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Become a <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Tutor</span>
            </h1>
            <p className="mt-2 text-slate-500 text-sm">Complete your profile to get verified and start earning</p>
          </div>
        )}

        <ProfStepProgress currentStep={step} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {step === 1 && <StepPersonal formData={formData} setFormData={setFormData} next={() => setStep(2)} />}
          {step === 2 && <StepAcademic formData={formData} setFormData={setFormData} next={() => setStep(3)} prev={() => setStep(1)} />}
          {step === 3 && <StepExperience formData={formData} setFormData={setFormData} next={() => setStep(4)} prev={() => setStep(2)} />}
          {step === 4 && <StepVerification formData={formData} setFormData={setFormData} next={() => setStep(5)} prev={() => setStep(3)} />}
          {step === 5 && <ProfilePreview formData={formData} restart={() => setStep(1)} submit={() => setShowAgreementModal(true)} />}
          {step === 6 && <ProfessorPaymentStep />}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          🔒 Your information is encrypted and never shared without consent.
        </p>
      </div>

      {showAgreementModal && (
        <TutorAgreementModal
          onAccept={() => { setShowAgreementModal(false); submitProfileThenPay(); }}
        />
      )}

      {savingProfile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="animate-spin h-7 w-7 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800">Saving your profile</p>
              <p className="text-xs text-slate-400 mt-1">This should only take a moment…</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
