import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SectionHeader — editorial section header for Portfolio v2 ("In Focus").
 *
 * A quiet mono kicker (with a small tick) + a display title, with room to
 * breathe. An optional serif `lede` carries the editorial lead-paragraph voice.
 * Chrome is deliberately restrained so the content leads.
 * @see docs/24-design-system-deep-field.md
 */
export interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono, uppercase observatory kicker, e.g. "RESEARCH RECORDS". */
  eyebrow?: string;
  title: string;
  /** Serif editorial lead paragraph (Newsreader). */
  lede?: string;
  /** Plain supporting description (sans). */
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  description,
  href,
  linkLabel = "Open log",
  align = "left",
  as = "h2",
  className,
  ...props
}: SectionHeaderProps) {
  const Heading = as;
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        href && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          align === "center" && "items-center",
        )}
      >
        {eyebrow && (
          <span
            className={cn(
              "flex items-center gap-2.5 font-mono text-mono-label uppercase text-[var(--text-muted)]",
              align === "center" && "justify-center",
            )}
          >
            <span
              aria-hidden="true"
              className="inline-block h-2 w-px bg-[var(--accent)]"
            />
            {eyebrow}
          </span>
        )}

        <Heading
          className={cn(
            "font-display font-semibold text-[var(--text-strong)]",
            as === "h1" ? "text-h1" : as === "h3" ? "text-h3" : "text-h2",
          )}
        >
          {title}
        </Heading>

        {lede && (
          <p
            className={cn(
              "lede measure text-[var(--text)]",
              align === "center" && "mx-auto",
            )}
          >
            {lede}
          </p>
        )}

        {description && (
          <p
            className={cn(
              "measure text-body text-[var(--text-muted)]",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline-1 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)]"
        >
          {linkLabel}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}
