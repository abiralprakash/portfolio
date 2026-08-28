# Personal Product Lab — Content & Architecture Brief

Source of truth for the premium React demo at `/demo`. Content is verified against
the static portfolio under `public/` (`index.html`, `about.html`, `case/*.html`,
`proof.html`). No fabricated metrics, users, or revenue.

Live chapter sequence:

```text
01 Identity → 02 Current Systems → 03 How I Build → 04 Capabilities → 05 Now → 06 Contact
```

---

## 1. Identity (`#identity`)

| Field | Value |
|---|---|
| Name / Brand | Prakash Adhikari (`PRAKASH.` wordmark, neon period) |
| Role | AI Product Builder |
| Location | Kathmandu / Remote |
| Builder ID | `PKA-2026` · `v2.1` |
| Headline | Solid `I turn complex ideas` + outline `into working systems.` |
| Positioning | AI products, SaaS platforms, automation systems, and digital tools — built from idea to working product. |
| Disciplines | AI · Product · Design · Engineering · Automation |
| Ghost type | `BUILD` (hero background) |
| Status language | Nav = `ONLINE` (lab availability). Builder ID badge = `BUILDING` (active work mode). |

Hero proof strip (three strongest verified points):

| Value | Label |
|---|---|
| 130K+ | Trademark records handled |
| 300+ | API endpoints |
| 150+ | Database migrations |

---

## 2. Current Systems (`#systems`) — index `02`

Interactive system registry + activated product stage. Not a 3D card deck.

Each system: name, status (`LIVE` / `SCALING` / `EXPERIMENT`), category, purpose,
tech, preview image, story (`problem` / `system` / `intelligence` / `outcome`),
build tags, link.

Tracked systems (from `data.js`): NepalIPMS, AI OCR Engine, Global Law, ScholarQuest,
TopRank Nepal, Hire an Expert (`EXPERIMENT` — architecture/case, included in the
registry with clear status, not counted as a live product).

---

## 3. How I Build (`#process`) — index `03`

Philosophy (masked reveal), then progressive process accordion:

| # | Stage |
|---|---|
| 01 | RESEARCH |
| 02 | PRODUCT DESIGN |
| 03 | ARCHITECTURE |
| 04 | DEVELOPMENT |
| 05 | INTELLIGENCE |
| 06 | DEPLOYMENT |

Open stage stays focused; other stages recede via opacity. Panel is a labelled region.

---

## 4. Capabilities (`#capabilities`) — index `04`

Composition of capability entries (not a skill dump). Each has title, line, detail,
and tags. Hover/focus may emphasize the active item lightly — siblings must not
heavily dim.

---

## 5. Now (`#now`) — index `05`

Live bench: currently building note, focus areas, available-for list, availability status.
Restrained pulse on building status only — no fake live data.

---

## 6. Contact (`#contact`) — index `06`

Final slide: ghost `CONTACT`, invitation headline, email channel CTA, availability,
navigate + social columns. Email CTA should feel primary and deliberate.

---

## 7. Design system

- Base `#0d1116` · surface `#14181f` · accent `#00df8f` · accent-deep `#00b373`
- Fonts: Space Grotesk (display) + Inter (body)
- Utilities: `.bg-grid`, `.text-outline`, `.panel`, `.eyebrow`, `.meta`, `.corner-ticks`
- Motion primitives: `Scene`, `SceneItem`, `MaskReveal`, `SceneLine` in `motion.jsx`
- Timing targets: element reveal ~0.55–0.65s · mask ≤0.75s · stagger ≤0.10 ·
  systems switch image ≤0.45s · story stagger total ≤0.28s
- `prefers-reduced-motion`: Framer `useReducedMotion` is source of truth for choreography;
  CSS only disables decorative CSS animations / long transitions, not all UI chrome

---

## 8. Components

`App.jsx` renders: `Navbar` → `Hero` → `CurrentSystems` → `Process` → `Capabilities` →
`Now` → `Contact`.

Section IDs: `#identity`, `#systems`, `#process`, `#capabilities`, `#now`, `#contact`.

---

## 9. Animation language

- Section entrances: once-per-session `whileInView` via `Scene` / `SCENE_VIEWPORT`
- Hierarchy: index → title (mask) → supporting copy → interaction
- Systems activation: directional `AnimatePresence` swap (no layout thrash)
- Builder ID: delayed entrance, then optional subtle float; drag on desktop
- Micro-interactions (buttons): 150–250ms; do not lag the cursor

---

## 10. Assets

- Portrait: `/demo-assets/portrait.jpg` (editorial render under `public/demo-assets/`)
- Product previews: `/assets/shots/proof/*` absolute paths

---

## 11. Integrity

- No vanity revenue / user counts
- Hire an Expert remains `EXPERIMENT` / case study
- OCR framed as intelligence inside NepalIPMS as well as its own system entry
- Overnight plan: see `OVERNIGHT_PLAN.md`
