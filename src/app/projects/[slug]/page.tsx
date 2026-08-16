import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Button, Chip } from "@/components/ui";
import { getProjects, getProjectDoc, projectIndex } from "@/lib/projects";
import { buildMetadata } from "@/lib/seo";
import { accession, formatDate } from "@/lib/utils";
import { SITE } from "@/constants";
import type { Project } from "@/types/content";

/**
 * /projects/[slug] — a single project record.
 */

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getProjectDoc(slug);
  if (!doc) return buildMetadata({ title: "Record not found", noindex: true });
  const p = doc.frontmatter;
  return buildMetadata({
    title: `${p.title} — Project`,
    description: p.tagline,
    path: `/projects/${p.slug}`,
  });
}

const STATUS_LABEL: Record<Project["status"], string> = {
  building: "Building",
  completed: "Completed",
  shipped: "Shipped",
  concept: "Concept",
  archived: "Archived",
};

export default async function ProjectRecordPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getProjectDoc(slug);
  if (!doc) notFound();

  const p = doc.frontmatter;
  const idx = projectIndex(p.slug);
  const code = accession("MA", new Date().getFullYear(), idx);
  const hasBody =
    Boolean(p.problem || p.solution || p.role || p.architecture) ||
    p.impact.length > 0 ||
    p.lessons.length > 0;

  return (
    <article className="mx-auto max-w-3xl px-6 md:px-10">
      {/* Masthead */}
      <header className="flex items-center justify-between py-6 border-b border-[var(--hairline)]">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]"
        >
          <span className="h-1.5 w-1.5 rounded-xs bg-[var(--accent)]" aria-hidden="true" />
          <span className="font-annotation text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            {SITE.name}
          </span>
        </Link>
        <Link
          href="/"
          className="font-annotation text-xs uppercase tracking-[0.12em] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
        >
          ← Home
        </Link>
      </header>

      <hr className="rule" />

      {/* Record head */}
      <div className="pb-12 pt-[clamp(2.5rem,7vh,5rem)]">
        <p className="accession">
          {code}
          <span aria-hidden="true" className="mx-2 text-[var(--border-strong)]">
            ·
          </span>
          {STATUS_LABEL[p.status]}
          {p.updatedAt && (
            <>
              <span
                aria-hidden="true"
                className="mx-2 text-[var(--border-strong)]"
              >
                ·
              </span>
              Updated {formatDate(p.updatedAt)}
            </>
          )}
        </p>

        <h1 className="mt-5 font-display text-display-xl text-[var(--text-strong)]">
          {p.title}
        </h1>

        {p.tagline && (
          <p className="lede mt-6 text-[var(--text)]">{p.tagline}</p>
        )}

        {(p.stack.length > 0 || p.links.demo || p.links.github) && (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            {p.stack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {p.stack.map((t) => (
                  <Chip key={t} variant="ghost">
                    {t}
                  </Chip>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {p.links.demo && (
                <Button asChild variant="secondary" size="sm">
                  <a href={p.links.demo} target="_blank" rel="noopener noreferrer">
                    Demo <ArrowUpRight className="size-3.5" />
                  </a>
                </Button>
              )}
              {p.links.github && (
                <Button asChild variant="ghost" size="sm">
                  <a
                    href={p.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub <ArrowUpRight className="size-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <hr className="rule" />

      {/* Structured record body — only what exists */}
      <div className="py-12">
        {hasBody ? (
          <div className="flex flex-col gap-10">
            <Field label="Problem" value={p.problem} />
            <Field label="Approach" value={p.solution} />
            <Field label="Role" value={p.role} />
            <Field label="Architecture" value={p.architecture} />
            <FieldList label="Impact" items={p.impact} />
            <FieldList label="What it taught" items={p.lessons} />
          </div>
        ) : (
          <p className="lede measure text-[var(--text-muted)]">
            This record is being written. The problem, the approach, and what it
            taught are on their way — check the field log for progress.
          </p>
        )}
      </div>

      <footer className="border-t border-[var(--border)] py-8">
        <Link
          href="/#projects"
          className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
        >
          ← Back to the records
        </Link>
      </footer>
    </article>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <section>
      <h2 className="font-mono text-mono-label uppercase text-[var(--text-muted)]">
        {label}
      </h2>
      <p className="measure mt-3 text-body-lg text-[var(--text)]">{value}</p>
    </section>
  );
}

function FieldList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="font-mono text-mono-label uppercase text-[var(--text-muted)]">
        {label}
      </h2>
      <ul className="measure mt-3 flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-body-lg text-[var(--text)]">
            <span
              aria-hidden="true"
              className="mt-3 h-px w-4 shrink-0 bg-[var(--accent)]/60"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
