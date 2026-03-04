import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Jessica Lin",
    role: "Engineering Student",
    text: "TutorHours helped me clear my exams with top grades. The professors are extremely knowledgeable and supportive.",
    color: "#6A11CB",
  },
  {
    name: "Dr. Robert Hayes",
    role: "Economics Professor",
    text: "This platform connects me with serious learners. Teaching online has never been this smooth and professional.",
    color: "#FF4E9B",
  },
  {
    name: "Michael Torres",
    role: "Computer Science Student",
    text: "The virtual sessions, recordings, and analytics are amazing. It feels like a premium university experience.",
    color: "#2575FC",
  },
  {
    name: "Sarah Ahmed",
    role: "Medical Student",
    text: "Flexible scheduling and verified tutors saved me so much time. Highly recommended for any serious learner.",
    color: "#6A11CB",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  const cur = testimonials[index];

  return (
    <section
      id="testimonials"
      className="relative py-28 grad-bg overflow-hidden transition-colors duration-500"
    >
      {/* Orbs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#FF4E9B]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "48px 48px" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF4E9B] mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            What Our Users Say
          </h2>
          <p className="mt-3 text-white/60">
            Real experiences from students and professors worldwide
          </p>
        </div>

        {/* Slide */}
        <div
          key={index}
          className="animate-fadeIn glass rounded-3xl p-10 md:p-14 text-center shadow-2xl"
        >
          {/* Avatar */}
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${cur.color}, #2575FC)`,
              boxShadow: `0 12px 32px ${cur.color}50`,
            }}
          >
            {cur.name.charAt(0)}
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#FF4E9B] text-xl">★</span>
            ))}
          </div>

          {/* Quote */}
          <p className="text-white/80 text-lg md:text-xl italic leading-relaxed mb-8 max-w-2xl mx-auto">
            "{cur.text}"
          </p>

          <h4 className="font-bold text-lg text-white">{cur.name}</h4>
          <span className="text-sm text-white/50">{cur.role}</span>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${index === i
                  ? "w-8 h-3 bg-[#FF4E9B] shadow-lg shadow-[#FF4E9B]/50"
                  : "w-3 h-3 bg-white/30 hover:bg-white/60"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
