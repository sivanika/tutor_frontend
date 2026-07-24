import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { FiBookOpen, FiDollarSign, FiStar, FiChevronLeft, FiChevronRight, FiLinkedin, FiCalendar } from "react-icons/fi";
import { media } from "../../utils/media";

const GRADIENTS = [
  { from: "#3B82F6", to: "#06B6D4" },
  { from: "#8B5CF6", to: "#3B82F6" },
  { from: "#06B6D4", to: "#10B981" },
  { from: "#F59E0B", to: "#EF4444" },
  { from: "#A78BFA", to: "#8B5CF6" },
  { from: "#F472B6", to: "#A78BFA" },
];

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
    track.scrollBy({ left: dir * (cardWidth + 28), behavior: "smooth" });
  };

  return (
    <section
      className="py-24 overflow-hidden relative"
      style={{ background: "var(--section-bg)" }}
    >
      {/* Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 orb-purple opacity-20 dark:opacity-30" />
      <div className="absolute bottom-0 left-0 w-80 h-80 orb-cyan opacity-15 dark:opacity-25" />

      {/* Glow top divider */}
      <div className="absolute top-0 left-0 right-0 h-px glow-divider" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="text-center mb-12 px-6">
          <div className="section-pill mx-auto w-fit mb-4">Meet Our Educators</div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
            Learn from the{" "}
            <span className="grad-text">Best Professors</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            Verified PhD scholars, industry experts, and passionate educators — ready for you.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && tutors.length === 0 && (
          <div className="text-center py-16 text-[var(--text-light)]">
            <FiBookOpen className="text-4xl mx-auto mb-3 text-[var(--accent)]/30" />
            <p className="text-lg font-semibold text-[var(--text-muted)]">No tutors available yet</p>
            <p className="text-sm mt-1">Check back soon — we're growing!</p>
          </div>
        )}

        {/* Carousel */}
        {!loading && tutors.length > 0 && (
          <div className="relative">
            {/* Prev */}
            {activeIndex > 0 && (
              <button
                onClick={() => scrollTo(-1)}
                aria-label="Scroll left"
                className="
                  hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20
                  w-10 h-10 rounded-full
                  border border-white/10 bg-white/05
                  items-center justify-center text-white/60
                  hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30 hover:text-[var(--accent)]
                  hover:scale-110 transition-all duration-200 backdrop-blur-sm
                "
              >
                <FiChevronLeft />
              </button>
            )}
            {/* Next */}
            {activeIndex < tutors.length - 1 && (
              <button
                onClick={() => scrollTo(1)}
                aria-label="Scroll right"
                className="
                  hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20
                  w-10 h-10 rounded-full
                  border border-white/10 bg-white/05
                  items-center justify-center text-white/60
                  hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30 hover:text-[var(--accent)]
                  hover:scale-110 transition-all duration-200 backdrop-blur-sm
                "
              >
                <FiChevronRight />
              </button>
            )}

            {/* Scroll track */}
            <div
              ref={trackRef}
              className="flex gap-5 sm:gap-7 overflow-x-auto pb-6 px-6 md:px-16 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {tutors.map((t, i) => {
                const grad = GRADIENTS[i % GRADIENTS.length];
                const gradStyle = `linear-gradient(135deg, ${grad.from}, ${grad.to})`;
                const photoUrl = t.profilePhoto ? media(t.profilePhoto) : null;
                const displayName = t.name || "Tutor";
                const initials = displayName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
                const ratingLabel = t.avgRating != null ? t.avgRating.toFixed(1) : "New";
                const sessionLabel = t.sessionCount > 0 ? `${t.sessionCount} sessions` : "New tutor";

                return (
                  <div
                    key={t._id}
                    data-card
                    className="
                      group relative flex-shrink-0 rounded-3xl overflow-hidden
                      w-[82vw] sm:w-72 md:w-76
                      transition-all duration-350 hover:-translate-y-2
                      will-change-transform
                    "
                    style={{
                      scrollSnapAlign: "start",
                      background: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      backdropFilter: "blur(16px)",
                    }}
                  >
                    {/* Top gradient strip */}
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: gradStyle }} />

                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{ background: `radial-gradient(ellipse at 30% 20%, ${grad.from}10, transparent 60%)` }}
                    />

                    <div className="relative p-6">
                      {/* Avatar row */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative flex-shrink-0">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={displayName}
                              loading="lazy"
                              width={56}
                              height={56}
                              className="w-14 h-14 rounded-2xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                            />
                          ) : null}
                          <div
                            className="w-14 h-14 rounded-2xl items-center justify-center font-black text-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                            style={{
                              background: gradStyle,
                              boxShadow: `0 6px 20px ${grad.from}40`,
                              display: photoUrl ? "none" : "flex",
                            }}
                          >
                            {initials}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[var(--text-primary)] truncate">{displayName}</h3>
                          <p className="text-[var(--text-muted)] text-sm mt-0.5 truncate">{t.subjects || "General Tutoring"}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, si) => (
                              <FiStar key={si} size={10} className={si < Math.round(t.avgRating || 4.5) ? "text-[#F59E0B] fill-current" : "text-[var(--text-light)]"} />
                            ))}
                            <span className="text-[var(--text-muted)] text-xs ml-1">{ratingLabel}</span>
                          </div>
                        </div>
                        {/* LinkedIn icon placeholder */}
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-light)] border border-[var(--border-soft)] hover:border-[#0A66C2]/40 hover:text-[#0A66C2] transition-all duration-200 flex-shrink-0">
                          <FiLinkedin size={13} />
                        </button>
                      </div>

                      {/* Rate + sessions */}
                      <div className="flex items-center justify-between mb-4">
                        {t.hourlyRate ? (
                          <span
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                            style={{ background: gradStyle, boxShadow: `0 2px 12px ${grad.from}30` }}
                          >
                            <FiDollarSign size={10} /> ₹{t.hourlyRate}/hr
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--text-light)] font-medium">Contact for price</span>
                        )}
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <FiCalendar size={10} /> {sessionLabel}
                        </span>
                      </div>

                      {/* Book button */}
                      <button
                        onClick={() => navigate(`/tutor/${t._id}`)}
                        className="w-full py-2.5 rounded-2xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{
                          background: gradStyle,
                          boxShadow: `0 4px 16px ${grad.from}25`,
                        }}
                      >
                        Book a Session →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {tutors.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to tutor ${i + 1}`}
                  onClick={() => {
                    const track = trackRef.current;
                    if (!track) return;
                    const card = track.querySelector("[data-card]");
                    if (!card) return;
                    track.scrollTo({ left: i * (card.offsetWidth + 28), behavior: "smooth" });
                  }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? "28px" : "8px",
                    height: "8px",
                    background: i === activeIndex
                      ? "linear-gradient(90deg, #3B82F6, #06B6D4)"
                      : "var(--border-soft)",
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
