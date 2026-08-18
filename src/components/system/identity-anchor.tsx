"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/system/theme-toggle";
import { HANDLES } from "@/constants";

/**
 * IdentityAnchor — Persistent Navigation Flow Instrument (Left Column).
 * Streamlined flow indicator tracking section waypoints without duplicate name redundancy.
 * @see docs/02-identity-first.md
 */
export function IdentityAnchor() {
  const [activeSection, setActiveSection] = useState<"overview" | "identity" | "whoami" | "campusswap">("overview");

  useEffect(() => {
    const handleScroll = () => {
      const identityCardEl = document.getElementById("identity-card-section");
      const whoamiEl = document.getElementById("whoami");
      const campusswapEl = document.getElementById("project-experience");

      const identityTop = identityCardEl ? identityCardEl.getBoundingClientRect().top : Infinity;
      const whoamiTop = whoamiEl ? whoamiEl.getBoundingClientRect().top : Infinity;
      const campusswapTop = campusswapEl ? campusswapEl.getBoundingClientRect().top : Infinity;

      if (campusswapTop <= window.innerHeight * 0.45) {
        setActiveSection("campusswap");
      } else if (whoamiTop <= window.innerHeight * 0.50) {
        setActiveSection("whoami");
      } else if (identityTop <= window.innerHeight * 0.55) {
        setActiveSection("identity");
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
    <aside
      aria-label="Navigation and system flow"
      className="w-full lg:w-[260px] shrink-0 lg:sticky lg:top-8 flex flex-col justify-between py-2 sm:py-4 self-start lg:border-r lg:border-[var(--hairline)] lg:pr-7 space-y-6"
    >
      {/* Top Header: System Label & Theme Toggle */}
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[var(--hairline)]">
          <span className="font-annotation text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
            SYSTEM <span className="text-[var(--text)] font-semibold">· NAVIGATION</span>
          </span>
          <ThemeToggle />
        </div>

        {/* Live Focus Status Indicator */}
        <div
          data-cursor="scan"
          className="mb-6 p-3 rounded-xs border border-[var(--hairline)] bg-[var(--surface-raised)]/50 text-xs font-annotation"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" aria-hidden="true" />
            <span className="text-[var(--muted)] text-[10px] uppercase tracking-wider font-semibold">CURRENT FOCUS</span>
          </div>
          <p className="text-[var(--text)] font-medium text-xs leading-snug">
            Building CAMPLX
          </p>
          <span className="text-[10px] text-[var(--muted)] block mt-0.5 font-mono">
            Pune, India · Active Builder
          </span>
        </div>

        {/* Flow Waypoints (Section Indicators) */}
        <div className="mb-2">
          <span className="font-annotation text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] block mb-2 font-semibold">
            WAYPOINTS
          </span>
          <nav aria-label="Page Sections" className="space-y-1 font-annotation text-xs">
            <button
              type="button"
              data-cursor="clickable"
              onClick={() => scrollTo("hero")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xs transition-colors text-left ${
                activeSection === "overview"
                  ? "bg-[var(--accent)]/[0.08] text-[var(--accent-ink)] font-semibold border-l-2 border-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hairline)]/20"
              }`}
            >
              <span>01 · Overview</span>
              {activeSection === "overview" && <span aria-hidden="true" className="text-[10px]">●</span>}
            </button>

            <button
              type="button"
              data-cursor="clickable"
              onClick={() => scrollTo("identity-card-section")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xs transition-colors text-left ${
                activeSection === "identity"
                  ? "bg-[var(--accent)]/[0.08] text-[var(--accent-ink)] font-semibold border-l-2 border-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hairline)]/20"
              }`}
            >
              <span>02 · Identity Object</span>
              {activeSection === "identity" && <span aria-hidden="true" className="text-[10px]">●</span>}
            </button>

            <button
              type="button"
              data-cursor="clickable"
              onClick={() => scrollTo("whoami")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xs transition-colors text-left ${
                activeSection === "whoami"
                  ? "bg-[var(--accent)]/[0.08] text-[var(--accent-ink)] font-semibold border-l-2 border-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hairline)]/20"
              }`}
            >
              <span>03 · Workstation</span>
              {activeSection === "whoami" && <span aria-hidden="true" className="text-[10px]">●</span>}
            </button>

            <button
              type="button"
              data-cursor="clickable"
              onClick={() => scrollTo("project-experience")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xs transition-colors text-left ${
                activeSection === "campusswap"
                  ? "bg-[var(--accent)]/[0.08] text-[var(--accent-ink)] font-semibold border-l-2 border-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hairline)]/20"
              }`}
            >
              <span>04 · CAMPLX</span>
              {activeSection === "campusswap" && <span aria-hidden="true" className="text-[10px]">●</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Channels: GitHub */}
      <div className="border-t border-[var(--hairline)] pt-3 font-annotation text-xs">
        <Link
          href={HANDLES.github.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="clickable"
          className="group flex items-center justify-between py-1 text-[var(--accent-ink)] hover:underline"
        >
          <span>github.com/sayyedmohdalsaf06-afk</span>
          <span className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">
            ↗
          </span>
        </Link>
      </div>
    </aside>
  );
}
