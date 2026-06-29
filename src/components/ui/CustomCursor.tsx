"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Custom cursor: a small dot + a larger ring.
 * Uses mix-blend-mode: difference for the invert effect.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;

    // Dot follows cursor precisely
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0,
      });

      // Ring follows with lag
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.12,
        ease: "power2.out",
      });
    };

    // Hover state — expand ring, shrink dot
    const handleMouseEnter = () => {
      dot.classList.add("is-hovering");
      ring.classList.add("is-hovering");
    };

    const handleMouseLeave = () => {
      dot.classList.remove("is-hovering");
      ring.classList.remove("is-hovering");
    };

    // Apply hover effect to all interactive elements
    const interactables = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select, label[for]"
    );

    interactables.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
