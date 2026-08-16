import Link from "next/link";
import { Chip } from "@/components/ui";
import type { Project } from "@/types/content";

/**
 * ProjectRecord — one entry in the records catalogue.
 * Hairline top border; hover shifts the title to accent.
 */

const STATUS: Record<Project["status"], { label: string; accent: boolean }> = {
  building: { label: "Building", accent: true }, // active record -> accent
  completed: { label: "Completed", accent: false },
  shipped: { label: "Shipped", accent: false },
  concept: { label: "Concept", accent: false },
  archived: { label: "Archived", accent: false },
};

export function ProjectRecord({
  project,
  accession,
}: {
  project: Project;
  accession: string;
}) {
  const status = STATUS[project.status];
  return (
    <article className="border-t border-[var(--border)]">
      <Link
        href={`/projects/${project.slug}`}
        className="group block py-8 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between">
          <div className="max-w-2xl">
            <p className="accession">
              {accession}
              <span aria-hidden="true" className="mx-2 text-[var(--border-strong)]">
                ·
              </span>
              <span
                className={
                  status.accent
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-muted)]"
                }
              >
                {status.label}
              </span>
            </p>

            <h3 className="mt-3 font-display text-h3 text-[var(--text-strong)] transition-colors group-hover:text-[var(--accent)]">
              {project.title}
            </h3>

            {project.tagline && (
              <p className="mt-2 text-body-lg text-[var(--text-muted)]">
                {project.tagline}
              </p>
            )}

            {project.stack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.slice(0, 5).map((t) => (
                  <Chip key={t} variant="ghost">
                    {t}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          <span className="shrink-0 font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]">
            Read the record{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
