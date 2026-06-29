# PRD — Calendar App (v0.1 Showcase)

**Date:** 2026-05-29
**Owner:** Viet
**Status:** Draft 0.1

---

## 1. Purpose
Showcase a calendar app that feels obviously better than Apple Calendar and Google Calendar at first sight and first touch. Portfolio-grade. Demonstrates Viet's product + design thinking end-to-end.

## 2. Why this exists
**Canonical: see `strategy.md`.** Short version below.

Existing calendars optimize for density (Google) or aesthetics (Apple) but neither integrates **thinking** — notes, reflection, decisions — with time. Time without context is just slots. People plan and remember in prose, not events.

**The wedge:** time-scoped notes. Every view (D/W/M/Y) has a notes panel scoped to that time unit. The calendar becomes a thinking surface, not just a scheduler.

## 3. Target user (v0.1)
- Viet. Senior Product Designer. Heavy calendar user. Uses both Apple + Google.
- Implicitly: knowledge workers who already use Notion + Calendar separately and want them fused.

## 4. Core jobs to be done
1. See my time across multiple calendars without switching apps.
2. Switch zoom (D → W → M → Y) without losing my place.
3. Capture a thought tied to a time unit, fast, without leaving the calendar.
4. See "what was the week / month / year about" at a glance.

## 5. Scope — v0.1 (UI prototype, mock data)

### In scope
- App shell: left sidebar (calendars + mini months), main canvas (current view), right notes panel.
- Views: Day, Week, Month, Year. Smooth transitions between views.
- Mini month calendars: current + next month, in sidebar, always visible.
- Multi-calendar mock data: `Viet`, `Plan`, `Shared with Erich`. Toggle visibility.
- Group calendar view: select multiple calendars, overlay color-coded events.
- Events: mock CRUD with modal. Persists in-session only.
- **Tasks (added 2026-06-04, D040):** lightweight, day-scoped check/uncheck items rendered on the calendar (month cells + week/day all-day row). NOT a project manager — no kanban, assignees, sub-tasks, priorities, or board views.
- **Natural-language capture (`N`):** one field that auto-detects `task:: / event:: / note::` (no marker → event). Live type indicator; Enter saves.
- Notes panel: scoped to current view (week note when on W, month note when on M, year note when on Y).
- Two note types: **Decision log** (challenges, tradeoffs, outcomes) and **Daily log** (highlights).
- Light + dark mode. Respects system preference.
- Responsive: desktop, tablet, mobile.
- Keyboard shortcuts: D/W/M/Y to switch view, `T` for today, `N` for natural-language capture (task/event/note), `/` for search.

### Out of scope (v0.1)
- Real Google / Apple OAuth.
- Real database persistence.
- Multi-user invites or sharing logic.
- Notifications, reminders, RSVP.
- Recurring event rules (mock only — no RRULE engine).
- Search across calendars (UI only, no real index).

## 6. Non-functional requirements
- First meaningful paint < 1.5s on Vercel edge.
- All transitions < 200ms.
- Layout works at 360px → 1920px wide.
- Lighthouse a11y > 95.
- Keyboard-navigable end to end.

## 7. Success criteria
1. Demo lands in under 60 seconds — viewer "gets it" without explanation.
2. A senior designer screenshot the notes panel and shares it as a differentiator.
3. View transitions feel native, not web-y.
4. Vercel URL live, custom domain optional.

## 8. Risks
| Risk | Mitigation |
|---|---|
| Scope creep into real integrations | Lock v0.1 at mock data. Real OAuth is v0.2. |
| Mock data feels fake | Hand-craft a realistic week of Viet's life. Treat it as a content design problem. |
| Notes UX is unclear | Wireframe the notes panel before coding. Test scope-switching (week → month note) early. |
| Year view is dead weight | Make year view the showcase moment — heatmap-style density + year notes. |

## 9. Open questions
- Notes data model: one note per time unit, or many? (See decision-log.)
- Year view: heatmap, timeline, or 12-month grid?
- Mobile: single-pane navigation or collapsing panels?
- Aesthetic philosophy: needs a named direction before design tokens (Swiss / editorial / utilitarian / brutalist-soft / etc.).

## 10. Out-of-band references
- Save inspiration to `Resources/` with source URL and one-line "what to steal."
