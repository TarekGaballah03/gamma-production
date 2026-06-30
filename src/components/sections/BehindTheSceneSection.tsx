"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/ui/RevealText";
import type { BehindTheSceneData } from "@/types";

interface BehindTheSceneSectionProps {
  data: BehindTheSceneData | null;
}

/** Convert any YouTube / Vimeo watch URL to an embed URL */
function toEmbedUrl(url: string): string {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`;
  }
  return url;
}

const FALLBACK: BehindTheSceneData = {
  eyebrow: "Behind the Scene",
  headline: "The Making Of",
  subheadline: "Go behind the lens — explore the raw moments, creative process and energy that bring every production to life.",
  videos: [],
};

export function BehindTheSceneSection({ data }: BehindTheSceneSectionProps) {
  const d = data ?? FALLBACK;
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = cardsRef.current?.querySelectorAll(".bts-card");
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
  }, [d.videos]);

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
            {d.eyebrow}
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
              {d.headline}
            </span>
          </RevealText>

          {d.subheadline && (
            <RevealText tag="p" delay={0.2}>
              <span
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)",
                  lineHeight: 1.7,
                  color: "var(--color-grey-400)",
                  maxWidth: "420px",
                  display: "block",
                }}
              >
                {d.subheadline}
              </span>
            </RevealText>
          )}
        </div>

        {/* Divider */}
        <div className="rule" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }} />

        {/* Videos grid */}
        {d.videos.length > 0 ? (
          <div
            ref={cardsRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 560px), 1fr))",
              gap: "clamp(2.5rem, 4vw, 4rem)",
            }}
          >
            {d.videos.map((video) => (
              <div
                key={video._key}
                className="bts-card"
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >
                {/* Video frame */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    overflow: "hidden",
                    borderRadius: "2px",
                    background: "var(--color-grey-800)",
                  }}
                >
                  <iframe
                    src={toEmbedUrl(video.videoUrl)}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div>
                  <h3
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "clamp(1.3rem, 2vw, 1.75rem)",
                      fontWeight: 400,
                      lineHeight: 1.2,
                      color: "white",
                      marginBottom: video.description ? "0.5rem" : 0,
                    }}
                  >
                    {video.title}
                  </h3>
                  {video.description && (
                    <p
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.875rem",
                        lineHeight: 1.65,
                        color: "var(--color-grey-400)",
                      }}
                    >
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state — shown until content is added in Sanity */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 560px), 1fr))",
              gap: "clamp(2.5rem, 4vw, 4rem)",
            }}
          >
            {[0, 1].map((i) => (
              <div key={i} className="bts-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div
                  style={{
                    aspectRatio: "16/9",
                    background: "var(--color-grey-800)",
                    borderRadius: "2px",
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
                    Add videos in Sanity Studio
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      height: "1.5rem",
                      width: i === 0 ? "60%" : "45%",
                      background: "var(--color-grey-800)",
                      borderRadius: "2px",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <div
                    style={{
                      height: "0.875rem",
                      width: "80%",
                      background: "var(--color-grey-800)",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
