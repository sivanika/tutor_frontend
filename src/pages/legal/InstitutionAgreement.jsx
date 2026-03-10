import { Link } from "react-router-dom";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

const sections = [
    {
        title: "1. Introduction",
        body: `This Institution Agreement ("Agreement") governs access to TutorHours services by schools, colleges, coaching centres, and other educational institutions ("Institution"). By activating an institution account, you agree to these terms on behalf of your organisation.`,
    },
    {
        title: "2. Account Setup",
        body: `The Institution must designate an authorised administrator who creates and manages the institutional account. The administrator is responsible for all users added under the institution account and for ensuring compliance with this Agreement.`,
    },
    {
        title: "3. Permitted Use",
        body: `Institution accounts may be used to: (a) enrol students in bulk under a single billing arrangement; (b) book sessions with TutorHours tutors for enrolled students; (c) access aggregate usage analytics for institution-administered sessions; (d) manage student rosters and session allocations.`,
    },
    {
        title: "4. Pricing & Billing",
        body: `Institutional pricing is agreed upon in a separate Order Form or Proposal. Invoices are issued monthly or annually as agreed. Payment terms are Net-30 from invoice date unless otherwise specified. Late payments may accrue interest at 1.5% per month.`,
    },
    {
        title: "5. Data Protection",
        body: `TutorHours will process student data on behalf of the Institution as a Data Processor under the DPDP Act 2023. The Institution is the Data Fiduciary responsible for obtaining student/guardian consent before enrolment. A Data Processing Agreement (DPA) will be executed separately upon request.`,
    },
    {
        title: "6. Confidentiality",
        body: `Each party agrees to keep the other's confidential information strictly confidential and not to disclose it to third parties without prior written consent, except as required by law.`,
    },
    {
        title: "7. Service Level Agreement",
        body: `TutorHours targets 99.5% monthly Platform uptime. Scheduled maintenance will be communicated 48 hours in advance. Downtime credits may be available for institution accounts subject to the specific SLA in the Order Form.`,
    },
    {
        title: "8. Term & Termination",
        body: `This Agreement begins on the date of institutional account activation and continues for the subscription period. Either party may terminate with 30 days' written notice. Upon termination, TutorHours will provide an export of the Institution's data within 14 days.`,
    },
    {
        title: "9. Limitation of Liability",
        body: `TutorHours' maximum liability under this Agreement in any 12-month period shall not exceed the total fees paid by the Institution in that period.`,
    },
    {
        title: "10. Governing Law",
        body: `This Agreement is governed by the laws of India. Disputes shall be resolved through mutual negotiation and, failing that, arbitration under the Arbitration and Conciliation Act, 1996, with seat of arbitration in Bengaluru.`,
    },
    {
        title: "11. Contact",
        body: `For partnership and institutional enquiries, contact institutions@tutorhours.com.`,
    },
];

export default function InstitutionAgreement() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] py-14 px-6 text-center">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Institution Agreement</h1>
                    <p className="text-indigo-100 max-w-lg mx-auto text-sm">
                        Terms governing educational institutions and organisations using TutorHours services.
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
