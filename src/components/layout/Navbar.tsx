"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NAV_LINKS = [
  { href: "#about",    label: "About",    num: "01" },
  { href: "#services", label: "Services", num: "02" },
  { href: "#work",     label: "Work",     num: "03" },
  { href: "#contact",  label: "Contact",  num: "04" },
];

// ─── Logo mark SVG (inline for crisp blend-mode rendering) ──────
function GammaLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 120 145"
      width={size}
      height={size * 1.2}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Stylised lowercase g */}
      <text
        x="-4"
        y="118"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="128"
        fontWeight="300"
        fill="currentColor"
      >
        g
      </text>
      {/* Grape cluster — three dots */}
      <circle cx="96" cy="30" r="6.5" fill="currentColor" />
      <circle cx="108" cy="18" r="5"   fill="currentColor" />
      <circle cx="105" cy="34" r="5"   fill="currentColor" />
    </svg>
  );
}

// ─── Wordmark beside the logo mark ─────────────────────────────
function GammaWordmark() {
  return (
    <span
      style={{
        display: "flex",
        flexDirection: "column",
        lineHeight: 1.1,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontSize: "0.6rem",
        fontFamily: "DM Sans, sans-serif",
        fontWeight: 400,
        color: "currentColor",
      }}
    >
      <span>Gamma</span>
      <span style={{ opacity: 0.6 }}>Production</span>
    </span>
  );
}

export function Navbar() {
  const navRef       = useRef<HTMLElement>(null);
  const menuRef      = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLUListElement>(null);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [hidden,   setHidden]     = useState(false);
  const prevY = useRef(0);

  // ── Initial reveal (after preloader ~2.2 s) ────────────────────
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.fromTo(
      nav,
      { yPercent: -110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 2.2 }
    );
  }, []);

  // ── Scroll hide / show ─────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const nav = navRef.current;
    if (!nav) return;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      if (y > prevY.current && y > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      prevY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.to(nav, {
      yPercent: hidden ? -110 : 0,
      duration: 0.55,
      ease: hidden ? "power2.inOut" : "power3.out",
    });
  }, [hidden]);

  // ── Mobile menu open / close ───────────────────────────────────
  useEffect(() => {
    const menu  = menuRef.current;
    const links = menuLinksRef.current?.children;
    if (!menu) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";

      gsap.set(menu, { display: "flex" });
      gsap.fromTo(
        menu,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.75, ease: "power4.inOut" }
      );

      if (links) {
        gsap.fromTo(
          links,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.09,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.3,
          }
        );
      }
    } else {
      document.body.style.overflow = "";

      gsap.to(menu, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "power4.inOut",
        onComplete: () => gsap.set(menu, { display: "none" }),
      });
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ── Main bar ──────────────────────────────────────────── */}
      <header
        ref={navRef}
        role="banner"
        style={{
          position: "fixed",
          inset: "0 0 auto",
          zIndex: 9000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.4rem clamp(1.5rem, 4vw, 4rem)",
          // Subtle border on scroll
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid transparent",
          // Very light blur on scroll for readability
          backdropFilter: scrolled ? "blur(12px)" : "none",
          backgroundColor: scrolled
            ? "rgba(10,10,10,0.55)"
            : "transparent",
          transition:
            "border-color 0.4s ease, backdrop-filter 0.4s ease, background-color 0.4s ease",
          willChange: "transform",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Gamma Production — Home"
          onClick={closeMenu}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "white",
            textDecoration: "none",
            transition: "opacity 0.3s",
          }}
          className="hover:opacity-70"
        >
          <GammaLogo size={32} />
          <GammaWordmark />
        </Link>

        {/* ── Desktop nav ─────────────────────────────────────── */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex"
          style={{ alignItems: "center", gap: "clamp(2rem, 3.5vw, 3.5rem)" }}
        >
          {NAV_LINKS.map(({ href, label, num }) => (
            <NavLink key={href} href={href} label={label} num={num} />
          ))}
        </nav>

        {/* ── CTA + hamburger row ─────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden md:inline-flex group"
            aria-label="Get in touch"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "white",
              padding: "0.65rem 1.6rem",
              border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: "999px",
              textDecoration: "none",
              position: "relative",
              overflow: "hidden",
              transition: "border-color 0.35s",
            }}
          >
            {/* Fill slide */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "white",
                transform: "translateX(-101%)",
                transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                zIndex: 0,
              }}
              className="group-hover:translate-x-0"
            />
            <span
              style={{
                position: "relative",
                zIndex: 1,
                transition: "color 0.4s",
              }}
              className="group-hover:text-black"
            >
              Let's Talk
            </span>
          </a>

          {/* Hamburger */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden"
            style={{
              background: "none",
              border: "none",
              cursor: "none",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              width: "30px",
            }}
          >
            <span
              style={{
                display: "block",
                height: "1px",
                background: "white",
                width: "100%",
                transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s",
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                height: "1px",
                background: "white",
                width: "62%",
                transition: "opacity 0.25s, width 0.35s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                height: "1px",
                background: "white",
                width: "100%",
                transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* ── Mobile fullscreen overlay ─────────────────────────── */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          zIndex: 8000,
          background: "var(--color-black)",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)",
          clipPath: "inset(0 0 100% 0)",
        }}
      >
        {/* Nav links */}
        <ul
          ref={menuLinksRef}
          style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0" }}
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ href, label, num }) => (
            <li key={href} style={{ overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBlock: "1.25rem" }}>
              <a
                href={href}
                onClick={closeMenu}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1.5rem",
                  textDecoration: "none",
                  color: "white",
                }}
                className="group"
              >
                <span
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    color: "var(--color-grey-600)",
                    transition: "color 0.3s",
                  }}
                  className="group-hover:text-white"
                >
                  {num}
                </span>
                <span
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "clamp(3rem, 10vw, 5.5rem)",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    transition: "opacity 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  className="group-hover:opacity-70 group-hover:translate-x-2"
                >
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Bottom meta */}
        <p
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "clamp(1.5rem, 5vw, 4rem)",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-grey-600)",
          }}
        >
          Gamma Production — Est. 2023
        </p>

        {/* Mobile contact link */}
        <a
          href="#contact"
          onClick={closeMenu}
          style={{
            position: "absolute",
            bottom: "2.5rem",
            right: "clamp(1.5rem, 5vw, 4rem)",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "white",
            textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            paddingBottom: "2px",
          }}
        >
          Let's Talk →
        </a>
      </div>
    </>
  );
}

// ── Desktop nav link with animated underline ────────────────────
function NavLink({ href, label, num }: { href: string; label: string; num: string }) {
  const lineRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.35, ease: "power2.out" });
  };
  const onLeave = () => {
    gsap.to(lineRef.current, {
      scaleX: 0,
      duration: 0.3,
      ease: "power2.in",
      transformOrigin: "right center",
    });
  };

  return (
    <a
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        fontFamily: "DM Sans, sans-serif",
        fontSize: "0.72rem",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "white",
        textDecoration: "none",
        paddingBottom: "3px",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
      }}
      aria-label={label}
    >
      {/* Tiny counter */}
      <sup
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.5rem",
          color: "rgba(255,255,255,0.35)",
          verticalAlign: "super",
        }}
      >
        {num}
      </sup>
      {label}
      {/* Underline */}
      <span
        ref={lineRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "white",
          transform: "scaleX(0)",
          transformOrigin: "left center",
        }}
      />
    </a>
  );
}
