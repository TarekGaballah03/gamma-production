"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { SanityImage, Project } from "@/types";

interface ProjectMediaDisplayProps {
  project: Project;
  /** Whether to apply a parallax scroll effect (only on image type) */
  parallax?: boolean;
  /** Extra className on the outer wrapper */
  className?: string;
  /** Whether this is a priority image (above-the-fold) */
  priority?: boolean;
}

// ─── Native video (autoplay, muted, loop, playsInline) ──────────
function VideoMedia({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  const ref = useVideoAutoplay<HTMLVideoElement>({ rootMargin: "200px", threshold: 0.1 });

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      title={title}
      aria-label={title}
      muted
      playsInline
      autoPlay
      loop
      preload="metadata"
      // No controls — design requirement
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        border: "none",
        outline: "none",
      }}
    />
  );
}

// ─── Image gallery slider (fade + slide fallback) ────────────────
function GalleryMedia({
  images,
  title,
}: {
  images: SanityImage[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number>(0);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || images.length < 2) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((index + images.length) % images.length);
        setIsTransitioning(false);
      }, 300);
    },
    [isTransitioning, images.length]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Auto-slide every 3.5 s
  useEffect(() => {
    if (images.length < 2) return;
    intervalRef.current = setInterval(next, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next, images.length]);

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  // Touch / swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      dx < 0 ? next() : prev();
    }
  };

  if (!images.length) return null;

  return (
    <div
      style={{ position: "absolute", inset: 0 }}
      role="region"
      aria-label={`${title} gallery`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((img, i) => {
        const src = img.asset?._ref
          ? urlFor(img).width(1200).quality(85).url()
          : null;
        if (!src) return null;

        const isActive = i === activeIndex;

        return (
          <div
            key={i}
            aria-hidden={!isActive}
            style={{
              position: "absolute",
              inset: 0,
              opacity: isActive && !isTransitioning ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            <Image
              src={src}
              alt={img.alt ?? `${title} — image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        );
      })}

      {/* Pagination dots */}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "0.75rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.4rem",
            zIndex: 2,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (intervalRef.current) clearInterval(intervalRef.current);
                goTo(i);
              }}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === activeIndex}
              style={{
                width: i === activeIndex ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: "rgba(255,255,255,0.9)",
                opacity: i === activeIndex ? 1 : 0.4,
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s ease, opacity 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Prev / Next arrows (hidden on touch devices via pointer media query in CSS) */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (intervalRef.current) clearInterval(intervalRef.current);
              prev();
            }}
            aria-label="Previous image"
            className="gallery-arrow gallery-arrow-prev"
            style={{
              position: "absolute",
              left: "0.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(4px)",
              border: "none",
              color: "white",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (intervalRef.current) clearInterval(intervalRef.current);
              next();
            }}
            aria-label="Next image"
            className="gallery-arrow gallery-arrow-next"
            style={{
              position: "absolute",
              right: "0.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(4px)",
              border: "none",
              color: "white",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Gallery badge */}
      <div
        style={{
          position: "absolute",
          top: "0.75rem",
          left: "0.75rem",
          background: "rgba(10,10,10,0.65)",
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
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────

/**
 * Unified project media renderer.
 *
 * - mediaType == "image"   → single parallax image (or static if parallax=false)
 * - mediaType == "gallery" → autoplay fade slider with swipe/keyboard support
 * - mediaType == "video"   → native HTML5 video, autoplay, muted, loop, no controls
 *
 * All three cases use ONE component — no separate sections.
 */
export function ProjectMediaDisplay({
  project,
  parallax = true,
  priority = false,
}: ProjectMediaDisplayProps) {
  const { mediaType, coverImage, galleryImages, videoUrl, title } = project;

  // ── Video ──────────────────────────────────────────────────────
  if (mediaType === "video" && videoUrl) {
    const posterUrl = coverImage?.asset?._ref
      ? urlFor(coverImage).width(800).quality(70).url()
      : undefined;

    return (
      <>
        <VideoMedia src={videoUrl} poster={posterUrl} title={title} />
        {/* Video badge */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            background: "rgba(10,10,10,0.65)",
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
      </>
    );
  }

  // ── Gallery ────────────────────────────────────────────────────
  if (mediaType === "gallery" && galleryImages?.length) {
    return <GalleryMedia images={galleryImages} title={title} />;
  }

  // ── Image (default) ────────────────────────────────────────────
  if (coverImage?.asset?._ref) {
    if (parallax) {
      return (
        <ParallaxImage
          image={coverImage}
          alt={coverImage.alt ?? title}
          className="w-full h-full"
          strength={8}
          priority={priority}
        />
      );
    }
    const src = urlFor(coverImage).width(1200).quality(85).url();
    return (
      <Image
        src={src}
        alt={coverImage.alt ?? title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: "cover" }}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  // ── Empty state ────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--color-grey-100)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="var(--color-grey-400)"
        strokeWidth="1"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}
