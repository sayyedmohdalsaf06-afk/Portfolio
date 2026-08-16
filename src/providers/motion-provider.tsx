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
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { track, EVENTS } from "@/lib/analytics";

/**
 * MotionProvider — the single authority on whether animation should run.
 *
 * `motionEnabled` combines the OS `prefers-reduced-motion` setting with a
 * user override (persisted, toggleable via ⌘K / footer). Every animated
 * component reads `useMotion()` so nothing animates without consent.
 * @see docs/12-animation-roadmap.md §7, docs/18-accessibility-strategy.md §2
 */

const STORAGE_KEY = "alsaf_motion";

interface MotionContextValue {
  /** OS-level preference. */
  prefersReduced: boolean;
  /** User's explicit override, or null if following the OS. */
  userOverride: boolean | null;
  /** Final decision: should rich motion run? */
  motionEnabled: boolean;
  /** Toggle the user override (on ⇄ off). */
  toggleMotion: () => void;
  /** Reset to follow the OS setting. */
  resetMotion: () => void;
}

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReduced = usePrefersReducedMotion();
  const [userOverride, setUserOverride] = useState<boolean | null>(null);

  // Hydrate the persisted override once on mount.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "on") setUserOverride(true);
      else if (stored === "off") setUserOverride(false);
    } catch {
      /* ignore */
    }
  }, []);

  const motionEnabled = userOverride ?? !prefersReduced;

  // Expose the decision to CSS via a data attribute (progressive enhancement).
  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "on" : "off";
  }, [motionEnabled]);

  const toggleMotion = useCallback(() => {
    setUserOverride((prev) => {
      const next = !(prev ?? !prefersReduced);
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      track(EVENTS.motionToggled, { enabled: next });
      return next;
    });
  }, [prefersReduced]);

  const resetMotion = useCallback(() => {
    setUserOverride(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<MotionContextValue>(
    () => ({
      prefersReduced,
      userOverride,
      motionEnabled,
      toggleMotion,
      resetMotion,
    }),
    [prefersReduced, userOverride, motionEnabled, toggleMotion, resetMotion],
  );

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotion(): MotionContextValue {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error("useMotion must be used within a MotionProvider");
  return ctx;
}
