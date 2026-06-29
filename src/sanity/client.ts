import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "05di1or7",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

/**
 * Typed GROQ query helper with optional revalidation.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  revalidate: number | false = 3600
): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: { revalidate },
  });
}
