# Strategy

**Date:** 2026-05-29
**Status:** Locked v1.1 (vision + mission added per D009)
**Purpose:** The load-bearing thesis behind the product. One page. Read in 60 seconds. Settles every "should we build X" debate before it starts.

---

## Vision
The default calendar for knowledge workers who plan in prose — where time and thinking live on one surface, and you never reach for a separate notes app to decide, remember, or reflect.

## Mission
Build the calendar that proves time and thinking belong together. World-class craft, calm pace, every minute earned through clarity — not engagement tricks. Beat Apple Calendar on calm and Google Calendar on warmth.

---

## 1. Thesis
Time without context is just slots. Calendars schedule; planning happens in prose. This product fuses time and thinking into one surface — the calendar becomes a place where decisions, reflections, and intent live next to the hours they belong to.

For Viet, this is a portfolio piece that proves senior product + design thinking end-to-end: concept, IA, craft, motion, accessibility, story.

## 2. The wedge
**Time-scoped notes.** Every view (D / W / M / Y) carries a notes panel scoped to that exact time unit.
- On Week view → this week's note.
- On Month view → this month's note.
- On Year view → this year's note.

Two note types out of the gate: **decision log** (challenges, tradeoffs, outcomes) and **daily log** (what happened, what mattered).

No competitor does this. That's the wedge.

## 3. Who it's for
**Primary (implicit, v0.1):** Viet. Senior designer, heavy calendar user, uses both Apple and Google, keeps a separate Notion for thinking.
**Secondary (decoded):** Knowledge workers — designers, PMs, founders, researchers — who already use Notion + Calendar side by side and resent the context switch. People who plan in prose and remember in narrative, not events.

What unites them: they treat the calendar as a memory artifact, not just a scheduling tool.

## 4. Positioning
| Competitor | Strength | Weakness | Our angle |
|---|---|---|---|
| **Apple Calendar** | Beautiful, native, calm | No thinking layer. Notes are an afterthought. | A calendar that *thinks*. |
| **Google Calendar** | Dense, integrated, ubiquitous | Cold, utilitarian, optimizes for scheduling not reflection. | Warm density. Negative space + signal. |
| **Notion Calendar** | Notion-connected | Calendar primitive is weak; not a daily-use surface. | A calendar-first product, not a database with dates. |
| **Cron / Fantastical** | Power-user features | Productivity-bro register. Cluttered with features. | One clear primary action per screen. |

**Wedge sentence:** the only calendar where the notes panel is a first-class citizen, scoped to the time unit you're looking at.

## 5. Anti-goals (what we will not be)
- **Tasks are in scope (amended 2026-06-04, D040 — founder override).** Lightweight, day-scoped,
  check/uncheck items captured in prose. Still **not a project manager**: no kanban, no assignees, no
  sub-tasks, no priorities/due-times, no project/board views, no dependencies. A task is a checkable
  line on a day, not a workflow.
- Not a team scheduler. No find-a-time, no polls.
- Not a productivity-bro app. No streaks, no XP, no nudges.
- Not an AI summarizer. No "your week in review by AI." Notes are written, not generated.
- Not a notification engine. No badges, no haptics, no daily-digest emails.
- Not engagement-optimized. Time spent in app is not a success metric.

If a feature pulls in this direction, CEO agent kills it.

## 6. Voice + feel
**One sentence:** Calm. Editorial. Confident. Never cute. Never corporate. Never loud.

- Microcopy reads like a senior editor wrote it, not a growth team.
- Typography carries personality; chrome stays quiet.
- Numbers and metadata in monospace. Body in a humanist sans.
- Motion is intentional, never decorative.
- Empty states are written, not stocked.

Design agent enforces this on every screen.

## 7. Constraints (what this implies for code)
- Stack locked: Next.js (App Router) + Supabase + Tailwind (per D002). New libs require justification.
- v0.1 = UI prototype with mock data (per D001). No real OAuth, no real DB writes.
- Single-user (per D003). No multi-user code paths.
- No analytics SDKs. No tracking. No cookie banners.
- No notification permission prompts.
- Performance budgets: <1.5s first paint, <200ms transitions (per PRD §6).
- A11y baseline: WCAG 2.1 AA. Engineer + Design enforce.

If a code change violates these, Engineer agent blocks it.

---

*Linked: [PRD](PRD.md) · [roadmap](roadmap.md) · [decision-log](decision-log.md) · [Agents](Agents/README.md)*
