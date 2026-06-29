/**
 * GSAP plugin registration.
 * Import this once at the app root — plugins are registered globally.
 * Client-side only (GSAP uses window/document).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export function registerGSAPPlugins(): void {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export { gsap, ScrollTrigger };
