# Portfolio v2 — Visual Identity

> **Status:** Decision document for approval. The translation layer between behavior and visuals.
> **Governed by (frozen):** Identity First (02), Interaction Philosophy (03).
> **The test for every choice:** *Why does this express the personality?* — not *is this trendy?*
> **The personality, in five words we must render:** calm · precise · curious · honest · quietly-in-motion.
> **After approval we prototype exactly one thing: the Hero.**

---

## 0 — The through-line

The behavior is *stillness that resolves into focus on your intent.* So the visual language is **quiet neutrals + one decisive signal, precise geometry, honest matte materials, and motion that settles exactly.** Restraint is not a style here — it *is* the personality (confidence = says less, means more). Everything below follows from that one sentence.

---

## 1 — Typography

The behavioral doc calls for *one confident voice* plus *a "thinking" register* (reasoning shown beneath results). So we need a precise primary and a technical annotation face — and, out of restraint, **no more than two families.**

| Direction | What it is | Why it fits | Risk |
|---|---|---|---|
| **A — Precise grotesque + mono** | A neutral, engineered grotesque as the single voice; a refined monospace as the "thinking/annotation" register (labels, reasoning, metadata) | Swiss clarity = signal-from-noise; the mono makes *learning-in-public* visible and honest; two families = restraint | Grotesques can feel anonymous if we pick a default one |
| **B — Editorial serif + grotesque** | A modern serif for display warmth; sans for body; mono for labels | Reads *curious, literary, tasteful* — "a mind that reads" | Serif skews traditional/less technical; risks 3 families |
| **C — Mono-forward** | Monospace as the primary voice | Maximal engineer/precision signal | Mono-everywhere is a dev-portfolio cliché and hurts long-reading — violates restraint |

**Recommendation: Direction A.** A precise grotesque carries the calm, confident voice; a monospace carries the *reasoning* register (the honest "here's my thinking" layer). This is the most literal translation of "watching someone think" and "identity by evidence," and two families honors his restraint.
- **Primary (voice):** a grotesque with quiet character, not the default — e.g. *General Sans* or *Hanken Grotesk* (both free); aspirational reference: Söhne/Diatype. Display comes from *size + tight tracking*, not a third font.
- **Annotation (thinking):** a humanist monospace — *JetBrains Mono* (free), or the more distinctive *Martian Mono* for small labels.
- **Rejected on purpose:** an editorial serif (B). Considered for warmth; cut because a third register dilutes the "one confident voice." We can revisit only if the Hero feels cold.

---

## 2 — Color

His restraint + "clarity is the aesthetic" + "signal from noise" point to one conclusion: **a neutral-dominant field with a single decisive accent.** The accent is the *signal*; the neutrals are the calm it emerges from. (No AI-purple, no cyberpunk cyan, no matrix green, and no return to v1's amber.)

| Palette | Neutrals | Accent | Emotion |
|---|---|---|---|
| **A — Paper & Ink** (light-first) | warm bone `#F4F1EA` / ink `#16161A` | one focus-blue `~#2A46E0` | calm, honest, editorial, timeless, human |
| **B — Graphite** (dark, *not* space) | warm graphite `#17181C` / soft bone text | the same focus-blue, luminous | focused, cinematic, quiet-at-night |
| **C — Ink & Signal** (near-mono + warm) | neutral greys only | a single warm signal `~#E4552A` used *only* for "now/alive" | technical + human warmth; purest signal-from-noise, but warmer/more energetic |

**Recommendation: Palette A as the system, with B as its *inverted dark mode* (same tokens).** One cool **focus-blue** accent — blue reads *precision, focus, trust, legibility, timelessness*, and a slightly deep, faintly-muted cobalt (not generic tech-blue) sitting in warm neutrals creates the exact *calm → signal* tension the personality is about. Color is **rationed**: mostly ink-on-paper, accent used only where attention should resolve. A sparshort warm "now/alive" tick (from C) is an *optional* second signal to validate on the Hero — not a given.
- **Open, decided on the Hero (as you intended — validate through design):** light-first (A) vs graphite (B) as the *primary* surface. I lean light — rarer for dev portfolios, most differentiated, most "clarity."

---

## 3 — Material

Research already told us glass has become the default cliché and that *tactile, honestly-authored* surfaces build trust (Rams: honest; anti-glassmorphism). His honesty rule makes this easy.

- **Primary: matte paper.** Surfaces don't fake light or depth they don't have. Honest, editorial, calm, timeless.
- **Detailing: precision-instrument.** Exact edges, hairline rules, machined alignment, fine tick-marks. This is where *precision* lives — a made-with-intent feel, like a good camera or measuring tool.
- **Rejected:** glass (dishonest depth, trendy), metal/ceramic/fabric skeuomorph (costume, not identity). Glass is permitted *only* as a rare transient overlay, if ever.
- **In one line:** *matte paper, detailed like an instrument.*

---

## 4 — Background

Direct consequence of Law #6 (**still by default**) and "never perform": the background does **not** move on its own. This is the deliberate opposite of v1's autonomous starfield.

- **Still, structural, not scenic.** A calm field (paper or graphite) with an optional *faint* structural rhythm — a hairline baseline/grid that organizes, never decorates.
- **Movement only on intent.** The field may respond *subtly* to the visitor (and to the single arrival "hello"), then return to stillness. No ambient particles, no drift, no loop.
- **Why:** an autonomous, always-moving background would *perform at* the visitor — the exact thing his confidence forbids. Stillness that reacts to you is the personality.

---

## 5 — Cursor (behavior)

The cursor is the visitor's **instrument of attention** — it reinforces "coming into focus" without a single animation flourish.

- **Precise and immediate.** Exact, responsive, no lag-trail, never a blob.
- **Contextual, honest states:** *inspect* (over content), *more-beneath* (where depth is available — curiosity's quiet hint), *press* (exact acknowledgement). It never signals an affordance that isn't real (Law #7).
- **Magnetism only where precision helps** (fine targets), never as a toy.
- **Degrades gracefully:** native behavior on touch; magnetism off under reduced-motion; it never hides the real cursor without an equal affordance.

---

## 6 — Motion language

From precision + calm + confidence + "settles to exact rest": motion is **confident and calm, with an exact landing.**

- **Fast?** Immediate to *begin* (<~100ms), unhurried to *complete.*
- **Heavy?** No — light, but never floaty.
- **Elastic / bouncy?** No — bounce reads playful-silly; he is playful-precise.
- **Mechanical / robotic?** No — cold.
- **Organic?** Only in the *easing* (a natural deceleration), not in the geometry.
- **The signature behaviour:** things **resolve into focus** — sharpen, align, and settle to an exact stop, no overshoot. Motion reveals, confirms, or transitions; otherwise it's cut (Law #5). One resolve per view.

---

## 7 — Shape language

- **Precise and near-square**, small *consistent* radius (crisp, not pill-soft, not brutalist-raw).
- **Hairline rules as a structural motif** — fine lines that organize content and occasionally *align/resolve.* This carries "systems thinking" and editorial craft, and it feeds the signature device below.
- **Why:** sharp = precision + honesty; hairlines = structure + taste; heavy rounding would read soft/consumer-trendy and off-personality.

---

## 8 — Signature visual device: **the focus mark**

**One timeless element people associate with the portfolio: a precise pair of registration / focus brackets that frame and *resolve onto* whatever has attention** — the visual grammar of a camera viewfinder, print crop/registration marks, and drafting.

- **Why it's *him,* not a gimmick:** it is *functional* — it directs attention and marks focus — so it earns its place (Law #5). It renders "coming into focus," precision, curiosity (attention on things), and editorial craft *without one word.* It threads through the cursor (attention), motion (resolving), and layout (hairlines/alignment) — one idea, everywhere, quietly.
- **Why timeless:** viewfinders and crop marks have looked right for a century; they won't date like a gradient or a glass panel.
- **Restraint:** it appears where focus genuinely shifts (arrival, the current subject, an opened project) — not as decoration on every element.
- **The screenshot test:** a frame with these marks resolving onto a subject, in ink-on-paper with one blue signal, is recognizable as this site with the name removed.

---

## 9 — Decisions summary

| Layer | Decision |
|---|---|
| Type | Precise grotesque (voice) + monospace (thinking register); two families |
| Color | Neutral-dominant, one rationed focus-blue signal; light-first system w/ inverted dark mode |
| Material | Matte paper, detailed like an instrument; no glass |
| Background | Still by default; reacts to intent only; never autonomous |
| Cursor | Precise instrument of attention; honest contextual states |
| Motion | Confident, calm, exact landing; resolves into focus; one resolve per view |
| Shape | Precise near-square + hairline rules as structure |
| **Signature** | **The focus mark** — registration/viewfinder brackets that resolve onto the subject |
| Sound | Optional, deferred — if ever, a single sparse, precise tick on the "hello" only; validate later |

---

## 10 — What the Hero will validate

Approve this, and the single Hero prototype tests the few things worth testing *through design, not debate:*
1. **Light (Paper & Ink) vs graphite** as primary surface.
2. The **focus mark** as signature — does it feel timeless and *his*, or clever?
3. The **arrival "hello"** resolve + the **type pairing** voice.
4. Whether one accent is enough, or a sparse warm "now" tick earns its place.

One exceptional screen. If it feels like him with the name removed, the identity is proven and the rest of the system follows.
