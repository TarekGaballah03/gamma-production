"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface PreloaderProps {
  onComplete: () => void;
}

/**
 * Full-screen brand preloader.
 * Animates the Gamma logo, counts to 100%, then wipes off-screen.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const logo = logoRef.current;
    const counter = counterRef.current;
    const panel = panelRef.current;
    if (!preloader || !logo || !counter || !panel) return;

    // Lock scroll during preload
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete();
      },
    });

    // Animate counter
    const counterObj = { value: 0 };
    tl.to(counterObj, {
      value: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        setCount(Math.round(counterObj.value));
      },
    });

    // Logo fade in
    tl.fromTo(
      logo,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
      "-=1.5"
    );

    // Hold briefly, then wipe out
    tl.to({}, { duration: 0.3 });

    // Split-panel exit: top and bottom panels slide away
    tl.to(panel, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
    });

    tl.set(preloader, { display: "none" });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div ref={preloaderRef} className="preloader" role="status" aria-label="Loading Gamma Production">
      {/* Sliding panel */}
      <div ref={panelRef} className="absolute inset-0 bg-[#0a0a0a] z-10 flex items-center justify-center flex-col">
        {/* Logo SVG */}
        <svg
          ref={logoRef}
          viewBox="0 0 200 220"
          width="120"
          height="130"
          aria-hidden="true"
          style={{ opacity: 0 }}
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized 'g' letterform */}
          <text
            x="10"
            y="170"
            fontFamily="Cormorant Garamond, Georgia, serif"
            fontSize="180"
            fontWeight="400"
            fill="white"
          >
            g
          </text>
          {/* Grape cluster dots */}
          <circle cx="148" cy="68" r="7" fill="white" />
          <circle cx="162" cy="56" r="5.5" fill="white" />
          <circle cx="158" cy="72" r="5.5" fill="white" />
        </svg>

        {/* Counter */}
        <div className="preloader-counter" aria-live="polite">
          <span ref={counterRef}>{count}</span>
          <span>%</span>
        </div>

        {/* Company name */}
        <p
          className="preloader-brand"
          style={{
            position: "absolute",
            bottom: "3rem",
            left: "3rem",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--color-grey-400)",
          }}
        >
          Gamma Production — Est. 2023
        </p>
      </div>
    </div>
  );
}
