"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HANDLES } from "@/constants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * FloatingPhotoCard — Left-Side 3D Floating Character Photo Object.
 *
 * Placed in the left column:
 *  - Tactile 3D Builder Portrait with technical corner crosshairs and scanline beam.
 *  - Continuous Zero-G Floating Levitation.
 *  - 3D Pointer Perspective Tilt & Bounded Drag Physics with Elastic Spring Rebound.
 *  - Specular Holographic Glare & Ambient Breathing Underglow.
 *  - Identity details: Role, Status, Flagship, and Codebase link.
 */
export function FloatingPhotoCard() {
  const [imgError, setImgError] = useState(false);
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
    if (!card) return;

    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hasFinePointer = mqFine.matches;

    let targetRotX = 0, targetRotY = 0;
    let curRotX = 0, curRotY = 0;

    let dragging = false;
    let dragStartX = 0, dragStartY = 0;
    let dragTargetX = 0, dragTargetY = 0;
    let dragCurX = 0, dragCurY = 0;
    const DRAG_MAX = 42;

    let localMouseX = 160;
    let localMouseY = 180;
    let time = 0;
    let rafId: number | null = null;

    function clamp(v: number, lo: number, hi: number) {
      return v < lo ? lo : v > hi ? hi : v;
    }

    function composeTransforms() {
      // 1. Continuous Zero-G Floating Levitation with pronounced dual-frequency buoyancy
      time += 0.030;
      const ambientFloatY = Math.sin(time) * 8.0 + Math.cos(time * 0.45) * 3.0;
      const ambientRotZ = Math.cos(time * 0.70) * 1.8;
      const ambientRotX = Math.sin(time * 0.55) * 1.4;
      const ambientRotY = Math.sin(time * 0.35) * 1.2;

      // 2. Drag Banking & Displacement
      const dragBankZ = dragCurX * 0.28;
      const dragBankX = dragCurY * -0.20;

      // 3. Combined Composition (rich, vivid in-place float)
      const totalRotX = curRotX + ambientRotX + dragBankX;
      const totalRotY = curRotY + ambientRotY;
      const totalRotZ = ambientRotZ + dragBankZ;
      const totalTransX = dragCurX;
      const totalTransY = dragCurY + ambientFloatY;

      const rotStr = `rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) rotateZ(${totalRotZ.toFixed(2)}deg)`;
      const transStr = `translate3d(${totalTransX.toFixed(2)}px, ${totalTransY.toFixed(2)}px, 0)`;
      card!.style.transform = `${transStr} ${rotStr}`;

      // 4. Specular Glare Movement with Prismatic Violet & Cyan Highlights
      if (sheen) {
        sheen.style.background = `radial-gradient(circle 380px at ${localMouseX}px ${localMouseY}px, rgba(167, 139, 250, 0.28) 0%, rgba(6, 182, 212, 0.14) 48%, transparent 72%)`;
      }

      // 5. Breathing Aurora Underglow Aura
      if (glow) {
        const glowScale = 1.0 + Math.sin(time * 1.6) * 0.12 + (dragging ? 0.20 : 0);
        const glowOpacity = 0.44 + Math.sin(time * 1.6) * 0.12 + (dragging ? 0.30 : 0);
        glow.style.transform = `translate3d(${totalTransX.toFixed(2)}px, ${(totalTransY + 16).toFixed(2)}px, -40px) scale(${glowScale.toFixed(3)})`;
        glow.style.opacity = `${glowOpacity.toFixed(2)}`;
      }

      // 6. Dynamic Elevation Shadow
      const shadowX = (-totalRotY * 2.8 + dragCurX * 0.28).toFixed(1);
      const shadowY = (totalRotX * 2.8 + 16 + Math.abs(dragCurY) * 0.4).toFixed(1);
      card!.style.boxShadow = `${shadowX}px ${shadowY}px 40px var(--hairline-strong)`;
    }

    function frame() {
      // (a) Pointer 3D tilt easing
      curRotX += (targetRotX - curRotX) * 0.11;
      curRotY += (targetRotY - curRotY) * 0.11;

      // (b) Elastic drag spring settle
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
          targetRotX = -ny * 8.5;
          targetRotY = nx * 8.5;
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

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    card.addEventListener("pointerleave", onPointerLeave);

    kick();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      card.removeEventListener("pointerleave", onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  return (
    <aside
      ref={containerRef}
      aria-label="Floating identity card"
      className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-20 flex flex-col items-center self-start"
    >
      {/* 3D Perspective Stage */}
      <div className="relative w-full [perspective:1200px]">
        {/* Breathing Aurora Violet & Cyan Underglow Aura */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="absolute inset-x-4 -inset-y-3 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.65)_0%,rgba(6,182,212,0.28)_45%,transparent_72%)] opacity-35 blur-2xl pointer-events-none -z-10 transition-opacity duration-300"
        />

        {/* 3D Physical Card Chassis */}
        <div
          ref={cardRef}
          data-cursor="drag"
          className="relative w-full rounded-sm border border-[var(--hairline-strong)] bg-[var(--surface-raised)] will-change-transform select-none shadow-xl overflow-hidden p-5 flex flex-col justify-between transition-shadow duration-300"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Specular Holographic Glare Layer */}
          <div
            ref={sheenRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-90"
          />

          {/* Animated Iridescent Edge Shimmer */}
          <div
            aria-hidden="true"
            className="absolute -inset-[1px] rounded-sm pointer-events-none z-20 border border-[var(--accent-ink)]/35 opacity-80 [mask-image:radial-gradient(circle_at_top_right,black,transparent_75%)]"
          />

          {/* Top Meta Bar */}
          <div
            className="flex items-center justify-between border-b border-[var(--hairline)] pb-3 mb-4 font-mono text-[10px] text-[var(--muted)]"
            style={{ transform: "translateZ(8px)" }}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-ink)] animate-pulse shadow-[0_0_8px_var(--accent-glow)]" aria-hidden="true" />
              <span className="font-semibold text-[var(--text)] tracking-wider">DOSSIER // SPEC-01</span>
            </div>
            <span className="text-[var(--accent-ink)] font-semibold">ACTIVE BUILDER</span>
          </div>

          {/* Builder Portrait Aperture */}
          <div
            className="relative aspect-square w-full rounded-xs border border-[var(--hairline-strong)] bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center group shadow-md my-1"
            style={{ transform: "translateZ(24px)" }}
            data-cursor="inspect"
            title="Builder Character Visual"
          >
            {/* Technical Corner Crosshairs */}
            <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[var(--accent-ink)] select-none z-10">┌</span>
            <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[var(--accent-ink)] select-none z-10">┐</span>
            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono text-[var(--accent-ink)] select-none z-10">└</span>
            <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono text-[var(--accent-ink)] select-none z-10">┘</span>

            {/* Scanline Radar Sweep */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-[var(--accent-ink)]/25 to-transparent pointer-events-none z-20 animate-[scanline_4s_ease-in-out_infinite]"
            />

            {!imgError ? (
              <Image
                src="/images/profile/alsaf.png"
                alt="Mohd Alsaf - Builder Portrait"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4 z-10 select-none">
                <div className="h-16 w-16 rounded-xs border border-[var(--accent)]/50 bg-[var(--accent)]/[0.08] flex items-center justify-center mb-3 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <span className="font-mono text-xl font-bold tracking-widest text-[var(--accent-ink)]">
                    MA
                  </span>
                </div>
                <span className="font-annotation text-[11px] uppercase tracking-[0.16em] text-[var(--text)] font-semibold">
                  Mohd Alsaf
                </span>
                <span className="font-annotation text-[9px] text-[var(--muted)] mt-0.5 font-mono">
                  BUILDER DESIGNATION
                </span>
              </div>
            )}
          </div>

          {/* Builder Details */}
          <div className="mt-4 space-y-2.5 font-mono text-xs" style={{ transform: "translateZ(12px)" }}>
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2">
              <span className="text-[var(--muted)] text-[10px] uppercase">LOCATION</span>
              <span className="text-[var(--text)] font-medium">Pune, India</span>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2">
              <span className="text-[var(--muted)] text-[10px] uppercase">STATUS</span>
              <span className="text-[var(--accent-ink)] font-semibold">Active · Phase 1 &amp; 2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)] text-[10px] uppercase">PRIMARY BUILD</span>
              <span className="text-[var(--accent-ink)] font-semibold">CAMPLX</span>
            </div>
          </div>

          {/* Bottom Codebase Channel */}
          <div
            className="mt-4 pt-3 border-t border-[var(--hairline)] flex items-center justify-between font-mono text-xs"
            style={{ transform: "translateZ(8px)" }}
          >
            <span className="text-[var(--muted)] text-[10px]">GITHUB:</span>
            <Link
              href={HANDLES.github.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="clickable"
              className="text-[var(--accent-ink)] hover:underline inline-flex items-center gap-1 font-medium text-[11px]"
            >
              <span>sayyedmohdalsaf06-afk</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
