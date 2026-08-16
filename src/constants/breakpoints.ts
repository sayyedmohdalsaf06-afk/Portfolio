/**
 * Breakpoint values (px) for JS logic — mirror of the Tailwind defaults used
 * across the design system. Prefer CSS/utility breakpoints in markup; use
 * these only where JS must branch on viewport (e.g. particle density).
 * @see docs/09-design-system.md §11
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Content container max width (px). */
export const CONTAINER_MAX = 1280;
