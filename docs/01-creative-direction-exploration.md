# Portfolio v2 — Creative Direction Exploration

> **Status:** Research & creative direction only. **No UI** until a direction is approved.
> **Deep Field v1:** complete and preserved (branch `design/deep-field`, PR #2). Not being iterated.

---

## 0. Why the reset (the lesson from v1)

v1 executed the *Deep Field / observatory* vision well — but the vision itself wasn't the identity. The trap: we committed to one atmosphere and built it fully before testing whether it was *right*.

**So v2 works differently: diverge → pick a concept → *then* deep-dive.** This doc is the diverge step. Nothing downstream (brand, UX specs, architecture, UI) happens until we lock the concept below.

## 1. New north star

> **An unforgettable interactive AI portfolio.**

The shift in one line: **from a site you *read* to an experience you *operate* — where AI is the medium, not the theme.**

Deep Field asked "what atmosphere?" v2 asks **"what is the one interaction a visitor will never forget — and how does it prove he builds with AI?"**

## 2. The honest tension (must be designed around, not ignored)

Three real constraints will make or break this:

1. **"Interactive AI portfolio" is a trend that rots into gimmick fast.** A bolted-on chatbot or "AI-generated" noise reads as *slop* — the opposite of unforgettable. The memorability must come from a genuine idea + craft, never from "look, AI."
2. **Content is still thin (early student, building in public).** Interactive experiences usually need *substance to interact with*. The concept must be great *now*, with little content, and get better as content grows.
3. **Positioning stays honest.** He's *becoming* — a curious student exploring AI, not an expert/founder. The concept can't require overclaiming. (Recommend we **keep** the "becoming" voice + honesty rules from v1 — they're about truth, not aesthetic.)

## 3. Pivotal questions (your answers steer everything)

1. **The one unforgettable thing** — which feels most *you*: *talk to an AI of me* · *play with my AI experiments* · *a site that generates/reconfigures itself* · *one wildly-crafted interactive centerpiece*?
2. **Real AI or AI-themed?** Is there budget/appetite for a real LLM backend (API cost, latency, hosting, keys) — or should "AI" be simulated/scripted/local for v1? *(This decides feasibility more than anything.)*
3. **Content reality:** lean into "early / building in public" as the story the experience tells — or hold the concept until there's more to show?
4. **Recruiter speed:** an experience can slow down a recruiter who needs proof in 60s. Do we need a fast "just show me the work" path alongside the experience?
5. **Blank slate?** Keep anything from v1 — the amber ring mark, the palette, the "becoming" voice, the honesty rules — or truly start from zero?
6. **Tech appetite:** OK with a heavier stack (WebGL/3D, real-time, LLM), or keep it lean/fast?

## 4. Four directions (distinct, concrete — react to these)

### A · "Ask Alsaf" — the portfolio *is* a conversational agent
The site is an AI you talk to. It knows his work, answers a visitor's real questions ("what has he built with AI?", "is he strong at X?"), adapts to who's asking, and surfaces real records/demos inline. **The site itself becomes his flagship AI project — proof by existence.** Honest when thin ("he's early — here's what he's exploring"). A fast scannable view sits behind it for recruiters.
- **Unforgettable:** "the portfolio you have a conversation with."
- **AI:** real (retrieval over his content) — or scripted for a v1 with no budget.
- **Risk:** chatbot fatigue unless persona + surfaced artifacts + craft are excellent; cost/latency; needs content; recruiter speed.
- **Fit:** highest "AI-native + proves the skill + grows with him."

### B · "Playground" — a portfolio of *playable* experiments
The hero is a live AI demo you actually use; each project is **"try it," not "read about it."** A toy chest of his experiments.
- **Unforgettable:** "I got to play with his AI, not read a résumé."
- **AI:** embedded live demos.
- **Risk:** needs real, working demos — he has few *yet*. Strong as content matures; thin now.

### C · "It builds itself in front of you" — generative, living interface
The site partly assembles/generates live: a generative hero, an interface that reconfigures around what you say you care about (recruiter / founder / curious), AI-authored micro-copy, input-responsive visuals. Different each visit.
- **Unforgettable:** "the site rearranged itself around me."
- **AI:** real-time generative text/visuals.
- **Risk:** highest slop/instability risk; hard quality control; can undercut craft.

### D · "One unforgettable centerpiece" — a single crafted interactive set-piece
Not a new paradigm — clean, fast content around **one** interactive moment engineered to be remembered/screenshotted (an interactive intro, a manipulable artifact, a scrubbable story). AI can be a single embedded demo or a light AI-themed interaction.
- **Unforgettable:** the one moment everyone shares.
- **AI:** light-to-medium; lower risk.
- **Fit:** pragmatic, high-polish, ships now; can evolve toward A/B later.

## 5. Recommendation lens (not a forced pick)

Given he's a **student building in public with thin-but-growing content and a no-overclaim ethos**, the most defensible *unforgettable + honest + AI-native* concept is:

> **A ("Ask Alsaf"), designed to grow into B (playable experiments) as they accrue.**

Because the site *being an AI he built* is the proof, it's honest about being early, and it compounds with his journey. **This hinges entirely on Q2 (real vs simulated AI) and Q3 (content).** If a real AI backend isn't viable now, **D** is the smart, memorable v1 that ships and evolves toward A.

## 6. Process from here (the gate)

1. **You answer Q1–Q6** and react to A–D (pick one, blend, or redirect).
2. I produce a **tight concept brief** for the chosen direction — the single unforgettable interaction, the AI mechanism, the "recruiter fast-path," feasibility + cost, and the memorability test.
3. **Only after you approve that concept** do we build the v2 vision/brand/UX/architecture — and only then, UI.

No files beyond research/direction until step 3 is approved.
