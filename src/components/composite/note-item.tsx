import type { WritingPost } from "@/types/content";
import { formatDate } from "@/lib/utils";

/**
 * NoteItem — one entry in Build Notes. A short, dated journal entry rendered
 * INLINE (no detail page yet — the /writing/[slug] route + full MDX rendering
 * arrive in a later phase, so we don't link to a 404). The excerpt carries the
 * note. Learning-in-public voice, not a blog card.
 */
const CATEGORY: Record<WritingPost["category"], string> = {
  blog: "Note",
  note: "Note",
  research: "Research",
  lesson: "Lesson",
};

export function NoteItem({ post }: { post: WritingPost }) {
  return (
    <article className="border-t border-[var(--border)] py-8">
      <p className="accession">
        {formatDate(post.publishedAt)}
        <span aria-hidden="true" className="mx-2 text-[var(--border-strong)]">
          ·
        </span>
        {CATEGORY[post.category]}
      </p>
      <h3 className="mt-3 font-display text-h3 text-[var(--text-strong)]">
        {post.title}
      </h3>
      <p className="measure mt-2 text-body-lg text-[var(--text)]">
        {post.excerpt}
      </p>
    </article>
  );
}
