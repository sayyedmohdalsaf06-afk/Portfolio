import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SectionShell — the unit of the descent.
 *
 * Every home section uses this so the page reads as ONE continuous descent
 * into the field, not a stack of separate web pages:
 *   - a shared container + left alignment (consistent spine),
 *   - a hairline "stratum" divider at the top of each section (connective
 *     tissue that reads as descending through layers),
 *   - one consistent vertical rhythm (no doubled section paddings),
 *   - scroll-margin so anchor jumps land cleanly.
 *
 * Calm and editorial — the only device is a hairline. No new visual systems.
 */
export function SectionShell({
  id,
  label,
  divider = true,
  className,
  children,
}: {
  id: string;
  label: string;
  divider?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("scroll-mt-20", className)}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {divider && <hr className="rule-strata my-0" aria-hidden="true" />}
        <div className="py-[clamp(4rem,8vh,6.5rem)]">{children}</div>
      </div>
    </section>
  );
}
