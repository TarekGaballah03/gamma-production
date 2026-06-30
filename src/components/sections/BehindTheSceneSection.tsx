"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/ui/RevealText";
import useEmblaCarousel from "embla-carousel-react";
import type { BtsItem } from "@/types";

interface BehindTheSceneSectionProps {
  items: BtsItem[];
}

/**
 * Renders a lazy-loading, auto-playing video element.
 * Video only starts playing (and loads) when intersecting the viewport.
 */
function BtsVideoPlayer({ videoUrl, thumbnailUrl, title }: { videoUrl: string; thumbnailUrl?: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    // Intersection Observer to lazy load the video
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            // Play video once in view
            if (videoRef.current) {
              videoRef.current.play().catch(() => {
                // Ignore autoplay failures (some browsers block it until interaction)
              });
            }
          } else {
            // Pause video when out of view to save resources
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { rootMargin: "200px" } // Start loading a bit before it enters the screen
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className="object-cover w-full h-full"
      src={inView ? videoUrl : undefined}
      poster={thumbnailUrl}
      title={title}
      autoPlay
      muted
      loop
      playsInline
      controls={false}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        outline: "none",
        border: "none",
        borderRadius: "4px", // Rounded corners as requested
      }}
    />
  );
}

export function BehindTheSceneSection({ items }: BehindTheSceneSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center", breakpoints: { "(min-width: 768px)": { active: false } } });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Only animate grid cards on desktop
    const cards = cardsRef.current?.querySelectorAll(".bts-desktop-card");
    if (!cards?.length) return;

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: (i % 2) * 0.12,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, [items]);

  return (
    <section
      id="behind"
      ref={sectionRef}
      className="section-dark"
      style={{
        padding: "clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle decorative accent */}
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
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
          }}
        >
          <RevealText tag="h2">
            <span
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
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
        <div className="rule" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }} />

        {items.length > 0 ? (
          <>
            {/* Desktop Grid View */}
            <div
              ref={cardsRef}
              className="hidden md:grid"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 560px), 1fr))",
                gap: "clamp(2.5rem, 4vw, 4rem)",
              }}
            >
              {items.map((item) => (
                <div key={item._id} className="bts-desktop-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16/9",
                      background: "var(--color-grey-800)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <BtsVideoPlayer videoUrl={item.videoUrl} thumbnailUrl={item.thumbnailUrl} title={item.title} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "clamp(1.3rem, 2vw, 1.75rem)",
                      fontWeight: 400,
                      lineHeight: 1.2,
                      color: "white",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Mobile Embla Slider View */}
            <div className="md:hidden">
              <div className="embla" ref={emblaRef} style={{ overflow: "hidden" }}>
                <div className="embla__container" style={{ display: "flex", touchAction: "pan-y" }}>
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="embla__slide"
                      style={{
                        flex: "0 0 90%", // Show 90% of a slide so the next one peeks
                        minWidth: 0,
                        paddingRight: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          aspectRatio: "16/9",
                          background: "var(--color-grey-800)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <BtsVideoPlayer videoUrl={item.videoUrl} thumbnailUrl={item.thumbnailUrl} title={item.title} />
                      </div>
                      <h3
                        style={{
                          fontFamily: "Cormorant Garamond, serif",
                          fontSize: "1.5rem",
                          fontWeight: 400,
                          lineHeight: 1.2,
                          color: "white",
                        }}
                      >
                        {item.title}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  marginTop: "1.5rem",
                  textAlign: "center",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "var(--color-grey-600)",
                  textTransform: "uppercase"
                }}
              >
                Swipe to view more
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
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
        )}
      </div>
    </section>
  );
}
