import type { AnalyticsEvent, AnalyticsProps } from "./events";
import { resolveProvider, type AnalyticsProvider } from "./providers";

export { EVENTS } from "./events";
export type { AnalyticsEvent, AnalyticsProps } from "./events";

let provider: AnalyticsProvider | null = null;

function getProvider(): AnalyticsProvider {
  if (!provider) {
    provider = resolveProvider(process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER);
    provider.init();
  }
  return provider;
}

/**
 * Public analytics API. Call from anywhere:
 *   track(EVENTS.resumeDownloaded, { location: "hero" });
 *
 * Foundation only in Phase 2 (default provider = no-op). Wired to a real
 * provider in Phase 7.
 */
export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  try {
    getProvider().track(event, props);
  } catch {
    // Analytics must never break the app.
  }
}

export function initAnalytics(): void {
  getProvider();
}
