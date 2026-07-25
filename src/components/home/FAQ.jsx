import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiArrowRight } from "react-icons/fi";

const faqs = [
  {
    q: "How does VishidhAcademy work?",
    a: "VishidhAcademy connects you with verified professors for live 1:1 or group sessions. Simply sign up, browse professors by subject, book a time that works for you, and join your virtual classroom. All sessions are recorded for your lifetime access.",
  },
  {
    q: "Are the professors verified and qualified?",
    a: "Yes. Every professor on VishidhAcademy undergoes a rigorous vetting process including credential verification, subject matter assessment, and a teaching quality review. We only onboard educators with proven academic backgrounds and teaching experience.",
  },
  {
    q: "Can I access recorded sessions after the class?",
    a: "Absolutely. Every live session is automatically recorded and available in your student dashboard immediately after class. You get lifetime access to all recordings — watch and rewatch as many times as you need.",
  },
  {
    q: "What subjects and courses are available?",
    a: "We cover Mathematics, Physics, Chemistry, Programming & CS, English & Languages, Data Analytics, UI/UX Design, and competitive exam prep (JEE, NEET, SAT, CAT, UPSC). New subjects are added regularly based on student demand.",
  },
  {
    q: "How does the AI Tutor work?",
    a: "Our AI Tutor is available 24/7 to help you solve doubts, explain concepts, and guide your study sessions. It analyzes your progress to identify weak areas and suggests personalized study plans to accelerate your learning.",
  },
  {
    q: "What is the pricing structure?",
    a: "We offer flexible plans — from a free tier to premium subscriptions. You can also pay per session. All plans include dashboard access, session recordings, and AI tutor support. Visit the Pricing section for detailed plan breakdowns.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel your subscription at any time with no questions asked. Your access continues until the end of your billing period, and you retain lifetime access to all recorded sessions from sessions you've attended.",
  },
  {
    q: "Do I get a certificate after completing a course?",
    a: "Yes. Upon completing your sessions and passing the associated quizzes, you receive a verifiable digital certificate. These certificates can be shared on LinkedIn, included in your CV, or submitted to institutions for recognition.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const homeFaqs = faqs.slice(0, 4);

  return (
    <section
      id="faq"
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--section-bg-alt)" }}
    >
      {/* Orbs */}
      <div className="absolute top-1/3 right-0 w-80 h-80 orb-purple opacity-15 dark:opacity-25" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 orb-cyan opacity-12 dark:opacity-20" />

      {/* Top glow divider */}
      <div className="absolute top-0 left-0 right-0 h-px glow-divider" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="section-pill mx-auto w-fit mb-3 sm:mb-4">FAQ</div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-3 sm:mb-4">
            Got{" "}
            <span className="grad-text">Questions?</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base">
            Everything you need to know about VishidhAcademy — answered.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {homeFaqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen ? "rgba(6,182,212,0.06)" : "var(--card-bg)",
                  border: isOpen ? "1px solid rgba(6,182,212,0.2)" : "1px solid var(--card-border)",
                  backdropFilter: "blur(16px)",
                  boxShadow: isOpen ? "0 0 30px rgba(6,182,212,0.06)" : "none",
                }}
              >
                <button
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left gap-3 sm:gap-4 group"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {/* Active indicator */}
                  {isOpen && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl" style={{ background: "linear-gradient(180deg, #06B6D4, #8B5CF6)" }} />
                  )}
                  <span
                    className="font-semibold text-xs sm:text-base transition-colors duration-200"
                    style={{ color: isOpen ? "#06B6D4" : "var(--text-primary)" }}
                  >
                    {faq.q}
                  </span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: isOpen ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.05)",
                      border: isOpen ? "1px solid rgba(6,182,212,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      color: isOpen ? "#06B6D4" : "rgba(255,255,255,0.4)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <FiChevronDown size={14} />
                  </div>
                </button>

                {/* Answer */}
                <div
                  className="overflow-hidden transition-all duration-400 ease-in-out"
                  style={{ maxHeight: isOpen ? "350px" : "0", opacity: isOpen ? 1 : 0 }}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                    <div className="h-px mb-3 sm:mb-4" style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.2), transparent)" }} />
                    <p className="text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA section */}
        <div className="text-center mt-10 p-6 sm:p-8 rounded-3xl" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
          <p className="text-[var(--text-primary)] font-bold text-base mb-1">Have more questions?</p>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm mb-5">Explore our complete knowledge base or get in touch with our team.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 4px 20px rgba(6,182,212,0.3)" }}
            >
              Know More / View All FAQs <FiArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--card-border)",
                color: "var(--text-primary)",
              }}
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
