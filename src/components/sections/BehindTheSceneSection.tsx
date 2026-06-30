"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/ui/RevealText";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";
import type { BtsItem } from "@/types";

interface BehindTheSceneSectionProps {
  items: BtsItem[];
}

const AUTO_SLIDE_INTERVAL = 5000; // ms between auto-advances

// ─── Single BTS video card ────────────────────────────────────────
function BtsVideoCard({
  item,
  isActive = true,
}: {
  item: BtsItem;
  isActive?: boolean;
}) {
  // useVideoAutoplay handles Safari muted/playsInline imperatively
  const videoRef = useVideoAutoplay<HTMLVideoElement>({
    rootMargin: "200px",
    threshold: 0.1,
    pauseOnLeave: true,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          background: "var(--color-grey-800)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {item.videoUrl ? (
          <video
            ref={videoRef}
            src={item.videoUrl}
            poster={item.thumbnailUrl}
            aria-label={item.title}
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              border: "none",
              outline: "none",
            }}
          />
        ) : item.thumbnailUrl ? (
          // No video yet — show thumbnail
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-grey-600)",
              }}
            >
              Upload video in Sanity Studio
            </span>
          </div>
        )}
      </div>

      <h3
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
          fontWeight: 400,
          lineHeight: 1.2,
          color: "white",
        }}
      >
        {item.title}
      </h3>
    </div>
  );
}

// ─── Desktop GSAP Carousel ────────────────────────────────────────
function DesktopCarousel({ items }: { items: BtsItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const next = (index + items.length) % items.length;
      setActiveIndex(next);

      if (!trackRef.current) return;
      const cards = trackRef.current.querySelectorAll<HTMLElement>(".bts-card");
      // Slide track: each card takes 65vw + 2rem gap
      const offset = next * (trackRef.current.getBoundingClientRect().width * 0.68 + 32);
      gsap.to(trackRef.current, {
        x: -offset,
        duration: 0.75,
        ease: "power3.inOut",
      });
    },
    [items.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo]);

  if (items.length === 0) return null;

  return (
    <div
      style={{ position: "relative" }}
      role="region"
      aria-label="Behind the scenes carousel"
    >
      {/* Clip wrapper so overflow is hidden */}
      <div style={{ overflow: "hidden" }}>
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: "2rem",
            willChange: "transform",
          }}
        >
          {items.map((item, i) => (
            <div
              key={item._id}
              className="bts-card"
              onClick={() => goTo(i)}
              style={{
                flex: "0 0 65%",
                maxWidth: "65%",
                transition: "opacity 0.5s ease",
                opacity: i === activeIndex ? 1 : 0.4,
                cursor: i !== activeIndex ? "pointer" : "default",
              }}
            >
              <BtsVideoCard item={item} isActive={i === activeIndex} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {/* Prev button */}
        <button
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous video"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s, border-color 0.3s",
            flexShrink: 0,
          }}
          className="bts-nav-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next video"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s, border-color 0.3s",
            flexShrink: 0,
          }}
          className="bts-nav-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Counter */}
        <span
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "var(--color-grey-400)",
            marginLeft: "0.5rem",
          }}
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

// ─── Mobile carousel with dots + auto-slide ───────────────────────
function MobileCarousel({ items }: { items: BtsItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number, userInitiated = false) => {
      if (isAnimating) return;
      setIsAnimating(true);
      const next = (index + items.length) % items.length;
      setActiveIndex(next);
      if (userInitiated && intervalRef.current) {
        clearInterval(intervalRef.current);
        // Restart auto-slide after user interaction
        intervalRef.current = setInterval(() => {
          setActiveIndex((prev) => (prev + 1) % items.length);
        }, AUTO_SLIDE_INTERVAL);
      }
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating, items.length]
  );

  // Auto-slide
  useEffect(() => {
    if (items.length < 2) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [items.length]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      dx < 0 ? goTo(activeIndex + 1, true) : goTo(activeIndex - 1, true);
    }
  };

  if (!items.length) return null;

  return (
    <div>
      {/* Slides */}
      <div
        ref={containerRef}
        style={{ position: "relative", overflow: "hidden" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-live="polite"
        aria-atomic="true"
      >
        {items.map((item, i) => (
          <div
            key={item._id}
            aria-hidden={i !== activeIndex}
            style={{
              position: i === 0 ? "relative" : "absolute",
              inset: i === 0 ? undefined : 0,
              opacity: i === activeIndex ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: i === activeIndex ? "auto" : "none",
            }}
          >
            <BtsVideoCard item={item} isActive={i === activeIndex} />
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {items.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1.5rem",
          }}
          role="tablist"
          aria-label="Video pagination"
        >
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to video ${i + 1}`}
              onClick={() => goTo(i, true)}
              style={{
                width: i === activeIndex ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === activeIndex
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Swipe hint */}
      <p
        style={{
          marginTop: "0.75rem",
          textAlign: "center",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: "var(--color-grey-600)",
          textTransform: "uppercase",
        }}
      >
        Swipe to explore
      </p>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 560px), 1fr))",
        gap: "clamp(2.5rem, 4vw, 4rem)",
      }}
    >
      {[0, 1].map((i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div
            style={{
              aspectRatio: "16/9",
              background: "var(--color-grey-800)",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-grey-600)",
              }}
            >
              Upload videos in Sanity Studio
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────
export function BehindTheSceneSection({ items }: BehindTheSceneSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <section
      id="behind"
      ref={sectionRef}
      className="section-dark"
      style={{
        padding: "clamp(4rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative accent circles */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "clamp(300px, 50vw, 700px)",
          height: "clamp(300px, 50vw, 700px)",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.03)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "clamp(200px, 35vw, 500px)",
          height: "clamp(200px, 35vw, 500px)",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-grey-400)",
            }}
          >
            Behind the Scene
          </span>
          <div className="rule" style={{ width: "40px" }} />
        </div>

        <div
          style={{
            marginBottom: "clamp(2.5rem, 5vw, 5rem)",
          }}
        >
          <RevealText tag="h2">
            <span
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(2.2rem, 5vw, 5rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                color: "white",
              }}
            >
              The Making Of
            </span>
          </RevealText>
        </div>

        {/* Divider */}
        <div className="rule" style={{ marginBottom: "clamp(2.5rem, 5vw, 5rem)" }} />

        {items.length > 0 ? (
          <>
            {/* Desktop GSAP carousel */}
            <div className="bts-desktop">
              <DesktopCarousel items={items} />
            </div>

            {/* Mobile fade carousel */}
            <div className="bts-mobile">
              <MobileCarousel items={items} />
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      <style>{`
        .bts-desktop { display: block; }
        .bts-mobile  { display: none; }

        @media (max-width: 767px) {
          .bts-desktop { display: none; }
          .bts-mobile  { display: block; }
        }

        /* Nav button hover */
        .bts-nav-btn:hover {
          background: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.5) !important;
        }
        .bts-nav-btn:focus-visible {
          outline: 2px solid rgba(255,255,255,0.8);
          outline-offset: 4px;
        }
      `}</style>
    </section>
  );
}
