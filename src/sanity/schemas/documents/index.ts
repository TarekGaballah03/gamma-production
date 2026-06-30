import { defineType, defineField } from "sanity";

export const heroSchema = defineType({
  name: "hero",
  title: "Hero Section",
  type: "document",
  icon: () => "🎬",
  fields: [
    defineField({
      name: "headlineTop",
      title: "Headline — Line 1",
      type: "string",
      description: 'e.g. "We craft"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headlineBottom",
      title: "Headline — Line 2",
      type: "string",
      description: 'e.g. "bold stories"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Sub-headline",
      type: "text",
      rows: 3,
      description: "A short supporting sentence beneath the headline",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label",
      type: "string",
      initialValue: "View Our Work",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Button Link",
      type: "string",
      initialValue: "#work",
    }),
  ],
  preview: {
    select: { title: "headlineTop", subtitle: "headlineBottom" },
  },
});

export const aboutSchema = defineType({
  name: "about",
  title: "About Section",
  type: "document",
  icon: () => "👁",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Label",
      type: "string",
      description: 'Small label above headline e.g. "About / Studio"',
      initialValue: "About",
    }),
    defineField({
      name: "headline",
      title: "Section Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            { name: "number", type: "string", title: "Number", description: 'e.g. "200+"' },
            { name: "label", type: "string", title: "Label", description: 'e.g. "Projects Delivered"' },
          ],
          preview: { select: { title: "number", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Studio / Team Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt Text", validation: (Rule) => Rule.required() },
      ],
    }),
    defineField({
      name: "signatureText",
      title: "Signature / Sign-off Text",
      type: "string",
      description: 'e.g. "Gamma Production Studio, Est. 2023"',
    }),
  ],
});

export const servicesSchema = defineType({
  name: "services",
  title: "Services Section",
  type: "document",
  icon: () => "⚡",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Label",
      type: "string",
      initialValue: "What We Do",
    }),
    defineField({
      name: "headline",
      title: "Section Headline",
      type: "string",
      initialValue: "Our Services",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Service Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "serviceItem",
          fields: [
            { name: "number", type: "string", title: "Number", description: 'e.g. "01"' },
            { name: "title", type: "string", title: "Service Title", validation: (Rule) => Rule.required() },
            { name: "description", type: "text", title: "Description", rows: 3 },
            { name: "tags", type: "array", title: "Tags", of: [{ type: "string" }], options: { layout: "tags" } },
          ],
          preview: { select: { title: "title", subtitle: "number" } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});

export const projectSchema = defineType({
  name: "project",
  title: "Projects (Our Work)",
  type: "document",
  icon: () => "🎥",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Videography", value: "Videography" },
          { title: "Photography", value: "Photography" },
          { title: "Graphic Design", value: "Graphic Design" },
          { title: "Creative Content", value: "Creative Content" },
          { title: "Moderation", value: "Moderation" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      initialValue: new Date().getFullYear(),
      validation: (Rule) => Rule.required().min(2020).max(2030),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt Text", validation: (Rule) => Rule.required() },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video (YouTube / Vimeo)", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      description: "Choose whether this project displays an image or a video embed.",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "YouTube or Vimeo URL (only used when Media Type is Video)",
    }),
    defineField({
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      description: "Featured projects appear first and larger in the grid",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Year, New → Old",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});

export const settingsSchema = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  icon: () => "⚙️",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      initialValue: "Gamma Production",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoDescription",
      title: "Default SEO Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
      options: { hotspot: true },
      description: "Recommended: 1200×630px",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "footerTagline",
      title: "Footer Tagline",
      type: "string",
      initialValue: "Crafting stories that move.",
    }),
  ],
  preview: {
    select: { title: "siteName" },
  },
});

export const btsSchema = defineType({
  name: "bts",
  title: "Behind the Scene Video",
  type: "document",
  icon: () => "🎞",
  fields: [
    defineField({
      name: "title",
      title: "Video Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "videoFile",
      title: "Video File",
      type: "file",
      options: {
        accept: "video/mp4,video/quicktime,video/webm",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail (optional)",
      type: "image",
      options: { hotspot: true },
      description: "Fallback image shown before video loads.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "thumbnail",
    },
  },
});
