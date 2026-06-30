/**
 * Main page — Server Component.
 *
 * All Sanity data is fetched server-side via Promise.all for optimal performance:
 * - Content is in the initial HTML (better SEO, no loading flash)
 * - Next.js ISR revalidation (1-hour default, configurable per query)
 * - Preloader still works — it is a client component that mounts immediately
 *
 * Data falls back gracefully to built-in fallbacks in each section component
 * if Sanity is unreachable.
 */

import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeSection } from "@/components/sections/MarqueeSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { BehindTheSceneSection } from "@/components/sections/BehindTheSceneSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";
import { PreloaderWrapper } from "@/components/layout/PreloaderWrapper";
import type { HeroData, AboutData, ServicesData, Project, SiteSettings, BtsItem } from "@/types";
import { sanityFetch } from "@/sanity/client";
import { heroQuery, aboutQuery, servicesQuery, workQuery, settingsQuery, btsQuery } from "@/sanity/queries";

// ISR: revalidate every 60 seconds
export const revalidate = 60;

async function getPageData() {
  try {
    const [hero, about, services, work, settings, bts] = await Promise.all([
      sanityFetch<HeroData>(heroQuery).catch(() => null),
      sanityFetch<AboutData>(aboutQuery).catch(() => null),
      sanityFetch<ServicesData>(servicesQuery).catch(() => null),
      sanityFetch<Project[]>(workQuery).catch(() => [] as Project[]),
      sanityFetch<SiteSettings>(settingsQuery).catch(() => null),
      sanityFetch<BtsItem[]>(btsQuery).catch(() => [] as BtsItem[]),
    ]);
    return { hero, about, services, work, settings, bts };
  } catch {
    return {
      hero: null,
      about: null,
      services: null,
      work: [] as Project[],
      settings: null,
      bts: [] as BtsItem[],
    };
  }
}

export default async function Home() {
  const { hero, about, services, work, settings, bts } = await getPageData();

  const displayProjects = work.length > 0 ? work : DUMMY_PROJECTS;

  return (
    <>
      {/* Preloader runs client-side — does not block server rendering */}
      <PreloaderWrapper />

      <main id="main-content">
        <HeroSection data={hero} />
        <MarqueeSection />
        <AboutSection data={about} />
        <ServicesSection data={services} />
        <WorkSection projects={displayProjects} />
        <BehindTheSceneSection items={bts} />
        <ContactSection />
        <Footer settings={settings} />
      </main>
    </>
  );
}

// ─── Fallback project data (shown when Sanity has no projects yet) ──
const DUMMY_PROJECTS: Project[] = [
  {
    _id: "1",
    title: "Urban Echo",
    slug: { current: "urban-echo" },
    category: "Brand Films",
    year: 2024,
    description: "A cinematic exploration of modern street culture.",
    tags: ["Video", "Direction"],
    featured: true,
    order: 1,
    mediaType: "image",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "2",
    title: "Solace",
    slug: { current: "solace" },
    category: "Photography",
    year: 2023,
    description: "Editorial photography for a luxury wellness brand.",
    tags: ["Photo", "Editorial"],
    featured: false,
    order: 2,
    mediaType: "image",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "3",
    title: "Aura Identity",
    slug: { current: "aura-identity" },
    category: "Graphic Design",
    year: 2023,
    description: "Complete visual identity for an emerging fashion label.",
    tags: ["Design", "Branding"],
    featured: false,
    order: 3,
    mediaType: "image",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "4",
    title: "Pulse",
    slug: { current: "pulse" },
    category: "Creative Content",
    year: 2024,
    description: "Social-first campaign designed for maximum engagement.",
    tags: ["Social", "Campaign"],
    featured: false,
    order: 4,
    mediaType: "image",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
];
