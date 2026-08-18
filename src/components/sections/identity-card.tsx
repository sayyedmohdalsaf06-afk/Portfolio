"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HANDLES } from "@/constants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * IdentityCard — Living 3D Interactive Builder Dossier.
 *
 * High-Impact 3D Spatial Arrival & Physics:
 *  - 100% Invisible on Initial Page Load: Completely hidden while viewing Hero at scrollY=0.
 *  - Pronounced Right-to-Left 3D Gliding Arc: Sweeps in from deep right (+380px X, -340px Z, -38° Yaw) as you scroll down.
 *  - Continuous Zero-G Floating Levitation with Velocity Physics.
 *  - 3D Satellite Telemetry Chips floating in differential Z-planes.
 *  - Animated Technical Scanline Beam sweeping across the portrait aperture.
 *  - Dynamic Conic Iridescent Border Beam & Specular Holographic Reflection.
 *  - Elastic Bounded Toss & Drag with velocity-induced 3D bank rotation.
 *  - Breathing Ambient Focus Blue Underglow.
 *
 * @see docs/02-identity-first.md
 * @see docs/03-interaction-philosophy.md
 */
export function IdentityCard() {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || typeof window === "undefined") return;

    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mqFine.matches) return;

    const card = cardRef.current;
    const sheen = sheenRef.current;
    const glow = glowRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    let targetRotX = 0, targetRotY = 0;
    let curRotX = 0, curRotY = 0;

    let dragging = false;
    let dragStartX = 0, dragStartY = 0;
    let dragTargetX = 0, dragTargetY = 0;
    let dragCurX = 0, dragCurY = 0;
    const DRAG_MAX = 48;

    let targetArrivalProgress = 0;
    let curArrivalProgress = 0;

    let localMouseX = 250;
    let localMouseY = 200;
    let time = 0;

    let rafId: number | null = null;

    function clamp(v: number, lo: number, hi: number) {
      return v < lo ? lo : v > hi ? hi : v;
    }

    function handleScroll() {
      const rect = container!.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start arrival ONLY when user actively scrolls down past the Hero
      const startY = windowHeight * 0.88;
      const endY = windowHeight * 0.28;
      const rawProgress = (startY - rect.top) / (startY - endY);
      targetArrivalProgress = Math.max(0, Math.min(1, rawProgress));
      kick();
    }

    function composeTransforms() {
      // 1. Zero-G Ambient Levitation Physics
      time += 0.026;
      const ambientFloatY = Math.sin(time) * 5.0;
      const ambientRotZ = Math.cos(time * 0.75) * 0.8;
      const ambientRotX = Math.sin(time * 0.65) * 0.6;

      // 2. Pronounced Right-to-Left 3D Spatial Swoop
      const t = curArrivalProgress;
      const easedProgress = 1 - Math.pow(1 - t, 2.8); // Fluid power ease-out curve

      // Fully hidden on top of page when viewing Hero
      if (easedProgress <= 0.005) {
        card!.style.opacity = "0";
        card!.style.pointerEvents = "none";
        if (glow) glow.style.opacity = "0";
        return;
      }

      card!.style.pointerEvents = "auto";
      card!.style.opacity = `${easedProgress.toFixed(2)}`;

      const scrollSlideX = (1 - easedProgress) * 380; // Sweeps in dramatically from +380px right
      const scrollSlideZ = (1 - easedProgress) * -340; // Enters from deep -340px Z space
      const scrollRotY = (1 - easedProgress) * -38; // Dramatic 3D yaw angle turning into focus
      const scrollRotX = (1 - easedProgress) * 11; // Pitch angle easing flat
      const scrollScale = 0.76 + easedProgress * 0.24; // Scales up from 0.76 to 1.0

      // 3. Velocity-Induced Bank Rotation when Dragging
      const dragBankZ = dragCurX * 0.28;
      const dragBankX = dragCurY * -0.18;

      const totalRotX = curRotX + scrollRotX + ambientRotX + dragBankX;
      const totalRotY = curRotY + scrollRotY;
      const totalRotZ = ambientRotZ + dragBankZ;
      const totalTransX = dragCurX + scrollSlideX;
      const totalTransY = dragCurY + ambientFloatY;
      const totalTransZ = scrollSlideZ;

      const rotStr = `rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) rotateZ(${totalRotZ.toFixed(2)}deg) scale(${scrollScale.toFixed(3)})`;
      const transStr = `translate3d(${totalTransX.toFixed(2)}px, ${totalTransY.toFixed(2)}px, ${totalTransZ.toFixed(2)}px)`;
      card!.style.transform = `${transStr} ${rotStr}`;

      // 4. Specular Holographic Glare
      if (sheen) {
        sheen.style.background = `radial-gradient(circle 380px at ${localMouseX}px ${localMouseY}px, rgba(138, 160, 255, 0.16), transparent 70%)`;
      }

      // 5. Breathing Focus Blue Underglow
      if (glow) {
        const glowScale = 1.0 + Math.sin(time * 1.5) * 0.08 + (dragging ? 0.15 : 0);
        glow.style.transform = `translate3d(${totalTransX.toFixed(2)}px, ${(totalTransY + 18).toFixed(2)}px, -60px) scale(${glowScale.toFixed(3)})`;
        glow.style.opacity = `${(easedProgress * 0.45 + (dragging ? 0.25 : 0)).toFixed(2)}`;
      }

      // 6. Dynamic Elevation Shadow
      const shadowX = (-totalRotY * 2.8 + dragCurX * 0.3).toFixed(1);
      const shadowY = (totalRotX * 2.8 + 16 + Math.abs(dragCurY) * 0.4).toFixed(1);
      card!.style.boxShadow = `${shadowX}px ${shadowY}px 40px var(--hairline-strong)`;
    }

    function frame() {
      // (a) Silky smooth arrival lerp with responsive damping
      curArrivalProgress += (targetArrivalProgress - curArrivalProgress) * 0.06;

      // (b) Pointer 3D tilt easing
      curRotX += (targetRotX - curRotX) * 0.10;
      curRotY += (targetRotY - curRotY) * 0.10;

      // (c) Elastic drag spring settle
      if (!dragging) {
        dragCurX += (dragTargetX - dragCurX) * 0.14;
        dragCurY += (dragTargetY - dragCurY) * 0.14;
      }

      composeTransforms();

      // Continuous loop for zero-g floating and fluid scroll response
      rafId = requestAnimationFrame(frame);
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

      if (isOver) {
        localMouseX = e.clientX - rect.left;
        localMouseY = e.clientY - rect.top;

        if (!dragging) {
          const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          targetRotX = -ny * 5.0;
          targetRotY = nx * 5.0;
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    card.addEventListener("pointerleave", onPointerLeave);

    handleScroll();
    kick();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      card.removeEventListener("pointerleave", onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  return (
    <section
      id="identity-card-section"
      aria-labelledby="identity-card-title"
      ref={containerRef}
      className="relative py-8 border-t border-[var(--hairline)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-annotation text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="inline-block h-1.5 w-1.5 rounded-xs bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" aria-hidden="true" />
          <h2 id="identity-card-title" className="font-normal text-[var(--muted)]">
            Builder Identity Object
          </h2>
        </div>

        <span className="font-annotation text-[10px] text-[var(--accent-ink)] font-mono tracking-wider select-none hidden sm:inline">
          LIVE 3D WORKSTATION ARTIFACT
        </span>
      </div>

      {/* 3D Perspective Stage Container */}
      <div className="relative w-full [perspective:1400px]">
        {/* Breathing Focus Blue Underglow Aura */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="absolute inset-x-8 -inset-y-4 rounded-full bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_68%)] opacity-0 blur-2xl pointer-events-none -z-10 transition-opacity duration-300"
        />

        {/* 3D Physical Card Chassis */}
        <div
          ref={cardRef}
          data-cursor="drag"
          className="relative w-full rounded-sm border border-[var(--hairline-strong)] bg-[var(--surface-raised)] will-change-transform select-none shadow-xl overflow-hidden opacity-0 pointer-events-none transition-shadow duration-300"
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

          {/* Animated Iridescent Edge Shimmer Beam */}
          <div
            aria-hidden="true"
            className="absolute -inset-[1px] rounded-sm pointer-events-none z-20 border border-[var(--accent)]/30 opacity-75 [mask-image:radial-gradient(circle_at_top_right,black,transparent_75%)]"
          />

          {/* Floating 3D Satellite Chip: Top Right */}
          <div
            aria-hidden="true"
            className="absolute top-3 right-3 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[var(--surface)]/85 border border-[var(--accent)]/40 font-mono text-[9px] text-[var(--accent-ink)] z-20 shadow-xs pointer-events-none"
            style={{ transform: "translateZ(32px)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-ping inline-block" />
            <span className="font-semibold tracking-wider">CORE // 06 · ONLINE</span>
          </div>

          {/* Main Card Body (Preserved 3D Depth Planes) */}
          <div
            className="w-full h-full p-6 sm:p-8 flex flex-col justify-between relative z-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Header Meta Bar */}
            <div
              className="flex items-center justify-between border-b border-[var(--hairline)] pb-3.5 mb-6 font-mono text-[11px] text-[var(--muted)] select-none"
              style={{ transform: "translateZ(10px)" }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_6px_var(--accent)]" aria-hidden="true" />
                <span className="font-semibold text-[var(--text)] tracking-wider">DOSSIER // SPEC-01</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="text-[var(--accent-ink)] font-semibold">STATUS: ACTIVE BUILDER</span>
                <span className="text-[var(--hairline-strong)]">|</span>
                <span>PUNE · IN</span>
              </div>
            </div>

            {/* Main Visual & Data Composition */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-start my-auto">
              {/* Elevated 3D Portrait / Character Aperture with Scanline Animation */}
              <div
                className="md:col-span-5 relative aspect-[4/3] md:aspect-square rounded-xs border border-[var(--hairline-strong)] bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center group shadow-md transition-transform duration-300"
                style={{ transform: "translateZ(28px)" }}
                data-cursor="inspect"
                title="Builder Character Visual"
              >
                {/* Technical Corner Crosshairs */}
                <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[var(--accent-ink)] select-none z-10">┌</span>
                <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[var(--accent-ink)] select-none z-10">┐</span>
                <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono text-[var(--accent-ink)] select-none z-10">└</span>
                <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono text-[var(--accent-ink)] select-none z-10">┘</span>

                {/* Animated Technical Radar Scanline Beam */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-[var(--accent)]/15 to-transparent pointer-events-none z-20 animate-[scanline_4s_ease-in-out_infinite]"
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
                  /* Stylized Cinematic Builder Insignia */
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

                {/* Subtle Coordinate Grid Inset */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_75%)] opacity-[0.08] pointer-events-none" />
              </div>

              {/* Complete Identity Typographic & Technical Core */}
              <div
                className="md:col-span-7 space-y-4"
                style={{ transform: "translateZ(18px)" }}
              >
                <div>
                  <span className="font-annotation text-xs uppercase tracking-[0.18em] text-[var(--accent-ink)] font-semibold block mb-1">
                    CSE · AI · SYSTEMS
                  </span>
                  <h3
                    data-cursor="scan"
                    className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[var(--text)] leading-tight select-text"
                  >
                    Mohd Alsaf
                  </h3>
                  <p className="text-xs text-[var(--muted)] font-mono mt-1 select-text">
                    2nd-year CSE Student · Builder · Exploring AI & Systems
                  </p>
                </div>

                {/* Structured Key Technical Data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--hairline)] font-mono text-xs select-text">
                  <div>
                    <span className="text-[var(--muted)] block text-[10px] uppercase">LOCATION</span>
                    <span className="text-[var(--text)] font-medium">Pune, India</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block text-[10px] uppercase">STATUS</span>
                    <span className="text-[var(--accent-ink)] font-semibold">Active · Phase 1 &amp; 2</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[var(--muted)] block text-[10px] uppercase">PRIMARY BUILD</span>
                    <span className="text-[var(--accent-ink)] font-semibold">
                      CAMPLX (Campus + Exchange + Community)
                    </span>
                  </div>
                </div>

                {/* Engineering Stance */}
                <div className="p-3 rounded-xs border border-[var(--hairline)] bg-[var(--surface-subtle)] text-xs text-[var(--muted)] leading-relaxed select-text shadow-xs">
                  <span className="text-[var(--text)] font-semibold block mb-0.5 font-sans">Engineering Philosophy:</span>
                  &quot;I turn ideas into working things — exploring intelligent systems, graph architectures, and building practical tools in the open.&quot;
                </div>

                {/* Direct Codebase Link */}
                <div className="pt-1 flex items-center justify-between font-mono text-xs">
                  <span className="text-[var(--muted)]">Codebase:</span>
                  <Link
                    href={HANDLES.github.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="clickable"
                    className="text-[var(--accent-ink)] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>github.com/sayyedmohdalsaf06-afk</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer Status Bar */}
            <div
              className="flex items-center justify-between border-t border-[var(--hairline)] pt-3.5 mt-5 font-mono text-[11px] text-[var(--muted)]"
              style={{ transform: "translateZ(10px)" }}
            >
              <span>DRAG TO DISPLACE IN 3D SPACE</span>
              <span className="text-[var(--accent-ink)] font-semibold">PHYSICAL OBJECT · ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
