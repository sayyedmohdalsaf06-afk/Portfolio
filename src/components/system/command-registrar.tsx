"use client";

import { useEffect } from "react";
import { useCommandPalette, useMotion, useTheme } from "@/providers";
import { HANDLES } from "@/constants";

/**
 * Registers baseline ⌘K commands for Portfolio v2.
 */
export function CommandRegistrar() {
  const { registerCommands } = useCommandPalette();
  const { toggleMotion } = useMotion();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    registerCommands([
      {
        id: "github",
        label: "Open GitHub Profile",
        group: "Open",
        run: () => {
          window.open(HANDLES.github.href, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "toggle-theme",
        label: "Toggle Theme (Paper / Graphite)",
        group: "Actions",
        run: toggleTheme,
      },
      {
        id: "toggle-motion",
        label: "Toggle Motion",
        group: "Actions",
        run: toggleMotion,
      },
    ]);
  }, [registerCommands, toggleMotion, toggleTheme]);

  return null;
}
