import { ROUTES } from "@/constants";

/**
 * Editorial content configuration (distinct from static site metadata in
 * src/constants/site.ts). Nav choices, ordering, and feature flags live here
 * because they are content decisions the author may tune over time.
 */

/**
 * Primary top-bar navigation. Clarity-first labels (paths stay conventional).
 * Naming source of truth: docs/30-lexicon-vocabulary.md §3.
 */
export const NAV = [
  { label: "Records", href: ROUTES.projects },
  { label: "Build Notes", href: ROUTES.writing },
  { label: "Lab", href: ROUTES.lab },
  { label: "Timeline", href: "/#journey" },
  { label: "Contact", href: "/#contact" },
] as const;

/** Content collection registry (where each collection lives under /content). */
export const COLLECTIONS = {
  projects: "projects",
  writing: "writing",
  logs: "logs",
  books: "books",
  experiments: "experiments",
} as const;

/** What I'm currently open to (Contact). Direction, not a claim. */
export const AVAILABILITY = [
  "Internships",
  "Hackathons",
  "Collaborations",
] as const;

/** Feature flags for progressive rollout across phases. */
export const FEATURES = {
  bootSequence: true,
  commandPalette: true,
  backgroundField: true,
} as const;
