/**
 * Motion tokens & Physics Constants for Portfolio v2 ("In Focus").
 * Governed by: docs/03-interaction-philosophy.md §6
 *
 * All motion is intent-driven:
 * - Immediate to begin (<100ms)
 * - Settles to exact rest (no autonomous drift, no bounce)
 * - Respects prefers-reduced-motion
 */

/** Durations (seconds) for UI transitions. */
export const DURATION = {
  instant: 0.08,
  quick: 0.16,
  base: 0.24,
  deliberate: 0.42,
  arrival: 0.72,
} as const;

/** Cubic-bezier easing presets. */
export const EASING = {
  arrival: [0.16, 1, 0.3, 1], // ease-out, settles exactly without overshoot
  standard: [0.2, 0, 0, 1],
} as const;

/** Physics constants for physical project objects. */
export const PHYSICAL_LIMITS = {
  maxTiltDeg: 3.5, // Subtle, restrained 3D perspective tilt
  maxDragPx: 36, // Bounded drag distance on canvas/cards
  parallaxMaxPx: 4, // Living grid pointer parallax cap
  spring: {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
  },
} as const;
