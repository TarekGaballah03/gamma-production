"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

const NAV_LINKS = [
  { href: "#about",    label: "About",    shortLabel: "About",    num: "01" },
  { href: "#work",     label: "Work",     shortLabel: "Work",     num: "02" },
  { href: "#services", label: "Services", shortLabel: "Services", num: "03" },
  { href: "#behind",   label: "Behind the Scene", shortLabel: "BTS", num: "04" },
  { href: "#contact",  label: "Contact",  shortLabel: "Contact",  num: "05" },
];

/** Smooth scroll to a hash section using GSAP ScrollTo */
function scrollToSection(href: string, onDone?: () => void) {
  const target = document.querySelector(href);
  if (!target) return;

  gsap.registerPlugin(ScrollToPlugin);
  gsap.to(window, {
    duration: 1.1,
    scrollTo: { y: target, offsetY: 70 },
    ease: "power3.inOut",
    onComplete: onDone,
  });
}

// ─── Logo Image ──────────────────────────────────────────────────
function GammaLogo({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/logo.PNG"
      alt="Gamma Production Logo"
      width={size * 1.5}
      style={{
        objectFit: "contain",
        display: "block"
      }}
    />
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

  /** Handle anchor clicks with smooth scroll */
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      closeMenu();
      // Small delay when closing mobile menu so animation can start
      const delay = menuOpen ? 700 : 0;
      setTimeout(() => scrollToSection(href), delay);
    }
  };

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
          <GammaLogo size={42} />
        </Link>

        {/* ── Desktop nav ─────────────────────────────────────── */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex"
          style={{ alignItems: "center", gap: "clamp(1.5rem, 2.5vw, 3rem)" }}
        >
          {NAV_LINKS.map(({ href, shortLabel, num }) => (
            <NavLink
              key={href}
              href={href}
              label={shortLabel}
              num={num}
              onClick={handleAnchorClick}
            />
          ))}
        </nav>

        {/* ── CTA + hamburger row ─────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Desktop CTA */}
          <a
            href="#contact"
            onClick={(e) => handleAnchorClick(e, "#contact")}
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
              Let&apos;s Talk
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
              cursor: "pointer",
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
                onClick={(e) => handleAnchorClick(e, href)}
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
                    fontSize: "clamp(2.5rem, 8vw, 5rem)",
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
          onClick={(e) => handleAnchorClick(e, "#contact")}
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
          Let&apos;s Talk →
        </a>
      </div>
    </>
  );
}

// ── Desktop nav link with animated underline ────────────────────
function NavLink({
  href,
  label,
  num,
  onClick,
}: {
  href: string;
  label: string;
  num: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
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
      onClick={(e) => onClick(e, href)}
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
