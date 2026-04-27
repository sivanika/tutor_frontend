import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "./validation/studentSchema";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLock } from "react-icons/fi";

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

  const stepFields = {
    1: ["firstName", "lastName", "email", "phone", "birthDate", "gradeLevel", "school", "learningGoals", "subjects"],
    2: ["parentName", "parentRelationship", "parentEmail", "parentPhone", "parentConsent"],
    3: [],
    4: ["availability"],
    5: [],
    6: [],
  };

  const next = async () => {
    const fieldsToValidate = stepFields[step] || [];
    const valid = await methods.trigger(fieldsToValidate);
    if (valid) {
      if (step === 5) await saveProfileDraft();
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prev = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveProfileDraft = async () => {
    setSavingProfile(true);
    try {
      const data = methods.getValues();
      const form = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "availability") {
          form.append("availability", JSON.stringify(data.availability));
        } else if (key !== "studentPhoto" && key !== "studentDocument") {
          if (data[key] !== undefined && data[key] !== null) form.append(key, data[key]);
        }
      });
      if (data.studentPhoto) form.append("studentPhoto", data.studentPhoto);
      if (data.studentDocument) form.append("studentDocument", data.studentDocument);
      await API.put("/student/complete-profile", form, { headers: { "Content-Type": "multipart/form-data" } });
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) { userInfo.user.profileCompleted = true; localStorage.setItem("userInfo", JSON.stringify(userInfo)); }
      setSubmitted(true);
    } catch (err) {
      console.warn("Profile draft save failed:", err.response?.data?.message);
      toast.error("Could not save profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const totalSteps = 6;
  const stepTitles = ["Student Info", "Parent Info", "School", "Schedule", "Documents", "Plan"];

  return (
    <FormProvider {...methods}>
      {/* Page background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30">

        {/* Top header bar */}
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
              Step <span className="text-indigo-600 font-bold">{step}</span> of {totalSteps}
              <span className="ml-2 text-slate-300">·</span>
              <span className="ml-2 text-slate-500">{stepTitles[step - 1]}</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Welcome banner (only step 1) */}
          {step === 1 && (
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Welcome to <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ProfessorOn</span>
              </h1>
              <p className="mt-2 text-slate-500 text-sm">Complete your profile to get matched with expert tutors</p>
            </div>
          )}

          <VerificationStatus submitted={submitted} />
          <StepProgress currentStep={step} />

          {/* Step card */}
          <div className="mt-2">
            {step === 1 && <StudentInfo />}
            {step === 2 && <ParentInfo />}
            {step === 3 && <SchoolInfo />}
            {step === 4 && <Availability />}
            {step === 5 && <AdminUpload />}
            {step === 6 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <PaymentStep />
              </div>
            )}

            {/* Navigation buttons */}
            {step < 6 && (
              <div className="flex items-center justify-between mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prev}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={next}
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60
                    bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700
                    shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95"
                >
                  {savingProfile ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>
                      {step === 5 ? "Save & Continue" : "Continue"}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-400 mt-10">
            <FiLock className="inline-block mr-1" /> Your information is encrypted and never shared without consent.

          </p>
        </div>
      </div>
    </FormProvider>
  );
}
