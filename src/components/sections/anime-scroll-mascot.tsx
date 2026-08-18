"use client";

import Image from "next/image";
import { useState } from "react";

interface AnimeScrollMascotProps {
  onScrollDown?: () => void;
}

export function AnimeScrollMascot({ onScrollDown }: AnimeScrollMascotProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (onScrollDown) {
      onScrollDown();
    } else {
      const target = document.getElementById("whoami") || document.getElementById("project-experience");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      data-cursor="clickable"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label="Scroll down for workstation and projects guide"
      className="group relative inline-flex flex-col sm:flex-row items-center gap-3 select-none cursor-pointer py-1 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-xs"
    >
      {/* Speech Bubble / Dialogue Balloon */}
      <div
        className={`relative order-2 sm:order-1 px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
          hovered
            ? "border-[var(--accent)] bg-[var(--surface-raised)] shadow-[0_0_16px_var(--accent-glow)] scale-[1.03]"
            : "border-[var(--hairline-strong)] bg-[var(--surface-raised)]/90 shadow-md"
        } backdrop-blur-md text-left`}
      >
        <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_6px_var(--accent)]" aria-hidden="true" />
          <span className="font-semibold tracking-tight text-[var(--accent)]">
            Scroll down for workstation &amp; projects!
          </span>
          <span
            className={`inline-block font-bold text-[var(--accent)] transition-transform duration-200 ${
              hovered ? "translate-y-1 scale-125" : "animate-anime-pointer"
            }`}
            aria-hidden="true"
          >
            ↓
          </span>
        </div>

        {/* Comic Speech Tail / Arrow pointer towards mascot */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-[var(--surface-raised)]"
        />
      </div>

      {/* Animated Chibi Character Avatar */}
      <div className="relative order-1 sm:order-2 shrink-0 animate-anime-float">
        {/* Luminous Cyan/Teal Halo */}
        <div
          aria-hidden="true"
          className="absolute -inset-1.5 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-30 blur-md pointer-events-none animate-anime-pulse"
        />

        {/* Character Circle Badge */}
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-[var(--accent)] bg-[#0d1520] overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Image
            src="/images/mascot/anime-guide.jpg"
            alt="Animated Anime Developer Guide"
            fill
            className="object-cover scale-110"
            priority
          />
        </div>

        {/* Small Pointing Hand Indicator Badge */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[var(--accent)] text-[#0a0f14] flex items-center justify-center text-[10px] font-extrabold shadow-sm border border-[var(--surface)] animate-anime-pointer"
        >
          ↓
        </span>
      </div>
    </div>
  );
}
