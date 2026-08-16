import type { AnalyticsEvent, AnalyticsProps } from "./events";

/**
 * Provider-agnostic analytics adapter. The rest of the app never talks to a
 * vendor SDK directly — swapping Vercel Analytics ↔ Plausible ↔ none is a
 * one-line env change (NEXT_PUBLIC_ANALYTICS_PROVIDER).
 */
export interface AnalyticsProvider {
  readonly name: string;
  init(): void;
  track(event: AnalyticsEvent, props?: AnalyticsProps): void;
}

/** Default: no-op (privacy-first; ships nothing until explicitly enabled). */
export const noopProvider: AnalyticsProvider = {
  name: "none",
  init() {},
  track() {},
};

/**
 * Plausible adapter (script injected in layout when enabled). Uses the global
 * `plausible()` queue if present; safely no-ops otherwise.
 */
export const plausibleProvider: AnalyticsProvider = {
  name: "plausible",
  init() {},
  track(event, props) {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      plausible?: (e: string, opts?: { props?: AnalyticsProps }) => void;
    };
    w.plausible?.(event, props ? { props } : undefined);
  },
};

/**
 * Vercel Analytics adapter. Wires to `@vercel/analytics` custom events when
 * that package is added (Phase 7). Kept as a safe stub for now.
 */
export const vercelProvider: AnalyticsProvider = {
  name: "vercel",
  init() {},
  track(event, props) {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      va?: (cmd: string, event: string, props?: AnalyticsProps) => void;
    };
    w.va?.("event", event, props);
  },
};

export function resolveProvider(name: string | undefined): AnalyticsProvider {
  switch (name) {
    case "plausible":
      return plausibleProvider;
    case "vercel":
      return vercelProvider;
    default:
      return noopProvider;
  }
}
