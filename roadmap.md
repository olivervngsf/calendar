# Roadmap — 0 → 1

**Date:** 2026-05-29
**Target ship:** v0.1 showcase URL on Vercel
**Cadence:** weekly phases, exit criteria gate each phase

---

## Phase 0 — Foundation (this week)
**Goal:** Lock thinking before pixels.
- [x] Workspace + planning docs scaffolded
- [ ] PRD reviewed + refined
- [x] Aesthetic philosophy chosen (named direction, not vibes) — **editorial-calm**
- [x] IA: navigation, panel structure, URL pattern — three-pane + `?v=&d=` (D011)
- [~] Wireframes for D, W, M, Y, notes panel, mini-month, event modal — Month + notes + mini-month done; D/W/Y + event modal pending
- [x] Mock data designed (a real month of Viet's life across 3 calendars) — `lib/mock-data.ts` (D012)

**Exit:** A senior dev could implement the shell from these docs without asking questions.

---

## Phase 1 — Design system
**Goal:** Visual + interaction language, not screens.
- [x] Design tokens (color, type, spacing, radius, shadow, motion) — `app/globals.css` `@theme`
- [x] Light + dark palettes — D013
- [~] Component primitives: button, input, modal, popover, tooltip, chip, calendar cell — Button, IconButton, ViewSwitch, ThemeToggle, EventChip done; input/popover/tooltip pending
- [~] Motion principles: durations, easings, entry/exit patterns — 120–200ms transitions + reduced-motion; entry/exit patterns pending

**Exit:** Tokens file lives in repo. Storybook-style primitive showcase page. *(Tokens ✓; showcase page pending.)*

---

## Phase 2 — App shell
**Goal:** The frame, no content yet.
- [x] Next.js App Router scaffolded (Vercel deploy pending)
- [ ] Supabase project created, auth scaffolded (not enforced) — deferred to v0.2 (D001)
- [x] Three-pane layout: sidebar, canvas, notes
- [x] Responsive collapse behavior — side panels hide < 900px
- [x] View routing — URL search params `?v=&d=` (decided: D011)
- [x] Keyboard shortcut layer — D/W/M/Y · T · ←/→ · ?

**Exit:** Empty shell deployed to Vercel. Switching views works. Panels collapse on mobile. *(Switching + collapse ✓; Vercel deploy pending.)*

---

## Phase 3 — Calendar views
**Goal:** Each view feels native.
- [x] Month grid (most-used, build first)
- [ ] Week with time slots
- [ ] Day with detail density
- [x] Year as differentiator — **12-month grid** (locked 2026-05-29) — D019
- [x] Mini-month sidebar (current + next)
- [~] View transition motion — panel slide done; view-switch + dialog motion pending

**Exit:** Mock events render correctly in all views. Transitions polished.

---

## Phase 4 — Calendars + events
**Goal:** Multi-calendar feels effortless.
- [x] Calendar list in sidebar with toggles
- [x] Color system per calendar
- [~] Group view (multiple calendars overlaid) — month overlays + toggles work; conflict-overlap polish pending (needs time grid)
- [x] Event create / edit / delete modal (in-memory only) — D014
- [ ] Drag to create on week + day views (stretch)

**Exit:** "Show only Viet + Plan" works. "Show all three together" works. Conflict overlap looks intentional. *(Toggle/overlay ✓ on Month; conflict-overlap polish lands with Week/Day.)*

---

## Phase 5 — Notes
**Goal:** The wedge feature.
- [x] Notes panel scoped to current view (day / week / month / year) — D022
- [x] Two note types: decision log, daily log
- [x] Note list, create, edit (+ delete) — D014
- [ ] Markdown rendering
- [x] Date-stamped automatically
- [x] Quick-access keyboard shortcut — `⌘N` new note · `⌘⇧N` quick-add (D020)

**Exit:** ✅ Switching M→W reloads the note panel to the relevant week — feels obvious (D022).

---

## Phase 6 — Polish
**Goal:** Make it feel inevitable.
- [ ] Microinteractions (hover, focus, active)
- [ ] Empty states designed (not generic)
- [ ] First-run state: feels alive, no tour
- [ ] Loading + skeleton states
- [ ] A11y pass (keyboard, contrast, screen reader)
- [ ] Performance audit (Lighthouse)

**Exit:** Random stranger uses it for 30 seconds and gets it.

---

## Phase 7 — Ship
- [x] Deploy to Vercel — **https://calendar-chi-two-67.vercel.app** (GitHub-connected, auto-deploy)
- [ ] Custom domain (optional)
- [ ] OG image + meta tags
- [ ] Demo video / screenshots for portfolio
- [ ] Design review pass (use design-review skill)

**Exit:** ✅ Public URL — linkable. Repo: github.com/olivervngsf/calendar.

---

## What v0.2 unlocks (not now)
- Real Google OAuth + event sync
- Supabase persistence for notes + calendars
- Drag events between calendars

## What v0.3 unlocks
- Apple Calendar integration (CalDAV — research first)

## What v1.0 unlocks
- Real multi-user, real shared calendars, real invites
