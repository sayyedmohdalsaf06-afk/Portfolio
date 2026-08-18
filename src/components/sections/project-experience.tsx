"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HANDLES } from "@/constants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type LayerId = "product" | "engineering" | "ai-roadmap";

interface ArchitectureLayer {
  id: LayerId;
  label: string;
  number: string;
  category: string;
  headline: string;
  description: string;
}

const LAYERS: ArchitectureLayer[] = [
  {
    id: "product",
    number: "01",
    label: "Product",
    category: "CURRENT EXPERIENCE · PHASE 1 & 2",
    headline: "Campus-First Marketplace & Community",
    description:
      "A verified platform for students to buy, sell, exchange, donate, and request items within their college community. Focused on clean navigation, intuitive interaction, and eliminating friction in student reuse.",
  },
  {
    id: "engineering",
    number: "02",
    label: "Engineering",
    category: "ARCHITECTURE & INFRASTRUCTURE",
    headline: "React Native / Expo → Supabase Architecture",
    description:
      "Engineered with Expo SDK 54 and Expo Router for cross-platform mobile fluidity, NativeWind for design-token styling, Zustand + TanStack Query for state & server cache, and Supabase for backend services.",
  },
  {
    id: "ai-roadmap",
    number: "03",
    label: "Next (AI)",
    category: "PLANNED INTELLIGENCE LAYER · PHASE 4",
    headline: "Planned AI Intelligence Layer",
    description:
      "AI is not currently active in production. It is designed as a Phase 4 intelligence layer to assist listing creation, automate categorization, power intelligent request matching, and deliver sustainability insights.",
  },
];

const PRODUCT_CAPABILITIES = [
  {
    name: "Campus Marketplace",
    status: "CURRENT",
    desc: "Buy, sell, exchange, and donate listings with campus filtering.",
  },
  {
    name: "Need-It Board",
    status: "CURRENT",
    desc: "Request specific items needed across dorms and courses.",
  },
  {
    name: "Campus Chat UI",
    status: "CURRENT · UI",
    desc: "Peer negotiation interface (UI implemented · Realtime backend planned).",
  },
  {
    name: "Notifications UI",
    status: "CURRENT · UI",
    desc: "Activity feeds and trade updates (UI implemented · triggers planned).",
  },
  {
    name: "Wishlist & Reservations",
    status: "CURRENT",
    desc: "Save items and hold handoffs with verified peers.",
  },
  {
    name: "Sustainability Tracker",
    status: "CURRENT · UI",
    desc: "Circular economy reuse metrics and waste diversion tracking.",
  },
  {
    name: "Verified Campus Identity",
    status: "CURRENT",
    desc: "Domain authentication gated to enrolled college students.",
  },
];

const PLANNED_AI_FEATURES = [
  {
    title: "Smart Listing Categorization",
    status: "PLANNED · PHASE 4",
    desc: "Auto-tags listings and suggests price/condition bands from item photos.",
  },
  {
    title: "AI Listing Assistant",
    status: "PLANNED · PHASE 4",
    desc: "Extracts structured specifications from informal student listing text.",
  },
  {
    title: "Intelligent Need-It Matching",
    status: "PLANNED · PHASE 4",
    desc: "Automatically links student requests with relevant newly posted items.",
  },
  {
    title: "Personalized Discovery & Smart Search",
    status: "PLANNED · PHASE 4",
    desc: "Intent-based campus search without rigid category taxonomies.",
  },
  {
    title: "AI-Assisted Sustainability Insights",
    status: "PLANNED · PHASE 4",
    desc: "Estimated CO2 and waste reduction analytics on completed swaps.",
  },
];

/**
 * ProjectExperience — CAMPLX as an Interactive Physical Object.
 * Authoritative representation based on the CAMPLX source-of-truth README.
 * @see docs/02-identity-first.md
 * @see docs/03-interaction-philosophy.md
 */
export function ProjectExperience() {
  const [activeLayer, setActiveLayer] = useState<LayerId>("product");
  const [activeProductTab, setActiveProductTab] = useState<number>(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const currentLayer = LAYERS.find((l) => l.id === activeLayer)!;

  useEffect(() => {
    if (prefersReduced || typeof window === "undefined") return;

    const card = cardRef.current;
    const sheen = sheenRef.current;
    const glow = glowRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hasFinePointer = mqFine.matches;

    let targetRotX = 0, targetRotY = 0;
    let curRotX = 0, curRotY = 0;

    let dragging = false;
    let dragStartX = 0, dragStartY = 0;
    let dragTargetX = 0, dragTargetY = 0;
    let dragCurX = 0, dragCurY = 0;
    const DRAG_MAX = 42;

    let localMouseX = 350;
    let localMouseY = 200;

    let targetArrivalProgress = 0;
    let curArrivalProgress = 0;

    let rafId: number | null = null;

    function clamp(v: number, lo: number, hi: number) {
      return v < lo ? lo : v > hi ? hi : v;
    }

    function onScroll() {
      const rect = container!.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Pop-up triggers as project section scrolls into view from below
      const startY = windowHeight * 0.96;
      const endY = windowHeight * 0.32;
      const rawProgress = (startY - rect.top) / (startY - endY);
      targetArrivalProgress = clamp(rawProgress, 0, 1);
      kick();
    }

    function composeTransforms() {
      // 1. High-Impact 3D Pop-Up Animation with pronounced spring overshoot on scroll
      const t = curArrivalProgress;
      const popProgress = t < 1
        ? 1 - Math.pow(1 - t, 2.4) + Math.sin(t * Math.PI) * 0.08
        : 1;

      const popSlideY = (1 - clamp(popProgress, 0, 1.08)) * 96; // Lifts up 96px from below
      const popSlideZ = (1 - clamp(popProgress, 0, 1.08)) * -240; // Enters from -240px depth in 3D perspective
      const popPitchX = (1 - clamp(popProgress, 0, 1.08)) * 18; // Pitches flat from 18deg
      const popScale = 0.74 + clamp(popProgress, 0, 1.06) * 0.26; // Scales up from 0.74 to 1.0
      const popOpacity = clamp(popProgress * 1.5, 0, 1);

      // 2. Drag Banking & Displacement
      const dragBankZ = dragCurX * 0.28;
      const dragBankX = dragCurY * -0.20;

      // 3. Combined Composition
      const totalRotX = curRotX + popPitchX + dragBankX;
      const totalRotY = curRotY;
      const totalRotZ = dragBankZ;
      const totalTransX = dragCurX;
      const totalTransY = dragCurY + popSlideY;
      const totalTransZ = popSlideZ;

      const rotStr = `rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) rotateZ(${totalRotZ.toFixed(2)}deg) scale(${popScale.toFixed(4)})`;
      const transStr = `translate3d(${totalTransX.toFixed(2)}px, ${totalTransY.toFixed(2)}px, ${totalTransZ.toFixed(2)}px)`;
      card!.style.transform = `${transStr} ${rotStr}`;
      card!.style.opacity = `${popOpacity.toFixed(2)}`;

      // 4. Dynamic Holographic Glare Movement with Prismatic Violet & Cyan
      if (sheen) {
        const glareY = localMouseY + (1 - clamp(popProgress, 0, 1)) * 120;
        sheen.style.background = `radial-gradient(circle 460px at ${localMouseX}px ${glareY.toFixed(1)}px, rgba(167, 139, 250, 0.30) 0%, rgba(6, 182, 212, 0.14) 48%, transparent 72%)`;
      }

      // 5. Breathing & Radiant Aurora Pop Underglow Aura
      if (glow) {
        const glowScale = 0.70 + popProgress * 0.42 + (dragging ? 0.20 : 0);
        const glowOpacity = clamp(popProgress * 0.58 + (dragging ? 0.30 : 0), 0, 0.90);
        glow.style.transform = `translate3d(${totalTransX.toFixed(2)}px, ${(totalTransY + 16).toFixed(2)}px, -40px) scale(${glowScale.toFixed(3)})`;
        glow.style.opacity = `${glowOpacity.toFixed(2)}`;
      }

      // 6. Dynamic Elevation Shadow
      const shadowX = (-totalRotY * 2.8 + dragCurX * 0.28).toFixed(1);
      const shadowY = (totalRotX * 2.8 + 14 + popProgress * 16 + Math.abs(dragCurY) * 0.4).toFixed(1);
      const shadowBlur = (16 + popProgress * 36).toFixed(1);
      card!.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px var(--hairline-strong)`;
    }

    function frame() {
      // (a) Silky smooth pop-up progress lerp
      curArrivalProgress += (targetArrivalProgress - curArrivalProgress) * 0.09;

      // (b) Pointer 3D tilt easing
      curRotX += (targetRotX - curRotX) * 0.11;
      curRotY += (targetRotY - curRotY) * 0.11;

      // (c) Elastic drag spring settle
      if (!dragging) {
        dragCurX += (dragTargetX - dragCurX) * 0.14;
        dragCurY += (dragTargetY - dragCurY) * 0.14;
      }

      composeTransforms();

      rafId = requestAnimationFrame(frame);
    }

    function kick() {
      if (rafId === null) rafId = requestAnimationFrame(frame);
    }

    function onPointerMove(e: PointerEvent) {
      if (!hasFinePointer) return;

      const rect = card!.getBoundingClientRect();
      const isOver = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );

      if (isOver) {
        localMouseX = e.clientX - rect.left;
        localMouseY = e.clientY - rect.top;

        if (!dragging) {
          const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          targetRotX = -ny * 7.5;
          targetRotY = nx * 7.5;
        }
      } else if (!dragging) {
        targetRotX = 0;
        targetRotY = 0;
      }

      if (dragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragTargetX = clamp(dx, -DRAG_MAX, DRAG_MAX);
        dragTargetY = clamp(dy, -DRAG_MAX, DRAG_MAX);
        dragCurX = dragTargetX;
        dragCurY = dragTargetY;
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, input, textarea, select, [role='button'], [role='tab']");
      if (isInteractive) return;

      const rect = card!.getBoundingClientRect();
      const isInside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      if (!isInside) return;

      dragging = true;
      dragStartX = e.clientX - dragCurX;
      dragStartY = e.clientY - dragCurY;
      document.body.classList.add("is-dragging-card");
    }

    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      dragTargetX = 0;
      dragTargetY = 0;
      document.body.classList.remove("is-dragging-card");
    }

    function onPointerLeave() {
      if (!dragging) {
        targetRotX = 0;
        targetRotY = 0;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    card.addEventListener("pointerleave", onPointerLeave);

    onScroll();
    kick();

    return () => {
      window.removeEventListener("scroll", onScroll);
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
      className="relative py-12 border-t border-[var(--hairline)]"
    >
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 font-annotation text-xs uppercase tracking-[0.16em] text-[var(--muted)] mb-2.5">
          <span>01 · Primary Build</span>
          <span aria-hidden="true" className="h-2.5 w-px bg-[var(--hairline-strong)]" />
          <span className="text-[var(--accent-ink)] font-medium">In Active Build · Phase 1 & 2</span>
        </div>

        <div className="flex flex-wrap items-baseline gap-3">
          <h2
            id="project-title"
            data-cursor="scan"
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-[var(--text)] select-none"
          >
            CAMPLX
          </h2>
          <span className="font-annotation text-xs sm:text-sm text-[var(--muted)] uppercase tracking-wider">
            Campus + Exchange + Community
          </span>
        </div>

        <p
          data-cursor="scan"
          className="mt-3 text-sm sm:text-base text-[var(--muted)] max-w-xl font-normal leading-relaxed"
        >
          &quot;Trade smarter on campus.&quot; A verified campus-first marketplace and community platform for students to buy, sell, exchange, donate, and request items within their college community.
        </p>
      </div>

      {/* Interactive Physical Object Container */}
      <div className="relative w-full [perspective:1200px]">
        {/* Ambient Aurora Underglow Aura */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="absolute inset-x-8 -inset-y-4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.60)_0%,rgba(139,92,246,0.30)_40%,rgba(6,182,212,0.15)_65%,transparent_75%)] opacity-30 blur-2xl pointer-events-none -z-10 transition-opacity duration-300"
        />

        <div
          ref={cardRef}
          data-cursor="drag"
          className="relative border border-[var(--hairline-strong)] rounded-sm bg-[var(--surface-raised)] p-5 sm:p-7 shadow-xl transition-shadow duration-300 will-change-transform select-none overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Specular Holographic Glare Layer */}
          <div
            ref={sheenRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-90"
          />

          {/* Object Header / Drag Handle */}
          <div
            data-drag-handle
            data-cursor="drag"
            className="flex items-center justify-between border-b border-[var(--hairline)] pb-3.5 mb-6 cursor-grab active:cursor-grabbing select-none"
            title="Drag to displace in 3D space"
          >
            <div className="flex items-center gap-2 font-annotation text-xs text-[var(--muted)]">
              <span className="inline-block h-1.5 w-1.5 rounded-xs bg-[var(--accent)]" aria-hidden="true" />
              <span className="font-medium text-[var(--text)]">PRODUCT OBJECT · CAMPLX-CORE</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-annotation text-[var(--muted)]">
              <span className="hidden sm:inline text-[9px] text-[var(--accent-ink)] font-semibold uppercase tracking-wider">3D PHYSICAL OBJECT</span>
              <span className="text-[var(--accent-ink)] select-none">::</span>
            </div>
          </div>

          {/* Layer Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--hairline)] pb-4 mb-6">
            <span className="font-annotation text-[11px] text-[var(--muted)] mr-2 uppercase tracking-wider hidden sm:inline">
              Inspect Layer:
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

          {/* Active Layer Details & Interactive Artifact */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 mb-2 font-annotation text-[11px] text-[var(--accent-ink)]">
                <span className="uppercase tracking-wider font-semibold">{currentLayer.category}</span>
              </div>

              <h3 data-cursor="scan" className="text-lg sm:text-xl font-medium tracking-tight text-[var(--text)] mb-2.5">
                {currentLayer.headline}
              </h3>

              <p data-cursor="scan" className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed mb-6">
                {currentLayer.description}
              </p>

              {/* Layer 01: Product Capabilities List */}
              {activeLayer === "product" && (
                <div className="space-y-2">
                  <span className="font-annotation text-[10px] text-[var(--muted)] uppercase tracking-wider block mb-1">
                    Current Product Features:
                  </span>
                  {PRODUCT_CAPABILITIES.map((cap, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveProductTab(idx)}
                      data-cursor="clickable"
                      className={`p-2 rounded-xs border transition-all text-xs flex items-start justify-between gap-2 cursor-pointer ${
                        activeProductTab === idx
                          ? "border-[var(--accent)] bg-[var(--accent)]/[0.04]"
                          : "border-[var(--hairline)] bg-[var(--surface)] hover:border-[var(--hairline-strong)]"
                      }`}
                    >
                      <div>
                        <span className="font-medium text-[var(--text)] block">{cap.name}</span>
                        <span className="text-[11px] text-[var(--muted)] leading-tight block mt-0.5">{cap.desc}</span>
                      </div>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs shrink-0 ${
                          cap.status.includes("UI")
                            ? "bg-[var(--surface-subtle)] text-[var(--muted)] border border-[var(--hairline)]"
                            : "bg-[var(--accent)]/[0.1] text-[var(--accent-ink)] font-semibold"
                        }`}
                      >
                        {cap.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Layer 02: Engineering Breakdown */}
              {activeLayer === "engineering" && (
                <div className="space-y-3 font-annotation text-xs">
                  <div className="p-3 rounded-xs border border-[var(--hairline)] bg-[var(--surface)] space-y-2">
                    <span className="text-[var(--accent-ink)] font-semibold uppercase tracking-wider block text-[10px]">
                      Client Architecture
                    </span>
                    <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                      Cross-platform mobile client built on React Native & Expo SDK 54. File-based routing via Expo Router, design-token utility styling with NativeWind, and fluid gesture physics using Reanimated & Moti.
                    </p>
                  </div>

                  <div className="p-3 rounded-xs border border-[var(--hairline)] bg-[var(--surface)] space-y-2">
                    <span className="text-[var(--accent-ink)] font-semibold uppercase tracking-wider block text-[10px]">
                      Data & Services (Supabase)
                    </span>
                    <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                      PostgreSQL for relational marketplace schemas, Supabase Auth for student email domain gating, Storage buckets for listing images, and Edge Functions for business logic.
                    </p>
                  </div>

                  <div className="p-3 rounded-xs border border-[var(--hairline)] bg-[var(--surface)] space-y-2">
                    <span className="text-[var(--accent-ink)] font-semibold uppercase tracking-wider block text-[10px]">
                      State & Validation
                    </span>
                    <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                      Zustand for reactive client UI state, TanStack Query for optimistic server caching, and Zod schemas with React Hook Form for type-safe validation.
                    </p>
                  </div>
                </div>
              )}

              {/* Layer 03: Planned AI Roadmap */}
              {activeLayer === "ai-roadmap" && (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xs border border-[var(--hairline)] bg-[var(--surface)] text-[11px] text-[var(--muted)] mb-3 leading-relaxed">
                    <span className="text-[var(--text)] font-medium block mb-0.5">Truthful Status Note:</span>
                    CAMPLX is currently in Phase 1/2 (core product & UI). AI backends are not live in production; they are architected as Phase 4 future intelligence enhancements.
                  </div>
                  {PLANNED_AI_FEATURES.map((ai, idx) => (
                    <div key={idx} className="p-2.5 rounded-xs border border-[var(--hairline)] bg-[var(--surface)] text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium text-[var(--text)]">{ai.title}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-[var(--surface-subtle)] border border-[var(--hairline)] text-[var(--muted)]">
                          {ai.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--muted)] leading-tight">{ai.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visual Engineering Artifact Preview Canvas */}
            <div className="lg:col-span-6 border border-[var(--hairline)] rounded-xs bg-[var(--surface)] p-4">
              {/* Product Layer Visual Artifact */}
              {activeLayer === "product" && (
                <div className="space-y-3 font-annotation text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2 text-[var(--muted)] text-[10px]">
                    <span>INTERACTIVE PRODUCT ARTIFACT</span>
                    <span className="text-[var(--accent-ink)] font-semibold">
                      {PRODUCT_CAPABILITIES[activeProductTab]?.status}
                    </span>
                  </div>

                  <div className="border border-[var(--hairline)] rounded-xs bg-[var(--surface-subtle)] p-3 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] border-b border-[var(--hairline)] pb-1.5">
                      <span className="text-[var(--text)] font-semibold">
                        {PRODUCT_CAPABILITIES[activeProductTab]?.name}
                      </span>
                      <span className="text-[var(--muted)] font-mono text-[10px]">CAMPLX · v0.2</span>
                    </div>

                    {activeProductTab === 0 && (
                      <div className="space-y-2 text-[11px]">
                        <div className="p-2 rounded-xs bg-[var(--surface)] border border-[var(--hairline)] flex justify-between items-center">
                          <span>Calculus 8th Edition (Stewart)</span>
                          <span className="text-[var(--accent-ink)] font-semibold">$35 · Buy / Trade</span>
                        </div>
                        <div className="p-2 rounded-xs bg-[var(--surface)] border border-[var(--hairline)] flex justify-between items-center">
                          <span>Arduino Starter Kit + Sensors</span>
                          <span className="text-[var(--accent-ink)] font-semibold">Free · Donate</span>
                        </div>
                        <div className="p-2 rounded-xs bg-[var(--surface)] border border-[var(--hairline)] flex justify-between items-center">
                          <span>TI-84 Plus Graphing Calculator</span>
                          <span className="text-[var(--accent-ink)] font-semibold">Swap only</span>
                        </div>
                      </div>
                    )}

                    {activeProductTab === 1 && (
                      <div className="space-y-2 text-[11px]">
                        <div className="p-2 rounded-xs bg-[var(--surface)] border border-[var(--hairline)]">
                          <span className="text-[var(--muted)] text-[10px] block">LOOKING FOR:</span>
                          <span className="text-[var(--text)] font-medium">Lab Coat & Safety Goggles (Size M)</span>
                          <span className="text-[10px] text-[var(--accent-ink)] block mt-1">Chemistry 102 · Posted 2h ago</span>
                        </div>
                        <div className="p-2 rounded-xs bg-[var(--surface)] border border-[var(--hairline)]">
                          <span className="text-[var(--muted)] text-[10px] block">LOOKING FOR:</span>
                          <span className="text-[var(--text)] font-medium">Breadboard & Jumper Wires</span>
                          <span className="text-[10px] text-[var(--accent-ink)] block mt-1">EE Dept · Posted today</span>
                        </div>
                      </div>
                    )}

                    {activeProductTab === 2 && (
                      <div className="space-y-2 text-[11px]">
                        <div className="p-2 rounded-xs bg-[var(--surface)] border border-[var(--hairline)] text-left">
                          <span className="text-[10px] text-[var(--muted)] block">Peer (Student · CS):</span>
                          <span>&quot;Is the textbook still available for pickup at the Library?&quot;</span>
                        </div>
                        <div className="p-2 rounded-xs bg-[var(--accent)]/[0.06] border border-[var(--accent)] text-right">
                          <span className="text-[10px] text-[var(--accent-ink)] block">You:</span>
                          <span>&quot;Yes! I can hand it off between 2-3 PM.&quot;</span>
                        </div>
                      </div>
                    )}

                    {activeProductTab >= 3 && (
                      <div className="p-3 rounded-xs bg-[var(--surface)] border border-[var(--hairline)] text-[11px] text-[var(--muted)] space-y-1">
                        <span className="text-[var(--text)] font-medium block">
                          {PRODUCT_CAPABILITIES[activeProductTab]?.name}
                        </span>
                        <p>{PRODUCT_CAPABILITIES[activeProductTab]?.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Engineering Architecture Diagram */}
              {activeLayer === "engineering" && (
                <div className="space-y-3 font-annotation text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2 text-[var(--muted)] text-[10px]">
                    <span>ARCHITECTURE SCHEMA</span>
                    <span className="text-[var(--accent-ink)] font-semibold">SYSTEM FLOW</span>
                  </div>

                  <div className="border border-[var(--hairline)] rounded-xs bg-[var(--surface-subtle)] p-3 font-mono text-[10px] space-y-2">
                    <div className="p-2 rounded-xs bg-[var(--surface)] border border-[var(--hairline)]">
                      <span className="text-[var(--accent-ink)] font-semibold block mb-0.5">MOBILE CLIENT (EXPO)</span>
                      <span className="text-[var(--text)] block">React Native · Expo SDK 54 · Router</span>
                      <span className="text-[var(--muted)] block">NativeWind · Reanimated · Zustand</span>
                    </div>

                    <div className="text-center text-[var(--muted)]">↓ validated with Zod & React Hook Form</div>

                    <div className="p-2 rounded-xs bg-[var(--surface)] border border-[var(--hairline)]">
                      <span className="text-[var(--accent-ink)] font-semibold block mb-0.5">DATA & SERVICES (SUPABASE)</span>
                      <div className="grid grid-cols-2 gap-1 text-[var(--text)] mt-1">
                        <span>├─ Auth (.edu)</span>
                        <span>├─ PostgreSQL</span>
                        <span>├─ Storage (Media)</span>
                        <span>└─ Edge Functions</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Roadmap Visual Canvas */}
              {activeLayer === "ai-roadmap" && (
                <div className="space-y-3 font-annotation text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2 text-[var(--muted)] text-[10px]">
                    <span>FUTURE AI PIPELINE</span>
                    <span className="text-[var(--accent-ink)] font-semibold">PHASE 4 SPEC</span>
                  </div>

                  <div className="border border-[var(--hairline)] rounded-xs bg-[var(--surface-subtle)] p-3 font-mono text-[10px] space-y-2.5">
                    <div className="p-2 rounded-xs bg-[var(--surface)] border border-[var(--hairline)]">
                      <span className="text-[var(--muted)] block text-[9px]">INPUT TRIGGER</span>
                      <span className="text-[var(--text)]">Listing Creation / Need-It Post</span>
                    </div>

                    <div className="text-center text-[var(--muted)]">↓ Supabase Edge Function Hook</div>

                    <div className="p-2 rounded-xs bg-[var(--accent)]/[0.05] border border-[var(--accent)]">
                      <span className="text-[var(--accent-ink)] font-semibold block text-[9px]">PLANNED MODEL LAYER</span>
                      <span className="text-[var(--text)] block">Gemini 2.5 Flash / Text Embeddings</span>
                      <span className="text-[var(--muted)] block text-[9px] mt-0.5">Categorization · Match Scoring · Insights</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Honest Technical Stack & Source Codebase */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[var(--hairline)] pt-6">
        <div>
          <h4 data-cursor="scan" className="font-annotation text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-2.5">
            Active Stack (Expo & Supabase)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {[
              "React Native",
              "Expo SDK 54",
              "Expo Router",
              "TypeScript",
              "NativeWind",
              "Zustand",
              "TanStack Query",
              "React Hook Form",
              "Zod",
              "Reanimated",
              "Moti",
              "Supabase",
            ].map((tech) => (
              <span
                key={tech}
                data-cursor="scan"
                className="px-2 py-0.5 rounded-xs border border-[var(--hairline)] font-annotation text-[11px] text-[var(--text)] bg-[var(--surface)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 data-cursor="scan" className="font-annotation text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-2.5">
            Source & Codebase
          </h4>
          <Link
            href={HANDLES.github.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="clickable"
            className="group inline-flex items-center gap-2 font-annotation text-xs text-[var(--accent-ink)] hover:underline"
          >
            <span>Follow project development on GitHub</span>
            <span className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
