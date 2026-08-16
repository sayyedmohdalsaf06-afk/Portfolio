import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Card / Panel — primitive for Portfolio v2 ("In Focus").
 * Matte surface + hairline border, rectilinear geometry, no glow.
 */
const cardVariants = cva(
  "rounded-md border transition-[border-color,background-color] duration-200 ease-[var(--ease-gravity)]",
  {
    variants: {
      elevation: {
        e1: "border-[var(--border)] bg-[var(--surface)]",
        e2: "border-[var(--border)] bg-[var(--surface-raised)]",
        e3: "border-[var(--border-strong)] bg-[var(--surface-raised)]",
        e4: "border-[var(--border-accent)] bg-[var(--surface)]",
      },
      interactive: {
        true: "cursor-pointer hover:border-[var(--border-accent)] hover:bg-[var(--surface-active)]",
        false: "",
      },
    },
    defaultVariants: {
      elevation: "e2",
      interactive: false,
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Render corner ticks (framing). */
  corners?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation, interactive, corners = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ elevation, interactive }),
        corners && "hud-corners",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-5", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display text-lg font-semibold text-[var(--text-strong)]",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter, cardVariants };
