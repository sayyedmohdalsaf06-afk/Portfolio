import { SectionHeader, SectionShell } from "@/components/ui";
import { ArchiveItem } from "@/components/composite/archive-item";
import { garden } from "@content/data/garden";
import { SECTION_META } from "@/constants";

/**
 * Knowledge Archive — books, essays, blogs, and resources shaping my thinking.
 * Data-driven from content/data/garden.ts; honest empty state. The reading
 * behind the building. Calm editorial. No new visual systems.
 */
export function KnowledgeArchive() {
  return (
    <SectionShell id="knowledge-garden" label="Knowledge Archive">
      <SectionHeader
        as="h2"
        eyebrow={SECTION_META["knowledge-garden"].eyebrow}
        title={SECTION_META["knowledge-garden"].title}
        lede="Books, essays, and resources shaping how I think — the reading behind the building."
        className="mb-12"
      />

      {garden.length === 0 ? (
        <p className="lede measure text-[var(--text-muted)]">
          The archive is being catalogued — the books, essays, and ideas that
          shape how I approach systems and building.
        </p>
      ) : (
        <div>
          {garden.map((item) => (
            <ArchiveItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </SectionShell>
  );
}
