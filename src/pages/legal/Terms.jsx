import { Link } from "react-router-dom";

const sections = [
    {
        title: "1. Acceptance of Terms",
        body: `By creating an account on TutorHours ("Platform"), you ("User") agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Platform. These Terms apply to all visitors, students, tutors, and institutions.`,
    },
    {
        title: "2. Eligibility",
        body: `You must be at least 13 years old to use TutorHours. If you are under 18, you must have parental or guardian consent. Tutors must be 18 or older to list services. By using the Platform, you represent that you meet these eligibility requirements.`,
    },
    {
        title: "3. Account Registration",
        body: `You agree to provide accurate, current, and complete information when creating your account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. Notify us immediately at support@tutorhours.com if you suspect unauthorised access.`,
    },
    {
        title: "4. Platform Services",
        body: `TutorHours provides a marketplace connecting students with tutors and educators. We do not directly provide tutoring services. All session content, teaching quality, and scheduling are the responsibility of the respective Tutor. TutorHours acts solely as an intermediary platform.`,
    },
    {
        title: "5. Payments & Fees",
        body: `All payments are processed through our payment gateway partner (Razorpay). TutorHours charges a service commission on tutor earnings as disclosed during onboarding. Subscription fees for students are non-refundable except as stated in our Refund Policy. All prices are in Indian Rupees (INR) unless stated otherwise.`,
    },
    {
        title: "6. Prohibited Conduct",
        body: `You agree not to: (a) use the Platform for any unlawful purpose; (b) harass, abuse, or harm other users; (c) post false or misleading information; (d) attempt to reverse-engineer, hack, or disrupt the Platform; (e) share your account with others; (f) solicit off-platform payments to circumvent TutorHours fees.`,
    },
    {
        title: "7. Intellectual Property",
        body: `All content, trademarks, logos, and software on TutorHours are owned by or licensed to TutorHours Pvt. Ltd. You may not reproduce, distribute, or create derivative works without prior written consent. Session materials shared by tutors remain the intellectual property of their respective creators.`,
    },
    {
        title: "8. Disclaimers",
        body: `TutorHours is provided "as is" without warranties of any kind, express or implied. We do not guarantee the accuracy, completeness, or suitability of any tutor profile information. We are not liable for the quality of tutoring sessions, disputes between users, or any losses arising from use of the Platform.`,
    },
    {
        title: "9. Limitation of Liability",
        body: `To the maximum extent permitted by applicable law, TutorHours' total liability in connection with the Platform shall not exceed the amount paid by you in the three months preceding the event giving rise to the claim.`,
    },
    {
        title: "10. Governing Law & Dispute Resolution",
        body: `These Terms are governed by the laws of India. Any disputes shall first be attempted to be resolved through mutual negotiation. Failing that, disputes shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka, India.`,
    },
    {
        title: "11. Changes to Terms",
        body: `We reserve the right to modify these Terms at any time. We will notify users of material changes via email or an in-app notice. Continued use of the Platform after a change is effective constitutes your acceptance of the revised Terms.`,
    },
    {
        title: "12. Contact",
        body: `For questions regarding these Terms, contact us at legal@tutorhours.com or write to: TutorHours Pvt. Ltd., Bengaluru, Karnataka, India.`,
    },
];

export default function Terms() {
    return (
        <div className="bg-gray-50 dark:bg-[var(--surface)]">
            <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] py-14 px-6 text-center">
                <h1 className="text-4xl font-extrabold text-white mb-2">Terms of Service</h1>
                <p className="text-indigo-100 max-w-lg mx-auto text-sm">
                    Please read these terms carefully before using TutorHours.
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
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{s.title}</h2>
                        <p className="text-gray-600 dark:text-[var(--accent)]/70 leading-relaxed text-sm">{s.body}</p>
                    </div>
                ))}
                <p className="text-xs text-gray-400 dark:text-[var(--accent)]/40 border-t dark:border-[var(--primary)]/20 pt-6">
                    © {new Date().getFullYear()} TutorHours Pvt. Ltd. All rights reserved.
                </p>
            </div>
        </div>
    );
}
