import { useState } from "react";
import { Link } from "react-router-dom";

const FAQS = [
    {
        category: "Students",
        questions: [
            {
                q: "What is TutorHours and how does it work?",
                a: "TutorHours is an online tutoring platform that connects students with qualified educators across all subjects and grade levels. Simply browse tutor profiles, choose one that matches your needs and budget, and book a session directly. Sessions happen via our integrated video platform — no downloads needed."
            },
            {
                q: "Is TutorHours free to join as a student?",
                a: "Yes — completely free. There are no subscription fees, registration charges, or hidden costs for students. You only pay when you book and complete a session with a tutor. The tutor's listed rate is exactly what you pay."
            },
            {
                q: "How do I find the right tutor for my subject?",
                a: "Use our search filters to narrow tutors by subject, grade level, language, hourly rate, and availability. Every tutor profile includes their qualifications, teaching experience, student reviews, and a sample intro video. You can also message a tutor before booking to gauge compatibility."
            },
            {
                q: "Can I try a free trial session before committing?",
                a: "Many tutors on TutorHours offer a free 15-minute introductory call so you can discuss your goals before booking a paid session. Look for the 'Free Intro' badge on tutor profiles. This helps you ensure the teaching style and subject depth are the right fit."
            },
            {
                q: "How do I reschedule or cancel a session?",
                a: "You can reschedule or cancel any upcoming session from your dashboard up to 24 hours before the scheduled time at no charge. Cancellations within 24 hours may incur a partial fee depending on the tutor's individual policy, which is displayed on their profile."
            },
            {
                q: "What subjects and levels does TutorHours cover?",
                a: "TutorHours covers a wide range including: School subjects (Class 1–12), Competitive exams (JEE, NEET, UPSC, CAT, IELTS), College-level courses (Engineering, Commerce, Arts), and Skill-based learning (Coding, Music, Art). New subjects are added regularly."
            },
            {
                q: "What payment methods are accepted?",
                a: "We accept UPI, Debit/Credit Cards, Net Banking, and major wallets. All payments are processed through a secure, encrypted gateway. You will receive a digital receipt after every transaction."
            },
            {
                q: "What happens if I am unhappy with a session?",
                a: "Your satisfaction matters. If a session doesn't meet expectations, report it within 48 hours via your dashboard. Our support team will review and, where valid, process a full or partial refund."
            },
            {
                q: "Are my personal details and sessions private?",
                a: "Yes. TutorHours follows strict data privacy practices. Your personal information is never shared with third parties. Session content is encrypted, and recordings are only accessible by you and your tutor."
            },
            {
                q: "Can I learn in my own regional language?",
                a: "Absolutely. TutorHours has tutors who teach in Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Punjabi, and many more regional languages. Use the language filter to find your match."
            }
        ]
    },
    {
        category: "Tutors / Professors",
        questions: [
            {
                q: "Who can become a tutor on TutorHours?",
                a: "Any qualified educator can apply — school teachers, college professors, subject-matter experts, retired academics, and skilled professionals. You need to demonstrate subject expertise and communication skills."
            },
            {
                q: "How does the tutor verification and onboarding process work?",
                a: "Our team reviews your credentials, followed by a brief knowledge evaluation and a mock demo session. Approval typically takes 3–5 business days. Once approved, your profile goes live."
            },
            {
                q: "What documents do I need to submit for registration?",
                a: "You will need to upload a government ID, highest academic qualification certificate, experience letters (if any), a profile photo, and bank account details for payouts."
            },
            {
                q: "How much do tutors earn and what is the commission structure?",
                a: "Tutors keep 82% of every session fee. TutorHours retains 18% for platform operations and student acquisition. You set your own hourly rate, giving you full control over your income."
            },
            {
                q: "When and how are payouts processed?",
                a: "Earnings are credited to your TutorHours wallet within 24 hours of session completion. You can withdraw to your bank account anytime, usually processed within 2-3 business days."
            },
            {
                q: "Is there any subscription fee for tutors?",
                a: "Basic registration is free. Tutors who opt for our Premium Subscription get priority placement in search results and access to advanced student leads. Subscription plans are optional."
            },
            {
                q: "Can I teach multiple subjects or set my own schedule?",
                a: "Yes! You can list up to 5 subjects per profile and your availability calendar is fully customizable. You can update your schedule at any time from your dashboard."
            },
            {
                q: "How does the student rating and review system work?",
                a: "Students rate tutors on a 5-star scale. Reviews are verified and visible on your profile. High ratings improve your visibility and build student trust."
            },
            {
                q: "What technology do I need to conduct sessions?",
                a: "You need a reliable internet connection, a computer/tablet with a webcam and mic, and a quiet environment. Our platform includes a built-in whiteboard and screen sharing."
            },
            {
                q: "Can tutors from outside India join TutorHours?",
                a: "Yes! TutorHours is a global platform. Tutors from any country are welcome. International payouts are processed via wire transfer or PayPal."
            }
        ]
    },
    {
        category: "Parents",
        questions: [
            {
                q: "How does TutorHours ensure my child's safety?",
                a: "Safety is our top priority. Every tutor undergoes identity verification and background checks. Sessions happen inside our secure platform, and you can enable session monitoring."
            },
            {
                q: "Are the tutors' qualifications genuinely verified?",
                a: "Yes. Every tutor's certificates and experience are manually reviewed. We also conduct a knowledge evaluation and demo session as part of the approval process."
            },
            {
                q: "Can I monitor my child's learning progress?",
                a: "Absolutely. Link your parent account to your child's profile to access a Parent Dashboard showing session history, duration, attendance, and tutor notes."
            },
            {
                q: "Is TutorHours affordable?",
                a: "Yes. We offer a wide range of price points, from budget-friendly tutors starting around ₹150/hour to specialists. Many tutors also offer discounted packages for regular bookings."
            },
            {
                q: "Can I purchase session packages or pay as I go?",
                a: "Both! You can book individual sessions or purchase multi-session bundles (4, 8, or 12 sessions) at a discounted rate, saving up to 20%."
            },
            {
                q: "What is the refund policy?",
                a: "If a session is unsatisfactory, you can raise a refund request within 48 hours. Our support team reviews all requests fairly and processes valid refunds within 5–7 working days."
            },
            {
                q: "How do I pick the best tutor for my child?",
                a: "Read tutor profiles, watch their intro videos, and interact with a few via free introductory sessions. Our smart matching tool also provides recommendations based on needs."
            },
            {
                q: "What if my child is shy or struggles with online learning?",
                a: "One-on-one sessions are ideal for shy children. Our tutors are experienced in adapting to different personalities and personalized teaching styles."
            },
            {
                q: "Can I be present in the session room with my child?",
                a: "Yes, parents are welcome to sit alongside their child, especially in the beginning. You can also use silent observation mode via the Parent Dashboard."
            },
            {
                q: "Does TutorHours support students with special learning needs?",
                a: "Yes. We have tutors trained in special education for students with dyslexia, ADHD, autism, or other differences. Use the 'Special Needs' filter to find specialists."
            }
        ]
    }
];

function Accordion({ q, a }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`group rounded-3xl border transition-all duration-300 mb-4 ${open ? "bg-[var(--primary)]/05 border-[var(--primary)]/20" : "bg-white dark:bg-[var(--surface-alt)] border-slate-100 dark:border-white/10 hover:border-[var(--primary)]/30 shadow-sm"}`}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
            >
                <span className={`font-bold transition-colors ${open ? "text-[var(--primary)]" : "text-slate-800 dark:text-white"}`}>{q}</span>
                <span className={`text-2xl transition-transform duration-300 ${open ? "rotate-45 text-[var(--primary)]" : "text-slate-400 group-hover:text-slate-600"}`}>+</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-8 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {a}
                </div>
            </div>
        </div>
    );
}

export default function FAQ() {
    const [activeCat, setActiveCat] = useState("Students");

    return (
        <>
        <div>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/academic_hero_banner.png" 
                            alt="Banner" 
                            className="w-full h-full object-cover opacity-20 dark:opacity-40 brightness-[0.9] dark:brightness-[0.7]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)]/20 via-[var(--surface)]/80 to-[var(--surface)]" />
                    </div>
                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 text-[var(--primary)] dark:text-[var(--accent)] text-xs font-bold tracking-wider uppercase mb-6">
                            Support Center
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 dark:text-white">Frequently Asked <span className="grad-text">Questions</span></h1>
                        <p className="text-slate-500 dark:text-slate-400">Everything you need to know about TutorHours</p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar Nav */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="sticky top-32 space-y-2">
                            {FAQS.map(cat => (
                                <button
                                    key={cat.category}
                                    onClick={() => setActiveCat(cat.category)}
                                    className={`w-full text-left px-6 py-3 rounded-2xl font-bold transition-all ${
                                        activeCat === cat.category
                                        ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                                    }`}
                                >
                                    {cat.category}
                                </button>
                            ))}
                            
                            <div className="mt-12 p-8 rounded-[2rem] grad-bg text-white relative overflow-hidden shadow-xl shadow-[var(--primary)]/30">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                <h3 className="font-bold mb-2 relative z-10">Still have questions?</h3>
                                <p className="text-xs text-white/80 mb-6 relative z-10">We're here to help you 24/7. Reach out to our support team.</p>
                                <Link to="/contact" className="inline-block bg-white text-[var(--primary)] px-6 py-2.5 rounded-xl font-bold text-xs hover:scale-105 transition-transform relative z-10">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1">
                        {FAQS.find(cat => cat.category === activeCat)?.questions.map((faq, i) => (
                            <Accordion key={i} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}
