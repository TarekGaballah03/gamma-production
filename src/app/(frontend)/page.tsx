"use client";

import { useState, useEffect } from "react";
import { Preloader } from "@/components/layout/Preloader";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeSection } from "@/components/sections/MarqueeSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { BehindTheSceneSection } from "@/components/sections/BehindTheSceneSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";
import type { HeroData, AboutData, ServicesData, Project, SiteSettings, BtsItem } from "@/types";
import { sanityFetch } from "@/sanity/client";
import { heroQuery, aboutQuery, servicesQuery, workQuery, settingsQuery, btsQuery } from "@/sanity/queries";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    hero: HeroData | null;
    about: AboutData | null;
    services: ServicesData | null;
    work: Project[];
    settings: SiteSettings | null;
    bts: BtsItem[];
  }>({
    hero: null,
    about: null,
    services: null,
    work: [],
    settings: null,
    bts: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [hero, about, services, work, settings, bts] = await Promise.all([
          sanityFetch<HeroData>(heroQuery).catch(() => null),
          sanityFetch<AboutData>(aboutQuery).catch(() => null),
          sanityFetch<ServicesData>(servicesQuery).catch(() => null),
          sanityFetch<Project[]>(workQuery).catch(() => []),
          sanityFetch<SiteSettings>(settingsQuery).catch(() => null),
          sanityFetch<BtsItem[]>(btsQuery).catch(() => []),
        ]);

        setData({ hero, about, services, work, settings, bts });
      } catch (err) {
        console.error("Sanity fetch failed, using fallbacks.", err);
      }
    }
    
    loadData();
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <main
        style={{
          visibility: loading ? "hidden" : "visible",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.6s ease-in",
        }}
      >
        <HeroSection data={data.hero} />
        <MarqueeSection />
        <AboutSection data={data.about} />
        <ServicesSection data={data.services} />
        
        {/* We pass dummy projects if none exist to demonstrate the grid */}
        <WorkSection projects={data.work.length > 0 ? data.work : DUMMY_PROJECTS} />
        
        <BehindTheSceneSection items={data.bts} />

        <ContactSection />
        <Footer settings={data.settings} />
      </main>
    </>
  );
}

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
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } }
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
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } }
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
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } }
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
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } }
  },
];
