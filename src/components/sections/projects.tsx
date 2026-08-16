import { SectionHeader, SectionShell } from "@/components/ui";
import { ProjectRecord } from "@/components/composite/project-record";
import { getProjects } from "@/lib/projects";
import { SITE, SECTION_META } from "@/constants";
import { accession } from "@/lib/utils";

/**
 * Engineering Records — the archive index (Phase 3).
 * Editorial catalogue (hairline rows, not cards), data-driven from
 * /content/projects, honest empty state. Calm; no new visual systems.
 */
export function Projects() {
  const projects = getProjects();
  const year = new Date().getFullYear();

  return (
    <SectionShell id="projects" label="Records — engineering records">
      <SectionHeader
        as="h2"
        eyebrow={SECTION_META.projects.eyebrow}
        title={SECTION_META.projects.title}
        lede="Each project is filed as a record — an exploration in what I set out to learn, the approach, and what it taught. Some are complete; some are still being written."
        className="mb-12"
      />

      {projects.length === 0 ? (
        <p className="lede measure text-[var(--text-muted)]">
          The archive opens with the first record. Projects are being written up
          — meanwhile, the field log is where the work happens.
        </p>
      ) : (
        <div>
          {projects.map((project, i) => (
            <ProjectRecord
              key={project.slug}
              project={project}
              accession={accession(SITE.accessionPrefix, year, i + 1)}
            />
          ))}
        </div>
      )}
    </SectionShell>
  );
}
