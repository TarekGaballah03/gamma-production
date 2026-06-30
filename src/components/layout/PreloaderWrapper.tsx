"use client";

import { useState } from "react";
import { Preloader } from "@/components/layout/Preloader";

/**
 * Client-side wrapper for the Preloader.
 * Placed in the Server Component page.tsx so the preloader can be
 * rendered client-side without making the entire page a client component.
 *
 * When the preloader completes it unmounts itself cleanly.
 */
export function PreloaderWrapper() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return <Preloader onComplete={() => setVisible(false)} />;
}
