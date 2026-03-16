import { Link } from "react-router-dom";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

const sections = [
    {
        title: "1. Introduction",
        body: `TutorHours Pvt. Ltd. ("TutorHours", "we", "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, store, and share your personal data in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act), and other applicable Indian laws.`,
    },
    {
        title: "2. Data We Collect",
        body: `We collect data you provide directly (name, email, phone, profile photo, educational credentials, government ID for tutors) and data collected automatically (IP address, device type, browsing activity on the Platform, cookies). For tutors, we also collect bank account / UPI details for payouts.`,
    },
    {
        title: "3. Purpose of Processing (DPDP Act §5)",
        body: `We process your personal data for the following purposes: (a) creating and managing your account; (b) facilitating session bookings and payments; (c) verifying tutor identity and credentials; (d) sending service-related communications; (e) improving Platform features and safety; (f) complying with legal obligations. We process data only for purposes you have consented to or as permitted by law.`,
    },
    {
        title: "4. Consent",
        body: `Under the DPDP Act 2023, we seek your free, specific, informed, and unambiguous consent before processing your personal data. You provide this consent at registration by accepting these Terms and Privacy Policy. You may withdraw consent at any time by contacting us, but this may affect your ability to use the Platform.`,
    },
    {
        title: "5. Data Sharing",
        body: `We do not sell your personal data. We may share your data with: (a) payment processors (Razorpay) for transactions; (b) cloud infrastructure providers for Platform hosting; (c) email/SMS service providers for communications; (d) law enforcement as required by law. All third parties are bound by data processing agreements.`,
    },
    {
        title: "6. Your Rights (DPDP Act §12–16)",
        body: `You have the right to: (a) access your personal data we hold; (b) correct inaccurate or outdated data; (c) erase your data (right to be forgotten), subject to legal retention obligations; (d) nominate a person to exercise rights on your behalf in case of incapacity or death; (e) file a complaint with the Data Protection Board of India.`,
    },
    {
        title: "7. Data Retention",
        body: `We retain your data for as long as your account is active or as needed to provide services. Upon account deletion, we erase personal data within 30 days, except data we are legally required to retain (e.g., financial records for 7 years under GST law).`,
    },
    {
        title: "8. Data Security",
        body: `We implement appropriate technical and organisational measures to protect your data, including encryption in transit (TLS), hashed passwords (bcrypt), and role-based access controls. However, no internet transmission is 100% secure.`,
    },
    {
        title: "9. Children's Privacy",
        body: `We do not knowingly collect personal data from children under 13 without verified parental consent. If we become aware that a child under 13 has provided data without consent, we will delete it promptly.`,
    },
    {
        title: "10. Cookies",
        body: `We use cookies and similar technologies as described in our Cookie Policy. You can manage cookie preferences via your browser settings or our cookie consent banner.`,
    },
    {
        title: "11. Changes to This Policy",
        body: `We may update this Privacy Policy periodically. We will notify you of material changes via email or in-app notice. Your continued use of the Platform constitutes acceptance of the updated policy.`,
    },
    {
        title: "12. Grievance Officer (DPDP Act §13)",
        body: `For any privacy-related queries or complaints, contact our Grievance Officer: Email: privacy@tutorhours.com | Address: TutorHours Pvt. Ltd., Bengaluru, Karnataka, India. We will respond within 30 days of receipt.`,
    },
];

export default function Privacy() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f0720]">
                <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] py-14 px-6 text-center">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Privacy Policy</h1>
                    <p className="text-indigo-100 max-w-lg mx-auto text-sm">
                        How TutorHours collects, uses, and protects your personal data — aligned with the DPDP Act 2023.
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
                            <p className="text-gray-600 dark:text-[#a78bfa]/70 leading-relaxed text-sm">{s.body}</p>
                        </div>
                    ))}
                    <p className="text-xs text-gray-400 dark:text-[#a78bfa]/40 border-t dark:border-[#6A11CB]/20 pt-6">
                        © {new Date().getFullYear()} TutorHours Pvt. Ltd. All rights reserved.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
