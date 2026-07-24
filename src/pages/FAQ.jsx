import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiMessageCircle } from "react-icons/fi";

const FAQS = [
  {
    category: "Students",
    color: "#3B82F6",
    questions: [
      { q: "What is VishidhAcademy and how does it work?", a: "VishidhAcademy is an online tutoring platform that connects students with qualified educators across all subjects and grade levels. Simply browse tutor profiles, choose one that matches your needs and budget, and book a session directly. Sessions happen via our integrated video platform — no downloads needed." },
      { q: "Is VishidhAcademy free to join as a student?", a: "Yes — completely free. There are no subscription fees, registration charges, or hidden costs for students. You only pay when you book and complete a session with a tutor. The tutor's listed rate is exactly what you pay." },
      { q: "How do I find the right tutor for my subject?", a: "Use our search filters to narrow tutors by subject, grade level, language, hourly rate, and availability. Every tutor profile includes their qualifications, teaching experience, student reviews, and a sample intro video." },
      { q: "Can I try a free trial session before committing?", a: "Many tutors on VishidhAcademy offer a free 15-minute introductory call so you can discuss your goals before booking a paid session. Look for the 'Free Intro' badge on tutor profiles." },
      { q: "How do I reschedule or cancel a session?", a: "You can reschedule or cancel any upcoming session from your dashboard up to 24 hours before the scheduled time at no charge. Cancellations within 24 hours may incur a partial fee depending on the tutor's individual policy." },
      { q: "What subjects and levels does VishidhAcademy cover?", a: "VishidhAcademy covers: School subjects (Class 1–12), Competitive exams (JEE, NEET, UPSC, CAT, IELTS), College-level courses (Engineering, Commerce, Arts), and Skill-based learning (Coding, Music, Art). New subjects are added regularly." },
      { q: "What payment methods are accepted?", a: "We accept UPI, Debit/Credit Cards, Net Banking, and major wallets. All payments are processed through a secure, encrypted gateway. You will receive a digital receipt after every transaction." },
      { q: "What happens if I am unhappy with a session?", a: "If a session doesn't meet expectations, report it within 48 hours via your dashboard. Our support team will review and, where valid, process a full or partial refund." },
      { q: "Are my personal details and sessions private?", a: "Yes. VishidhAcademy follows strict data privacy practices. Your personal information is never shared with third parties. Session content is encrypted, and recordings are only accessible by you and your tutor." },
      { q: "Can I learn in my own regional language?", a: "Absolutely. VishidhAcademy has tutors who teach in Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Punjabi, and many more regional languages. Use the language filter to find your match." },
    ],
  },
  {
    category: "Tutors / Professors",
    color: "#8B5CF6",
    questions: [
      { q: "Who can become a tutor on VishidhAcademy?", a: "Any qualified educator can apply — school teachers, college professors, subject-matter experts, retired academics, and skilled professionals. You need to demonstrate subject expertise and communication skills." },
      { q: "How does the tutor verification and onboarding process work?", a: "Our team reviews your credentials, followed by a brief knowledge evaluation and a mock demo session. Approval typically takes 3–5 business days. Once approved, your profile goes live." },
      { q: "What documents do I need to submit for registration?", a: "You will need to upload a government ID, highest academic qualification certificate, experience letters (if any), a profile photo, and bank account details for payouts." },
      { q: "How much do tutors earn and what is the commission structure?", a: "Tutors keep 82% of every session fee. VishidhAcademy retains 18% for platform operations and student acquisition. You set your own hourly rate, giving you full control over your income." },
      { q: "When and how are payouts processed?", a: "Earnings are credited to your VishidhAcademy wallet within 24 hours of session completion. You can withdraw to your bank account anytime, usually processed within 2-3 business days." },
      { q: "Is there any subscription fee for tutors?", a: "Basic registration is free. Tutors who opt for our Premium Subscription get priority placement in search results and access to advanced student leads. Subscription plans are optional." },
      { q: "Can I teach multiple subjects or set my own schedule?", a: "Yes! You can list up to 5 subjects per profile and your availability calendar is fully customizable. You can update your schedule at any time from your dashboard." },
      { q: "How does the student rating and review system work?", a: "Students rate tutors on a 5-star scale. Reviews are verified and visible on your profile. High ratings improve your visibility and build student trust." },
      { q: "What technology do I need to conduct sessions?", a: "You need a reliable internet connection, a computer/tablet with a webcam and mic, and a quiet environment. Our platform includes a built-in whiteboard and screen sharing." },
      { q: "Can tutors from outside India join VishidhAcademy?", a: "Yes! VishidhAcademy is a global platform. Tutors from any country are welcome. International payouts are processed via wire transfer or PayPal." },
    ],
  },
  {
    category: "Parents",
    color: "#10B981",
    questions: [
      { q: "How does VishidhAcademy ensure my child's safety?", a: "Safety is our top priority. Every tutor undergoes identity verification and background checks. Sessions happen inside our secure platform, and you can enable session monitoring." },
      { q: "Are the tutors' qualifications genuinely verified?", a: "Yes. Every tutor's certificates and experience are manually reviewed. We also conduct a knowledge evaluation and demo session as part of the approval process." },
      { q: "Can I monitor my child's learning progress?", a: "Absolutely. Link your parent account to your child's profile to access a Parent Dashboard showing session history, duration, attendance, and tutor notes." },
      { q: "Is VishidhAcademy affordable?", a: "Yes. We offer a wide range of price points, from budget-friendly tutors starting around ₹150/hour to specialists. Many tutors also offer discounted packages for regular bookings." },
      { q: "Can I purchase session packages or pay as I go?", a: "Both! You can book individual sessions or purchase multi-session bundles (4, 8, or 12 sessions) at a discounted rate, saving up to 20%." },
      { q: "What is the refund policy?", a: "If a session is unsatisfactory, you can raise a refund request within 48 hours. Our support team reviews all requests fairly and processes valid refunds within 5–7 working days." },
      { q: "How do I pick the best tutor for my child?", a: "Read tutor profiles, watch their intro videos, and interact with a few via free introductory sessions. Our smart matching tool also provides recommendations based on needs." },
      { q: "What if my child is shy or struggles with online learning?", a: "One-on-one sessions are ideal for shy children. Our tutors are experienced in adapting to different personalities and personalized teaching styles." },
      { q: "Can I be present in the session room with my child?", a: "Yes, parents are welcome to sit alongside their child, especially in the beginning. You can also use silent observation mode via the Parent Dashboard." },
      { q: "Does VishidhAcademy support students with special learning needs?", a: "Yes. We have tutors trained in special education for students with dyslexia, ADHD, autism, or other differences. Use the 'Special Needs' filter to find specialists." },
    ],
  },
];

function Accordion({ q, a, accentColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 mb-3"
      style={{
        background: open ? `${accentColor}08` : "var(--card-bg)",
        border: open ? `1px solid ${accentColor}30` : "1px solid var(--card-border)",
        backdropFilter: "blur(16px)",
        boxShadow: open ? `0 0 20px ${accentColor}08` : "none",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
      >
        <span className="font-semibold text-sm sm:text-base transition-colors duration-200" style={{ color: open ? accentColor : "var(--text-primary)" }}>
          {q}
        </span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: open ? `${accentColor}15` : "var(--surface-alt)",
            border: open ? `1px solid ${accentColor}30` : "1px solid var(--border)",
            color: open ? accentColor : "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <FiChevronDown size={14} />
        </div>
      </button>
      <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: open ? "400px" : "0", opacity: open ? 1 : 0 }}>
        <div className="px-6 pb-5">
          <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, ${accentColor}25, transparent)` }} />
          <p className="text-[var(--text-muted)] text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [activeCat, setActiveCat] = useState("Students");
  const activeData = FAQS.find((c) => c.category === activeCat);

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(42,77,110,0.3) 0%, transparent 65%), var(--hero-section)" }}>
        <div className="absolute -top-20 right-1/4 w-96 h-96 orb-blue opacity-20 dark:opacity-30" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 orb-purple opacity-15 dark:opacity-20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="section-pill mx-auto w-fit mb-6 animate-fadeIn">Support Center</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[var(--text-primary)] leading-tight animate-slideUp">
            Frequently Asked <br />
            <span className="grad-text">Questions</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto animate-slideUp delay-200">
            Everything you need to know about VishidhAcademy — answered.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-16" style={{ background: "var(--bg)" }}>
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-2">
              {FAQS.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCat(cat.category)}
                  className="w-full text-left px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
                  style={{
                    background: activeCat === cat.category ? `${cat.color}15` : "var(--card-bg)",
                    border: activeCat === cat.category ? `1px solid ${cat.color}30` : "1px solid var(--card-border)",
                    color: activeCat === cat.category ? cat.color : "var(--text-muted)",
                  }}
                >
                  {cat.category}
                </button>
              ))}

              {/* Help card */}
              <div
                className="mt-8 p-6 rounded-3xl relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #0d1e3d 0%, #060e1c 100%)",
                  border: "1px solid rgba(6,182,212,0.35)",
                  boxShadow: "0 12px 30px rgba(5,8,22,0.25)"
                }}
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 orb-cyan opacity-30" />
                <FiMessageCircle className="text-[#06B6D4] text-xl mb-3 relative z-10" />
                <h3 className="font-bold text-white mb-2 text-sm relative z-10">Still have questions?</h3>
                <p className="text-white/80 text-xs mb-4 relative z-10">We're here 24/7. Reach out anytime.</p>
                <Link
                  to="/contact"
                  className="inline-block text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 relative z-10"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 4px 16px rgba(6,182,212,0.3)" }}
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </aside>

          {/* Questions */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 rounded-full" style={{ background: `linear-gradient(180deg, ${activeData?.color}, ${activeData?.color}50)` }} />
              <h2 className="text-xl font-black text-[var(--text-primary)]">{activeCat}</h2>
              <span className="text-xs text-[var(--text-muted)] ml-auto">{activeData?.questions.length} questions</span>
            </div>
            {activeData?.questions.map((faq, i) => (
              <Accordion key={i} q={faq.q} a={faq.a} accentColor={activeData.color} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
