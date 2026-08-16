"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * CursorInstrument — 6-state precision instrument for Portfolio v2.
 * @see docs/03-interaction-philosophy.md §6
 * @see docs/04-visual-identity.md §5
 */
export function CursorInstrument() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || typeof window === "undefined") return;

    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mqFine.matches) return;

    const cursor = cursorRef.current;
    const scanline = scanlineRef.current;
    if (!cursor || !scanline) return;

    document.body.classList.add("custom-cursor");

    let cx = 0, cy = 0;
    let tx = -100, ty = -100;
    let rafId: number | null = null;
    let currentState = "inspect";
    let isMouseDown = false;

    function frame() {
      cx += (tx - cx) * 0.35;
      cy += (ty - cy) * 0.35;
      cursor!.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;

      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        rafId = requestAnimationFrame(frame);
      } else {
        rafId = null;
      }
    }

    function kick() {
      if (rafId === null) rafId = requestAnimationFrame(frame);
    }

    function setState(s: string) {
      if (s === currentState) return;
      currentState = s;

      cursor!.classList.remove("is-scan", "is-clickable", "is-nav", "is-grab", "is-loading", "is-press");

      if (s === "scan") {
        cursor!.classList.add("is-scan");
        // Run one-shot scanline sweep
        scanline!.classList.remove("run");
        void scanline!.offsetWidth;
        scanline!.classList.add("run");
      } else if (s === "clickable") {
        cursor!.classList.add("is-clickable");
      } else if (s === "nav") {
        cursor!.classList.add("is-nav");
      } else if (s === "drag") {
        cursor!.classList.add("is-grab");
      } else if (s === "loading") {
        cursor!.classList.add("is-loading");
      }
    }

    function resolveState(e: MouseEvent): string {
      if (document.body.classList.contains("is-dragging-grid")) return "drag";

      const target = e.target as HTMLElement | null;
      if (!target) return "inspect";

      const explicit = target.closest("[data-cursor]") as HTMLElement | null;
      if (explicit) {
        const val = explicit.getAttribute("data-cursor");
        if (val) return val;
      }

      if (target.closest("a, button, [role='button'], input, textarea, select")) {
        return "clickable";
      }

      if (target.closest("h1, h2, h3, p, article, [data-cursor='scan']")) {
        return "scan";
      }

      return "drag"; // over draggable canvas field
    }

    function onMouseMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      cursor!.style.opacity = "1";

      const state = resolveState(e);
      setState(state);

      if (isMouseDown) {
        cursor!.classList.add("is-press");
      }

      kick();
    }

    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return;
      isMouseDown = true;
      cursor!.classList.add("is-press");

      // Spawn click snap crosshair
      spawnSnap(e.clientX, e.clientY);
    }

    function onMouseUp() {
      isMouseDown = false;
      cursor!.classList.remove("is-press");
    }

    function onMouseLeave() {
      cursor!.style.opacity = "0";
    }

    function spawnSnap(x: number, y: number) {
      const snap = document.createElement("div");
      snap.className = "snap play";
      snap.style.left = `${x}px`;
      snap.style.top = `${y}px`;
      document.body.appendChild(snap);
      setTimeout(() => {
        if (snap.parentNode) snap.parentNode.removeChild(snap);
      }, 300);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.body.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div ref={cursorRef} className="cursor" aria-hidden="true">
      <span className="ring" />
      <span className="dot" />
      <span ref={scanlineRef} className="scanline" aria-hidden="true" />
      <span className="chev" aria-hidden="true" />
      <span className="loader" aria-hidden="true" />
    </div>
  );
}
