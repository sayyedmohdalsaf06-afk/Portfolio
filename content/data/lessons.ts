import type { Lesson } from "@/types/content";

/**
 * Field Observations — lessons/ideas/insights, growth-minded (never
 * achievements). SEEDED DRAFTS in the owner's voice, grounded in the real
 * journey (Terminal Games, Resume Analyzer, building in public). No fabricated
 * metrics or outcomes. Chronological (oldest first) so it reads as growth.
 * TODO(owner): edit/confirm/expand these.
 */
export const lessons: Lesson[] = [
  {
    id: "fundamentals-compound",
    title: "Fundamentals compound",
    context:
      "Building small terminal games to practice logic and problem solving felt slow at the time.",
    insight:
      "The habits from those tiny programs — decomposing problems, reading errors patiently, iterating — are the ones I lean on now. None of it was wasted.",
    relatedProject: "terminal-games",
    date: "2026-05-20",
  },
  {
    id: "real-data-is-messy",
    title: "Real data is messy",
    context:
      "With the Resume Analyzer, the clean examples worked; real resumes didn't.",
    insight:
      "Most of the work lives in the edge cases and the feedback loop, not the happy path. I'm learning to design for the mess rather than around it.",
    relatedProject: "resume-analyzer",
    date: "2026-06-28",
  },
  {
    id: "sharing-rough-work",
    title: "Sharing rough work is uncomfortable",
    context: "Posting things before they're polished still feels strange.",
    insight:
      "The accountability and the feedback are worth more than looking finished. Building in public is a skill I'm still practising.",
    date: "2026-07-12",
  },
];
