# Product

## Register

product

## Users
**Primary (v0.1):** Viet — senior product designer, heavy calendar user who lives in both Apple and
Google Calendar and keeps a separate Notion for thinking. Uses this as a daily-driver *and* as a portfolio
piece proving end-to-end senior product + design craft.

**Secondary:** Knowledge workers — designers, PMs, founders, researchers — who already run Notion +
Calendar side by side and resent the context switch. People who **plan in prose and remember in narrative**,
and who treat the calendar as a memory artifact, not just a scheduling grid.

Context of use: focused, single-user, desktop-first, keyboard-driven. Calm sessions, not frantic triage.

## Product Purpose
A calendar that fuses **time and thinking** onto one surface. The wedge: **time-scoped notes** — every view
(Day / Week / Month / Year) carries a notes panel scoped to that exact time unit, with two first-class note
types (decision log, daily log). No competitor makes notes a first-class, time-scoped citizen.

Success = the experience reads as *real and irresistible* in 60 seconds: beats Apple Calendar on calm and
Google Calendar on warmth, and proves the "plan in prose" thesis without a single tutorial. v0.1 is a
polished UI prototype on mock data; real OAuth + persistence are v0.2+.

## Brand Personality
**Calm. Editorial. Confident. Never cute. Never corporate. Never loud.**

- Microcopy reads like a senior editor wrote it, not a growth team.
- Typography carries the personality; chrome stays quiet. Monospace for numbers/metadata, humanist sans
  for body.
- Motion is intentional, never decorative.
- Empty states are written, not stocked.
- Emotional goal: a quiet, trusted surface you think *with* — focus and recall, not urgency or dopamine.

## Anti-references
- **Google Calendar** — cold, utilitarian density that optimizes for scheduling over reflection.
- **Productivity-bro tools** (Cron/Fantastical register, plus streaks / XP / nudges / badges) — feature
  clutter and engagement tricks. Time-in-app is explicitly *not* a success metric.
- **AI-summarizer dashboards** ("your week in review, by AI") — notes here are written, never generated.
- **Project managers / team schedulers** — no kanban, assignees, sub-tasks, priorities, board/project
  views, find-a-time, polls, or notification engine. (Lightweight day-scoped *tasks* are in scope as of
  D040 — a checkable line on a day, not a workflow — but the PM machinery above stays out.)
- **The 2026 AI-landing aesthetic** — SaaS-cream backgrounds, per-section uppercase eyebrows, hero-metric
  templates, identical card grids. This is a tool, not a pitch page.

## Design Principles
1. **Time and thinking on one surface.** The notes panel is first-class and scoped to the active view —
   never a bolted-on afterthought. The wedge is the product.
2. **Calm is the feature.** Every minute is earned through clarity, not engagement mechanics. Negative
   space first; compact density without crowding.
3. **One clear primary action per screen.** Signal over chrome; resist feature sprawl (anti-goals win ties).
4. **Keyboard-first (D033).** Every interaction has a keyboard path — create, edit, navigate, dismiss —
   without reaching for the mouse. Mouse-only flows are the exception and keep a keyboard equivalent.
5. **Invisible onboarding.** No tours, no modals — affordances are discoverable. The interface teaches
   itself through use.
6. **Written, not generated.** Human-authored content throughout; the product never fakes thinking for you.

## Accessibility & Inclusion
- **WCAG 2.1 AA** baseline in **both light and dark themes** (verified contrast on body + metadata text).
- **Keyboard-first** is an accessibility commitment, not just a power-user nicety (D033): full keyboard
  reachability, visible `:focus-visible` rings, semantic landmarks.
- **`prefers-reduced-motion`** respected on every animation (crossfade / instant fallback).
- Targets WCAG 2.5.5 touch sizing as a known debt (DBT-05); `role="grid"` semantics on the month grid
  pending (DBT-04).
