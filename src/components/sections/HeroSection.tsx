"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import type { HeroData } from "@/types";
import { splitWords } from "@/lib/utils";

interface HeroSectionProps {
  data: HeroData | null;
}

const FALLBACK: HeroData = {
  headlineTop: "We craft",
  headlineBottom: "bold stories.",
  subheadline: "A creative production studio specialising in videography, photography, graphic design, and content creation.",
  ctaLabel: "View Our Work",
  ctaLink: "#work",
};

/**
 * Hero Section — kinetic typography with GSAP word-split reveal.
 * Full viewport height. Dark background.
 */
export function HeroSection({ data }: HeroSectionProps) {
  const d = data ?? FALLBACK;
  const sectionRef = useRef<HTMLElement>(null);
  const headlineTopRef = useRef<HTMLDivElement>(null);
  const headlineBottomRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wordsTop = headlineTopRef.current?.querySelectorAll(".word");
    const wordsBottom = headlineBottomRef.current?.querySelectorAll(".word");

    const tl = gsap.timeline({ delay: 0.2 });

    // Eyebrow
    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Line
    tl.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
      "-=0.4"
    );

    // Top headline words
    if (wordsTop?.length) {
      tl.fromTo(
        wordsTop,
        { y: "120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.1,
          stagger: 0.1,
          ease: "power4.out",
        },
        "-=0.5"
      );
    }

    // Bottom headline words
    if (wordsBottom?.length) {
      tl.fromTo(
        wordsBottom,
        { y: "120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.1,
          stagger: 0.1,
          ease: "power4.out",
        },
        "-=0.9"
      );
    }

    // Sub
    tl.fromTo(
      subRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      "-=0.6"
    );

    // CTA
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    );

    // Scroll parallax on headline
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const y = self.progress * 120;
        const targets = [headlineTopRef.current, headlineBottomRef.current].filter(Boolean);
        if (targets.length) gsap.set(targets, { y: -y });
      },
    });
  }, []);

  const topWords = splitWords(d.headlineTop);
  const bottomWords = splitWords(d.headlineBottom);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="section-dark"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 clamp(1.5rem, 5vw, 5rem) clamp(3rem, 6vw, 5rem)",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Hero"
    >
      {/* Background grain is handled by global .grain class on body */}

      {/* Decorative year */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          right: "clamp(1.5rem, 4vw, 4rem)",
          transform: "translateY(-50%) rotate(90deg)",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.65rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--color-grey-600)",
          writingMode: "horizontal-tb",
        }}
      >
        Est. 2023
      </span>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "clamp(3rem, 6vw, 5rem)",
          right: "clamp(1.5rem, 4vw, 4rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "60px",
            background: "var(--color-grey-600)",
            animation: "scrollIndicator 2s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes scrollIndicator {
          0% { transform: scaleY(0); transform-origin: top; opacity: 0; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
      `}</style>

      {/* Content */}
      <div style={{ maxWidth: "1400px", width: "100%" }}>
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            opacity: 0,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            ref={lineRef}
            style={{
              height: "1px",
              width: "40px",
              background: "var(--color-grey-600)",
              transformOrigin: "left center",
            }}
          />
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-grey-400)",
            }}
          >
            Creative Production Studio
          </span>
        </div>

        {/* Top headline */}
        <div ref={headlineTopRef} className="overflow-clip" aria-hidden="true">
          <h1
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(2.5rem, 10vw, 10rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "white",
              display: "flex",
              gap: "0.25em",
              flexWrap: "wrap",
            }}
          >
            {topWords.map((word, i) => (
              <span
                key={i}
                className="word"
                style={{ display: "inline-block" }}
              >
                {word}
              </span>
            ))}
          </h1>
        </div>

        {/* Bottom headline */}
        <div ref={headlineBottomRef} className="overflow-clip">
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(2.5rem, 10vw, 10rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "white",
              display: "flex",
              gap: "0.25em",
              flexWrap: "wrap",
            }}
            aria-label={d.headlineBottom}
          >
            {bottomWords.map((word, i) => (
              <span
                key={i}
                className="word"
                style={{ display: "inline-block" }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Accessible full headline for screen readers */}
        <h1 className="sr-only">{d.headlineTop} {d.headlineBottom}</h1>

        {/* Sub + CTA row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "clamp(2rem, 4vw, 3.5rem)",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <p
            ref={subRef}
            style={{
              opacity: 0,
              fontFamily: "DM Sans, sans-serif",
              fontSize: "clamp(0.875rem, 1.5vw, 1.1rem)",
              lineHeight: 1.7,
              color: "var(--color-grey-400)",
              maxWidth: "480px",
            }}
          >
            {d.subheadline}
          </p>

          <div ref={ctaRef} style={{ opacity: 0 }}>
            <Button href={d.ctaLink} variant="ghost">
              {d.ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
