/**
 * Typed analytics event catalog — the single source of truth for everything
 * we might track. Components call `track(EVENTS.x, props)`; adding an event
 * here is the only way to introduce one. Keeps analytics auditable + privacy
 * conscious (no PII in props).
 * @see docs/16-seo-strategy.md §9, docs/17-performance-strategy.md §10
 */

export const EVENTS = {
  bootSkipped: "boot_skipped",
  bootCompleted: "boot_completed",
  commandPaletteOpened: "command_palette_opened",
  commandExecuted: "command_executed",
  motionToggled: "motion_toggled",
  resumeDownloaded: "resume_downloaded",
  projectDemoClicked: "project_demo_clicked",
  projectGithubClicked: "project_github_clicked",
  contactChannelClicked: "contact_channel_clicked",
  emailCopied: "email_copied",
  outboundLinkClicked: "outbound_link_clicked",
} as const;

export type AnalyticsEvent = (typeof EVENTS)[keyof typeof EVENTS];

/** Event properties must be flat, primitive, and PII-free. */
export type AnalyticsProps = Record<
  string,
  string | number | boolean | undefined
>;
