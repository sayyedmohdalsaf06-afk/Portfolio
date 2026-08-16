/**
 * Route + section-anchor constants for Portfolio v2 ("In Focus").
 * Single source of truth for navigation.
 */

/** Standalone routes. */
export const ROUTES = {
  home: "/",
  projects: "/projects",
  writing: "/writing",
  logs: "/logs",
  now: "/now",
  lab: "/lab",
  uses: "/uses",
  resume: "/resume",
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Home-page section ids (the continuous workspace spine). */
export const SECTION_IDS = [
  "hero",
  "project-experience",
  "projects",
  "journey",
  "learning-lab",
  "writing",
  "knowledge-garden",
  "lessons",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_META: Record<
  SectionId,
  { label: string; title: string; eyebrow: string }
> = {
  hero: { label: "Overview", title: "Mohd Alsaf", eyebrow: "IN FOCUS" },
  "project-experience": {
    label: "CampusSwap AI",
    title: "CampusSwap AI",
    eyebrow: "FLAGSHIP EXPLORATION",
  },
  projects: {
    label: "Projects",
    title: "Engineering Records",
    eyebrow: "RECORDS",
  },
  journey: {
    label: "Trajectory",
    title: "Systems Trajectory",
    eyebrow: "TRAJECTORY",
  },
  "learning-lab": {
    label: "Lab",
    title: "Experiment Lab",
    eyebrow: "EXPERIMENTS",
  },
  writing: {
    label: "Notes",
    title: "Build Notes",
    eyebrow: "BUILD NOTES",
  },
  "knowledge-garden": {
    label: "Archive",
    title: "Knowledge Archive",
    eyebrow: "ARCHIVE",
  },
  lessons: {
    label: "Reflections",
    title: "Engineering Reflections",
    eyebrow: "REFLECTIONS",
  },
  contact: {
    label: "Contact",
    title: "Get in touch",
    eyebrow: "CONTACT",
  },
};

export const anchor = (id: SectionId) => `#${id}`;
