---
score: 29
max: 40
p0: 0
p1: 2
p2: 2
p3: 1
slop: low
method: dual-agent
timestamp: 2026-06-29T21-01-38Z
slug: components-calendar-yearcolumns-tsx
---
# Critique — Year "Columns" view (`components/calendar/YearColumns.tsx`)

Method: dual-agent (A: design review · B: detector + manual a11y read). 2026-06-04.

## Design Health: 29/40 (strong aesthetics; weak information scent)

AI-slop: LOW — hand-tuned, token-disciplined, Mono-Metadata honored, amber-ring-not-fill today marker.
Detector: 0 findings, exit 0 (clean; today-marker border correctly not flagged as a side-stripe).

## Priority issues
- P1 — No information scent: the 4px dot says "something" not "what". Fix: wire existing YearDayPopup hover into columns (handlers already exist in YearView).
- P1 — Keyboard: ~370 sequential tab stops, no roving tabindex/arrow nav, no focus-preview. D033 violation. Fix: role=grid + roving tabindex + onFocus preview (pays down DBT-04).
- P2 — a11y: color-only event dot has no text alt; aria-label is raw ISO ("2026-06-29"). Fix: human-readable label + ", has events".
- P2 — Hover-only detail undiscoverable; click=navigate conflicts with D032 (click=detail on events). Selection state (bg-accent-soft) rarely seen because click navigates away.
- P3 — Month header vs day cell similar weight; sub-44px touch targets + sub-760px horizontal scroll (both deliberate for a dense planner).

## Verdict on proposed "slide-in right-side day detail on select"
Instinct right (don't teleport; let me peek), mechanism wrong. The RIGHT edge is already owned by the
Notes panel — the product's wedge. A second right-side panel collides with it. Recommendation:
1) Wire the existing hover/focus popup (cheap, on-brand) — solves the real "let me see before I commit" need.
2) Keep click → Day view for app-wide consistency (week-header + grid-year both navigate via handleSelectDay).
3) If a persistent day surface is truly wanted, make the EXISTING Notes panel follow the selected day —
   reinforces the wedge instead of competing. That's a scope-model change for the Strategist, not a free tweak.
Do NOT introduce a third click grammar on cells.
