export type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string;
};

export type SanityFile = {
  _type: "file";
  asset: {
    _ref: string;
    _type: "reference";
    url?: string;
  };
};

export type SocialLink = {
  _key: string;
  platform: string;
  url: string;
};

export type CTAButton = {
  label: string;
  href: string;
  variant?: "primary" | "ghost";
};

export type PortableTextBlock = {
  _key: string;
  _type: string;
  children: Array<{
    _key: string;
    _type: string;
    marks: string[];
    text: string;
  }>;
  markDefs: unknown[];
  style: string;
};

// ─── Document Types ──────────────────────────────────────────────

export type HeroData = {
  headlineTop: string;
  headlineBottom: string;
  subheadline: string;
  ctaLabel: string;
  ctaLink: string;
};

export type AboutData = {
  eyebrow: string;
  headline: string;
  body: PortableTextBlock[];
  stats: Array<{
    _key: string;
    number: string;
    label: string;
  }>;
  image: SanityImage;
  signatureText?: string;
};

export type ServiceItem = {
  _key: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
};

export type ServicesData = {
  eyebrow: string;
  headline: string;
  items: ServiceItem[];
};

export type Project = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  year: number;
  coverImage: SanityImage;
  description: string;
  tags: string[];
  featured: boolean;
  order: number;
  mediaType?: "image" | "video";
  videoUrl?: string;
};

export type BtsVideo = {
  _key: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: SanityImage;
};

export type BehindTheSceneData = {
  eyebrow: string;
  headline: string;
  subheadline?: string;
  videos: BtsVideo[];
};

export type SiteSettings = {
  siteName: string;
  seoDescription: string;
  ogImage?: SanityImage;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialLinks: SocialLink[];
  footerTagline: string;
};
