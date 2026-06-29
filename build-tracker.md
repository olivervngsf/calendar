# Build Tracker

**Date:** 2026-05-29 · **maintained live**
**Purpose:** The at-a-glance "what's built" + "what's owed" view. One row per feature. The phased plan
and the *why* live in [roadmap.md](roadmap.md); this is the flat status board Viet scans to decide focus.

**Status legend:** ✅ Done · 🟡 Partial · ⬜ Not started · ⏸️ Deferred (v0.2+, by scope — D001/D003)
**Debt priority:** P1 do next · P2 before public ship · P3 nice-to-have

---

## How this page stays alive (ownership — D015)

| Role | Owns | Does |
|---|---|---|
| **Engineer** | the **Status** columns | After building/reviewing a feature, flips its status (⬜→🟡→✅) and notes anything load-bearing. The single source of truth for "what's built." |
| **Design** | **design debts** | On every UI review, files craft / interaction / a11y / microcopy / motion gaps it doesn't fix on the spot into the **Debts** table below. |
| **Strategist** | **strategy debts** | Files scope drift, positioning gaps, and anti-goal risks into the **Debts** table. |
| **Viet (CEO)** | the **decision** | Reads the Debts table to decide what to focus on next. Sets / overrides priority. Consumes — doesn't maintain. |

A debt closes when its owner (or Viet) marks it **Addressed** with a date, and Engineer reflects the
matching feature status. Agents update this page as part of their critical path — not as an extra step.

---

## Debts — what's owed (Design / Strategy / Eng file here; Viet prioritizes)

| ID | Type | Item | Why it matters | Priority | Raised | Status |
|---|---|---|---|---|---|---|
| DBT-01 | Design | Delete is one-click, no confirm or undo | Calm ≠ silent — accidental loss (Research pain #10) | **P1** | Design · 05-30 | 🟡 Partial 05-30 — calendar delete confirms w/ event count (D031); event/note/set deletes still one-click |
| DBT-02 | Eng | In-memory store resets on reload | A demo viewer who adds an event and refreshes loses it | **P1** | Eng · 05-30 | Open |
| DBT-03 | Design | Multi-day events render as per-day badges, not spans | Reads as redundant; every calendar must solve true spans. **Blocks** Viet's drag-to-create multi-day all-day ask (06-03) | P2 | Design · 05-29 | Open |
| DBT-04 | Design / a11y | Month grid lacks `role="grid"` / `gridcell` | Screen readers can't navigate the calendar | P2 | Design · 05-29 | Open |
| DBT-05 | Design / a11y | Icon buttons 28px (< 44px target) | Fails WCAG 2.5.5 on touch | P2 | Design · 05-29 | Open |
| DBT-06 | Design | Dialogs have no entry/exit motion | Motion principles still owed (Phase 1) | P3 | Design · 05-30 | ✅ Addressed 05-30 — entry fade+lift on all dialogs (D025); exit instant by choice (consistent across close paths) |
| DBT-07 | Eng | `EventDialog` doesn't validate end-after-start | Low stakes now; matters once the time grid lands | P3 | Eng · 05-30 | Open |
| DBT-08 | Design | "+ New event" button wrapped to two lines | App bar's fixed 240px right column squeezed the cluster after the panel toggle was added | P2 | Viet · 05-30 | ✅ Addressed 05-30 — app bar columns → `auto/1fr/auto` + `whitespace-nowrap` |
| DBT-09 | Design | D/W/M/Y view switch clipped (only D W showed) | Same fixed-column squeeze clipped the switch | P2 | Viet · 05-30 | ✅ Addressed 05-30 — content-sized columns + `shrink-0` on switch |
| DBT-10 | Strategy / Eng | **Integration (Google)** — real calendar data, not mock | Proves the experience on live events; the v0.2 unlock. **Scoped slice (06-03 discussion):** read-only import only · OAuth in **testing mode** (≤100 users, no Google app-verification) · `singleEvents=true` so Google expands recurrence (no RRULE engine) · adapter maps Google event → `CalendarEvent` (D012). **Skip** write-back + webhooks (weeks of cost, ~0 portfolio signal). Crosses the v0.1 mock-only line (D001) → needs a scope decision + decision-log entry first. Est: read-only on screen ~1–2 days; polished ~1 wk. | **v0.2** (post-v0.1 ship) | Viet · 06-03 | Open — Viet will return |

| DBT-11 | Design | "? shortcuts" hint isn't clickable — click should open the help | Mouse users can't discover shortcuts; the affordance looked tappable but was dead. Adds the mouse path to an action that already has the `?` keyboard path (parity, D033) | P3 | Viet · 06-03 | ✅ Addressed 06-04 — hint is now a `<button>` → opens help (D036) |
| DBT-12 | Design | Notes panel header should stick on scroll — title + scope on **1 line** | The whole panel scrolled, so the header drifted away and you lost which scope (Day/Week/Month) the notes belong to | P3 | Viet · 06-03 | ✅ Addressed 06-04 — sticky single-line header "Notes · {scope}" (D036) |
| DBT-13 | Design | "+ New note" pinned to panel bottom (sticky footer) | The create affordance scrolled with the list; want it always reachable for fast capture | P3 | Viet · 06-03 | ✅ Addressed 06-04 — sticky footer, always reachable (D036) |

**DBT-12 + DBT-13 done as one layout pass (D036):** Notes `<aside>` is now 3 rows — sticky header (shrink-0) · scrollable list (flex-1 overflow-y-auto) · sticky footer (shrink-0).

| DBT-14 | Design | Year **columns** style has no hover event-preview | Year grid got the hover popup (D038); the columns/planner style didn't — inconsistent across the two year layouts | P3 | Viet · 06-04 | Open — follow-on to D038 |

*No open strategy debts beyond DBT-10 (scope, parked for v0.2).*

---

## Foundation & infrastructure
| Feature | Status | Notes |
|---|---|---|
| Next.js (App Router, TS) scaffold | ✅ | At project root, alongside docs |
| Tailwind v4 (CSS-first `@theme`) | ✅ | Tokens in `app/globals.css` |
| Fonts — Inter + JetBrains Mono | ✅ | via `next/font` |
| Design tokens (light) | ✅ | Ported from wireframe |
| Design tokens (dark) | ✅ | D013 — warm-neutral darks |
| No-flash theme bootstrap | ✅ | External `public/theme-init.js` (D014) |
| Mock data layer | ✅ | `lib/mock-data.ts` (D012) |
| In-memory data store | ✅ | `DataProvider` Context (D014) · resets on reload (DBT-02) |
| Deploy to Vercel | ✅ | Live: calendar-chi-two-67.vercel.app · GitHub-connected (auto-deploy) |

## App shell
| Feature | Status | Notes |
|---|---|---|
| Three-pane layout (sidebar · canvas · notes) | ✅ | |
| App bar (nav · today · view switch · profile) | ✅ | |
| Sidebar — account, calendars, mini-months | ✅ | |
| Responsive collapse (< 900px) | ✅ | Side panels hide |
| View routing (URL state `?v=&d=`) | ✅ | D011 |
| Keyboard layer (D/W/M/Y · T · ←/→ · N · ⇧N · ⇧Q · , · [ · ] · ? · Esc) | ✅ | ⌘-combos avoided (browser-reserved, D023); keyboard-first is principle #6 (D033) |
| `W` cycles Week sub-mode (W1 timeline ⇄ W2 agenda) | ✅ | D037 — entry → W1; persisted + in sync; W1/W2 label on switch; mouse parity |
| Collapsible side panels (sidebar + notes) | ✅ | App-bar toggles + `[` `]` (D018) |
| Panel slide animation (sidebar←, notes→) | ✅ | 200ms width+translate; reflows the canvas |
| Command palette (⌘K) | ⬜ | |
| Search | ⬜ | UI only in v0.1 scope |

## Calendar views
| Feature | Status | Notes |
|---|---|---|
| Month view | ✅ | Real date-grid math |
| Mini-month (current + next) | ✅ | Sidebar · pick a date → moves focus, keeps view (D024) |
| Focus day vs zoom model + selected-day marker | ✅ | D024 — today = ring, focus = soft fill |
| Week view — timeline (time slots) | ✅ | Shared time grid (D017) |
| Week view — agenda (list) | ✅ | D028 — switch in Settings |
| Day view | ✅ | Shared time grid (D017) |
| View-aware nav + title (←/→ by month/week/day) | ✅ | D017 |
| Overlapping events lane-packed | ✅ | `lib/timegrid.ts` |
| Year view — calendar grid (12 mini-months) | ✅ | D019 — today ring, event dots, click-through |
| Year grid — hover a day → event preview popup | ✅ | D038 — ~400ms delay; color·time·title, capped 6; focus parity; grid style only |
| Year view — linear columns (planner) | ✅ | D021 — months×days; switch in Settings |
| Multi-day event spans | ⬜ | DBT-03 — currently per-day badges |
| Current-time line | ⬜ | Deferred to real data (v0.2) |
| View transition motion | ⬜ | |

## Calendars & events
| Feature | Status | Notes |
|---|---|---|
| Calendar list + visibility toggles | ✅ | |
| Calendar CRUD (create/edit/delete) | ✅ | D030 — palette color; delete cascades events |
| Calendar delete confirm (with event count) | ✅ | D031 — prompts only when it has events |
| Calendar Sets (saved combinations) | ✅ | D029 — create/edit/delete; seeded Personal/Work |
| Color system per calendar | ✅ | Curated 6-color palette, light+dark (D030) |
| Multi-calendar overlay (Month) | ✅ | Conflict-overlap polish pending |
| Event — create (full dialog) | ✅ | Button · `N`; opens on title, ⌘↵ saves (D027) |
| Event — quick-create on empty slot/cell | ✅ | D034 — click empty month cell (all-day) / week-day hour slot (timed) → popover, type title + Enter; "More options" → full dialog |
| Quick add — natural language (`⇧Q`) | ✅ | Parses title + date + yearly; jumps to date (D020, rebound D023) |
| Note — create via `⇧N` | ✅ | Opens NoteDialog at the active scope (D020, rebound D023) |
| Event — click shows detail (not edit) | ✅ | D032 — read-first popover, Edit/Delete inside |
| Event — edit | ✅ | From the detail popover · **double-click** event · **Enter** in popover (D035) |
| Event — delete | ✅ | From detail · or bulk via multi-select |
| Event multi-select (⌘-click) + bulk delete | ✅ | D032 — selection bar, delete-with-count; **Esc clears** (D033) |
| Drag to create (week/day) | ⬜ | Stretch |
| Drag to create multi-day all-day (Mon–Wed) | ⏸️ | Viet ask 06-03 — deferred; needs multi-day spans (DBT-03) |

## Notes (the wedge)
| Feature | Status | Notes |
|---|---|---|
| Notes panel scoped to month | ✅ | (now part of full D/W/M/Y scoping — D022) |
| Two types — decision · daily | ✅ | |
| Note — create / edit / delete | ✅ | D014 |
| Auto date-stamped | ✅ | |
| Notes scoped to active view (D/W/M/Y) | ✅ | D022 — the wedge, fully live |
| Markdown rendering | ⬜ | |
| Dedicated note shortcut | ⬜ | |

## Settings (global preferences)
| Feature | Status | Notes |
|---|---|---|
| Settings popup (centered · Esc · × · click-outside) | ✅ | Reuses `Dialog` (D016) |
| Persisted globally (localStorage) | ✅ | `SettingsProvider` |
| Open via gear + `,` shortcut | ✅ | |
| Toggle — show week numbers | ✅ | Across M (row gutter) · D/W (header) · Y grid (D026) |
| Choice — week view style (timeline / agenda) | ✅ | D028 |
| Choice — year view style (grid / columns) | ✅ | D021 |
| (room for more settings) | ⬜ | Group into sections as they grow |

## Theming & polish
| Feature | Status | Notes |
|---|---|---|
| Light / dark toggle | ✅ | |
| Respects system preference | ✅ | |
| Persists theme (localStorage) | ✅ | Theme only — data doesn't persist (DBT-02) |
| Microinteractions (hover/focus/active) | ✅ | hover/focus states + panel slide + dialog entry motion |
| Empty states (written, not generic) | 🟡 | Notes empty-state done; others pending |
| Loading / skeleton states | ⬜ | |
| Dialog entry motion (fade + lift) | ✅ | D025 — all dialogs + shortcuts overlay |

## Accessibility
| Feature | Status | Notes |
|---|---|---|
| `:focus-visible` rings | ✅ | |
| `prefers-reduced-motion` | ✅ | |
| Semantic landmarks | ✅ | header / main / aside |
| AA contrast (both themes) | ✅ | `--text-3` darkened |
| `role="grid"` on month grid | ⬜ | DBT-04 |
| 44px touch targets (mobile) | ⬜ | DBT-05 |
| Lighthouse a11y > 95 | ⬜ | Not yet audited |

## Deferred to v0.2+ (by scope, not backlog)
| Feature | Status | Notes |
|---|---|---|
| Real Google OAuth | ⏸️ | v0.2 (D001) |
| Supabase persistence | ⏸️ | v0.2 (D001) |
| Apple Calendar (CalDAV) | ⏸️ | v0.3 |
| Multi-user / real sharing | ⏸️ | v1.0 (D003) |
| Notifications / reminders / RSVP | ⏸️ | Out of scope (anti-goal) |
| Recurring rules (RRULE engine) | ⏸️ | Mock only in v0.1 |
