import { getMdxCollection, type MdxDoc } from "./content";
import { WritingPostSchema, type WritingPost } from "@/types/content";

/**
 * Build Notes = the writing collection (learning in public). Loaded from
 * `/content/writing/*.mdx`, validated, newest-first, drafts hidden in prod.
 * Server-only. Empty until notes are written (honest empty state).
 */
export function getWritingDocs(): MdxDoc<WritingPost>[] {
  return getMdxCollection("writing", WritingPostSchema)
    .filter(
      (d) => !(d.frontmatter.draft && process.env.NODE_ENV === "production"),
    )
    .sort((a, b) =>
      b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
    );
}

export function getWritingPosts(): WritingPost[] {
  return getWritingDocs().map((d) => d.frontmatter);
}

export function getWritingDoc(slug: string): MdxDoc<WritingPost> | undefined {
  return getWritingDocs().find((d) => (d.frontmatter.slug ?? d.slug) === slug);
}
