"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Hero — Portfolio v2 ("In Focus").
 * Answers: WHAT DOES HE BUILD / THINK ABOUT?
 * Features continuous spatial recession and clean complementary hierarchy.
 * @see docs/02-identity-first.md
 * @see docs/03-interaction-philosophy.md
 */
export function Hero() {
  const [resolved, setResolved] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Arrival resolve: settles into focus on mount
    const timer = setTimeout(() => setResolved(true), 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prefersReduced || typeof window === "undefined") return;

    const stage = stageRef.current;
    if (!stage) return;

    function onScroll() {
      const scrollY = window.scrollY || 0;
      // Controlled, gentle recession (Hero stays identifiable and readable)
      const recede = Math.min(scrollY, 600);
      const stY = -recede * 0.08;
      const stScale = Math.max(0.96, 1 - recede * 0.00012);
      const stOpacity = Math.max(0.45, 1 - recede * 0.001);

      stage!.style.transform = `translate3d(0, ${stY.toFixed(2)}px, 0) scale(${stScale.toFixed(4)})`;
      stage!.style.opacity = stOpacity.toFixed(3);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReduced]);

  const scrollToProject = () => {
    const el = document.getElementById("project-experience");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-thesis"
      className="relative min-h-[70vh] flex flex-col justify-center py-8 lg:py-16 will-change-transform"
    >
      <div
        ref={stageRef}
        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          resolved ? "opacity-100 translate-y-0 filter-none" : "opacity-0 translate-y-4 blur-[2px]"
        }`}
      >
        {/* Kicker */}
        <p className="font-annotation text-xs tracking-[0.16em] uppercase text-[var(--muted)] mb-4" data-cursor="scan">
          Builder · Exploring Intelligent Systems
        </p>

        {/* Headline: WHAT DOES HE BUILD / THINK ABOUT? */}
        <h1
          id="hero-thesis"
          data-cursor="scan"
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--text)] select-none max-w-2xl"
        >
          I turn ideas into working things — and I figure them out in the open.
        </h1>

        {/* Supporting Context */}
        <p
          data-cursor="scan"
          className="mt-6 text-base sm:text-lg leading-[1.5] text-[var(--muted)] max-w-xl font-normal"
        >
          Documenting software experiments, algorithmic logic, and AI systems. Building practical tools and learning in public on the journey toward impactful intelligent products.
        </p>

        {/* Action Cue to CampusSwap */}
        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={scrollToProject}
            data-cursor="clickable"
            className="group inline-flex items-center gap-2 font-annotation text-xs sm:text-sm text-[var(--accent-ink)] border border-[var(--hairline)] px-3.5 py-2 rounded-xs bg-[var(--surface-raised)]/40 hover:border-[var(--accent)] hover:bg-[var(--accent)]/[0.04] transition-all"
          >
            <span>Explore CampusSwap AI</span>
            <span className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">
              ↓
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
