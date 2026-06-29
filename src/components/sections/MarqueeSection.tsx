/**
 * Marquee Section — Animated scrolling text strip.
 * Server Component — no interactivity needed.
 */
const MARQUEE_ITEMS = [
  "Videography",
  "Photography",
  "Graphic Design",
  "Creative Content",
  "Moderation",
  "Brand Films",
  "Visual Storytelling",
];

export function MarqueeSection() {
  return (
    <section
      aria-hidden="true"
      style={{
        background: "var(--color-white)",
        color: "var(--color-black)",
        padding: "1.5rem 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(10,10,10,0.08)",
        borderBottom: "1px solid rgba(10,10,10,0.08)",
      }}
    >
      <div className="marquee-track">
        {/* Render two copies to create seamless loop */}
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-track-inner" aria-hidden={copy === 1}>
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "2rem",
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(1rem, 2vw, 1.25rem)",
                  fontStyle: i % 2 === 1 ? "italic" : "normal",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  color: "var(--color-black)",
                }}
              >
                {item}
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--color-black)",
                    display: "inline-block",
                    opacity: 0.3,
                  }}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
