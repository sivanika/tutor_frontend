import { Link } from "react-router-dom";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

const sections = [
    {
        title: "1. Overview",
        body: `This Refund Policy governs refunds and cancellations for sessions and subscriptions on TutorHours. Please read it carefully before making any payment.`,
    },
    {
        title: "2. Session Cancellation by Student",
        body: `Students may cancel a scheduled session: (a) More than 24 hours before the session start time — full refund of the session credits to wallet; (b) Between 12–24 hours before — 50% of session credits refunded; (c) Less than 12 hours before or no-show — no refund. Refunded credits are valid for 6 months.`,
    },
    {
        title: "3. Session Cancellation by Tutor",
        body: `If a tutor cancels a confirmed session at any time, the student receives a full refund of session credits and an additional 10% bonus credit as compensation. Repeated cancellations by tutors may result in account suspension.`,
    },
    {
        title: "4. Subscription Fees (Student Plans)",
        body: `Subscription fees are non-refundable once a billing cycle has started. If you cancel a subscription, it remains active until the end of the current billing period. No partial-month refunds are issued. Free trial conversions to paid plans follow standard subscription terms from the conversion date.`,
    },
    {
        title: "5. Platform Listing Fees (Tutor)",
        body: `Tutor listing/activation fees paid to TutorHours are non-refundable once the profile has been reviewed or published. If TutorHours rejects a profile after payment, a full refund is issued within 7 business days.`,
    },
    {
        title: "6. Technical Disruptions",
        body: `If a session fails due to a confirmed technical issue on TutorHours' platform (not user's internet), the session credits will be fully refunded upon investigation and approval by our support team (typically within 5 business days).`,
    },
    {
        title: "7. Refund Processing",
        body: `Credit card/debit card/UPI refunds are processed within 5–10 business days depending on your bank. Wallet credit refunds are instant. TutorHours bears no responsibility for delays caused by banks or payment processors.`,
    },
    {
        title: "8. How to Request a Refund",
        body: `Email support@tutorhours.com with your Order ID, registered email, and reason for refund. Our team will respond within 48 business hours.`,
    },
];

export default function RefundPolicy() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f0720]">
                <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] py-14 px-6 text-center">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Refund &amp; Cancellation Policy</h1>
                    <p className="text-indigo-100 max-w-lg mx-auto text-sm">
                        Our fair policies on cancellations, credit refunds, and disputes.
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
