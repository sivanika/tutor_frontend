import { useState } from "react";
import { Link } from "react-router-dom";

export default function TutorAgreementModal({ onAccept }) {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] px-8 py-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🎓</span>
                        <div>
                            <h2 className="text-xl font-extrabold text-white">Tutor Agreement</h2>
                            <p className="text-indigo-100 text-sm mt-0.5">
                                Please read and accept before activating your profile
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 px-8 py-6 space-y-5 text-sm text-gray-700 leading-relaxed">
                    <AgreementSection title="1. Independent Contractor">
                        You are an independent contractor, not an employee of TutorHours. You are responsible for your own taxes, insurance, and compliance with applicable laws.
                    </AgreementSection>

                    <AgreementSection title="2. Session Conduct">
                        You agree to conduct sessions professionally and punctually. Communicate any session changes to students at least 12 hours in advance. Maintain confidentiality of all student information.
                    </AgreementSection>

                    <AgreementSection title="3. Commission & Payments">
                        TutorHours charges an 18% service commission on all session payments. Payouts are processed weekly to your registered bank/UPI account. You are responsible for declaring income and paying applicable taxes.
                    </AgreementSection>

                    <AgreementSection title="4. Prohibited Activities">
                        You must not solicit students to transact outside TutorHours, share student contact information, provide false credentials, engage in academic dishonesty, or promote competing platforms during sessions.
                    </AgreementSection>

                    <AgreementSection title="5. Account Suspension">
                        TutorHours may suspend or terminate your listing for Agreement violations, consistently poor ratings, frequent cancellations, or false information. Pending payouts for completed sessions are not affected.
                    </AgreementSection>

                    <AgreementSection title="6. Intellectual Property">
                        Materials you upload remain your intellectual property. By uploading, you grant TutorHours a non-exclusive licence to display them on the Platform.
                    </AgreementSection>

                    <AgreementSection title="7. Governing Law">
                        This Agreement is governed by Indian law. Disputes are subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.
                    </AgreementSection>

                    <p className="text-xs text-gray-400 border-t pt-4">
                        This is a summary. Read the{" "}
                        <Link
                            to="/tutor-agreement"
                            target="_blank"
                            className="text-indigo-600 underline hover:text-indigo-800"
                        >
                            full Tutor Agreement ↗
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t bg-gray-50 flex-shrink-0">
                    <label className="flex items-start gap-3 cursor-pointer mb-4">
                        <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <span className="text-sm text-gray-700">
                            I have read and agree to the{" "}
                            <Link
                                to="/tutor-agreement"
                                target="_blank"
                                className="text-indigo-600 underline hover:text-indigo-800"
                            >
                                Tutor Agreement
                            </Link>
                            , and I understand that my profile will go live after admin approval.
                        </span>
                    </label>

                    <button
                        onClick={onAccept}
                        disabled={!agreed}
                        className="
              w-full py-3 rounded-xl font-bold text-sm
              bg-gradient-to-r from-[#6A11CB] to-[#2575FC]
              text-white
              hover:shadow-lg hover:shadow-indigo-400/30
              transition-all duration-200
              active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
            "
                    >
                        ✓ Accept &amp; Continue to Activation
                    </button>
                </div>
            </div>
        </div>
    );
}

function AgreementSection({ title, children }) {
    return (
        <div>
            <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
            <p>{children}</p>
        </div>
    );
}
