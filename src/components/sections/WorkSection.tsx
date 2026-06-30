"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/ui/RevealText";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { Project } from "@/types";

interface WorkSectionProps {
  projects: Project[];
}

/** Convert any YouTube / Vimeo watch URL to an embed URL */
function toEmbedUrl(url: string): string {
  // YouTube: https://www.youtube.com/watch?v=ID  →  embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  }
  // Vimeo: https://vimeo.com/ID  →  player.vimeo.com/video/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`;
  }
  return url;
}

export function WorkSection({ projects }: WorkSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const projectCards = sectionRef.current?.querySelectorAll(".project-card");
    if (!projectCards?.length) return;

    projectCards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, [projects]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="section-light"
      style={{ padding: "clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "4rem",
          }}
        >
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-grey-600)",
            }}
          >
            Selected Works
          </span>
          <div className="rule" style={{ width: "40px" }} />
        </div>

        <RevealText tag="h2" className="mb-16">
          <span
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--color-black)",
            }}
          >
            Our Work
          </span>
        </RevealText>

        {/* Project Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 500px), 1fr))",
            gap: "clamp(3rem, 5vw, 6rem) clamp(2rem, 4vw, 4rem)",
          }}
        >
          {projects.map((project, idx) => {
            const isHovered = hoveredProject === project._id;
            const isVideo   = project.mediaType === "video" && !!project.videoUrl;
            
            // Layout variation: stagger odd items down slightly on desktop
            const isOdd = idx % 2 !== 0;
            const marginTop = isOdd ? "clamp(0px, 10vw, 8rem)" : "0px";

            return (
              <div
                key={project._id}
                className="project-card group"
                style={{ marginTop, willChange: "transform" }}
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Media Wrapper */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: isVideo ? "16/9" : project.featured ? "4/3" : "3/4",
                    overflow: "hidden",
                    marginBottom: "1.5rem",
                    backgroundColor: "var(--color-grey-200)",
                  }}
                >
                  {isVideo ? (
                    /* ── Video embed ── */
                    <iframe
                      src={toEmbedUrl(project.videoUrl!)}
                      title={project.title}
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
                  ) : (
                    /* ── Image ── */
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      {project.coverImage?.asset?._ref ? (
                        <ParallaxImage
                          image={project.coverImage}
                          alt={project.title}
                          className="w-full h-full"
                          strength={8}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#e5e1da]" />
                      )}
                    </div>
                  )}

                  {/* Overlay for hover (only on image cards) */}
                  {!isVideo && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(10,10,10,0.2)",
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.6s ease",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Video badge */}
                  {isVideo && (
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        left: "0.75rem",
                        background: "rgba(10,10,10,0.75)",
                        backdropFilter: "blur(6px)",
                        borderRadius: "999px",
                        padding: "0.25rem 0.75rem",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.6rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "white",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    >
                      Video
                    </div>
                  )}
                </div>

                {/* Info */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                        fontWeight: 400,
                        lineHeight: 1.2,
                        color: "var(--color-black)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.8rem",
                        color: "var(--color-grey-600)",
                      }}
                    >
                      {project.category} — {project.year}
                    </p>
                  </div>
                  
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "1px solid var(--color-black)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                      backgroundColor: isHovered ? "var(--color-black)" : "transparent",
                      color: isHovered ? "var(--color-white)" : "var(--color-black)",
                      transform: isHovered ? "rotate(-45deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .project-card {
            margin-top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
