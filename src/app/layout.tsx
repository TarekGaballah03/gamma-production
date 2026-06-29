import type { Metadata } from "next";
import "./globals.css";
import { sanityFetch } from "@/sanity/client";
import { settingsQuery } from "@/sanity/queries";
import type { SiteSettings } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await sanityFetch<SiteSettings>(settingsQuery);
    return {
      title: {
        template: `%s | ${settings?.siteName || "Gamma Production"}`,
        default: settings?.siteName || "Gamma Production Studio",
      },
      description: settings?.seoDescription || "Creative production studio specialising in videography, photography, and digital content.",
    };
  } catch (e) {
    return {
      title: "Gamma Production Studio",
      description: "Creative production studio.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="grain antialiased bg-black text-white selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
