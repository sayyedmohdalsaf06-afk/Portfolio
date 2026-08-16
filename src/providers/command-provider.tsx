"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { track, EVENTS } from "@/lib/analytics";

/**
 * CommandPaletteProvider — owns ⌘K / Ctrl+K open state and the command
 * registry. The palette UI (system/command-palette.tsx) consumes this.
 * A full command set + search lands in Phase 7; Phase 2 wires the plumbing
 * and the global shortcut.
 * @see docs/21-section-specifications.md (Global chrome → Command Palette)
 */

export type CommandGroup = "Go to" | "Open" | "Actions";

export interface Command {
  id: string;
  label: string;
  group: CommandGroup;
  /** Optional keyword hints for search. */
  keywords?: string[];
  /** Executed on select. */
  run: () => void;
  /** Optional shortcut hint shown on the right (e.g. "⌘K"). */
  shortcut?: string;
}

interface CommandContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  commands: Command[];
  registerCommands: (commands: Command[]) => void;
  runCommand: (command: Command) => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) track(EVENTS.commandPaletteOpened);
      return next;
    });
  }, []);

  const registerCommands = useCallback((incoming: Command[]) => {
    setCommands((prev) => {
      const byId = new Map(prev.map((c) => [c.id, c]));
      for (const c of incoming) byId.set(c.id, c);
      return Array.from(byId.values());
    });
  }, []);

  const runCommand = useCallback((command: Command) => {
    track(EVENTS.commandExecuted, { command: command.id });
    command.run();
    setOpen(false);
  }, []);

  // Global shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const value = useMemo<CommandContextValue>(
    () => ({ open, setOpen, toggle, commands, registerCommands, runCommand }),
    [open, toggle, commands, registerCommands, runCommand],
  );

  return (
    <CommandContext.Provider value={value}>{children}</CommandContext.Provider>
  );
}

export function useCommandPalette(): CommandContextValue {
  const ctx = useContext(CommandContext);
  if (!ctx)
    throw new Error(
      "useCommandPalette must be used within a CommandPaletteProvider",
    );
  return ctx;
}
