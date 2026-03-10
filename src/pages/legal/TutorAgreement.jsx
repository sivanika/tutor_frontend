import { Link } from "react-router-dom";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

const sections = [
    {
        title: "1. Introduction",
        body: `This Tutor Agreement ("Agreement") is a binding contract between you ("Tutor") and TutorHours Pvt. Ltd. ("TutorHours"). By completing the onboarding process and activating your profile, you agree to all terms of this Agreement. Please read it carefully.`,
    },
    {
        title: "2. Eligibility & Identity Verification",
        body: `You must be at least 18 years old to list services on TutorHours. You agree to provide accurate identity documents (government ID) and educational credentials. TutorHours reserves the right to verify all information and reject or deactivate profiles that contain false information.`,
    },
    {
        title: "3. Independent Contractor Status",
        body: `You are an independent contractor, not an employee, agent, partner, or franchise of TutorHours. You are solely responsible for your own taxes, insurance, and compliance with applicable laws. Nothing in this Agreement creates an employer-employee relationship.`,
    },
    {
        title: "4. Session Conduct & Quality",
        body: `You agree to: (a) conduct sessions professionally and punctually; (b) prepare adequately for each session; (c) communicate session changes to students at least 12 hours in advance; (d) not engage in any behaviour that is discriminatory, offensive, or harmful; (e) maintain the confidentiality of student information.`,
    },
    {
        title: "5. Commission & Payments",
        body: `TutorHours charges an 18% service commission on all session payments. Payouts are processed weekly to your registered bank account or UPI ID. You are responsible for declaring income and paying applicable taxes. TutorHours will issue payment receipts but is not responsible for tax filings on your behalf.`,
    },
    {
        title: "6. Prohibited Activities",
        body: `Tutors must not: (a) solicit students to transact outside TutorHours to bypass commissions; (b) share or sell student contact information; (c) provide false qualifications or credentials; (d) engage in academic dishonesty (e.g., completing assignments for students); (e) promote competing platforms during TutorHours sessions.`,
    },
    {
        title: "7. Intellectual Property",
        body: `Materials you create and share on TutorHours remain your intellectual property. By uploading materials, you grant TutorHours a non-exclusive, royalty-free licence to display them on the Platform. You must not upload content that infringes third-party IP rights.`,
    },
    {
        title: "8. Ratings & Reviews",
        body: `Students may rate and review your sessions. TutorHours may display these publicly. You agree not to manipulate, fake, or solicit fraudulent reviews. TutorHours may remove reviews that violate our content policy.`,
    },
    {
        title: "9. Account Suspension & Termination",
        body: `TutorHours may suspend or terminate your listing if you violate this Agreement, receive consistently poor ratings, have frequent cancellations, or are found to have provided false information. Termination does not affect pending payouts for completed sessions.`,
    },
    {
        title: "10. Indemnification",
        body: `You agree to indemnify and hold TutorHours harmless from any claims, losses, or damages arising from your breach of this Agreement, your sessions, or your actions or omissions on the Platform.`,
    },
    {
        title: "11. Governing Law",
        body: `This Agreement is governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.`,
    },
    {
        title: "12. Amendments",
        body: `TutorHours may amend this Agreement with 14 days' notice via email. Continued use of the Platform after the notice period constitutes acceptance of the revised Agreement.`,
    },
    {
        title: "13. Contact",
        body: `For questions about this Agreement, contact legal@tutorhours.com.`,
    },
];

export default function TutorAgreement() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] py-14 px-6 text-center">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Tutor Agreement</h1>
                    <p className="text-indigo-100 max-w-lg mx-auto text-sm">
                        The binding agreement between tutors and TutorHours governing platform listings and conduct.
                    </p>
                    <p className="text-indigo-200 text-xs mt-3">Last updated: March 2025</p>
                    <div className="flex justify-center gap-4 mt-5 text-sm">
                        <Link to="/legal" className="text-indigo-200 hover:text-white transition underline underline-offset-4">← All Policies</Link>
                        <Link to="/" className="text-indigo-200 hover:text-white transition underline underline-offset-4">Home</Link>
                    </div>
                </div>
                <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
                    {sections.map((s) => (
                        <div key={s.title}>
                            <h2 className="text-lg font-bold text-gray-800 mb-2">{s.title}</h2>
                            <p className="text-gray-600 leading-relaxed text-sm">{s.body}</p>
                        </div>
                    ))}
                    <p className="text-xs text-gray-400 border-t pt-6">
                        © {new Date().getFullYear()} TutorHours Pvt. Ltd. All rights reserved.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
