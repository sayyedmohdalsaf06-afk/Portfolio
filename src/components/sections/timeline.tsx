import { SectionHeader, SectionShell } from "@/components/ui";
import { TimelineNodeItem } from "@/components/composite/timeline-node";
import { timeline } from "@content/data/timeline";
import { SECTION_META } from "@/constants";

/**
 * Systems Timeline — the trajectory so far (Phase 3).
 * A calm vertical spine (past · present · future). Data-driven; honest empty
 * state; no fabricated dates; no new visual systems.
 */
export function Timeline() {
  return (
    <SectionShell id="journey" label="Systems Timeline">
      <SectionHeader
        as="h2"
        eyebrow={SECTION_META.journey.eyebrow}
        title={SECTION_META.journey.title}
        lede="How I got here, and where it's heading — the systems and skills built along the way, told honestly."
        className="mb-12"
      />

      {timeline.length === 0 ? (
        <p className="lede measure text-[var(--text-muted)]">
          The timeline is being charted.
        </p>
      ) : (
        <ol className="relative max-w-2xl">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-[3px] top-2 w-px bg-[var(--border)]"
          />
          {timeline.map((node) => (
            <TimelineNodeItem key={node.id} node={node} />
          ))}
        </ol>
      )}
    </SectionShell>
  );
}
