"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Hero — Big Animated Centered Identity Hero (V2).
 *
 * Features:
 *  - Massive, kinetic animated name: "MOHD ALSAF" in all-caps display typography.
 *  - Centered technical builder badges, core thesis, and dual action cues.
 *  - Smooth spatial recession physics on scroll.
 *
 * @see docs/02-identity-first.md
 * @see docs/03-interaction-philosophy.md
 */
export function Hero() {
  const [stage, setStage] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Choreographed spatial arrival progression
    const t1 = setTimeout(() => setStage(1), 60);  // Kicker
    const t2 = setTimeout(() => setStage(2), 160); // Kinetic Name
    const t3 = setTimeout(() => setStage(3), 300); // Thesis & context
    const t4 = setTimeout(() => setStage(4), 440); // Action cues

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    if (prefersReduced || typeof window === "undefined") return;

    const stageEl = stageRef.current;
    if (!stageEl) return;

    function onScroll() {
      const scrollY = window.scrollY || 0;
      const recede = Math.min(scrollY, 600);
      const stY = -recede * 0.09;
      const stScale = Math.max(0.95, 1 - recede * 0.00014);
      const stOpacity = Math.max(0.35, 1 - recede * 0.0012);

      stageEl!.style.transform = `translate3d(0, ${stY.toFixed(2)}px, 0) scale(${stScale.toFixed(4)})`;
      stageEl!.style.opacity = stOpacity.toFixed(3);
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
      className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-between pt-2 pb-3 will-change-transform text-center"
    >
      <div
        ref={stageRef}
        className="my-auto py-2 flex flex-col items-center justify-center"
      >
        {/* Kicker Technical Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-xs border border-[var(--hairline-strong)] bg-[var(--surface-raised)] font-annotation text-[11px] uppercase tracking-[0.20em] text-[var(--accent)] mb-3 shadow-xs transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage >= 1
              ? "opacity-100 translate-y-0 filter-none"
              : "opacity-0 -translate-y-3 filter blur-[2px]"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" aria-hidden="true" />
          <span>BUILDER · CSE · INTELLIGENT SYSTEMS</span>
        </div>

        {/* Big Animated Centered Name with Kinetic Specular Shimmer */}
        <h1
          id="hero-name"
          data-cursor="scan"
          className={`text-4xl sm:text-6xl md:text-7xl lg:text-[86px] font-extrabold tracking-[-0.04em] uppercase leading-[0.95] text-[var(--text)] select-none drop-shadow-xs group transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage >= 2
              ? "opacity-100 scale-100 filter-none"
              : "opacity-0 scale-95 filter blur-[6px]"
          }`}
        >
          <span className="inline-block transition-transform duration-500 group-hover:scale-[1.02] group-hover:text-[var(--accent)] animate-shimmer-sweep">
            MOHD
          </span>{" "}
          <span className="inline-block transition-transform duration-500 group-hover:scale-[1.02] animate-shimmer-sweep">
            ALSAF
          </span>
        </h1>

        {/* Core Philosophy / Headline in Vibrant Cyan-Teal */}
        <p
          data-cursor="scan"
          className={`mt-4 font-annotation text-xs sm:text-sm uppercase tracking-[0.18em] text-[var(--accent)] font-semibold max-w-xl mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage >= 3
              ? "opacity-100 translate-y-0 filter-none"
              : "opacity-0 translate-y-4 filter blur-[2px]"
          }`}
        >
          I turn ideas into working things – and I figure them out in the open.
        </p>

        {/* Supporting Context */}
        <p
          data-cursor="scan"
          className={`mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-[var(--muted)] max-w-2xl mx-auto font-normal transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage >= 3
              ? "opacity-100 translate-y-0 filter-none"
              : "opacity-0 translate-y-4 filter blur-[2px]"
          }`}
        >
          Documenting software experiments, algorithmic logic, and AI systems. Building practical tools and learning in public on the journey toward impactful intelligent products.
        </p>

        {/* Centered Action Cues */}
        <div
          className={`mt-5 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage >= 4
              ? "opacity-100 translate-y-0 scale-100 filter-none"
              : "opacity-0 translate-y-4 scale-95 filter blur-[2px]"
          }`}
        >
          <button
            type="button"
            onClick={scrollToProject}
            data-cursor="clickable"
            className="group inline-flex items-center gap-2 font-annotation text-xs sm:text-sm text-[var(--accent)] border border-[var(--accent)]/50 px-5 py-2 rounded-xs bg-[var(--accent)]/[0.08] hover:bg-[var(--accent)] hover:text-[var(--surface)] transition-all duration-200 shadow-xs font-medium"
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
            className="inline-flex items-center gap-2 font-annotation text-xs sm:text-sm text-[var(--text)] border border-[var(--hairline-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--surface-raised)] px-4 py-2 rounded-xs transition-all duration-200"
          >
            <span>View Interactive Object</span>
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      </div>

      {/* Bottom Viewport Anchor & Scroll Indicator */}
      <div className="pt-3 pb-1 border-t border-[var(--hairline)] flex items-center justify-between font-mono text-[11px] text-[var(--muted)] select-none">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" aria-hidden="true" />
          <span>SCROLL DOWN FOR WORKSTATION &amp; PROJECTS</span>
        </div>
        <span className="hidden sm:inline text-[10px] tracking-wider font-mono">SEC // 01 · OVERVIEW</span>
      </div>
    </section>
  );
}
