"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PortableText } from "next-sanity";
import { RevealText } from "@/components/ui/RevealText";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { AboutData } from "@/types";

interface AboutSectionProps {
  data: AboutData | null;
}

const FALLBACK: AboutData = {
  eyebrow: "About",
  headline: "A studio built on craft, driven by vision.",
  body: [],
  stats: [
    { _key: "a", number: "200+", label: "Projects" },
    { _key: "b", number: "50+", label: "Clients" },
    { _key: "c", number: "3", label: "Years" },
  ],
  image: {
    _type: "image",
    asset: { _ref: "", _type: "reference" },
    alt: "Gamma Production studio",
  },
  signatureText: "Gamma Production Studio, Est. 2023",
};

export function AboutSection({ data }: AboutSectionProps) {
  const d = data ?? FALLBACK;
  const statsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate stats counting up
    const statNumbers = statsRef.current?.querySelectorAll(".stat-number");
    if (statNumbers?.length) {
      statNumbers.forEach((el) => {
        const target = parseFloat(el.getAttribute("data-value") ?? "0");
        const hasPlus = el.getAttribute("data-plus") === "true";

        const obj = { value: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              value: target,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent =
                  Math.round(obj.value) + (hasPlus ? "+" : "");
              },
            });
          },
        });
      });
    }
  }, []);

  // Parse stat numbers
  const parseStat = (num: string) => {
    const hasPlus = num.includes("+");
    const value = parseFloat(num.replace(/[^0-9.]/g, ""));
    return { value, hasPlus };
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-light"
      style={{ padding: "clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)" }}
      aria-label="About Gamma Production"
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Eyebrow */}
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
            {d.eyebrow}
          </span>
          <div className="rule" style={{ width: "40px" }} />
        </div>

        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(3rem, 6vw, 6rem)",
            alignItems: "start",
          }}
          className="about-grid"
        >
          {/* Left: text */}
          <div>
            <RevealText tag="h2" className="mb-10">
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
                {d.headline}
              </span>
            </RevealText>

            {/* Body text */}
            {d.body.length > 0 ? (
              <div
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
                  lineHeight: 1.8,
                  color: "var(--color-grey-600)",
                  marginBottom: "3rem",
                }}
              >
                <PortableText value={d.body} />
              </div>
            ) : (
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
                  lineHeight: 1.8,
                  color: "var(--color-grey-600)",
                  marginBottom: "3rem",
                  maxWidth: "500px",
                }}
              >
                Gamma Production is a creative studio established in 2023 with a clear mission: to produce visual work that doesn't just capture attention — it holds it. We blend technical expertise with artistic vision across every medium we touch.
              </p>
            )}

            {/* Stats */}
            <div
              ref={statsRef}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "2rem",
                paddingTop: "2rem",
                borderTop: "1px solid rgba(10,10,10,0.1)",
              }}
            >
              {(d.stats || []).map((stat) => {
                const { value, hasPlus } = parseStat(stat.number);
                return (
                  <div key={stat._key}>
                    <p
                      className="stat-number"
                      data-value={value}
                      data-plus={hasPlus}
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: "clamp(2rem, 4vw, 3.5rem)",
                        fontWeight: 300,
                        color: "var(--color-black)",
                        lineHeight: 1,
                      }}
                    >
                      0{hasPlus ? "+" : ""}
                    </p>
                    <p
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--color-grey-400)",
                        marginTop: "0.5rem",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Signature */}
            {d.signatureText && (
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1rem",
                  fontStyle: "italic",
                  color: "var(--color-grey-400)",
                  marginTop: "3rem",
                  letterSpacing: "0.02em",
                }}
              >
                — {d.signatureText}
              </p>
            )}
          </div>

          {/* Right: image */}
          {d.image?.asset?._ref ? (
            <ParallaxImage
              image={d.image}
              alt={d.image.alt ?? "Gamma Production"}
              className="w-full aspect-[3/4]"
              strength={12}
            />
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "3/4",
                background: "var(--color-grey-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                viewBox="0 0 120 140"
                width="80"
                fill="var(--color-grey-200)"
                aria-hidden="true"
              >
                <text
                  x="0"
                  y="118"
                  fontFamily="Cormorant Garamond, serif"
                  fontSize="120"
                  fontWeight="400"
                >
                  g
                </text>
                <circle cx="98" cy="35" r="8" />
                <circle cx="110" cy="22" r="6" />
                <circle cx="107" cy="40" r="6" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
