import { defineType, defineField } from "sanity";

export const seoObject = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Optimal length: 50–60 characters",
      validation: (Rule) => Rule.max(60).warning("Keep under 60 characters"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Optimal length: 150–160 characters",
      validation: (Rule) => Rule.max(160).warning("Keep under 160 characters"),
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      description: "Recommended: 1200×630px",
      options: { hotspot: true },
    }),
  ],
});

export const socialLinkObject = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "TikTok", value: "tiktok" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "YouTube", value: "youtube" },
          { title: "Behance", value: "behance" },
          { title: "Vimeo", value: "vimeo" },
          { title: "X (Twitter)", value: "x" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});

export const ctaButtonObject = defineType({
  name: "ctaButton",
  title: "CTA Button",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Button Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Ghost", value: "ghost" },
        ],
      },
      initialValue: "primary",
    }),
  ],
});
