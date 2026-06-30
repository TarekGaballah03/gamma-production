"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/ui/RevealText";
import { ProjectMediaDisplay } from "@/components/ui/ProjectMediaDisplay";
import type { Project } from "@/types";

interface WorkSectionProps {
  projects: Project[];
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

  /** Aspect ratio based on media type and featured status */
  const getAspectRatio = (project: Project): string => {
    if (project.mediaType === "video") return "16/9";
    if (project.featured) return "4/3";
    return "3/4";
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="section-light"
      style={{ padding: "clamp(4rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem)" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "clamp(2rem, 4vw, 4rem)",
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
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
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
        <div className="work-grid">
          {projects.map((project, idx) => {
            const isHovered = hoveredProject === project._id;
            const isOdd = idx % 2 !== 0;
            const aspectRatio = getAspectRatio(project);

            return (
              <div
                key={project._id}
                className={`project-card group ${isOdd ? "work-card-offset" : ""}`}
                style={{ willChange: "transform" }}
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Media Wrapper */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio,
                    overflow: "hidden",
                    marginBottom: "1.25rem",
                    backgroundColor: "var(--color-grey-200)",
                  }}
                  className="work-media-wrap"
                >
                  {/* Scale wrapper for hover effect on image type only */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      transition:
                        project.mediaType !== "video"
                          ? "transform 0.8s cubic-bezier(0.16,1,0.3,1)"
                          : undefined,
                      transform:
                        project.mediaType !== "video" && isHovered
                          ? "scale(1.05)"
                          : "scale(1)",
                    }}
                  >
                    <ProjectMediaDisplay project={project} parallax={false} />
                  </div>

                  {/* Hover overlay (image/gallery only) */}
                  {project.mediaType !== "video" && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(10,10,10,0.2)",
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.6s ease",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />
                  )}
                </div>

                {/* Info */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                        fontWeight: 400,
                        lineHeight: 1.2,
                        color: "var(--color-black)",
                        marginBottom: "0.25rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.75rem",
                        color: "var(--color-grey-600)",
                      }}
                    >
                      {project.client
                        ? `${project.client} — `
                        : ""}
                      {project.category}
                      {project.year ? ` — ${project.year}` : ""}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "1px solid var(--color-black)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                      backgroundColor: isHovered
                        ? "var(--color-black)"
                        : "transparent",
                      color: isHovered
                        ? "var(--color-white)"
                        : "var(--color-black)",
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
                      aria-hidden="true"
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
        /* Desktop: 2-col grid with stagger offset */
        .work-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 480px), 1fr));
          gap: clamp(3rem, 5vw, 6rem) clamp(2rem, 4vw, 4rem);
        }
        @media (min-width: 768px) {
          .work-card-offset {
            margin-top: clamp(0px, 10vw, 8rem);
          }
        }
        /* Gallery arrows: show on hover */
        .work-media-wrap:hover .gallery-arrow {
          opacity: 1 !important;
        }
        /* Mobile: single column, no offset */
        @media (max-width: 767px) {
          .work-grid {
            grid-template-columns: 1fr;
            gap: clamp(2.5rem, 6vw, 4rem);
          }
          .work-card-offset {
            margin-top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
