"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/system/theme-toggle";
import { HANDLES } from "@/constants";

/**
 * TopNavigation — Modern Minimalist System Navigation Instrument.
 *
 * Placed at the top of the workspace:
 *  - System Status Indicator
 *  - Waypoint navigation anchors
 *  - Theme Toggle and direct GitHub channel
 */
export function TopNavigation() {
  const [activeSection, setActiveSection] = useState<"overview" | "whoami" | "campusswap">("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const whoamiEl = document.getElementById("whoami");
      const campusswapEl = document.getElementById("project-experience");

      const whoamiTop = whoamiEl ? whoamiEl.getBoundingClientRect().top : Infinity;
      const campusswapTop = campusswapEl ? campusswapEl.getBoundingClientRect().top : Infinity;

      if (campusswapTop <= window.innerHeight * 0.45) {
        setActiveSection("campusswap");
      } else if (whoamiTop <= window.innerHeight * 0.50) {
        setActiveSection("whoami");
      } else {
        setActiveSection("overview");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`w-full border-b border-[var(--hairline)] bg-[var(--surface)]/80 backdrop-blur-md sticky top-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        mounted ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
        {/* Left: System Designation */}
        <div className="flex items-center gap-3 font-annotation text-xs">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" aria-hidden="true" />
          <span className="text-[var(--text)] font-semibold tracking-wider uppercase">
            PORTFOLIO // V2
          </span>
          <span className="text-[var(--hairline-strong)] hidden sm:inline">|</span>
          <span className="text-[var(--muted)] hidden sm:inline text-[11px]">
            BUILDER WORKSPACE
          </span>
        </div>

        {/* Center: Quick Flow Waypoints */}
        <nav aria-label="Quick Navigation" className="hidden md:flex items-center gap-1.5 font-annotation text-xs">
          <button
            type="button"
            data-cursor="clickable"
            onClick={() => scrollTo("hero")}
            className={`px-3 py-1 rounded-xs transition-all ${
              activeSection === "overview"
                ? "bg-[var(--accent)]/[0.12] border border-[var(--accent)]/40 text-[var(--accent)] font-semibold"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            01 · OVERVIEW
          </button>
          <button
            type="button"
            data-cursor="clickable"
            onClick={() => scrollTo("whoami")}
            className={`px-3 py-1 rounded-xs transition-all ${
              activeSection === "whoami"
                ? "bg-[var(--accent)]/[0.12] border border-[var(--accent)]/40 text-[var(--accent)] font-semibold"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            02 · WORKSTATION
          </button>
          <button
            type="button"
            data-cursor="clickable"
            onClick={() => scrollTo("project-experience")}
            className={`px-3 py-1 rounded-xs transition-all ${
              activeSection === "campusswap"
                ? "bg-[var(--accent)]/[0.12] border border-[var(--accent)]/40 text-[var(--accent)] font-semibold"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            03 · CAMPLX
          </button>
        </nav>

        {/* Right: GitHub & Theme Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href={HANDLES.github.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="clickable"
            className="font-annotation text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-medium uppercase"
          >
            <span>GITHUB</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
