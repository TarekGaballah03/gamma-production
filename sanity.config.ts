import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemas";

export default defineConfig({
  name: "gamma-production-studio",
  title: "Gamma Production Studio",
  basePath: "/studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("🎬 Hero Section")
              .id("hero")
              .child(S.document().schemaType("hero").documentId("hero")),
            S.listItem()
              .title("👁 About Section")
              .id("about")
              .child(S.document().schemaType("about").documentId("about")),
            S.listItem()
              .title("⚡ Services Section")
              .id("services")
              .child(S.document().schemaType("services").documentId("services")),
            S.divider(),
            S.documentTypeListItem("project").title("🎥 Projects"),
            S.documentTypeListItem("bts").title("🎞 Behind the Scene").icon(() => "🎞"),
            S.divider(),
            S.listItem()
              .title("⚙️ Site Settings")
              .id("settings")
              .child(S.document().schemaType("settings").documentId("settings")),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
