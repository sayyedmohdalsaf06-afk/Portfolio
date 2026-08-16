import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Chip — tech tag / filter / availability pill for Portfolio v2 ("In Focus").
 * Hairline, rectilinear, matte. Interactive variant is keyboard focusable and
 * renders as a <button> when `asButton` is set.
 */
const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-sm transition-colors duration-150 ease-[var(--ease-dock)]",
  {
    variants: {
      variant: {
        default:
          "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text)]",
        accent:
          "border-[var(--border-accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]",
        ghost: "border-transparent bg-white/[0.03] text-[var(--text-muted)]",
      },
      interactive: {
        true: "cursor-pointer hover:border-[var(--border-accent)] hover:text-[var(--text-strong)] focus-visible:outline-1 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)]",
        false: "",
      },
      active: {
        true: "border-[var(--border-accent)] bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--text-strong)]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
      active: false,
    },
  },
);

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof chipVariants> {
  /** Render as a <button> (for filters/toggles). */
  asButton?: boolean;
}

const Chip = React.forwardRef<HTMLElement, ChipProps>(
  (
    { className, variant, interactive, active, asButton = false, ...props },
    ref,
  ) => {
    const classes = cn(
      chipVariants({ variant, interactive: interactive || asButton, active }),
      className,
    );

    if (asButton) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={classes}
          aria-pressed={active ?? undefined}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        />
      );
    }

    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={classes}
        {...props}
      />
    );
  },
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
