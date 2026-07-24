import ContactUsComponent from "../components/home/ContactUs";
import { FiMail, FiMapPin, FiPhone, FiClock } from "react-icons/fi";

const quickInfo = [
  { icon: <FiMail />, label: "Email", value: "support@vishidhacademy.com", href: "mailto:support@vishidhacademy.com", color: "#06B6D4" },
  { icon: <FiPhone />, label: "Phone", value: "+91 72763 17328", href: "tel:+917276317328", color: "#8B5CF6" },
  { icon: <FiMapPin />, label: "Location", value: "Konark Orchid, Pune, India", href: null, color: "#3B82F6" },
  { icon: <FiClock />, label: "Support Hours", value: "Mon–Fri, 9am – 6pm IST", href: null, color: "#10B981" },
];

export default function Contact() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(6,182,212,0.25) 0%, rgba(59,130,246,0.1) 50%, transparent 70%), var(--hero-section)" }}>
        <div className="absolute -top-20 left-1/4 w-96 h-96 orb-cyan opacity-20 dark:opacity-30" />
        <div className="absolute top-1/2 right-0 w-80 h-80 orb-blue opacity-15 dark:opacity-20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="section-pill mx-auto w-fit mb-6 animate-fadeIn">Get in Touch</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[var(--text-primary)] leading-tight animate-slideUp">
            We're Here to <span className="grad-text">Help</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed animate-slideUp delay-200">
            Have questions about the platform, pricing, or need technical support? Our team is available to assist you 24/7.
          </p>

          {/* Quick contact pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-10 animate-slideUp delay-300">
            {quickInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: `${item.color}12`, border: `1px solid ${item.color}25`, color: item.color }}
              >
                {item.icon}
                <span className="text-[var(--text-muted)]">{item.label}:</span>
                {item.href ? (
                  <a href={item.href} className="hover:underline">{item.value}</a>
                ) : (
                  <span>{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactUsComponent />
    </div>
  );
}
