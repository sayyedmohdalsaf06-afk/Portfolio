import { SectionHeader, SectionShell } from "@/components/ui";
import { ObservationItem } from "@/components/composite/observation-item";
import { lessons } from "@content/data/lessons";
import { SECTION_META } from "@/constants";

/**
 * Field Observations — lessons, ideas, and insights from the work (Phase 3).
 * Data-driven from content/data/lessons.ts; honest empty state. Growth-minded,
 * never an achievement. Calm editorial, becoming voice. No new visual systems.
 */
export function Observations() {
  return (
    <SectionShell id="lessons" label="Field Observations">
      <SectionHeader
        as="h2"
        eyebrow={SECTION_META.lessons.eyebrow}
        title={SECTION_META.lessons.title}
        lede="What the work taught me — lessons, ideas, and insights, kept honest."
        className="mb-12"
      />

      {lessons.length === 0 ? (
        <p className="lede measure text-[var(--text-muted)]">
          Observations are being recorded — the lessons and ideas that come from
          building, and from getting things wrong.
        </p>
      ) : (
        <div>
          {lessons.map((lesson) => (
            <ObservationItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </SectionShell>
  );
}
