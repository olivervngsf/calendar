# Calendar — v0.1

**A calm, editorial calendar where time and thinking live on one surface.**

A 0→1 showcase by [Viet Nguyen](https://github.com/olivervngsf) — built to prove a calendar can be a
*thinking* surface, not just a scheduler. The wedge: **time-scoped notes** — every view (Day / Week /
Month / Year) carries a notes panel scoped to that exact time unit.

> v0.1 is a polished UI prototype with hand-crafted mock data. No real OAuth or database — the bet is the
> *experience*; real integration is v0.2.

---

## Highlights

- **Four views** — Day, Week, Month, Year (12-month grid *or* a linear month-by-month planner).
- **Time-scoped notes** — the notes panel re-scopes to the active view (day note on D, week note on W, …).
  Two logs: **decision** and **daily**.
- **Events** — create / edit / delete; click a day or an hour slot; natural-language **quick-add**
  ("Viet's birthday, July 23, repeat yearly").
- **Keyboard-first** — `D W M Y` · `T` today · `←/→` navigate · `N` event · `⇧N` note · `⇧Q` quick-add ·
  `,` settings · `[` `]` panels · `?` help. Dialogs open on the title; `⌘↵` saves.
- **Calm craft** — light/dark, week numbers across views, sliding panels, smooth dialog motion,
  WCAG-minded focus + contrast, responsive down to mobile.

## Stack

Next.js (App Router) · React 19 · TypeScript · Tailwind v4 (CSS-first tokens) · deployed on Vercel.
No component library — a small set of hand-built primitives on a bespoke editorial token system.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## How it's built (the thinking)

This repo ships its own product process as a showcase. Start here:

- **[`context-primer.md`](context-primer.md)** — 30-second boot.
- **[`strategy.md`](strategy.md)** — thesis, wedge, positioning, anti-goals, voice.
- **[`PRD.md`](PRD.md)** — what v0.1 is.
- **[`decision-log.md`](decision-log.md)** — every non-trivial decision (D001–D027), with the reasoning.
- **[`build-tracker.md`](build-tracker.md)** — live status board.
- **[`Agents/`](Agents/)** — the Engineer / Strategist / Design / Research review agents that gate the work.

## Status

v0.1 — feature-complete on the view layer + notes wedge. Next: persistence + real OAuth (v0.2),
Apple Calendar (v0.3), multi-user (v1.0).
