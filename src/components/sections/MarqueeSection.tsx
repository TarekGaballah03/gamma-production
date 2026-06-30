/**
 * Marquee Section — Animated scrolling text strip.
 * Server Component — no interactivity needed.
 *
 * Fixed: uses 4 copies so wide screens never show a gap.
 * The animation translates exactly -25% per copy, creating a
 * perfectly seamless infinite loop regardless of screen width.
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

/** One set of items rendered inside a copy */
function MarqueeItems() {
  return (
    <>
      {MARQUEE_ITEMS.map((item, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)",
            fontStyle: i % 2 === 1 ? "italic" : "normal",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            color: "var(--color-black)",
            paddingRight: "3rem",
          }}
        >
          {item}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "var(--color-black)",
              opacity: 0.25,
              marginLeft: "3rem",
              flexShrink: 0,
            }}
          />
        </span>
      ))}
    </>
  );
}

export function MarqueeSection() {
  return (
    <section
      aria-hidden="true"
      style={{
        background: "var(--color-white)",
        color: "var(--color-black)",
        padding: "1.25rem 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(10,10,10,0.08)",
        borderBottom: "1px solid rgba(10,10,10,0.08)",
      }}
    >
      {/*
        We render 4 identical copies in a single flex row.
        The CSS animation moves the whole track by -25% (= 1 copy width),
        then jumps back to 0 — creating a perfectly seamless loop.
        4 copies guarantees the strip is always wider than any viewport.
      */}
      <div className="marquee-track">
        {/* Copy 1 — visible */}
        <div className="marquee-track-inner" aria-hidden="false">
          <MarqueeItems />
        </div>
        {/* Copies 2-4 — duplicate for seamless loop, hidden from a11y */}
        <div className="marquee-track-inner" aria-hidden="true">
          <MarqueeItems />
        </div>
        <div className="marquee-track-inner" aria-hidden="true">
          <MarqueeItems />
        </div>
        <div className="marquee-track-inner" aria-hidden="true">
          <MarqueeItems />
        </div>
      </div>
    </section>
  );
}
