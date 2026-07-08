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
  const logoRef = useRef<HTMLImageElement>(null);
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

    // Logo: starts tiny and grows continuously during loading
    tl.fromTo(
      logo,
      { opacity: 0, scale: 0.12 },
      { opacity: 1, scale: 1, duration: 1.8, ease: "power2.inOut" },
      "<"
    );

    // Brief hold at 100%
    tl.to({}, { duration: 0.15 });

    // Logo explodes: keeps scaling up massively and fades out
    tl.to(logo, {
      scale: 8,
      opacity: 0,
      duration: 0.7,
      ease: "power3.in",
    });

    // Panel wipes away (overlaps slightly with logo explosion)
    tl.to(
      panel,
      {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
      },
      "-=0.35"
    );

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
        <img
          ref={logoRef}
          src="/logo.PNG"
          alt="Gamma Production Logo"
          width="120"
          height="130"
          aria-hidden="true"
          style={{ opacity: 0, objectFit: "contain" }}
        />

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
