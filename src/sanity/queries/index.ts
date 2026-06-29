import { groq } from "next-sanity";

export const heroQuery = groq`
  *[_type == "hero"][0] {
    headlineTop,
    headlineBottom,
    subheadline,
    ctaLabel,
    ctaLink
  }
`;

export const aboutQuery = groq`
  *[_type == "about"][0] {
    eyebrow,
    headline,
    body,
    stats,
    image,
    signatureText
  }
`;

export const servicesQuery = groq`
  *[_type == "services"][0] {
    eyebrow,
    headline,
    items[] {
      _key,
      number,
      title,
      description,
      tags
    }
  }
`;

export const workQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    slug,
    category,
    year,
    coverImage,
    description,
    tags,
    featured,
    order
  }
`;

export const settingsQuery = groq`
  *[_type == "settings"][0] {
    siteName,
    seoDescription,
    ogImage,
    contactEmail,
    contactPhone,
    address,
    socialLinks,
    footerTagline
  }
`;
