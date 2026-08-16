import { SectionHeader, SectionShell } from "@/components/ui";
import { ExperimentRecord } from "@/components/composite/experiment-record";
import { getExperiments } from "@/lib/experiments";
import { SECTION_META } from "@/constants";

/**
 * Experiment Lab — small exploratory builds/tests (Phase 3).
 * Data-driven from /content/experiments; honest empty state until experiments
 * are logged. Calm editorial; /lab/[slug] + demos come later with content.
 */
export function Lab() {
  const experiments = getExperiments();

  return (
    <SectionShell id="learning-lab" label="Experiment Lab">
      <SectionHeader
        as="h2"
        eyebrow={SECTION_META["learning-lab"].eyebrow}
        title={SECTION_META["learning-lab"].title}
        lede="Small experiments and quick builds — hypotheses run at the frontier, kept honest about what worked and what didn't."
        className="mb-12"
      />

      {experiments.length === 0 ? (
        <p className="lede measure text-[var(--text-muted)]">
          The lab is warming up. Experiments — small tests and quick builds —
          will be logged here as they run.
        </p>
      ) : (
        <div>
          {experiments.map((experiment) => (
            <ExperimentRecord key={experiment.slug} experiment={experiment} />
          ))}
        </div>
      )}
    </SectionShell>
  );
}
