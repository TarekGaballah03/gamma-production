"use client";

import { useEffect, useRef } from "react";

interface UseVideoAutoplayOptions {
  /**
   * Root margin for the IntersectionObserver.
   * Use positive values to start loading before the video enters the viewport.
   * Default: "0px"
   */
  rootMargin?: string;
  /**
   * Threshold at which the video is considered "in view".
   * Default: 0.25 (25% visible)
   */
  threshold?: number;
  /**
   * Whether to pause when the video leaves the viewport.
   * Default: true
   */
  pauseOnLeave?: boolean;
}

/**
 * Shared hook for video autoplay with IntersectionObserver.
 *
 * Handles:
 * - Lazy loading (src is always present; preload="metadata" avoids heavy network hit)
 * - Safari autoplay policy (requires muted + playsInline attributes — set on the element itself)
 * - Pause on leave / resume on enter
 * - Graceful error handling (DOMException from blocked autoplay is swallowed)
 *
 * Usage:
 *   const videoRef = useVideoAutoplay<HTMLVideoElement>();
 *   return <video ref={videoRef} src={url} muted playsInline autoPlay loop preload="metadata" />;
 */
export function useVideoAutoplay<T extends HTMLVideoElement = HTMLVideoElement>({
  rootMargin = "100px",
  threshold = 0.1,
  pauseOnLeave = true,
}: UseVideoAutoplayOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Safari requires these attributes to be set as DOM properties, not just React props
    video.muted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Resume / start play
            if (video.paused) {
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // Blocked by browser autoplay policy — safe to ignore
                });
              }
            }
          } else if (pauseOnLeave && !video.paused) {
            video.pause();
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [rootMargin, threshold, pauseOnLeave]);

  return ref;
}
