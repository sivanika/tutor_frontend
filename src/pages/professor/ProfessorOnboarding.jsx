import { useState } from "react";
import StepPersonal from "./components/StepPersonal";
import StepAcademic from "./components/StepAcademic";
import StepExperience from "./components/StepExperience";
import StepVerification from "./components/StepVerification";
import ProfilePreview from "./components/ProfilePreview";

export default function ProfessorOnboarding() {
  const [step, setStep] = useState(1);

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

  const steps = ["Personal", "Academic", "Experience", "Verification", "Preview"];

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
              className={`h-2 rounded-full transition-all duration-500 ${
                step > index ? "bg-indigo-600" : "bg-gray-300"
              }`}
            />
            <p
              className={`mt-2 text-sm font-semibold ${
                step === index + 1 ? "text-indigo-600" : "text-gray-500"
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
          <StepPersonal formData={formData} setFormData={setFormData} next={() => setStep(2)} />
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
          />
        )}
      </div>
    </div>
  );
}
