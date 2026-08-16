import type { Experiment } from "@/types/content";

/**
 * ExperimentRecord — one entry in the Experiment Lab (editorial row).
 * kind · status → title → summary → optional takeaway.
 */
const STATUS: Record<Experiment["status"], string> = {
  idea: "Idea",
  "in-progress": "In progress",
  done: "Done",
  shelved: "Shelved",
};

export function ExperimentRecord({ experiment }: { experiment: Experiment }) {
  const e = experiment;
  const active = e.status === "in-progress";

  return (
    <article className="border-t border-[var(--border)] py-8">
      <p className="accession">
        {e.kind.toUpperCase()}
        <span aria-hidden="true" className="mx-2 text-[var(--border-strong)]">
          ·
        </span>
        <span
          className={
            active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
          }
        >
          {STATUS[e.status]}
        </span>
      </p>
      <h3 className="mt-3 font-display text-h3 text-[var(--text-strong)]">
        {e.title}
      </h3>
      <p className="measure mt-2 text-body text-[var(--text-muted)]">
        {e.summary}
      </p>
      {e.learning && (
        <p className="measure mt-3 text-body-sm text-[var(--text-dim)]">
          <span className="font-mono text-mono-label uppercase text-[var(--text-muted)]">
            Took away
          </span>{" "}
          — {e.learning}
        </p>
      )}
    </article>
  );
}
