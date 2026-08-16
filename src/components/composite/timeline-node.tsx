import type { TimelineNode } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * TimelineNodeItem — one node on the Systems Timeline spine.
 * Present = accent dot; past = filled slate; future = dashed + dimmed.
 */
export function TimelineNodeItem({ node }: { node: TimelineNode }) {
  const isFuture = node.type === "future";
  const isPresent = node.type === "present";

  return (
    <li className={cn("relative pl-9 pb-12 last:pb-0", isFuture && "opacity-70")}>
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-1.5 size-[7px] rounded-full border",
          isPresent
            ? "border-[var(--accent)] bg-[var(--accent)]"
            : isFuture
              ? "border-dashed border-[var(--border-strong)] bg-transparent"
              : "border-[var(--text-muted)] bg-[var(--text-muted)]",
        )}
      />
      <p className="accession">{node.date}</p>
      <h3 className="mt-2 font-display text-h3 text-[var(--text-strong)]">
        {node.title}
      </h3>
      <p className="measure mt-2 text-body text-[var(--text-muted)]">
        {node.description}
      </p>
    </li>
  );
}
