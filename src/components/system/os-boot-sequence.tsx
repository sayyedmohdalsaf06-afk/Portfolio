"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface OSBootSequenceProps {
  onComplete?: () => void;
}

const BOOT_LOGS = [
  { prefix: "KERN_INIT", text: "ALSAF-OS KERNEL v2.4 // INITIALIZED", status: "OK" },
  { prefix: "GRAPH_3D", text: "MOUNTING 3D SPATIAL ENGINE & AVATAR CANVAS", status: "LOADED" },
  { prefix: "AUTH_SPEC", text: "PROFILE: SAYYED MOHD ALSAF [CSE // ACTIVE BUILDER]", status: "VERIFIED" },
  { prefix: "SYS_READY", text: "ALL SYSTEMS NOMINAL. LAUNCHING WORKSPACE...", status: "READY" },
];

export function OSBootSequence({ onComplete }: OSBootSequenceProps) {
  const prefersReduced = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // If reduced motion or already booted in this session, skip immediately
    if (prefersReduced) {
      setCompleted(true);
      setDismissed(true);
      if (onComplete) onComplete();
      return;
    }

    // Step 1
    const t1 = setTimeout(() => {
      setCurrentStep(1);
      setProgress(35);
    }, 220);

    // Step 2
    const t2 = setTimeout(() => {
      setCurrentStep(2);
      setProgress(68);
    }, 520);

    // Step 3
    const t3 = setTimeout(() => {
      setCurrentStep(3);
      setProgress(92);
    }, 820);

    // Step 4: Complete
    const t4 = setTimeout(() => {
      setCurrentStep(4);
      setProgress(100);
    }, 1100);

    // Unlock screen & fade out
    const t5 = setTimeout(() => {
      setCompleted(true);
      if (onComplete) onComplete();
    }, 1350);

    // Completely unmount overlay after fade
    const t6 = setTimeout(() => {
      setDismissed(true);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [prefersReduced, onComplete]);

  const handleSkip = useCallback(() => {
    setCompleted(true);
    setDismissed(true);
    if (onComplete) onComplete();
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  if (dismissed) return null;

  return (
    <div
      onClick={handleSkip}
      role="dialog"
      aria-label="System Boot Sequence"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#070b0e] text-[#e5e7eb] select-none transition-all duration-500 ease-out cursor-pointer ${
        completed
          ? "opacity-0 pointer-events-none scale-105 filter blur-xs"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Ambient Cyber Grid & Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-20"
      />
      <div
        aria-hidden="true"
        className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />

      {/* Main Terminal HUD Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg mx-4 p-6 sm:p-8 rounded-sm border border-[#1e293b] bg-[#0c1319]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(13,148,136,0.18)] overflow-hidden"
      >
        {/* Futuristic Corner Brackets */}
        <div aria-hidden="true" className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#22d3ee]" />
        <div aria-hidden="true" className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#22d3ee]" />
        <div aria-hidden="true" className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#22d3ee]" />
        <div aria-hidden="true" className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#22d3ee]" />

        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-4 font-mono text-[10px] text-[#94a3b8] uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#22d3ee] animate-ping" />
            <span className="font-bold text-[#22d3ee] tracking-widest">ALSAF-OS // SYS_BOOT</span>
          </div>
          <span className="text-[#64748b]">MEM: 0x7FFF · 64-BIT</span>
        </div>

        {/* Sequential Boot Log Lines */}
        <div className="space-y-2.5 font-mono text-xs text-[#cbd5e1] min-h-[110px]">
          {BOOT_LOGS.map((log, idx) => {
            const isVisible = currentStep >= idx;
            const isCurrent = currentStep === idx;

            return (
              <div
                key={log.prefix}
                className={`flex items-start justify-between gap-3 transition-all duration-200 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#22d3ee] font-bold">[{log.prefix}]</span>
                  <span className={isCurrent ? "text-white font-medium" : "text-[#94a3b8]"}>
                    {log.text}
                  </span>
                  {isCurrent && !completed && (
                    <span className="inline-block w-2 h-3.5 bg-[#22d3ee] animate-pulse ml-0.5" />
                  )}
                </div>

                {isVisible && (
                  <span className="shrink-0 font-bold text-[10px] px-1.5 py-0.5 rounded-xs bg-[#0d9488]/20 text-[#22d3ee] border border-[#0d9488]/40 shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                    {log.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Percentage Gauge */}
        <div className="mt-6 pt-3 border-t border-[#1e293b]">
          <div className="flex items-center justify-between font-mono text-[10px] text-[#94a3b8] mb-1.5">
            <span className="tracking-wider">SYSTEM INITIALIZATION</span>
            <span className="font-bold text-[#22d3ee]">{progress}%</span>
          </div>

          <div className="relative h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0d9488] via-[#22d3ee] to-[#38bdf8] transition-all duration-300 ease-out shadow-[0_0_12px_#22d3ee]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip Hint */}
        <div className="mt-4 flex items-center justify-between font-mono text-[9px] text-[#64748b]">
          <span>SPATIAL WORKBENCH v2.4</span>
          <button
            type="button"
            onClick={handleSkip}
            className="hover:text-[#22d3ee] underline transition-colors cursor-pointer"
          >
            PRESS [ESC] OR CLICK TO SKIP →
          </button>
        </div>
      </div>
    </div>
  );
}
