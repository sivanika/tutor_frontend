import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { FiBookOpen, FiDollarSign, FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";



const GRADIENTS = [
  { from: "var(--primary)", to: "var(--primary)" },
  { from: "var(--accent)", to: "var(--primary)" },
  { from: "var(--primary)", to: "var(--accent)" },
  { from: "#38BDF8", to: "#2563EB" }, // Sky to Blue
  { from: "#A78BFA", to: "#6366F1" }, // Purple to Indigo
  { from: "#60A5FA", to: "#3B82F6" }, // Blue variants
];

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "https://tutor-backend-mqz1.onrender.com";

export default function TutorCards() {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    API.get("/professors/featured")
      .then((res) => setTutors(res.data))
      .catch((err) => {
        console.error("Failed to load featured tutors:", err);
        setTutors([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Watch scroll position to highlight the active dot
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cardWidth = track.scrollWidth / Math.max(tutors.length, 1);
      const idx = Math.round(track.scrollLeft / cardWidth);
      setActiveIndex(idx);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [tutors.length]);

  const scrollTo = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.querySelector("[data-card]")?.offsetWidth ?? 320;
    track.scrollBy({ left: dir * (cardWidth + 32), behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-[var(--surface-alt)] dark:bg-[var(--surface)] transition-colors duration-500 overflow-hidden relative">
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[var(--primary)]/06 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[var(--accent)]/05 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="text-center mb-12 px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] dark:text-[var(--accent)] mb-2">
            Our educators
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] dark:text-white">
            Recommended <span className="grad-text">Tutors</span>
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && tutors.length === 0 && (
          <div className="text-center py-16 text-[var(--text-muted)] dark:text-[var(--accent)]">
            <p className="text-2xl mb-2 flex justify-center text-[var(--primary)]"><FiBookOpen /></p>

            <p className="text-lg font-semibold">No tutors available yet</p>
            <p className="text-sm mt-1">Check back soon — we're growing!</p>
          </div>
        )}

        {/* Carousel */}
        {!loading && tutors.length > 0 && (
          <div className="relative">
            {/* Prev button */}
            {activeIndex > 0 && (
              <button
                onClick={() => scrollTo(-1)}
                aria-label="Scroll left"
                className="
                  hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20
                  w-10 h-10 rounded-full bg-white dark:bg-[var(--surface-alt)]
                  border border-[var(--primary)]/20 shadow-lg
                  items-center justify-center
                  text-[var(--primary)] dark:text-[var(--accent)]
                  hover:scale-110 transition-transform duration-200
                "
              >
                <FiChevronLeft />

              </button>
            )}
            {/* Next button */}
            {activeIndex < tutors.length - 1 && (
              <button
                onClick={() => scrollTo(1)}
                aria-label="Scroll right"
                className="
                  hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20
                  w-10 h-10 rounded-full bg-white dark:bg-[var(--surface-alt)]
                  border border-[var(--primary)]/20 shadow-lg
                  items-center justify-center
                  text-[var(--primary)] dark:text-[var(--accent)]
                  hover:scale-110 transition-transform duration-200
                "
              >
                <FiChevronRight />

              </button>
            )}

            {/* Scroll track */}
            <div
              ref={trackRef}
              className="flex gap-6 md:gap-8 overflow-x-auto pb-6 px-6 md:px-16 scrollbar-hide"
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "smooth",
              }}
            >
              {tutors.map((t, i) => {
                const grad = GRADIENTS[i % GRADIENTS.length];
                const gradientStyle = `linear-gradient(135deg, ${grad.from}, ${grad.to})`;
                const photoUrl = t.profilePhoto
                  ? `${BACKEND_URL}/${t.profilePhoto.replace(/\\/g, "/")}`
                  : null;
                const displayName = t.name || "Tutor";
                const initials = displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();
                const ratingLabel =
                  t.avgRating != null ? t.avgRating.toFixed(1) : "New";
                const sessionLabel =
                  t.sessionCount > 0
                    ? `${t.sessionCount} sessions`
                    : "New tutor";

                return (
                  <div
                    key={t._id}
                    data-card
                    className="
                      group relative p-6 md:p-7 rounded-2xl overflow-hidden flex-shrink-0
                      w-[82vw] sm:w-72 md:w-80
                      bg-white dark:bg-[var(--surface-alt)]
                      border border-[var(--primary)]/10 dark:border-[var(--primary)]/20
                      shadow-md dark:shadow-[var(--primary)]/05
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--primary)]/15
                      transition-all duration-300
                      will-change-transform
                    "
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {/* Top gradient border */}
                    <div
                      className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                      style={{ background: gradientStyle }}
                    />

                    {/* Avatar */}
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={displayName}
                        loading="lazy"
                        decoding="async"
                        width={64}
                        height={64}
                        className="w-16 h-16 mb-5 rounded-2xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Initials fallback */}
                    <div
                      className="w-16 h-16 mb-5 rounded-2xl items-center justify-center font-black text-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: gradientStyle,
                        boxShadow: `0 8px 20px ${grad.from}40`,
                        display: photoUrl ? "none" : "flex",
                      }}
                    >
                      {initials}
                    </div>

                    <h3 className="text-lg font-bold text-[var(--text-primary)] dark:text-white truncate">
                      {displayName}
                    </h3>
                    <p className="text-[var(--text-muted)] dark:text-[var(--accent)] text-sm mt-1 truncate">
                      {t.subjects || "General Tutoring"}
                    </p>

                    {/* Hourly Rate Badge */}
                    <div className="mt-3">
                      {t.hourlyRate ? (
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                          style={{ background: gradientStyle }}
                        >
                          <FiDollarSign className="inline-block" /> ₹{t.hourlyRate}/hr

                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-[var(--text-muted)] dark:text-[var(--accent)] bg-gray-100 dark:bg-[var(--text-primary)]">
                          Contact for price
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: grad.from }}
                      >
                        <FiStar className="inline-block" /> {ratingLabel}

                      </span>
                      <span className="text-xs text-[var(--text-muted)] dark:text-[var(--accent)]">
                        {sessionLabel}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/tutor/${t._id}`)}
                      className="mt-5 w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{
                        background: gradientStyle,
                        boxShadow: `0 4px 16px ${grad.from}30`,
                      }}
                    >
                      View Profile →
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-2">
              {tutors.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to tutor ${i + 1}`}
                  onClick={() => {
                    const track = trackRef.current;
                    if (!track) return;
                    const card = track.querySelector("[data-card]");
                    if (!card) return;
                    track.scrollTo({
                      left: i * (card.offsetWidth + 32),
                      behavior: "smooth",
                    });
                  }}
                  className="rounded-full transition-all duration-300"
                    style={{
                    width: i === activeIndex ? "24px" : "8px",
                    height: "8px",
                    background:
                      i === activeIndex ? "var(--primary)" : "var(--primary)/25",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
