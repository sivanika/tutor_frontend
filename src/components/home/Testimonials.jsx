import { useEffect, useState } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Jessica Lin",
      role: "Engineering Student",
      text: "ProfessorOn helped me clear my exams with top grades. The professors are extremely knowledgeable and supportive.",
    },
    {
      name: "Dr. Robert Hayes",
      role: "Economics Professor",
      text: "This platform connects me with serious learners. Teaching online has never been this smooth and professional.",
    },
    {
      name: "Michael Torres",
      role: "Computer Science Student",
      text: "The virtual sessions, recordings, and analytics are amazing. It feels like a premium university experience.",
    },
    {
      name: "Sarah Ahmed",
      role: "Medical Student",
      text: "Flexible scheduling and verified tutors saved me so much time. Highly recommended!",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="testimonials"
      className="
        py-24
        bg-slate-50
        dark:bg-gradient-to-b dark:from-slate-900 dark:to-black
        transition-colors duration-500
      "
    >
      {/* Heading */}
      <div className="text-center mb-14 px-6">
        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
          What Our Users Say
        </h2>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Real experiences from students and professors
        </p>
      </div>

      {/* Slider */}
      <div className="max-w-4xl mx-auto px-6 relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="min-w-full px-4">
              <div
                className="
                  rounded-2xl p-10 text-center

                  bg-white
                  dark:bg-slate-900/80

                  border border-slate-200 dark:border-slate-800
                  shadow-md dark:shadow-black/30

                  backdrop-blur-xl
                  transition-all duration-300
                "
              >
                {/* Avatar */}
                <div
                  className="
                    w-16 h-16 mx-auto mb-5
                    rounded-full
                    bg-slate-200 dark:bg-slate-800
                    text-slate-800 dark:text-white
                    flex items-center justify-center
                    font-semibold text-xl
                  "
                >
                  {t.name.charAt(0)}
                </div>

                {/* Text */}
                <p className="text-slate-600 dark:text-slate-400 italic mb-6 leading-relaxed">
                  “{t.text}”
                </p>

                {/* Name */}
                <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                  {t.name}
                </h4>

                <span className="text-sm text-slate-500 dark:text-slate-500">
                  {t.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`
                w-3 h-3 rounded-full transition
                ${
                  index === i
                    ? "bg-slate-800 dark:bg-white scale-125"
                    : "bg-slate-300 dark:bg-slate-700"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
