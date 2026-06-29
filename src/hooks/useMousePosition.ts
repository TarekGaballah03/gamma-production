"use client";

import { useEffect, useRef } from "react";
import { type MouseEvent } from "react";

/**
 * Tracks mouse position and returns a ref for the current position.
 * Used by the custom cursor and magnetic button effects.
 */
export function useMousePosition() {
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: globalThis.MouseEvent) => {
      position.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}
