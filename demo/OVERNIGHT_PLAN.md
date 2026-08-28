# Overnight Left-To-Go Plan — Personal Product Lab

**North star:** Scrolling `/demo` should feel like moving through carefully directed scenes — Identity → Systems → Process → Capabilities → Now → Contact — not a slideshow and not a generic dark portfolio.

**Supervisor rule:** One backlog item per pass. Ship the smallest safe change. Run `npm run demo:build` after each meaningful wave. Never invent metrics. Prefer transform/opacity. Respect `prefers-reduced-motion`. Do not overanimate.

**Repo note:** Source of truth is `demo/`. Build output `public/demo/` is gitignored. Commit `demo/**` + `public/demo-assets/**` before any cloud automation can see this work.

---

## Progress log

- **W1 started:** Scene defaults retuned (reveal ~0.58s, mask ~0.72s, stagger 0.10). Systems switch: removed layout thrash, image ≤0.42s, story stagger ≤0.27s. Hero Builder ID delay cut to 0.42s.
- **W2/W3/W4 pass:** CONTENT.md synced to live IA. Hero `01 Identity` chapter cue. Mobile menu focus trap + Esc restore. Reduced-motion CSS no longer blanket-kills transitions. Process region a11y + 0.35s open. Capabilities tags + no sibling dim. Contact ghost `CONTACT` + green primary CTA. Section hairlines + Capabilities surface shift. Systems `aria-activedescendant` + restrained mobile scrollIntoView.
- **W5 perf:** OG/Twitter meta, preload first system image, CONTENT portrait path fixed to `.jpg`. Build green.
- **W5b continuity/perf:** ChapterRail (01–06) on xl; nav hamburger until lg; hero proof labels unclipped on small screens; system previews compressed to WebP under `public/demo-assets/systems/` (~1.4MB → ~200KB); Process section quiet grid atmosphere.
- **W6 morning:** Restored Builder ID float (reduced-motion gated). Now availability uses StatusDot. Removed unused capability `line` fields + Playwright dep. Wrote `demo/MORNING_STATUS.md`.

---

## Pass schedule (local overnight)

| Wave | Window | Focus |
|------|--------|--------|
| W0 | Immediate | Sync CONTENT + freeze backlog state |
| W1 | +0–90m | Motion timing (systems switch + Scene defaults) |
| W2 | +90–180m | Scene continuity (Hero 01, chapter cue, section atmosphere) |
| W3 | +180–270m | Accessibility (menu trap, reduced-motion CSS, Process a11y) |
| W4 | +270–360m | Craft (Capabilities, Contact, status language) |
| W5 | +360–420m | Perf (images, fonts) |
| W6 | Morning | Hygiene report + remaining P2 list |

---

## P0 — ship-blocking

### P0.1 Reconcile CONTENT.md with live IA
- Files: `demo/CONTENT.md`
- Done when: docs match Identity → Systems → Process → Capabilities → Now → Contact; portrait path and animation notes match code

### P0.2 Hero chapter cue `01`
- Files: `Hero.jsx`, optionally `ui.jsx`
- Done when: Hero uses same index/label/line language as other sections; sequence reads 01–06

### P0.3 Systems switch feels premium, not laggy
- Files: `CurrentSystems.jsx`
- Done when: image crossfade ≤450ms; story stagger total ≤280ms; no heavy `layout` thrash; reduced-motion = instant swap

### P0.4 Retune global Scene timing
- Files: `motion.jsx`, `Hero.jsx`
- Done when: item reveal ~0.55–0.65s; mask ≤0.75s; default stagger ≤0.10; Builder ID delay ≤0.45 after primary text; secondary sections snappy, hero still intentional

### P0.5 Mobile menu focus trap
- Files: `Navbar.jsx`
- Done when: Tab cycles inside open menu; Esc closes; focus returns to hamburger

### P0.6 Reduced-motion CSS vs Framer
- Files: `index.css`
- Done when: CSS reduce does not blanket-kill UI transitions; Framer `useReducedMotion` is source of truth for choreography

---

## P1 — cinematic continuity / craft

### P1.1 Section atmosphere continuity
- Files: `index.css`, section components
- Done when: each major section has one quiet differentiator (grid, hairline, or tiny surface shift) without palette drift

### P1.2 Chapter progress cue
- Files: `Navbar.jsx` and/or small component + `App.jsx`
- Done when: active chapter is readable continuously (nav already tracks — reinforce with a thin rail or stronger active state)

### P1.3 Systems registry quieter idle
- Files: `CurrentSystems.jsx`
- Done when: registry enters once; active rail stays; remove noisy inactive scale pulses; `aria-activedescendant` on listbox

### P1.4 Capabilities composition
- Files: `Capabilities.jsx`, `data.js`
- Done when: tags or line used; sibling opacity-dim removed or heavily reduced; hover remains subtle

### P1.5 Process accordion polish
- Files: `Process.jsx`
- Done when: open panel has region + labelledby; height anim ~0.35s; focus doesn’t orphan

### P1.6 Contact final-slide craft
- Files: `Contact.jsx`
- Done when: ghost type + CTA hierarchy intentional; email hover/press satisfying; ending feels deliberate

### P1.7 Status language consistency
- Files: `Hero.jsx`, `Navbar.jsx`, `CONTENT.md`
- Done when: ONLINE vs BUILDING distinction is clear and documented

### P1.8 Proof image performance
- Files: `CurrentSystems.jsx`, image assets / `data.js`
- Done when: dimensions set; first system eager; rest lazy; weight reduced where practical

### P1.9 Font loading hygiene
- Files: `demo/index.html`
- Done when: swap/preload strategy avoids headline jump

---

## P2 — if time remains

- OG/Twitter meta for `/demo`
- Nav density at `md`
- Mobile systems scrollIntoView restraint
- Hero proof labels on 320px
- Dead data / unused deps cleanup
- Commit hygiene checklist for morning
- Prefetch first system image

---

## Anti-patterns (do not do overnight)

- Scroll-jacking / pinned storytelling unless both desktop + mobile feel natural
- Infinite floats, particles, purple glow, bouncing letters, typewriter, glitch
- Animating every word or every capability sibling aggressively
- Fabricated metrics, users, or revenue
- Force-push, amend shared history, or deploy without a clean `demo:build`

---

## Morning handoff template

```text
Shipped:
- …

Left:
- …

Blocked:
- …

Verify:
- npm run demo:build
- desktop scroll Identity → Contact
- mobile 390w systems switch + menu Esc/focus
- prefers-reduced-motion: reduce
```

---

## Auto-chatter prompts (for supervisor ticks)

Copy one prompt per wave. Do not skip P0 for P2.

**W1:** Implement P0.3 and P0.4 from `demo/OVERNIGHT_PLAN.md`. Retune Scene defaults and Current Systems switch timing. Build with `npm run demo:build`. Report what changed and remaining P0.

**W2:** Implement P0.1, P0.2, then P1.1–P1.2. Continuity only — no new animation libraries. Build and report.

**W3:** Implement P0.5, P0.6, P1.5. Accessibility and reduced-motion correctness. Build and report.

**W4:** Implement P1.3, P1.4, P1.6, P1.7. Craft pass. Build and report.

**W5:** Implement P1.8, P1.9 and any remaining P0. Perf pass. Build and report.

**W6 Morning:** Audit against this plan. Mark done/left/blocked. Do not start large new features. Leave a concise morning brief.
