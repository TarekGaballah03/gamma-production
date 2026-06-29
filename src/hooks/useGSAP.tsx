"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

/**
 * Registers GSAP plugins globally and sets premium defaults.
 * Rendered once as a null component in root layout.
 * Must be "use client" — GSAP depends on window/document.
 */
export function GSAPInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    gsap.defaults({
      ease: "power3.out",
      duration: 0.9,
    });

    ScrollTrigger.defaults({
      toggleActions: "play none none none",
    });
  }, []);

  return null;
}
