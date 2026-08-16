import { SectionHeader, SectionShell } from "@/components/ui";
import { NoteItem } from "@/components/composite/note-item";
import { getWritingPosts } from "@/lib/writing";
import { SECTION_META } from "@/constants";

/**
 * Build Notes — writing / learning in public (Phase 3).
 * Data-driven from /content/writing; honest empty state. Not a blog — working
 * notes, in progress. Calm editorial, becoming voice. No new visual systems.
 */
export function BuildNotes() {
  // Homepage shows the latest 3 as a teaser; the full field log lives at
  // /writing (built later).
  const posts = getWritingPosts().slice(0, 3);

  return (
    <SectionShell id="writing" label="Build Notes">
      <SectionHeader
        as="h2"
        eyebrow={SECTION_META.writing.eyebrow}
        title={SECTION_META.writing.title}
        lede="Working notes on what I'm building and learning — thinking in the open, rough edges and all."
        className="mb-12"
      />

      {posts.length === 0 ? (
        <p className="lede measure text-[var(--text-muted)]">
          Notes are being written. As I build, I&rsquo;ll share what I&rsquo;m
          learning here — in progress, not polished.
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <NoteItem key={post.slug} post={post} />
          ))}
        </div>
      )}
    </SectionShell>
  );
}
