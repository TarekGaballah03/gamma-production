"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/ui/RevealText";
import type { ServicesData } from "@/types";
import { cn } from "@/lib/utils";

interface ServicesSectionProps {
  data: ServicesData | null;
}

const FALLBACK: ServicesData = {
  eyebrow: "What We Do",
  headline: "Our Services",
  items: [
    { _key: "1", number: "01", title: "Videography", description: "From cinematic brand films to engaging social campaigns, we handle all aspects of video production with a focus on storytelling.", tags: ["Brand Films", "Commercials", "Social", "Documentary"] },
    { _key: "2", number: "02", title: "Photography", description: "Editorial, commercial, and lifestyle photography that captures the essence of your brand with a distinct aesthetic.", tags: ["Editorial", "Commercial", "Lifestyle", "Product"] },
    { _key: "3", number: "03", title: "Graphic Design", description: "Visual identity, print materials, and digital assets crafted with precision and an eye for modern design principles.", tags: ["Identity", "Print", "Digital", "Packaging"] },
    { _key: "4", number: "04", title: "Creative Content", description: "End-to-end content creation tailored for modern platforms, designed to engage and convert your target audience.", tags: ["Social Content", "Campaigns", "Strategy", "Copywriting"] },
    { _key: "5", number: "05", title: "Moderation", description: "Community management and moderation services to ensure your brand's digital spaces remain active, safe, and aligned with your voice.", tags: ["Community", "Social Listening", "Engagement", "Crisis Management"] },
  ],
};

export function ServicesSection({ data }: ServicesSectionProps) {
  const d = data ?? FALLBACK;
  const sectionRef = useRef<HTMLElement>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const items = sectionRef.current?.querySelectorAll(".service-row");
    if (!items?.length) return;

    gsap.fromTo(
      items,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="section-dark"
      style={{ padding: "clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "clamp(3rem, 6vw, 6rem)",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div>
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

            <RevealText tag="h2">
              <span
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {d.headline}
              </span>
            </RevealText>
          </div>
        </div>

        {/* Services List (Accordion style on hover) */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          {d.items.map((item, i) => {
            const isActive = activeItem === item._key;

            return (
              <div
                key={item._key}
                className="service-row group"
                onMouseEnter={() => setActiveItem(item._key)}
                onMouseLeave={() => setActiveItem(null)}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  padding: "clamp(2rem, 4vw, 3rem) 0",
                  cursor: "pointer",
                  transition: "background-color 0.4s",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: "clamp(2rem, 5vw, 5rem)",
                    alignItems: "flex-start",
                  }}
                  className="service-grid"
                >
                  <span
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.85rem",
                      color: "var(--color-grey-400)",
                      transition: "color 0.4s",
                    }}
                    className={cn(isActive && "text-white")}
                  >
                    {item.number}
                  </span>

                  <div>
                    <h3
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: "clamp(2rem, 4vw, 3.5rem)",
                        fontWeight: 300,
                        lineHeight: 1.1,
                        letterSpacing: "-0.01em",
                        margin: 0,
                        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s",
                        transformOrigin: "left",
                      }}
                      className={cn(isActive ? "translate-x-4 opacity-100" : "opacity-70")}
                    >
                      {item.title}
                    </h3>
                    
                    {/* Expandable Content */}
                    <div
                      className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        maxHeight: isActive ? "300px" : "0",
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      <div style={{ paddingTop: "2rem" }}>
                        <p
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
                            lineHeight: 1.7,
                            color: "var(--color-grey-400)",
                            maxWidth: "500px",
                            marginBottom: "1.5rem",
                          }}
                        >
                          {item.description}
                        </p>
                        
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                          {item.tags?.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontFamily: "DM Sans, sans-serif",
                                fontSize: "0.7rem",
                                letterSpacing: "0.05em",
                                padding: "0.4rem 1rem",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "40px",
                                color: "var(--color-white)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                      transform: isActive ? "rotate(-45deg)" : "rotate(0)",
                      backgroundColor: isActive ? "white" : "transparent",
                    }}
                    className="service-icon hidden md:flex"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isActive ? "black" : "white"}
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
          .service-grid {
            grid-template-columns: auto 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
