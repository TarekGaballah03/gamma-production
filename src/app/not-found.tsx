import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Gamma Production",
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        background: "var(--color-black)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* Large 404 */}
      <p
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(8rem, 20vw, 18rem)",
          fontWeight: 300,
          lineHeight: 1,
          color: "var(--color-grey-800)",
          letterSpacing: "-0.04em",
          userSelect: "none",
        }}
        aria-hidden="true"
      >
        404
      </p>

      <div style={{ marginTop: "-2rem" }}>
        <h1
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(1.5rem, 4vw, 3rem)",
            fontWeight: 300,
            color: "var(--color-white)",
            marginBottom: "1rem",
          }}
        >
          Page not found.
        </h1>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "1rem",
            color: "var(--color-grey-400)",
            marginBottom: "3rem",
          }}
        >
          This page doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-white)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "1rem 2.5rem",
            display: "inline-block",
            transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
          className="hover:bg-white hover:text-black hover:border-white"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
