# Wireframes

First-pass design explorations. HTML mockups, dated.

## Convention
- `v0-<view>.html` — first pass for a given view (Month, Week, Day, Year)
- `v1-<view>.html` — refined pass after Design agent review

## Open in browser
Each file is standalone HTML — open directly. No build step.

## Review workflow
1. Build first pass.
2. Invoke Design agent: "Design, review `wireframes/v0-month-view.html`".
3. Design appends verdict to `../agents-log.md`.
4. Viet decides which findings to incorporate.
5. Iterate to v1.

## Index
- `v0-month-view.html` — first pass, Month view. Editorial-calm direction. Mock data: Viet / Plan / Shared with Erich. Dated 2026-05-29.
- `v0-day-view.html` — first pass, Day view. Vertical timeline with hour rail, all-day strip, now indicator, and event-vs-intent visual distinction (per Research 2026-05-29). Dated 2026-05-29.
- `v0-week-view.html` — first pass, Week view. 7-column hour grid; **true multi-day spans via CSS grid columns** (addresses Design v0 Block #2). Notes scoped to week. Dated 2026-05-29.
- `v0-year-view.html` — first pass, Year view. 12-month grid with 3-tier density wash, year ribbon for keyboard jump, notes scoped to year. Dated 2026-05-29.
