"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * BackgroundField — The Living Grid.
 * Still by default. Features:
 *  - Pointer parallax (small, single structural layer).
 *  - Pointer illumination mask (fieldNear).
 *  - Bounded grid dragging: click & drag anywhere on empty canvas with spring settle.
 *  - Scroll depth translation.
 * @see docs/03-interaction-philosophy.md
 * @see docs/04-visual-identity.md §4
 */
export function BackgroundField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const fieldNearRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || typeof window === "undefined") return;

    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mqFine.matches) return;

    const field = fieldRef.current;
    const fieldNear = fieldNearRef.current;
    const root = rootRef.current;
    if (!field || !fieldNear || !root) return;

    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    let scrollY = window.scrollY || 0;

    let dragging = false;
    let dragStartX = 0, dragStartY = 0;
    let dragTargetX = 0, dragTargetY = 0;
    let dragCurX = 0, dragCurY = 0;
    const DRAG_MAX = 48;

    let rafId: number | null = null;
    let idleTimer: NodeJS.Timeout | null = null;

    function clamp(v: number, lo: number, hi: number) {
      return v < lo ? lo : v > hi ? hi : v;
    }

    function composeTransforms() {
      const fieldX = curX + dragCurX;
      const fieldY = curY + dragCurY + scrollY * 0.05;
      const transformStr = `translate3d(${fieldX.toFixed(2)}px, ${fieldY.toFixed(2)}px, 0)`;
      field!.style.transform = transformStr;
      fieldNear!.style.transform = transformStr;
    }

    function frame() {
      let active = false;

      // (a) Parallax lerp
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      if (Math.abs(targetX - curX) > 0.03 || Math.abs(targetY - curY) > 0.03) active = true;
      else { curX = targetX; curY = targetY; }

      // (b) Grid drag lerp / spring settle
      if (dragging) {
        active = true;
      } else {
        dragCurX += (dragTargetX - dragCurX) * 0.16;
        dragCurY += (dragTargetY - dragCurY) * 0.16;
        if (Math.abs(dragTargetX - dragCurX) > 0.05 || Math.abs(dragTargetY - dragCurY) > 0.05) active = true;
        else { dragCurX = dragTargetX; dragCurY = dragTargetY; }
      }

      composeTransforms();

      if (active) {
        rafId = requestAnimationFrame(frame);
      } else {
        rafId = null;
      }
    }

    function kick() {
      if (rafId === null) rafId = requestAnimationFrame(frame);
    }

    function onPointerMove(e: PointerEvent) {
      const px = (e.clientX / window.innerWidth - 0.5) * 2;
      const py = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = px * -4;
      targetY = py * -4;

      fieldNear!.style.setProperty("--mx", `${e.clientX}px`);
      fieldNear!.style.setProperty("--my", `${e.clientY}px`);
      fieldNear!.classList.add("active");

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        fieldNear!.classList.remove("active");
      }, 400);

      if (dragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragTargetX = clamp(dx, -DRAG_MAX, DRAG_MAX);
        dragTargetY = clamp(dy, -DRAG_MAX, DRAG_MAX);
        dragCurX = dragTargetX;
        dragCurY = dragTargetY;
      }

      kick();
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      // Allow drag on empty canvas or non-interactive background
      const isInteractive = target.closest("a, button, input, textarea, select, [role='button']");
      if (isInteractive) return;

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

    function onScroll() {
      scrollY = window.scrollY || 0;
      kick();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [prefersReduced]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--surface)] select-none"
    >
      <div ref={fieldRef} className="field" />
      <div ref={fieldNearRef} className="field-near" />
    </div>
  );
}
