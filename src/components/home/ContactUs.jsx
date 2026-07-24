import { useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL/send-email, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "vishidhacadamy@gmail.com", // Updated receiver email
          subject: formData.subject || "Contact Us Inquiry",
          message: `Name: ${formData.name}<br/>Email: ${formData.email}<br/><br/>Message:<br/>${formData.message}`,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while sending the email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden" style={{ background: "var(--section-bg)" }}>
      {/* Top glow divider */}
      <div className="absolute top-0 left-0 right-0 h-px glow-divider" />
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full orb-blue opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full orb-purple opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <div className="section-pill mx-auto w-fit mb-3 sm:mb-4">Get in Touch</div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-5 text-[var(--text-primary)]">
            We'd Love to <span className="grad-text">Hear From You</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-2xl mx-auto">
            Have a question about our platform, pricing, or looking to partner with us? Reach out and our team will be happy to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          
          {/* Contact Details */}
          <div className="space-y-3 sm:space-y-4">
            {[
              { icon: <FiMail size={20} />, color: "#06B6D4", title: "Email Us", sub: "Our friendly team is here to help.", value: "support@vishidhacademy.com", href: "mailto:vishidhacadamy@gmail.com" },
              { icon: <FiMapPin size={20} />, color: "#3B82F6", title: "Visit Us", sub: "Come say hello at our HQ.", value: "Konark Orchid, Pune, India", href: null },
              { icon: <FiPhone size={20} />, color: "#8B5CF6", title: "Call Us", sub: "Mon–Fri from 8am to 5pm.", value: "+91 72763 17328", href: "tel:+917276317328" },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "var(--card-bg)", border: `1px solid var(--card-border)`, backdropFilter: "blur(16px)" }}
              >
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-[var(--text-primary)] text-sm sm:text-base mb-0.5">{item.title}</h4>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm mb-1">{item.sub}</p>
                  {item.href ? (
                    <a href={item.href} className="text-xs sm:text-sm font-semibold transition-colors duration-200 block truncate" style={{ color: item.color }}>{item.value}</a>
                  ) : (
                    <p className="text-[var(--text-muted)] text-xs sm:text-sm font-medium truncate">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl p-5 sm:p-8 relative" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", backdropFilter: "blur(20px)" }}>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] blur-2xl opacity-50 -z-10" />
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[var(--text-muted)] mb-1.5 sm:mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-soft)] text-[var(--text-primary)] placeholder:text-[var(--text-light)] outline-none focus:border-[var(--accent)]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-soft)] text-[var(--text-primary)] placeholder:text-[var(--text-light)] outline-none focus:border-[var(--accent)]/40 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-soft)] text-[var(--text-primary)] placeholder:text-[var(--text-light)] outline-none focus:border-[var(--accent)]/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Drop your message here..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-soft)] text-[var(--text-primary)] placeholder:text-[var(--text-light)] outline-none focus:border-[var(--accent)]/40 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", boxShadow: "0 8px 30px rgba(6,182,212,0.3)" }}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message <FiSend size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
