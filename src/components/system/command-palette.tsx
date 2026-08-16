"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useCommandPalette, type Command } from "@/providers/command-provider";
import { cn } from "@/lib/utils";

/**
 * CommandPalette — In Focus ⌘K launcher for Portfolio v2.
 * @see docs/03-interaction-philosophy.md
 */
export function CommandPalette() {
  const { open, setOpen, commands, runCommand } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when opened; reset state when closed.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        c.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }, [commands, query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = results[active];
      if (cmd) runCommand(cmd);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onKeyDown={onKeyDown}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close command palette"
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-sm border border-[var(--hairline-strong)] bg-[var(--surface-raised)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--hairline)] px-4">
          <Search className="size-4 text-[var(--muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search commands or jump..."
            className="h-12 w-full bg-transparent font-sans text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
          />
          <kbd className="rounded border border-[var(--hairline)] px-1.5 py-0.5 font-annotation text-[0.6875rem] text-[var(--muted)]">
            ESC
          </kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center font-annotation text-xs text-[var(--muted)]">
              No matching commands.
            </li>
          ) : (
            results.map((cmd: Command, i) => (
              <li key={cmd.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => runCommand(cmd)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors",
                    i === active
                      ? "bg-[var(--accent)]/10 text-[var(--accent-ink)] font-medium"
                      : "text-[var(--text)] hover:bg-[var(--hairline)]",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="font-annotation text-[0.6875rem] uppercase tracking-wide text-[var(--muted)]">
                      {cmd.group}
                    </span>
                    {cmd.label}
                  </span>
                  {cmd.shortcut && (
                    <kbd className="rounded border border-[var(--hairline)] px-1.5 py-0.5 font-annotation text-[0.6875rem] text-[var(--muted)]">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
