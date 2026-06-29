"use client";

/**
 * Sanity Studio embedded route — accessible at /studio
 *
 * "use client" is required because Sanity Studio is a fully
 * client-side React application with its own providers.
 * force-dynamic prevents any static caching of the studio shell.
 */
import { Suspense } from "react";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#101112",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "DM Sans, sans-serif",
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.8rem",
            letterSpacing: "0.15em",
          }}
        >
          Loading Studio…
        </div>
      }
    >
      <NextStudio config={config} />
    </Suspense>
  );
}
