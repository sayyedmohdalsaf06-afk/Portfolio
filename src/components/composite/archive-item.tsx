import { ArrowUpRight } from "lucide-react";
import type { GardenItem } from "@/types/content";

/**
 * ArchiveItem — one entry in the Knowledge Archive: a book, essay, or resource
 * that shaped how I think. Type · author → title → note. Links out if it has a
 * url. Lighter row than a record.
 */
const TYPE: Record<GardenItem["type"], string> = {
  book: "Book",
  note: "Note",
  blog: "Essay",
  lesson: "Lesson",
  research: "Research",
  resource: "Resource",
};

export function ArchiveItem({ item }: { item: GardenItem }) {
  const inner = (
    <>
      <p className="accession">
        {TYPE[item.type]}
        {item.author && (
          <>
            <span aria-hidden="true" className="mx-2 text-[var(--border-strong)]">
              ·
            </span>
            {item.author}
          </>
        )}
      </p>
      <h3 className="mt-2 font-display text-h3 text-[var(--text-strong)] transition-colors group-hover:text-[var(--accent)]">
        {item.title}
      </h3>
      {item.note && (
        <p className="measure mt-2 text-body-sm text-[var(--text-muted)]">
          {item.note}
        </p>
      )}
    </>
  );

  return (
    <article className="border-t border-[var(--border)]">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start justify-between gap-4 py-6 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]"
        >
          <div>{inner}</div>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]" />
        </a>
      ) : (
        <div className="py-6">{inner}</div>
      )}
    </article>
  );
}
