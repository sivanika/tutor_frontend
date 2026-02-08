import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

import StepProgress from "./components/StepProgress";
import VerificationStatus from "./components/VerificationStatus";
import StudentInfo from "./components/StudentInfo";
import ParentInfo from "./components/ParentInfo";
import SchoolInfo from "./components/SchoolInfo";
import Availability from "./components/Availability";
import Subscription from "./components/Subscription";
import AdminUpload from "./components/AdminUpload";

export default function StudentOnboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthDate: "",
        gradeLevel: "",
        school: "",
        learningGoals: "",
        subjects: "",
        parentName: "",
        parentRelationship: "",
        parentEmail: "",
        parentPhone: "",
        parentConsent: false,
        schoolEmail: "",
        studentId: "",
        schoolVerification: false,
        availability: [],
        subscriptionTier: "basic",
        professorPreferences: "",
        studentPhoto: null,
        studentDocument: null,
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        let err = {};

        if (currentStep === 1) {
            if (!formData.firstName) err.firstName = "Required";
            if (!formData.lastName) err.lastName = "Required";
            if (!formData.email) err.email = "Required";
            if (!formData.birthDate) err.birthDate = "Required";
            if (!formData.gradeLevel) err.gradeLevel = "Required";
            if (!formData.school) err.school = "Required";
            if (!formData.learningGoals) err.learningGoals = "Required";
            if (!formData.subjects) err.subjects = "Required";
        }

        if (currentStep === 2) {
            if (!formData.parentName) err.parentName = "Required";
            if (!formData.parentRelationship) err.parentRelationship = "Required";
            if (!formData.parentEmail) err.parentEmail = "Required";
            if (!formData.parentPhone) err.parentPhone = "Required";
            if (!formData.parentConsent) err.parentConsent = "Consent required";
        }

        if (currentStep === 4) {
            if (formData.availability.length === 0)
                err.availability = "Select at least one slot";
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const submitProfile = async () => {
        if (!validate()) return alert("Fix errors");

        try {
            const form = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "availability") {
                    form.append("availability", JSON.stringify(formData.availability));
                } else if (key !== "studentPhoto" && key !== "studentDocument") {
                    form.append(key, formData[key]);
                }
            });


            if (formData.studentPhoto) {
                form.append("studentPhoto", formData.studentPhoto);
            }

            if (formData.studentDocument) {
                form.append("studentDocument", formData.studentDocument);
            }

            const { data } = await API.put("/student/complete-profile", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert(data.message || "Student profile completed successfully");
            setSubmitted(true);
            navigate("/student/dashboard");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Student profile submit failed");
        }
    };

    const motionProps = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fb] to-[#eef1ff]">
            <div className="max-w-6xl mx-auto p-6">
                <div className="card">
                    <VerificationStatus submitted={submitted} />
                    <StepProgress currentStep={currentStep} />

                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div key="s1" {...motionProps}>
                                <StudentInfo
                                    formData={formData}
                                    setFormData={setFormData}
                                    errors={errors}
                                />
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div key="s2" {...motionProps}>
                                <ParentInfo
                                    formData={formData}
                                    setFormData={setFormData}
                                    errors={errors}
                                />
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div key="s3" {...motionProps}>
                                <SchoolInfo formData={formData} setFormData={setFormData} />
                                {/* 🔥 THIS WAS YOUR BUG */}
                                <AdminUpload
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                            </motion.div>
                        )}

                        {currentStep === 4 && (
                            <motion.div key="s4" {...motionProps}>
                                <Availability
                                    formData={formData}
                                    setFormData={setFormData}
                                    errors={errors}
                                />
                            </motion.div>
                        )}

                        {currentStep === 5 && (
                            <motion.div key="s5" {...motionProps}>
                                <Subscription
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between mt-8">
                        {currentStep > 1 && (
                            <button
                                className="btn btn-outline"
                                onClick={() => setCurrentStep((s) => s - 1)}
                            >
                                Back
                            </button>
                        )}

                        {currentStep < 5 ? (
                            <button
                                className="btn btn-primary ml-auto"
                                onClick={() => setCurrentStep((s) => s + 1)}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary ml-auto"
                                onClick={submitProfile}
                            >
                                Submit for Verification
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
