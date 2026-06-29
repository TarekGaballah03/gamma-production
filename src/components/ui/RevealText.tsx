"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  trigger?: string | Element;
}

/**
 * Wraps text in a clip-path overflow container.
 * Text slides up into view when scrolled into viewport.
 */
export function RevealText({
  children,
  className = "",
  delay = 0,
  tag: Tag = "p",
  trigger,
}: RevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = textRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 1,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: trigger || containerRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [delay, trigger]);

  return (
    <div ref={containerRef} className={cn("overflow-clip", className)}>
      <Tag
        ref={(el) => {
          textRef.current = el as HTMLElement | null;
        }}
        style={{ display: "block", transform: "translateY(110%)", opacity: 0 }}
      >
        {children}
      </Tag>
    </div>
  );
}
