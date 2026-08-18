"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AnimeScrollMascot } from "./anime-scroll-mascot";

/**
 * Hero — Big Animated Centered Identity Hero (V2).
 *
 * Features:
 *  - Massive, kinetic animated name: "MOHD ALSAF" in all-caps display typography.
 *  - Centered technical builder badges, core thesis, and dual action cues.
 *  - Animated Anime Chibi Developer Mascot scroll guide.
 *  - Smooth spatial recession physics on scroll.
 *
 * @see docs/02-identity-first.md
 * @see docs/03-interaction-philosophy.md
 */
export function Hero() {
  const [resolved, setResolved] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Smooth arrival trigger on mount
    const timer = setTimeout(() => setResolved(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prefersReduced || typeof window === "undefined") return;

    const stage = stageRef.current;
    if (!stage) return;

    function onScroll() {
      const scrollY = window.scrollY || 0;
      const recede = Math.min(scrollY, 600);
      const stY = -recede * 0.09;
      const stScale = Math.max(0.95, 1 - recede * 0.00014);
      const stOpacity = Math.max(0.35, 1 - recede * 0.0012);

      stage!.style.transform = `translate3d(0, ${stY.toFixed(2)}px, 0) scale(${stScale.toFixed(4)})`;
      stage!.style.opacity = stOpacity.toFixed(3);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReduced]);

  const scrollToIdentity = () => {
    const el = document.getElementById("whoami") || document.getElementById("identity-card-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToProject = () => {
    const el = document.getElementById("project-experience");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-between pt-4 pb-6 will-change-transform text-center"
    >
      <div
        ref={stageRef}
        className={`my-auto py-6 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          resolved ? "opacity-100 translate-y-0 filter-none" : "opacity-0 translate-y-6 blur-[3px]"
        }`}
      >
        {/* Kicker Technical Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xs border border-[var(--hairline-strong)] bg-[var(--surface-raised)] font-annotation text-[11px] uppercase tracking-[0.20em] text-[var(--accent)] mb-5 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" aria-hidden="true" />
          <span>BUILDER · CSE · INTELLIGENT SYSTEMS</span>
        </div>

        {/* Big Animated Centered Name in CAPS */}
        <h1
          id="hero-name"
          data-cursor="scan"
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[104px] font-extrabold tracking-[-0.04em] uppercase leading-[0.95] text-[var(--text)] select-none drop-shadow-xs group transition-transform duration-300"
        >
          <span className="inline-block transition-transform duration-500 group-hover:scale-[1.02] group-hover:text-[var(--accent)]">
            MOHD
          </span>{" "}
          <span className="inline-block transition-transform duration-500 group-hover:scale-[1.02]">
            ALSAF
          </span>
        </h1>

        {/* Core Philosophy / Headline in Vibrant Cyan-Teal / Deep Teal */}
        <p
          data-cursor="scan"
          className="mt-6 font-annotation text-xs sm:text-sm uppercase tracking-[0.18em] text-[var(--accent)] font-semibold max-w-xl mx-auto"
        >
          I turn ideas into working things – and I figure them out in the open.
        </p>

        {/* Supporting Context */}
        <p
          data-cursor="scan"
          className="mt-3 text-sm sm:text-base md:text-lg leading-relaxed text-[var(--muted)] max-w-2xl mx-auto font-normal"
        >
          Documenting software experiments, algorithmic logic, and AI systems. Building practical tools and learning in public on the journey toward impactful intelligent products.
        </p>

        {/* Centered Action Cues */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={scrollToProject}
            data-cursor="clickable"
            className="group inline-flex items-center gap-2 font-annotation text-xs sm:text-sm text-[var(--accent)] border border-[var(--accent)]/50 px-5 py-2.5 rounded-xs bg-[var(--accent)]/[0.08] hover:bg-[var(--accent)] hover:text-[var(--surface)] transition-all duration-200 shadow-xs font-medium"
          >
            <span>Explore CAMPLX</span>
            <span className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </button>

          <button
            type="button"
            onClick={scrollToIdentity}
            data-cursor="clickable"
            className="inline-flex items-center gap-2 font-annotation text-xs sm:text-sm text-[var(--text)] border border-[var(--hairline-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--surface-raised)] px-4 py-2.5 rounded-xs transition-all duration-200"
          >
            <span>View Interactive Object</span>
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      </div>

      {/* Bottom Viewport Anchor & Animated Anime Mascot Guide */}
      <div className="pt-4 border-t border-[var(--hairline)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[var(--muted)] select-none">
        <AnimeScrollMascot onScrollDown={scrollToIdentity} />
        <span className="hidden sm:inline text-[10px] tracking-wider font-mono">SEC // 01 · OVERVIEW</span>
      </div>
    </section>
  );
}
