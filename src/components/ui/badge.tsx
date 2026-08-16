import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge — status token for Portfolio v2 ("In Focus").
 * Mono, uppercase, wide-tracked — reads like a status readout. Always pairs a
 * color with TEXT (never color alone), and supports an optional status dot
 * (with slow blink) for LIVE indicators. See docs/24, docs/18 §4.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        neutral:
          "border-[var(--border)] bg-white/[0.03] text-[var(--text-muted)]",
        active:
          "border-[var(--border-accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]",
        signal:
          "border-[color-mix(in_srgb,var(--signal)_45%,transparent)] bg-[color-mix(in_srgb,var(--signal)_8%,transparent)] text-[var(--signal)]",
        alert:
          "border-[color-mix(in_srgb,var(--alert)_45%,transparent)] bg-[color-mix(in_srgb,var(--alert)_8%,transparent)] text-[var(--alert)]",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

const dotColor: Record<NonNullable<BadgeProps["variant"]>, string> = {
  neutral: "bg-[var(--text-muted)]",
  active: "bg-[var(--accent)]",
  signal: "bg-[var(--signal)]",
  alert: "bg-[var(--alert)]",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a leading status dot. */
  dot?: boolean;
  /** Blink the dot (LIVE) — gated by CSS reduced-motion. */
  pulse?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant, dot = false, pulse = false, children, ...props },
    ref,
  ) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            dotColor[variant ?? "neutral"],
            pulse && "motion-safe:animate-[blink_1.6s_step-end_infinite]",
          )}
        />
      )}
      {children}
    </span>
  ),
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
