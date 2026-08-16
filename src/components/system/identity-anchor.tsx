"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/system/theme-toggle";
import { HANDLES, SITE } from "@/constants";

/**
 * IdentityAnchor — Quiet, persistent left identity anchor.
 * Answers: WHO IS HE? (Mohd Alsaf, 2nd-year CSE, Builder).
 * Stays sticky on desktop; acts as top identity header on mobile.
 * @see docs/02-identity-first.md
 */
export function IdentityAnchor() {
  const [activeSection, setActiveSection] = useState<"overview" | "campusswap">("overview");

  useEffect(() => {
    const handleScroll = () => {
      const campusswapEl = document.getElementById("project-experience");
      if (!campusswapEl) return;
      const rect = campusswapEl.getBoundingClientRect();
      // When CampusSwap enters the upper viewport
      if (rect.top <= window.innerHeight * 0.45) {
        setActiveSection("campusswap");
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
      aria-label="Identity and navigation"
      className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-8 flex flex-col justify-between py-6 px-6 sm:px-8 border border-[var(--hairline)] rounded-sm bg-[var(--surface-raised)]/60 backdrop-blur-sm self-start"
    >
      {/* Top Header: Identity & Theme Toggle */}
      <div>
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4 mb-6">
          <span className="font-annotation text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            Portfolio <span className="text-[var(--text)] font-semibold">· In Focus</span>
          </span>
          <ThemeToggle />
        </div>

        {/* Name & Primary Role */}
        <div className="mb-6">
          <h2
            data-cursor="scan"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)]"
          >
            {SITE.name}
          </h2>
          <p
            data-cursor="scan"
            className="mt-1.5 text-xs sm:text-sm text-[var(--muted)] font-normal leading-relaxed"
          >
            2nd-year CSE · Exploring AI & Systems
          </p>
          <p data-cursor="scan" className="font-annotation text-xs text-[var(--muted)] mt-1">
            {SITE.author.location}
          </p>
        </div>

        {/* Current Focus / Status Dot */}
        <div
          data-cursor="scan"
          className="mb-8 flex items-start gap-2.5 p-3 rounded-xs border border-[var(--hairline)] bg-[var(--surface)] text-xs font-annotation"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-sm bg-[var(--accent)] mt-1 shrink-0" aria-hidden="true" />
          <div className="text-[var(--text)] leading-snug">
            <span className="text-[var(--muted)] block text-[10px] uppercase tracking-wider mb-0.5">CURRENT FOCUS</span>
            <span>Building CampusSwap AI & exploring intelligent systems</span>
          </div>
        </div>

        {/* Waypoints (Section Indicator) */}
        <nav aria-label="Page Sections" className="mb-8 space-y-1 font-annotation text-xs">
          <button
            type="button"
            data-cursor="clickable"
            onClick={() => scrollTo("hero")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xs transition-colors text-left ${
              activeSection === "overview"
                ? "bg-[var(--accent)]/[0.08] text-[var(--accent-ink)] font-semibold border-l-2 border-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hairline)]/30"
            }`}
          >
            <span>01 · Overview</span>
            {activeSection === "overview" && <span aria-hidden="true">●</span>}
          </button>

          <button
            type="button"
            data-cursor="clickable"
            onClick={() => scrollTo("project-experience")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xs transition-colors text-left ${
              activeSection === "campusswap"
                ? "bg-[var(--accent)]/[0.08] text-[var(--accent-ink)] font-semibold border-l-2 border-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hairline)]/30"
            }`}
          >
            <span>02 · CampusSwap AI</span>
            {activeSection === "campusswap" && <span aria-hidden="true">●</span>}
          </button>
        </nav>
      </div>

      {/* Bottom Channels: GitHub & Direct Contact */}
      <div className="border-t border-[var(--hairline)] pt-4 space-y-2 font-annotation text-xs">
        <Link
          href={HANDLES.github.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="clickable"
          className="group flex items-center justify-between py-1.5 text-[var(--accent-ink)] hover:underline"
        >
          <span>github.com/sayyedmohdalsaf06-afk</span>
          <span className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </aside>
  );
}
