import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "./validation/studentSchema";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import StepProgress from "./components/StepProgress";
import VerificationStatus from "./components/VerificationStatus";
import StudentInfo from "./components/StudentInfo";
import ParentInfo from "./components/ParentInfo";
import SchoolInfo from "./components/SchoolInfo";
import Availability from "./components/Availability";
import AdminUpload from "./components/AdminUpload";
import PaymentStep from "./components/PaymentStep";

export default function StudentOnboarding() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(studentSchema),
    mode: "onBlur",
    defaultValues: {
      availability: [],
      subscriptionTier: "free_trial",
      parentConsent: false,
      schoolVerification: false,
    },
  });

  /* ---------- STEP VALIDATION MAP ---------- */
  const stepFields = {
    1: [
      "firstName", "lastName", "email", "phone",
      "birthDate", "gradeLevel", "school",
      "learningGoals", "subjects",
    ],
    2: [
      "parentName", "parentRelationship",
      "parentEmail", "parentPhone", "parentConsent",
    ],
    3: [],
    4: ["availability"],
    5: [],
    6: [], // Payment step — handled by PaymentStep component navigation
  };

  const next = async () => {
    const fieldsToValidate = stepFields[step] || [];
    const valid = await methods.trigger(fieldsToValidate);
    if (valid) {
      // On step 5→6: save profile first, then show payment step
      if (step === 5) {
        await saveProfileDraft();
      }
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prev = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Save profile to backend before showing payment ── */
  const saveProfileDraft = async () => {
    setSavingProfile(true);
    try {
      const data = methods.getValues();
      const form = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "availability") {
          form.append("availability", JSON.stringify(data.availability));
        } else if (key !== "studentPhoto" && key !== "studentDocument") {
          if (data[key] !== undefined && data[key] !== null) {
            form.append(key, data[key]);
          }
        }
      });

      if (data.studentPhoto) form.append("studentPhoto", data.studentPhoto);
      if (data.studentDocument) form.append("studentDocument", data.studentDocument);

      await API.put("/student/complete-profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update localStorage so profileCompleted is true
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        userInfo.user.profileCompleted = true;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
      setSubmitted(true);
    } catch (err) {
      // Non-fatal — still allow going to payment
      console.warn("Profile draft save failed:", err.response?.data?.message);
      toast.error("Could not save profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gradient-to-br from-[#f5f7fb] to-[#eef1ff]">
        <div className="max-w-5xl mx-auto p-6">

          <VerificationStatus submitted={submitted} />
          <StepProgress currentStep={step} />

          <div className="mt-6">
            {step === 1 && <StudentInfo />}
            {step === 2 && <ParentInfo />}
            {step === 3 && <SchoolInfo />}
            {step === 4 && <Availability />}
            {step === 5 && <AdminUpload />}
            {step === 6 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <PaymentStep />
              </div>
            )}

            <div className="flex justify-between mt-10">
              {step > 1 && step < 6 && (
                <button
                  type="button"
                  onClick={prev}
                  className="px-6 py-2 rounded-lg bg-slate-200 font-medium text-slate-700 hover:bg-slate-300 transition"
                >
                  ← Back
                </button>
              )}

              {step < 6 && (
                <button
                  type="button"
                  onClick={next}
                  disabled={savingProfile}
                  className="ml-auto px-6 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-700 transition disabled:opacity-60 flex items-center gap-2"
                >
                  {savingProfile ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Next →"
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </FormProvider>
  );
}