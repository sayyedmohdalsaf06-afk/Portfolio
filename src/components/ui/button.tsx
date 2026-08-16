import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — primitive for Portfolio v2 ("In Focus").
 * Clean hairline and accent controls with precise focus rings.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[color,background-color,border-color,transform] duration-200 ease-[var(--ease-dock)] focus-visible:outline-1 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Lit instrument control
        primary:
          "bg-[var(--accent)] text-[var(--color-void)] hover:bg-[var(--accent-hover)]",
        // Hairline HUD control
        secondary:
          "border border-[var(--border-strong)] bg-transparent text-[var(--text-strong)] hover:border-[var(--border-accent)] hover:bg-white/[0.03]",
        ghost:
          "text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-[var(--text-strong)]",
        outline:
          "border border-[var(--border-accent)] bg-transparent text-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]",
        link: "text-[var(--signal)] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
