"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HANDLES, SITE } from "@/constants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type CommandKey = "whoami" | "focus" | "status";

interface CommandItem {
  id: CommandKey;
  command: string;
  description: string;
}

const COMMANDS: CommandItem[] = [
  { id: "whoami", command: "$ whoami", description: "Identity profile" },
  { id: "focus", command: "$ cat focus.txt", description: "Engineering focus" },
  { id: "status", command: "$ cat status.env", description: "Build status" },
];

/**
 * IdentityTerminal — Modern Developer Workstation Artifact (V2).
 * Features 3D Movable Physics, Tactile Drag, Interactive Hover Tilt & Scroll Pop-up.
 * @see docs/02-identity-first.md
 * @see docs/03-interaction-philosophy.md
 */
export function IdentityTerminal() {
  const [activeCmd, setActiveCmd] = useState<CommandKey>("whoami");
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

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
    const DRAG_MAX = 40;

    let localMouseX = 260;
    let localMouseY = 160;

    let targetArrivalProgress = 0;
    let curArrivalProgress = 0;

    let rafId: number | null = null;

    function clamp(v: number, lo: number, hi: number) {
      return v < lo ? lo : v > hi ? hi : v;
    }

    function onScroll() {
      const rect = container!.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Pop-up triggers as terminal scrolls into view from below
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

      // 4. Specular Teal & Cyan Lens Reflection
      if (sheen) {
        const glareY = localMouseY + (1 - clamp(popProgress, 0, 1)) * 120;
        sheen.style.background = `radial-gradient(circle 460px at ${localMouseX}px ${glareY.toFixed(1)}px, rgba(34, 211, 238, 0.16) 0%, rgba(13, 148, 136, 0.04) 50%, transparent 68%)`;
      }

      // 5. Ambient Teal Underglow
      if (glow) {
        const glowScale = 0.70 + popProgress * 0.42 + (dragging ? 0.20 : 0);
        const glowOpacity = clamp(popProgress * 0.42 + (dragging ? 0.20 : 0), 0, 0.75);
        glow.style.transform = `translate3d(${totalTransX.toFixed(2)}px, ${(totalTransY + 16).toFixed(2)}px, -40px) scale(${glowScale.toFixed(3)})`;
        glow.style.opacity = `${glowOpacity.toFixed(2)}`;
      }

      // 6. Precision Studio Drop Shadow
      const shadowX = (-totalRotY * 2.4 + dragCurX * 0.22).toFixed(1);
      const shadowY = (totalRotX * 2.4 + 14 + popProgress * 16 + Math.abs(dragCurY) * 0.35).toFixed(1);
      const shadowBlur = (16 + popProgress * 32).toFixed(1);
      card!.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.6)`;
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
      id="whoami"
      ref={containerRef}
      aria-labelledby="terminal-heading"
      className="relative py-6 border-t border-[var(--hairline)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-annotation text-xs uppercase tracking-[0.16em] text-[#9ca3af]">
          <span className="inline-block h-1.5 w-1.5 rounded-xs bg-[#22d3ee] shadow-[0_0_6px_#22d3ee]" aria-hidden="true" />
          <h2 id="terminal-heading" className="font-normal text-[#9ca3af]">
            Developer Workstation
          </h2>
        </div>

        <span className="font-annotation text-[10px] text-[#9ca3af] hidden sm:inline">
          INTERACTIVE READOUT · DRAGGABLE
        </span>
      </div>

      {/* 3D Perspective Stage Container */}
      <div className="relative w-full [perspective:1200px]">
        {/* Ambient Teal + Cyan Underglow Aura */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="absolute inset-x-6 -inset-y-4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.35)_0%,rgba(34,211,238,0.18)_45%,transparent_75%)] opacity-30 blur-2xl pointer-events-none -z-10 transition-opacity duration-300"
        />

        {/* Modern Developer Terminal Artifact */}
        <div
          ref={cardRef}
          data-cursor="drag"
          className="relative border border-[var(--terminal-border)] rounded-sm bg-[var(--terminal-bg)] shadow-lg overflow-hidden will-change-transform select-none transition-shadow duration-300"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Specular Holographic Glare Layer */}
          <div
            ref={sheenRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-90"
          />

          {/* Terminal Chrome Bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--terminal-chrome)] border-b border-[var(--terminal-hairline)] select-none">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80 border border-[#E0443E]/50 inline-block" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80 border border-[#DEA123]/50 inline-block" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80 border border-[#1AAB29]/50 inline-block" aria-hidden="true" />
              <span className="ml-2 font-mono text-[11px] text-[var(--muted)] tracking-tight">
                mohd@alsaf: ~/camplx
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--muted)]">
              <span className="hidden sm:inline text-[9px] text-[var(--accent-ink)] font-semibold uppercase tracking-wider">3D PHYSICAL OBJECT</span>
              <span>zsh · utf-8</span>
            </div>
          </div>

        {/* Command Navigation Bar */}
        <div
          role="tablist"
          aria-label="Terminal commands"
          className="flex items-center gap-1 px-3.5 py-2 border-b border-[var(--terminal-hairline)] bg-[var(--terminal-bg)]/90 overflow-x-auto"
        >
          {COMMANDS.map((cmd) => {
            const isSelected = activeCmd === cmd.id;
            return (
              <button
                key={cmd.id}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`terminal-panel-${cmd.id}`}
                id={`terminal-tab-${cmd.id}`}
                type="button"
                data-cursor="clickable"
                onClick={() => setActiveCmd(cmd.id)}
                className={`font-mono text-xs px-2.5 py-1 rounded-xs transition-colors whitespace-nowrap ${
                  isSelected
                    ? "bg-[var(--surface-raised)] text-[var(--accent-ink)] font-semibold border border-[var(--accent)]/50 shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]/40 border border-transparent"
                }`}
              >
                {cmd.command}
              </button>
            );
          })}
        </div>

        {/* Terminal Execution Body */}
        <div
          role="tabpanel"
          id={`terminal-panel-${activeCmd}`}
          aria-labelledby={`terminal-tab-${activeCmd}`}
          className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-[var(--text)] space-y-3.5"
        >
          {/* Active Command Line */}
          <div className="flex items-center gap-2 text-[var(--muted)] select-none">
            <span className="text-[var(--accent-ink)] font-bold">❯</span>
            <span className="text-[#EDE9E0] font-semibold">
              {activeCmd === "whoami" ? "whoami" : activeCmd === "focus" ? "cat focus.txt" : "cat status.env"}
            </span>
          </div>

          {/* Primary View: whoami (High-contrast key-value table) */}
          {activeCmd === "whoami" && (
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-4 gap-y-2.5 pt-2 border-t border-[var(--terminal-hairline)]">
              <span className="text-[var(--muted)] select-none" data-cursor="scan">
                name
              </span>
              <span className="font-sans font-medium text-[#EDE9E0]" data-cursor="scan">
                {SITE.name}
              </span>

              <span className="text-[var(--muted)] select-none" data-cursor="scan">
                role
              </span>
              <span className="text-[#EDE9E0]" data-cursor="scan">
                2nd-year CSE Student · Builder · Exploring AI & Systems
              </span>

              <span className="text-[var(--muted)] select-none" data-cursor="scan">
                location
              </span>
              <span className="text-[#EDE9E0]" data-cursor="scan">
                {SITE.author.location}
              </span>

              <span className="text-[var(--muted)] select-none" data-cursor="scan">
                current_build
              </span>
              <span className="text-[var(--accent-ink)] font-semibold" data-cursor="scan">
                CAMPLX (Campus + Exchange + Community)
              </span>

              <span className="text-[var(--muted)] select-none" data-cursor="scan">
                status
              </span>
              <span className="text-[#EDE9E0]" data-cursor="scan">
                Building in public
              </span>

              <span className="text-[var(--muted)] select-none" data-cursor="scan">
                codebase
              </span>
              <Link
                href={HANDLES.github.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="clickable"
                className="text-[var(--accent-ink)] hover:underline inline-flex items-center gap-1 w-fit font-medium"
              >
                <span>github.com/sayyedmohdalsaf06-afk</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}

          {/* Secondary View: cat focus.txt */}
          {activeCmd === "focus" && (
            <div className="space-y-3 pt-2 border-t border-[var(--terminal-hairline)] text-xs sm:text-[13px]">
              <div className="flex items-start gap-3" data-cursor="scan">
                <span className="text-[var(--accent-ink)] select-none pt-0.5 font-bold">01</span>
                <div>
                  <span className="font-semibold text-[#EDE9E0]">Software Engineering:</span>
                  <p className="text-[#A1A1AA] text-xs mt-0.5 leading-relaxed">
                    Type-safe mobile & web applications, clean state machines, modular component architectures.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3" data-cursor="scan">
                <span className="text-[var(--accent-ink)] select-none pt-0.5 font-bold">02</span>
                <div>
                  <span className="font-semibold text-[#EDE9E0]">Intelligent Systems:</span>
                  <p className="text-[#A1A1AA] text-xs mt-0.5 leading-relaxed">
                    Exploring embedding vectors, recommendation graphs, and intent matching algorithms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3" data-cursor="scan">
                <span className="text-[var(--accent-ink)] select-none pt-0.5 font-bold">03</span>
                <div>
                  <span className="font-semibold text-[#EDE9E0]">Product Building:</span>
                  <p className="text-[#A1A1AA] text-xs mt-0.5 leading-relaxed">
                    Turning campus problem spaces into working software with thoughtful UX and clear boundaries.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Secondary View: cat status.env */}
          {activeCmd === "status" && (
            <div className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-x-4 gap-y-2 pt-2 border-t border-[var(--terminal-hairline)] text-xs font-mono">
              <span className="text-[var(--muted)] select-none" data-cursor="scan">
                CURRENT_STATUS=
              </span>
              <span className="text-[var(--accent-ink)] font-semibold" data-cursor="scan">
                &quot;Building CAMPLX (Phase 1 & 2 UI / Architecture)&quot;
              </span>

              <span className="text-[var(--muted)] select-none" data-cursor="scan">
                EXPLORATION_PHASE=
              </span>
              <span className="text-[#EDE9E0]" data-cursor="scan">
                &quot;AI Intelligence & Graph Matching (Phase 4 Spec)&quot;
              </span>

              <span className="text-[var(--muted)] select-none" data-cursor="scan">
                LEARNING_MODE=
              </span>
              <span className="text-[#EDE9E0]" data-cursor="scan">
                &quot;Building in the open & documenting lessons&quot;
              </span>
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}
