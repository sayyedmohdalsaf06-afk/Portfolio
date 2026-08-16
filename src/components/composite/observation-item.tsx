import type { Lesson } from "@/types/content";
import { formatDate } from "@/lib/utils";

/**
 * ObservationItem — one Field Observation: a distilled learning. Optional date
 * → title → context (what happened) → insight (what it taught). Honest, growth-
 * minded, never an achievement. The insight is the emphasis.
 */
export function ObservationItem({ lesson }: { lesson: Lesson }) {
  return (
    <article className="border-t border-[var(--border)] py-8">
      {lesson.date && <p className="accession">{formatDate(lesson.date)}</p>}
      <h3 className="mt-2 font-display text-h3 text-[var(--text-strong)]">
        {lesson.title}
      </h3>
      <p className="measure mt-2 text-body text-[var(--text-muted)]">
        {lesson.context}
      </p>
      <p className="lede measure mt-4 text-[var(--text)]">{lesson.insight}</p>
    </article>
  );
}
