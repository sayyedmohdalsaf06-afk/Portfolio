import { z } from "zod";

/**
 * Content schemas — the typed contract for every data-driven collection.
 * Zod schemas double as build-time validators (see src/lib/content.ts).
 * Types are inferred from the schemas so there is a single source of truth.
 * @see docs/13-content-architecture.md
 */

/* ----------------------------------- shared ----------------------------------- */
const isoDate = z.string().describe("ISO-8601 date, e.g. 2026-07-18");
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug");

/* ----------------------------------- Project ----------------------------------- */
export const ProjectSchema = z.object({
  slug,
  title: z.string(),
  tagline: z.string(),
  status: z.enum(["building", "completed", "shipped", "archived", "concept"]),
  featured: z.boolean().default(false),
  order: z.number().default(100),
  cover: z.string().optional(),
  // Optional: a record can exist before its full write-up. Sections render
  // only what's present (honest "documenting soon" otherwise). See docs/28 §8.
  problem: z.string().optional(),
  solution: z.string().optional(),
  role: z.string().optional(),
  architecture: z.string().optional(),
  stack: z.array(z.string()).default([]),
  impact: z.array(z.string()).default([]),
  lessons: z.array(z.string()).default([]),
  links: z
    .object({
      demo: z.string().url().optional(),
      github: z.string().url().optional(),
      caseStudy: z.string().optional(),
    })
    .default({}),
  hackathonSlug: z.string().optional(),
  startedAt: isoDate.optional(),
  updatedAt: isoDate.optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

/* ---------------------------------- Hackathon ---------------------------------- */
export const HackathonSchema = z.object({
  slug,
  name: z.string(),
  date: isoDate,
  location: z.string().optional(),
  role: z.string(),
  problem: z.string(),
  idea: z.string(),
  outcome: z.string(),
  learning: z.string(),
  result: z.enum(["winner", "finalist", "participant"]).optional(),
  projectSlug: z.string().optional(),
  links: z
    .object({ repo: z.string().url().optional(), devpost: z.string().url().optional() })
    .optional(),
});
export type Hackathon = z.infer<typeof HackathonSchema>;

/* -------------------------------- TimelineNode --------------------------------- */
export const TimelineNodeSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["past", "present", "future"]),
  icon: z.string().optional(),
});
export type TimelineNode = z.infer<typeof TimelineNodeSchema>;

/* ------------------------------------ Metric ----------------------------------- */
export const MetricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.union([z.number(), z.literal("∞")]),
  suffix: z.string().optional(),
  derivedFrom: z
    .enum(["projects", "hackathons", "writing", "books", "experiments"])
    .nullish(),
});
export type Metric = z.infer<typeof MetricSchema>;

/* ------------------------------------ Skill ------------------------------------ */
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum([
    "ai",
    "frontend",
    "backend",
    "database",
    "devtools",
    "design",
  ]),
  level: z.enum(["exploring", "working", "confident"]).optional(),
  icon: z.string().optional(),
});
export type Skill = z.infer<typeof SkillSchema>;

/* ----------------------------------- LogEntry ---------------------------------- */
export const LogEntrySchema = z.object({
  id: z.string(),
  date: isoDate,
  project: z.string().optional(),
  kind: z.enum(["build", "experiment", "learning", "changelog"]),
  title: z.string(),
  tags: z.array(z.string()).default([]),
});
export type LogEntry = z.infer<typeof LogEntrySchema>;

/* --------------------------------- WritingPost --------------------------------- */
export const WritingPostSchema = z.object({
  slug,
  title: z.string(),
  excerpt: z.string(),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  category: z.enum(["blog", "note", "research", "lesson"]),
  tags: z.array(z.string()).default([]),
  readingTime: z.number().optional(),
  draft: z.boolean().default(false),
});
export type WritingPost = z.infer<typeof WritingPostSchema>;

/* ------------------------------------- Book ------------------------------------ */
export const BookSchema = z.object({
  slug,
  title: z.string(),
  author: z.string(),
  cover: z.string().optional(),
  status: z.enum(["reading", "read", "queued"]),
  rating: z.number().min(1).max(5).optional(),
  startedAt: isoDate.optional(),
  finishedAt: isoDate.optional(),
  topics: z.array(z.string()).default([]),
  takeaways: z.array(z.string()).default([]),
  url: z.string().url().optional(),
  featured: z.boolean().default(false),
});
export type Book = z.infer<typeof BookSchema>;

/* --------------------------------- Experiment ---------------------------------- */
export const ExperimentSchema = z.object({
  slug,
  title: z.string(),
  summary: z.string(),
  date: isoDate,
  status: z.enum(["idea", "in-progress", "done", "shelved"]),
  kind: z.enum(["ai", "frontend", "data", "design", "other"]),
  stack: z.array(z.string()).default([]),
  hypothesis: z.string().optional(),
  result: z.string().optional(),
  learning: z.string().optional(),
  demo: z.boolean().default(false),
  links: z
    .object({ repo: z.string().url().optional(), live: z.string().url().optional() })
    .optional(),
  relatedProject: z.string().optional(),
  featured: z.boolean().default(false),
});
export type Experiment = z.infer<typeof ExperimentSchema>;

/* ---------------------------------- GardenItem --------------------------------- */
export const GardenItemSchema = z.object({
  id: z.string(),
  type: z.enum(["book", "note", "blog", "lesson", "research", "resource"]),
  title: z.string(),
  author: z.string().optional(),
  url: z.string().url().optional(),
  note: z.string().optional(),
  status: z.enum(["reading", "read", "queued"]).optional(),
  slug: z.string().optional(),
});
export type GardenItem = z.infer<typeof GardenItemSchema>;

/* ------------------------------------ Lesson ----------------------------------- */
export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  context: z.string(),
  insight: z.string(),
  relatedProject: z.string().optional(),
  date: isoDate.optional(),
});
export type Lesson = z.infer<typeof LessonSchema>;

/* ---------------------------------- Achievement -------------------------------- */
export const AchievementSchema = z.object({
  id: z.string(),
  category: z.enum([
    "projects",
    "hackathons",
    "courses",
    "communities",
    "leadership",
    "github",
  ]),
  label: z.string(),
  value: z.union([z.string(), z.number()]).optional(),
  detail: z.string().optional(),
  icon: z.string().optional(),
});
export type Achievement = z.infer<typeof AchievementSchema>;

/* ---------------------------------- BeyondItem --------------------------------- */
export const BeyondItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(["sport", "craft", "interest"]),
  note: z.string().optional(),
  icon: z.string().optional(),
});
export type BeyondItem = z.infer<typeof BeyondItemSchema>;

/* ----------------------------------- NowData ----------------------------------- */
export const NowDataSchema = z.object({
  updatedAt: isoDate,
  learning: z.array(z.string()).default([]),
  building: z.array(z.string()).default([]),
  reading: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
});
export type NowData = z.infer<typeof NowDataSchema>;

/* -------------------------------- ContactChannel ------------------------------- */
export const ContactChannelSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(["github", "linkedin", "instagram", "email", "phone"]),
  href: z.string(),
  handle: z.string(),
});
export type ContactChannel = z.infer<typeof ContactChannelSchema>;

/* ----------------------------------- UsesItem ---------------------------------- */
export const UsesItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  category: z.enum([
    "hardware",
    "editor",
    "terminal",
    "software",
    "ai-tools",
    "desk",
  ]),
  detail: z.string().optional(),
  url: z.string().url().optional(),
});
export type UsesItem = z.infer<typeof UsesItemSchema>;
