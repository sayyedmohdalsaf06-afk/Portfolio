import type { TimelineNode } from "@/types/content";

/**
 * Systems Timeline — the trajectory so far, in the "becoming" voice.
 * `date` is a display label (not necessarily an exact date), so honest, vague
 * markers ("Earlier", "Now", "Next") are fine — no fabricated dates. Only 2025
 * is used, tied to the confirmed firstLight (SITE.firstLight).
 * TODO(owner): refine labels/milestones with real dates when you'd like.
 */
export const timeline: TimelineNode[] = [
  {
    id: "foundations",
    date: "Earlier",
    title: "Foundations",
    description:
      "Early programming experiments — logic, problem solving, and first tools (Terminal Games, Resume Analyzer).",
    type: "past",
  },
  {
    id: "first-light",
    date: "2025",
    title: "First light",
    description:
      "Started documenting the journey and building in public — the field log begins.",
    type: "present",
  },
  {
    id: "now",
    date: "Now",
    title: "Exploring AI",
    description:
      "Exploring AI and trust systems while building CampusSwap AI, and learning in public.",
    type: "present",
  },
  {
    id: "next",
    date: "Next",
    title: "Toward impactful systems",
    description:
      "On the way toward building impactful intelligent systems — one record at a time.",
    type: "future",
  },
];
