"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { SanityImage } from "@/types";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  image: SanityImage;
  alt: string;
  className?: string;
  strength?: number; // parallax offset in %
  priority?: boolean;
  width?: number;
  height?: number;
}

/**
 * Image with GSAP scroll-triggered parallax effect.
 * The image moves slower than the scroll speed, creating depth.
 */
export function ParallaxImage({
  image,
  alt,
  className = "",
  strength = 15,
  priority = false,
  width = 900,
  height = 1100,
}: ParallaxImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const src = urlFor(image).width(width * 2).quality(90).url();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    gsap.fromTo(
      img,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      }
    );
  }, [strength]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative overflow-hidden", className)}
      style={{ willChange: "transform" }}
    >
      <div ref={imgRef} style={{ scale: 1.15 + strength / 100 }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="img-cover"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
