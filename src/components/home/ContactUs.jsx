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
      const res = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "support@tutorhours.com", // You can change this to your desired receiving email
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
    <section id="contact" className="py-24 relative overflow-hidden dark:bg-[#0f0720]">
      {/* Background Blurs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#6A11CB]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF4E9B]/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#6A11CB] dark:text-[#FF4E9B] font-semibold text-sm tracking-wider uppercase mb-3 block">
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            We'd Love to <span className="grad-text">Hear From You</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Have a question about our platform, pricing, or looking to partner with us? Reach out and our team will be happy to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Contact Details */}
          <div className="space-y-8">
            <div className="group flex items-start gap-5 p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 hover:border-[#6A11CB]/30 dark:hover:border-[#FF4E9B]/30 transition-colors backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-[#6A11CB]/20 flex items-center justify-center text-[#6A11CB] dark:text-[#a78bfa] shrink-0 group-hover:scale-110 transition-transform">
                <FiMail size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">Email Us</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-2">Our friendly team is here to help.</p>
                <a href="mailto:support@tutorhours.com" className="text-[#6A11CB] dark:text-[#FF4E9B] font-medium hover:underline">
                  support@tutorhours.com
                </a>
              </div>
            </div>

            <div className="group flex items-start gap-5 p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 hover:border-[#6A11CB]/30 dark:hover:border-[#FF4E9B]/30 transition-colors backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-[#2575FC]/20 flex items-center justify-center text-[#2575FC] dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                <FiMapPin size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">Visit Us</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-2">Come say hello at our HQ.</p>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  123 Innovation Drive<br />
                  Tech District, CA 94103
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-5 p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 hover:border-[#6A11CB]/30 dark:hover:border-[#FF4E9B]/30 transition-colors backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-[#FF4E9B]/20 flex items-center justify-center text-[#FF4E9B] dark:text-pink-400 shrink-0 group-hover:scale-110 transition-transform">
                <FiPhone size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">Call Us</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-2">Mon-Fri from 8am to 5pm.</p>
                <a href="tel:+15550000000" className="text-slate-700 dark:text-slate-300 font-medium hover:text-[#6A11CB] dark:hover:text-[#FF4E9B] transition-colors">
                  +1 (555) 000-0000
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-[#1a0e33] rounded-3xl p-8 shadow-2xl shadow-[#6A11CB]/5 border border-slate-100 dark:border-white/10 relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-[#6A11CB] to-[#FF4E9B] blur-2xl opacity-50 -z-10" />
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#6A11CB] dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#6A11CB] dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#6A11CB] dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Let us know what you need</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Drop your message here..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#6A11CB] dark:text-white outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl grad-bg text-white font-semibold text-lg shadow-lg shadow-[#6A11CB]/30 hover:shadow-xl hover:shadow-[#6A11CB]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
