import { Link } from "react-router-dom";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

const sections = [
    {
        title: "1. What Are Cookies?",
        body: `Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you interact with the site.`,
    },
    {
        title: "2. Cookies We Use",
        body: `(a) Essential Cookies — Required for the Platform to function (authentication tokens, CSRF protection, session state). These cannot be disabled. (b) Preference Cookies — Remember your settings such as language and timezone. (c) Analytics Cookies — Help us understand aggregate usage patterns (page views, feature usage) using privacy-safe tools. (d) Marketing Cookies — Only set with your explicit consent; used to show relevant ads on third-party platforms.`,
    },
    {
        title: "3. Third-Party Cookies",
        body: `We may use cookies from trusted third parties: Razorpay (payment processing), Google Analytics (usage analytics), and Crisp (customer support chat). Each third party operates under its own privacy policy.`,
    },
    {
        title: "4. Your Choices",
        body: `You can control cookie preferences via your browser settings (delete, block, or allow specific cookies). Note that disabling essential cookies will prevent you from logging in or using core features. You may also update your preferences via the cookie banner shown on your first visit.`,
    },
    {
        title: "5. Consent (DPDP Act 2023)",
        body: `In accordance with the Digital Personal Data Protection Act, 2023, we obtain your explicit consent before placing non-essential cookies. You can withdraw consent at any time by clearing your browser cookies or contacting us.`,
    },
    {
        title: "6. Retention",
        body: `Session cookies expire when you close your browser. Persistent cookies expire as indicated in your browser's cookie manager (typically 30–365 days depending on the cookie type).`,
    },
    {
        title: "7. Contact",
        body: `For questions about our use of cookies, contact privacy@tutorhours.com.`,
    },
];

export default function DataCookiesPolicy() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] py-14 px-6 text-center">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Cookie Policy</h1>
                    <p className="text-indigo-100 max-w-lg mx-auto text-sm">
                        How TutorHours uses cookies and similar technologies.
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
