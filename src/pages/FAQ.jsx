import { useState } from "react";
import { Link } from "react-router-dom";

const FAQS = [
    {
        category: "General",
        questions: [
            {
                q: "What is TutorHours?",
                a: "TutorHours is a premium platform connecting students with verified professors for personalized academic guidance, exam prep, and research support."
            },
            {
                q: "How do I get started?",
                a: "Simply sign up as a student, browse our list of verified tutors, and book a session that fits your schedule."
            }
        ]
    },
    {
        category: "For Students",
        questions: [
            {
                q: "How are tutors verified?",
                a: "Every professor on our platform undergoes a rigorous background check, including verification of their academic credentials and a trial teaching session."
            },
            {
                q: "What if I'm not happy with a session?",
                a: "We offer a satisfaction guarantee. If your session didn't meet expectations, contact our support team within 24 hours for a refund or credit."
            },
            {
                q: "Can I cancel a booking?",
                a: "Yes, you can cancel up to 24 hours before the session for a full refund. Cancellations within 24 hours may incur a small fee depending on the tutor's policy."
            }
        ]
    },
    {
        category: "For Professors",
        questions: [
            {
                q: "How do I become a tutor?",
                a: "Click on 'Become a Tutor' in the footer, fill out the application form, and our team will get in touch for the verification process."
            },
            {
                q: "When do I get paid?",
                a: "Payments are processed weekly and sent directly to your linked bank account after the session is successfully completed."
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
    const [activeCat, setActiveCat] = useState("General");

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
