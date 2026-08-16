"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HANDLES } from "@/constants";
import { PHYSICAL_LIMITS } from "@/constants/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type LayerId = "semantic" | "barter" | "trust";

interface ArchitectureLayer {
  id: LayerId;
  label: string;
  number: string;
  status: string;
  headline: string;
  description: string;
  explorations: string[];
}

const LAYERS: ArchitectureLayer[] = [
  {
    id: "semantic",
    number: "01",
    label: "Semantic Matching",
    status: "Active Exploration",
    headline: "Vector Search Over Student Item Descriptions",
    description:
      "Traditional campus marketplaces rely on exact keyword queries that fail when students use informal course codes, book editions, or abbreviations. I am exploring using text embeddings to map item descriptions into a shared vector space, testing whether high-relevance fuzzy matching solves student search friction.",
    explorations: [
      "Testing embedding models on student listings ('Stewart 8th ed' vs 'Calculus Early Transcendentals').",
      "Evaluating cosine similarity thresholds to match items without manual tagging.",
      "Exploring how semantic indexing handles cross-department textbook abbreviations.",
    ],
  },
  {
    id: "barter",
    number: "02",
    label: "Barter Graph",
    status: "Architecture in Progress",
    headline: "Cycle Detection for Non-Monetary Student Trades",
    description:
      "Direct 1-to-1 swaps are rare because student needs rarely align symmetrically. I am exploring constructing a directed trade graph between students and running cycle detection algorithms to discover multi-way swaps (A gives to B, B gives to C, C gives to A).",
    explorations: [
      "Modeling trade requests as directed graphs to discover 3-way swap cycles.",
      "Developing fairness heuristics based on estimated item utility and condition.",
      "Evaluating notification flows when a multi-way cycle is detected.",
    ],
  },
  {
    id: "trust",
    number: "03",
    label: "Trust Heuristics",
    status: "Planned Design",
    headline: "Verified Identity & Campus Safe Exchange",
    description:
      "Open marketplaces suffer from ghosting and scam listings. The core problem I am sitting with is trust: how do you make student-to-student exchange feel safe? I am designing campus-restricted authentication and safe drop-zone heuristics.",
    explorations: [
      "Designing verification restricted to authenticated college email domains (.edu).",
      "Proposing designated on-campus drop-zones (Campus Library, Student Center).",
      "Exploring accountability track records based on confirmed mutual handoffs.",
    ],
  },
];

const SAMPLE_SEARCHES = [
  { query: "Calculus Stewart 8th Ed", match: "Calculus: Early Transcendentals (Vector Cosine Match)" },
  { query: "Arduino Uno + Breadboard", match: "EE Hardware Starter Kit (Vector Cosine Match)" },
  { query: "Scientific Calculator Casio", match: "Casio FX-991EX ClassWiz (Vector Cosine Match)" },
];

/**
 * ProjectExperience — CampusSwap AI as an Interactive Physical Object.
 * Built with honest evidence, real explorations, and restrained tactile physical response.
 * @see docs/02-identity-first.md
 * @see docs/03-interaction-philosophy.md
 */
export function ProjectExperience() {
  const [activeLayer, setActiveLayer] = useState<LayerId>("semantic");
  const [selectedSample, setSelectedSample] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const currentLayer = LAYERS.find((l) => l.id === activeLayer)!;

  useEffect(() => {
    if (prefersReduced || typeof window === "undefined") return;

    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mqFine.matches) return;

    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    let targetRotX = 0, targetRotY = 0;
    let curRotX = 0, curRotY = 0;

    let dragging = false;
    let dragStartX = 0, dragStartY = 0;
    let dragTargetX = 0, dragTargetY = 0;
    let dragCurX = 0, dragCurY = 0;

    let rafId: number | null = null;

    function clamp(v: number, lo: number, hi: number) {
      return v < lo ? lo : v > hi ? hi : v;
    }

    function composeTransforms() {
      const rotStr = `rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
      const transStr = `translate3d(${dragCurX.toFixed(2)}px, ${dragCurY.toFixed(2)}px, 0)`;
      card!.style.transform = `${transStr} ${rotStr}`;

      // Subtle dynamic elevation shadow responding to tilt
      const shadowX = (-curRotY * 2.2).toFixed(1);
      const shadowY = (curRotX * 2.2 + 10).toFixed(1);
      card!.style.boxShadow = `${shadowX}px ${shadowY}px 22px var(--hairline-strong)`;
    }

    function frame() {
      let active = false;

      // (a) Rotation lerp
      curRotX += (targetRotX - curRotX) * 0.12;
      curRotY += (targetRotY - curRotY) * 0.12;
      if (Math.abs(targetRotX - curRotX) > 0.02 || Math.abs(targetRotY - curRotY) > 0.02) active = true;
      else { curRotX = targetRotX; curRotY = targetRotY; }

      // (b) Drag spring settle
      if (dragging) {
        active = true;
      } else {
        dragCurX += (dragTargetX - dragCurX) * 0.16;
        dragCurY += (dragTargetY - dragCurY) * 0.16;
        if (Math.abs(dragTargetX - dragCurX) > 0.04 || Math.abs(dragTargetY - dragCurY) > 0.04) active = true;
        else { dragCurX = dragTargetX; dragCurY = dragTargetY; }
      }

      composeTransforms();

      if (active) rafId = requestAnimationFrame(frame);
      else rafId = null;
    }

    function kick() {
      if (rafId === null) rafId = requestAnimationFrame(frame);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = card!.getBoundingClientRect();
      const isOver = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );

      if (isOver && !dragging) {
        const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        targetRotX = clamp(-ny * PHYSICAL_LIMITS.maxTiltDeg, -PHYSICAL_LIMITS.maxTiltDeg, PHYSICAL_LIMITS.maxTiltDeg);
        targetRotY = clamp(nx * PHYSICAL_LIMITS.maxTiltDeg, -PHYSICAL_LIMITS.maxTiltDeg, PHYSICAL_LIMITS.maxTiltDeg);
      } else if (!dragging) {
        targetRotX = 0;
        targetRotY = 0;
      }

      if (dragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragTargetX = clamp(dx, -PHYSICAL_LIMITS.maxDragPx, PHYSICAL_LIMITS.maxDragPx);
        dragTargetY = clamp(dy, -PHYSICAL_LIMITS.maxDragPx, PHYSICAL_LIMITS.maxDragPx);
        dragCurX = dragTargetX;
        dragCurY = dragTargetY;
      }

      kick();
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      const dragTrigger = target.closest("[data-drag-handle]");
      if (!dragTrigger) return;

      dragging = true;
      dragStartX = e.clientX - dragCurX;
      dragStartY = e.clientY - dragCurY;
      document.body.classList.add("is-dragging-grid");
      kick();
    }

    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      dragTargetX = 0;
      dragTargetY = 0;
      document.body.classList.remove("is-dragging-grid");
      kick();
    }

    function onPointerLeave() {
      if (!dragging) {
        targetRotX = 0;
        targetRotY = 0;
        kick();
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    card.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      card.removeEventListener("pointerleave", onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  return (
    <section
      id="project-experience"
      aria-labelledby="project-title"
      ref={containerRef}
      className="relative py-16 border-t border-[var(--hairline)]"
    >
      {/* Section Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2.5 font-annotation text-xs uppercase tracking-[0.16em] text-[var(--muted)] mb-2.5">
          <span>01 · Flagship Project</span>
          <span aria-hidden="true" className="h-2.5 w-px bg-[var(--hairline-strong)]" />
          <span className="text-[var(--accent-ink)] font-medium">Currently Building</span>
        </div>

        <h2
          id="project-title"
          data-cursor="scan"
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-[var(--text)] select-none"
        >
          CampusSwap AI
        </h2>

        <p
          data-cursor="scan"
          className="mt-3 text-base sm:text-lg text-[var(--muted)] max-w-xl font-normal leading-relaxed"
        >
          Exploring how semantic search and graph-based barter matching can reduce waste and solve the trust problem in student reuse.
        </p>
      </div>

      {/* Interactive Physical Object Container */}
      <div className="relative [perspective:1200px]">
        <div
          ref={cardRef}
          className="relative border border-[var(--hairline)] rounded-sm bg-[var(--surface-raised)] p-5 sm:p-7 transition-shadow duration-300 will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Object Header / Drag Handle */}
          <div
            data-drag-handle
            data-cursor="drag"
            className="flex items-center justify-between border-b border-[var(--hairline)] pb-3.5 mb-6 cursor-grab active:cursor-grabbing select-none"
            title="Drag to test object boundaries"
          >
            <div className="flex items-center gap-2 font-annotation text-xs text-[var(--muted)]">
              <span className="inline-block h-1.5 w-1.5 rounded-xs bg-[var(--accent)]" aria-hidden="true" />
              <span className="font-medium text-[var(--text)]">PROJECT OBJECT · CAMPUS-SWAP-01</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-annotation text-[var(--muted)]">
              <span className="hidden sm:inline">BOUNDED DRAG ±36PX</span>
              <span className="text-[var(--accent-ink)] select-none">::</span>
            </div>
          </div>

          {/* Layer Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--hairline)] pb-4 mb-6">
            <span className="font-annotation text-[11px] text-[var(--muted)] mr-2 uppercase tracking-wider hidden sm:inline">
              Architecture Layers:
            </span>
            {LAYERS.map((layer) => {
              const isActive = layer.id === activeLayer;
              return (
                <button
                  key={layer.id}
                  type="button"
                  data-cursor="clickable"
                  onClick={() => setActiveLayer(layer.id)}
                  className={`inline-flex items-center gap-2 rounded-xs border px-3 py-1 font-annotation text-xs transition-all ${
                    isActive
                      ? "border-[var(--accent)] bg-[var(--surface)] text-[var(--accent-ink)] font-semibold shadow-xs"
                      : "border-[var(--hairline)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--hairline-strong)]"
                  }`}
                >
                  <span>{layer.number}</span>
                  <span>{layer.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Layer Details & Interactive Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-2 font-annotation text-[11px] text-[var(--accent-ink)]">
                <span>{currentLayer.status}</span>
              </div>
              <h3 data-cursor="scan" className="text-lg sm:text-xl font-medium tracking-tight text-[var(--text)] mb-2.5">
                {currentLayer.headline}
              </h3>
              <p data-cursor="scan" className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed mb-5">
                {currentLayer.description}
              </p>

              <div className="space-y-2">
                {currentLayer.explorations.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text)]">
                    <span className="font-annotation text-[var(--accent-ink)] select-none pt-0.5">→</span>
                    <span data-cursor="scan">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="lg:col-span-5 border border-[var(--hairline)] rounded-xs bg-[var(--surface)] p-4">
              {activeLayer === "semantic" && (
                <div className="space-y-3 font-annotation text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-1.5 text-[var(--muted)] text-[11px]">
                    <span>SEMANTIC VECTOR MATCHER</span>
                    <span className="text-[var(--accent-ink)]">EXPLORATION</span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[var(--muted)] block text-[11px]">Sample Student Search:</span>
                    <div className="flex flex-col gap-1">
                      {SAMPLE_SEARCHES.map((sample, i) => (
                        <button
                          key={i}
                          type="button"
                          data-cursor="clickable"
                          onClick={() => setSelectedSample(i)}
                          className={`text-left px-2.5 py-1 rounded-xs border transition-all text-xs ${
                            selectedSample === i
                              ? "border-[var(--accent)] bg-[var(--accent)]/[0.06] text-[var(--text)] font-medium"
                              : "border-[var(--hairline)] text-[var(--muted)] hover:text-[var(--text)]"
                          }`}
                        >
                          &quot;{sample.query}&quot;
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--hairline)]">
                    <span className="text-[var(--muted)] block text-[11px] mb-1">Conceptual Similarity Match:</span>
                    <div className="p-2 rounded-xs bg-[var(--surface-subtle)] border border-[var(--hairline)] text-[var(--accent-ink)] text-xs font-medium">
                      {SAMPLE_SEARCHES[selectedSample]?.match ?? ""}
                    </div>
                  </div>
                </div>
              )}

              {activeLayer === "barter" && (
                <div className="space-y-3 font-annotation text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-1.5 text-[var(--muted)] text-[11px]">
                    <span>3-WAY SWAP TOPOLOGY</span>
                    <span className="text-[var(--accent-ink)]">CYCLE DETECTION</span>
                  </div>
                  <div className="flex flex-col gap-2 py-1">
                    <div className="p-2 rounded-xs border border-[var(--hairline)] bg-[var(--surface-subtle)] text-[11px]">
                      <span className="text-[var(--muted)] block text-[10px]">STUDENT A</span>
                      <span className="text-[var(--text)]">Offers: Calculus Book → Wants: Arduino</span>
                    </div>
                    <div className="p-2 rounded-xs border border-[var(--hairline)] bg-[var(--surface-subtle)] text-[11px]">
                      <span className="text-[var(--muted)] block text-[10px]">STUDENT B</span>
                      <span className="text-[var(--text)]">Offers: Arduino Kit → Wants: Calculator</span>
                    </div>
                    <div className="p-2 rounded-xs border border-[var(--accent)] bg-[var(--accent)]/[0.05] text-[11px]">
                      <span className="text-[var(--accent-ink)] block text-[10px]">STUDENT C (MATCH)</span>
                      <span className="text-[var(--text)]">Offers: Calculator → Wants: Calculus Book</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-[var(--muted)] leading-tight">
                    Multi-way cycle resolved without cash requirement.
                  </p>
                </div>
              )}

              {activeLayer === "trust" && (
                <div className="space-y-3 font-annotation text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-1.5 text-[var(--muted)] text-[11px]">
                    <span>CAMPUS VERIFICATION</span>
                    <span className="text-[var(--accent-ink)]">TRUST RULES</span>
                  </div>
                  <div className="space-y-2 py-1">
                    <div className="flex items-center justify-between border border-[var(--hairline)] p-2 rounded-xs text-[11px]">
                      <span className="text-[var(--muted)]">Domain Authentication</span>
                      <span className="text-[var(--accent-ink)] font-medium">.edu Verified</span>
                    </div>
                    <div className="flex items-center justify-between border border-[var(--hairline)] p-2 rounded-xs text-[11px]">
                      <span className="text-[var(--muted)]">Exchange Drop-Zone</span>
                      <span className="text-[var(--text)]">Campus Library</span>
                    </div>
                    <div className="flex items-center justify-between border border-[var(--hairline)] p-2 rounded-xs text-[11px]">
                      <span className="text-[var(--muted)]">Exchange Tracking</span>
                      <span className="text-[var(--text)]">Confirmed Handoff</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-[var(--muted)] leading-tight">
                    Designing geo-fenced campus identity to prevent spam listings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Honest Technical Stack & Repository Link */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[var(--hairline)] pt-6">
        <div>
          <h4 data-cursor="scan" className="font-annotation text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-2.5">
            Technical Stack
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {["Next.js 15", "TypeScript", "Python / FastAPI", "Embeddings", "PostgreSQL", "Tailwind CSS"].map(
              (tech) => (
                <span
                  key={tech}
                  data-cursor="scan"
                  className="px-2 py-0.5 rounded-xs border border-[var(--hairline)] font-annotation text-[11px] text-[var(--text)] bg-[var(--surface)]"
                >
                  {tech}
                </span>
              ),
            )}
          </div>
        </div>

        <div>
          <h4 data-cursor="scan" className="font-annotation text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-2.5">
            Source & Progress
          </h4>
          <Link
            href={HANDLES.github.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="clickable"
            className="group inline-flex items-center gap-2 font-annotation text-xs text-[var(--accent-ink)] hover:underline"
          >
            <span>Follow project progress on GitHub</span>
            <span className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
