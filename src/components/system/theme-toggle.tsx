"use client";

import { useTheme } from "@/providers";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeToggle — In Focus dual-theme switch (Paper & Ink <-> Graphite).
 * @see docs/04-visual-identity.md §2
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-sm border border-[var(--hairline)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
      aria-label={`Switch to ${theme === "light" ? "dark (Graphite)" : "light (Paper & Ink)"} mode`}
      title={`Current: ${theme === "light" ? "Paper & Ink" : "Graphite"}`}
    >
      {theme === "light" ? (
        <>
          <Moon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-annotation tracking-wider">GRAPHITE</span>
        </>
      ) : (
        <>
          <Sun className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-annotation tracking-wider">PAPER</span>
        </>
      )}
    </button>
  );
}
