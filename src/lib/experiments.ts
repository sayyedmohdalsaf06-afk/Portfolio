import { getMdxCollection, type MdxDoc } from "./content";
import { ExperimentSchema, type Experiment } from "@/types/content";

/**
 * Experiments = small, exploratory builds/tests in the Lab. Loaded from
 * `/content/experiments/*.mdx`, validated, sorted featured-first then newest.
 * Server-only. Empty until experiments are logged (honest empty state).
 */

function byFeaturedThenNewest(a: MdxDoc<Experiment>, b: MdxDoc<Experiment>) {
  const featured =
    Number(b.frontmatter.featured) - Number(a.frontmatter.featured);
  if (featured !== 0) return featured;
  return b.frontmatter.date.localeCompare(a.frontmatter.date);
}

export function getExperimentDocs(): MdxDoc<Experiment>[] {
  return getMdxCollection("experiments", ExperimentSchema).sort(
    byFeaturedThenNewest,
  );
}

export function getExperiments(): Experiment[] {
  return getExperimentDocs().map((d) => d.frontmatter);
}

export function getExperimentDoc(slug: string): MdxDoc<Experiment> | undefined {
  return getExperimentDocs().find(
    (d) => (d.frontmatter.slug ?? d.slug) === slug,
  );
}
