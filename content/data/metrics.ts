import type { Metric } from "@/types/content";

/**
 * Premium metrics. Numbers with `derivedFrom` are auto-counted from their
 * collection at build (keeps them honest); others are curated.
 * Populated in Phase 4–5. Empty = graceful placeholder.
 */
export const metrics: Metric[] = [];
