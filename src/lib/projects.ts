import { getMdxCollection, type MdxDoc } from "./content";
import { ProjectSchema, type Project } from "@/types/content";

/**
 * Projects = "records" in the archive. Loaded from `/content/projects/*.mdx`,
 * validated against ProjectSchema, sorted featured-first then by `order`.
 * Server-only (touches the filesystem via lib/content).
 */

function byFeaturedThenOrder(a: MdxDoc<Project>, b: MdxDoc<Project>) {
  const featured =
    Number(b.frontmatter.featured) - Number(a.frontmatter.featured);
  if (featured !== 0) return featured;
  return (a.frontmatter.order ?? 100) - (b.frontmatter.order ?? 100);
}

export function getProjectDocs(): MdxDoc<Project>[] {
  return getMdxCollection("projects", ProjectSchema).sort(byFeaturedThenOrder);
}

export function getProjects(): Project[] {
  return getProjectDocs().map((d) => d.frontmatter);
}

export function getProjectDoc(slug: string): MdxDoc<Project> | undefined {
  return getProjectDocs().find((d) => (d.frontmatter.slug ?? d.slug) === slug);
}

/** Stable catalogue index (1-based) for a project's accession number. */
export function projectIndex(slug: string): number {
  return getProjects().findIndex((p) => p.slug === slug) + 1;
}
