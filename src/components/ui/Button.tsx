"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "ghost" | "outline" | "text";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
  external?: boolean;
}

/**
 * Premium button with GSAP magnetic + CSS wipe fill animation.
 *
 * Variants:
 * - primary  → white bg, black text — fills black on hover
 * - ghost    → transparent, white border/text — fills white on hover
 * - outline  → transparent, black border/text — fills black on hover
 * - text     → no border — just animated underline arrow
 */
export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
  external = false,
}: ButtonProps) {
  const wrapRef = useRef<HTMLElement | null>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  // GSAP magnetic on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) * 0.22;
    const dy = (e.clientY - rect.top  - rect.height / 2) * 0.22;
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(wrapRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    gsap.to(fillRef.current, { x: "-101%", duration: 0.4, ease: "power2.in" });
  };

  const handleMouseEnter = () => {
    gsap.to(fillRef.current, { x: "0%", duration: 0.45, ease: "power2.out" });
  };

  // ── Style config per variant ───────────────────────────────────
  const styles: Record<ButtonVariant, {
    wrapper: React.CSSProperties;
    fill: string;
    textHover: string;
  }> = {
    primary: {
      wrapper: {
        background: "white",
        color: "black",
        border: "1px solid white",
      },
      fill: "black",
      textHover: "text-white",
    },
    ghost: {
      wrapper: {
        background: "transparent",
        color: "white",
        border: "1px solid rgba(255,255,255,0.3)",
      },
      fill: "white",
      textHover: "text-black",
    },
    outline: {
      wrapper: {
        background: "transparent",
        color: "black",
        border: "1px solid rgba(10,10,10,0.3)",
      },
      fill: "black",
      textHover: "text-white",
    },
    text: {
      wrapper: {
        background: "transparent",
        color: "inherit",
        border: "none",
        padding: "0",
      },
      fill: "transparent",
      textHover: "",
    },
  };

  const s = styles[variant];

  const inner = (
    <span
      style={{
        ...s.wrapper,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: variant === "text" ? "0" : "0.9rem 2.2rem",
        fontFamily: "DM Sans, sans-serif",
        fontSize: "0.7rem",
        fontWeight: 400,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        overflow: "hidden",
        cursor: "none",
        userSelect: "none",
        transition: "border-color 0.35s",
        verticalAlign: "middle",
      }}
    >
      {/* Wipe fill */}
      <span
        ref={fillRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: s.fill,
          transform: "translateX(-101%)",
          zIndex: 0,
          willChange: "transform",
        }}
      />

      {/* Label */}
      <span
        className={cn("relative z-10 transition-colors duration-300", s.textHover && `group-hover:${s.textHover}`)}
        style={{ position: "relative", zIndex: 1 }}
      >
        {children}
      </span>

      {/* Animated arrow */}
      <ArrowIcon />
    </span>
  );

  const sharedProps = {
    ref: (el: any) => { wrapRef.current = el; },
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    "aria-label": ariaLabel,
    className: cn("group inline-block", className),
    style: { display: "inline-block" } as React.CSSProperties,
  };

  if (href) {
    return (
      <Link
        href={href}
        {...sharedProps}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...sharedProps}
    >
      {inner}
    </button>
  );
}

// ── Micro-animated arrow ────────────────────────────────────────
function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        position: "relative",
        zIndex: 1,
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
      className="group-hover:translate-x-1"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
