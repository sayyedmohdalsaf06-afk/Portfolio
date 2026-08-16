# Mohd Alsaf — Portfolio v2 ("In Focus")

> Turning ideas into working things, figured out in the open.

Portfolio v2 is an identity-first, interactive experience. Rather than decorating a theme (e.g. observatory/space), the interface behaves the way Mohd thinks: **calm, precise, curious, honest, and quietly in motion**.

---

## The Concept: Identity First

- **Essence:** *Mohd Alsaf turns curiosity into working things.*
- **Behavior:** Still by default, resolving into focus on the visitor's intent.
- **Signature Device:** **The Focus Mark** — registration / viewfinder brackets that frame and resolve onto the active subject.
- **Palette:** **Paper & Ink** (light-first `#F4F1EA` / `#16161A`) and **Graphite** (dark `#17181C` / `#EDE9E0`) with a decisive **Focus-Blue signal** (`#2A46E0`).
- **Typography:** **General Sans** (confident voice) + **JetBrains Mono** (thinking/annotation register).
- **Material:** Matte paper detailed like a precision instrument (zero glassmorphism, zero gimmicks).

---

## Documentation

All architectural and design specifications are in [`/docs`](./docs/00-INDEX.md):
- [`docs/01-creative-direction-exploration.md`](./docs/01-creative-direction-exploration.md)
- [`docs/02-identity-first.md`](./docs/02-identity-first.md) *(Governing)*
- [`docs/03-interaction-philosophy.md`](./docs/03-interaction-philosophy.md) *(Governing)*
- [`docs/04-visual-identity.md`](./docs/04-visual-identity.md) *(Governing)*
- [`docs/05-design-bible.md`](./docs/05-design-bible.md)

---

## Prototypes

- **Hero Prototype:** [`prototypes/hero/index.html`](./prototypes/hero/index.html) — Interactive, single-file prototype with 6 cursor states, dual theme, arrival resolve, and focus mark.
- **Specs:** [`.kiro/specs/hero-prototype/`](./.kiro/specs/hero-prototype/)

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev            # http://localhost:3000

# 3. Validation
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint
npm run build          # production build
```

---

## Stack

- **Framework:** Next.js 15 (App Router, RSC)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (`@theme` in `globals.css`)
- **Animation:** Framer Motion (restrained, interruptible, `prefers-reduced-motion` compliant)
- **Typography:** General Sans + JetBrains Mono
