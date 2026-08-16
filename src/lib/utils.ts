import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * The standard shadcn/ui-style `cn` helper.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO date string as e.g. "Jul 2026". */
export function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Format an ISO date string as e.g. "18 Jul 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Whole days elapsed since an ISO date (inclusive of day 1). Used for the
 * masthead "DAY N in the field" readout — a value that encodes something true
 * (time spent building), unlike a per-session timer.
 */
export function daysSince(iso: string, now: Date = new Date()): number {
  const start = new Date(iso);
  if (Number.isNaN(start.getTime())) return 0;
  const ms = now.getTime() - start.getTime();
  return Math.max(1, Math.floor(ms / 86_400_000) + 1);
}

/** Build a catalogue accession code, e.g. accession("MA", 2026, 7) → "MA·2026·007". */
export function accession(prefix: string, year: number, seq: number): string {
  return `${prefix}·${year}·${String(seq).padStart(3, "0")}`;
}
