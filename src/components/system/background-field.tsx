"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useTheme } from "@/providers";

interface Point3D {
  x: number;
  y: number;
  z: number;
  origX: number;
  origY: number;
  origZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  tier: "far" | "mid" | "near";
  hasCross: boolean;
  hasRing: boolean;
  pulsePhase: number;
  tag?: string;
}

interface ProjectedPoint {
  px: number;
  py: number;
  scale: number;
  p: Point3D;
  alpha: number;
  distToMouse: number;
}

interface DataPulse {
  p1Index: number;
  p2Index: number;
  progress: number;
  speed: number;
}

/**
 * BackgroundField — Fully Animated Living 3D Spatial Universe.
 *
 * Visual Features:
 *  - 180 3D spatial coordinate nodes with continuous orbital drift & Z-flow.
 *  - Dynamic kinetic data pulses traveling along constellation hairlines.
 *  - Rotating technical coordinate rings and pulsing telemetry nodes.
 *  - High-impact cursor parallax and fluid magnetic vortex.
 *  - Full High-DPI canvas rendering directly under main content (z-0).
 */
export function BackgroundField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Camera & Pointer state
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetCamX = 0;
    let targetCamY = 0;
    let camX = 0;
    let camY = 0;
    let scrollY = window.scrollY || 0;
    let targetScrollY = scrollY;

    // Generate 180 rich 3D coordinate nodes
    const POINT_COUNT = 180;
    const points: Point3D[] = [];
    const technicalTags = ["01", "02", "03", "SYS", "NODE", "ALSAF", "CAMPLX", "EXP", "V2", "POS", "SYNC", "AI", "FLOW", "CORE"];

    for (let i = 0; i < POINT_COUNT; i++) {
      const z = (Math.random() - 0.5) * 800; // -400 to +400
      const spreadX = (Math.random() - 0.5) * (width * 2.0);
      const spreadY = (Math.random() - 0.5) * (height * 2.2);
      const tier: "far" | "mid" | "near" = z < -100 ? "far" : z > 100 ? "near" : "mid";

      const size = tier === "near" ? 4.2 : tier === "mid" ? 2.8 : 1.8;

      points.push({
        x: spreadX,
        y: spreadY,
        z: z,
        origX: spreadX,
        origY: spreadY,
        origZ: z,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.55,
        size: size,
        tier: tier,
        hasCross: i % 4 === 0,
        hasRing: tier === "near" && i % 2 === 0,
        pulsePhase: Math.random() * Math.PI * 2,
        tag: i % 9 === 0 ? technicalTags[i % technicalTags.length] : undefined,
      });
    }

    // Dynamic traveling data pulses between connected nodes
    const pulses: DataPulse[] = [];
    for (let i = 0; i < 22; i++) {
      pulses.push({
        p1Index: Math.floor(Math.random() * POINT_COUNT),
        p2Index: Math.floor(Math.random() * POINT_COUNT),
        progress: Math.random(),
        speed: 0.009 + Math.random() * 0.016,
      });
    }

    let animationFrameId: number;
    let time = 0;

    function handleResize() {
      resize();
    }

    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const nx = (e.clientX / width - 0.5) * 2;
      const ny = (e.clientY / height - 0.5) * 2;
      // Pronounced, dynamic 3D camera response
      targetCamX = nx * 135;
      targetCamY = ny * 95;
    }

    function handleScroll() {
      targetScrollY = window.scrollY || 0;
    }

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const FOCAL_LENGTH = 460;

    function render() {
      if (!ctx) return;
      time += 0.02;

      // Camera interpolation
      camX += (targetCamX - camX) * 0.08;
      camY += (targetCamY - camY) * 0.08;
      scrollY += (targetScrollY - scrollY) * 0.09;

      ctx.clearRect(0, 0, width, height);

      const isDark = theme !== "light";
      const cx = width / 2;
      const cy = height / 2;

      const projected: ProjectedPoint[] = [];

      // 1. Kinetic 3D Node Simulation & Spatial Projection
      for (const p of points) {
        // Continuous spatial travel
        p.origX += p.vx;
        p.origY += p.vy;
        p.origZ += p.vz;

        // Bounded cycling
        const boundX = width * 1.05;
        const boundY = height * 1.2;
        if (Math.abs(p.origX) > boundX) p.vx *= -1;
        if (Math.abs(p.origY) > boundY) p.vy *= -1;
        if (Math.abs(p.origZ) > 400) p.vz *= -1;

        const waveX = Math.sin(time * 0.8 + p.origZ * 0.012) * 16;
        const waveY = Math.cos(time * 0.9 + p.origX * 0.012) * 16;
        const waveZ = Math.sin(time * 0.6 + p.origY * 0.012) * 12;

        const parallaxMult = p.tier === "near" ? 1.75 : p.tier === "mid" ? 1.05 : 0.5;

        const rx = p.origX + waveX - camX * parallaxMult;
        const ry = p.origY + waveY - (camY + scrollY * 0.28) * parallaxMult;
        const rz = p.origZ + waveZ + FOCAL_LENGTH;

        if (rz <= 20) continue;

        const scale = FOCAL_LENGTH / rz;
        let px = cx + rx * scale;
        let py = cy + ry * scale;

        // Screen boundary
        if (px < -100 || px > width + 100 || py < -100 || py > height + 100) continue;

        // Pulse brightness
        const pulseAlpha = Math.sin(time * 2.2 + p.pulsePhase) * 0.18;
        let baseAlpha = (p.tier === "near" ? 0.85 : p.tier === "mid" ? 0.55 : 0.32) + pulseAlpha;
        if (!isDark) baseAlpha = (p.tier === "near" ? 0.70 : p.tier === "mid" ? 0.45 : 0.25) + pulseAlpha * 0.7;

        // Cursor proximity reaction
        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isNearCursor = dist < 200;
        const mouseProx = Math.max(0, 1 - dist / 200);

        // Fluid magnetic cursor repulsion / vortex
        if (isNearCursor) {
          const pullStrength = mouseProx * 16;
          px -= (dx / (dist || 1)) * pullStrength;
          py -= (dy / (dist || 1)) * pullStrength;
        }

        const finalAlpha = Math.min(1.0, baseAlpha + mouseProx * 0.5);

        projected.push({
          px,
          py,
          scale,
          p,
          alpha: finalAlpha,
          distToMouse: dist,
        });
      }

      // 2. Connective Constellation Hairlines
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (!p1) continue;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (!p2) continue;

          const pdist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          if (pdist < 165) {
            const lineProximity = 1 - pdist / 165;
            const mouseBoost = p1.distToMouse < 200 || p2.distToMouse < 200 ? 1.9 : 1.0;
            const lineAlpha = lineProximity * Math.min(p1.alpha, p2.alpha) * 0.45 * mouseBoost;

            if (lineAlpha > 0.02) {
              ctx.lineWidth = p1.distToMouse < 150 ? 1.1 : 0.7;
              ctx.strokeStyle = isDark
                ? `rgba(138, 160, 255, ${Math.min(0.92, lineAlpha)})`
                : `rgba(42, 70, 224, ${Math.min(0.80, lineAlpha)})`;
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Render Traveling Kinetic Data Pulses
      for (const pulse of pulses) {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1.0) {
          pulse.progress = 0;
          pulse.p1Index = Math.floor(Math.random() * projected.length);
          pulse.p2Index = Math.floor(Math.random() * projected.length);
        }

        const pt1 = projected[pulse.p1Index];
        const pt2 = projected[pulse.p2Index];
        if (pt1 && pt2) {
          const pdist = Math.hypot(pt1.px - pt2.px, pt1.py - pt2.py);
          if (pdist < 190) {
            const pulseX = pt1.px + (pt2.px - pt1.px) * pulse.progress;
            const pulseY = pt1.py + (pt2.py - pt1.py) * pulse.progress;
            const pulseSize = 2.4 * ((pt1.scale + pt2.scale) / 2);

            ctx.fillStyle = isDark ? "rgba(165, 185, 255, 0.98)" : "rgba(42, 70, 224, 0.95)";
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, pulseSize, 0, Math.PI * 2);
            ctx.fill();

            // Luminous pulse aura
            ctx.fillStyle = isDark ? "rgba(138, 160, 255, 0.4)" : "rgba(42, 70, 224, 0.35)";
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, pulseSize * 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 4. Render 3D Coordinate Nodes, Rotating Reticles & Technical Crosses
      for (const item of projected) {
        const { px, py, scale, p, alpha, distToMouse } = item;
        const isNearby = distToMouse < 170;
        const ptSize = p.size * scale * (isNearby ? 1.45 : 1.0);

        if (p.hasCross) {
          // Technical coordinate cross (+)
          const arm = (ptSize + 4.5) * scale;
          ctx.strokeStyle = isDark
            ? isNearby
              ? `rgba(165, 185, 255, ${alpha})`
              : `rgba(237, 233, 224, ${alpha})`
            : isNearby
            ? `rgba(42, 70, 224, ${alpha})`
            : `rgba(22, 22, 26, ${alpha})`;
          ctx.lineWidth = isNearby ? 1.4 : 0.9;
          ctx.beginPath();
          ctx.moveTo(px - arm, py);
          ctx.lineTo(px + arm, py);
          ctx.moveTo(px, py - arm);
          ctx.lineTo(px, py + arm);
          ctx.stroke();
        } else {
          // Luminous node core
          ctx.fillStyle = isDark
            ? isNearby
              ? `rgba(165, 185, 255, ${alpha})`
              : `rgba(237, 233, 224, ${alpha})`
            : isNearby
            ? `rgba(42, 70, 224, ${alpha})`
            : `rgba(22, 22, 26, ${alpha})`;

          ctx.beginPath();
          ctx.arc(px, py, Math.max(1.3, ptSize), 0, Math.PI * 2);
          ctx.fill();

          // Rotating technical radar halo ring
          if (p.hasRing || isNearby) {
            const ringRadius = Math.max(4.0, ptSize + 5.0);
            ctx.strokeStyle = isDark
              ? `rgba(138, 160, 255, ${alpha * 0.65})`
              : `rgba(42, 70, 224, ${alpha * 0.55})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.arc(px, py, ringRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Rotating compass tick
            const tickAngle = time * 1.3 + p.pulsePhase;
            const tx = px + Math.cos(tickAngle) * ringRadius;
            const ty = py + Math.sin(tickAngle) * ringRadius;
            ctx.fillStyle = isDark ? `rgba(165, 185, 255, ${alpha})` : `rgba(42, 70, 224, ${alpha})`;
            ctx.beginPath();
            ctx.arc(tx, ty, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Technical coordinate label
        if (p.tag && isNearby && p.tier !== "far") {
          ctx.font = `600 ${Math.max(8.5, 10 * scale)}px "JetBrains Mono", monospace`;
          ctx.fillStyle = isDark
            ? `rgba(165, 185, 255, ${alpha * 0.9})`
            : `rgba(42, 70, 224, ${alpha * 0.9})`;
          ctx.fillText(p.tag, px + ptSize + 5, py - 2);
        }
      }

      // 5. Breathing Ambient Cursor Light Field
      const glowGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 340);
      if (isDark) {
        glowGrad.addColorStop(0, "rgba(60, 95, 255, 0.22)");
        glowGrad.addColorStop(0.45, "rgba(42, 70, 224, 0.08)");
        glowGrad.addColorStop(1, "transparent");
      } else {
        glowGrad.addColorStop(0, "rgba(42, 70, 224, 0.12)");
        glowGrad.addColorStop(0.45, "rgba(42, 70, 224, 0.04)");
        glowGrad.addColorStop(1, "transparent");
      }
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      if (!prefersReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReduced, theme]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 3D Hardware-Accelerated Spatial Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
