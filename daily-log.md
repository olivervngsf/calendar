# Daily Log

Daily working notes. Newest at top. What we did, what worked, what's next.

---

## 2026-06-04 — Thursday — Unscheduled items: tasks & events scoped to week/month/year (D044)

**Did:** Capture-loosely, place-later. Added optional `scope` to Task & Event (notes already had it) =
**unscheduled**. On Week/Month/Year, an ambiguous capture → scoped to the view with no specific day; on Day
→ that day; a parsed date always schedules. Unscheduled items live **only in the digest**, pinned on top of
their section; events show **"Unscheduled"** and don't navigate. Excluded from the grid. Viet overrode my
"events should keep a real date" rec and chose all-three (founder's call, logged).

**Verified:** `tsc` clean; console clean. Live (week): `event:: Plan offsite` (no date) → preview "May 24 –
30 · unscheduled" → saved → pinned first in Events as "Plan offsite · Unscheduled", absent from the grid.
Screenshot confirms.

**Next:** the **drag-and-drop** pass (assign date/time, with a keyboard equivalent per D033) — Viet's chosen
follow-on. Also still open: task delete (D040); task day shown in digest rows.

---

## 2026-06-04 — Thursday — Digest sections collapse + per-section quick-create (D043)

**Did:** First two pieces of Viet's "panel as workspace" batch. Each digest section (Tasks · Events ·
Notes) now **collapses** (chevron + count) and has a **"+"** that opens the N capture preset to that kind
(`task:: / event:: / note::`). Footer "+ Add to {scope}" = capture with no preset. `QuickCapture` gained
`initialText`; `NotesPanel` got a `Section` wrapper + `onCreate(kind?)`.

**Verified:** `tsc` clean; fresh-server console clean (mid-edit parse errors were stale buffer — restart
confirmed). Live (week): 3 collapsible sections, counts persist when collapsed; "New event" + opens capture
at "event:: ". Screenshot confirms chevron/count/+ chrome.

**Deferred — need Viet's decision (next):** (1) **unscheduled items** scoped to a week/month with no
specific day, shown pinned on top — a data-model change, and conceptually fuzzy for *events* (an event
without a date isn't a calendar event). (2) **Drag-and-drop** to assign date/time — big interaction,
mouse-only → needs a keyboard equivalent (D033).

**Next:** decide the two deferred parts, then build. Also still open: task delete (D040).

---

## 2026-06-04 — Thursday — Notes digest scope setting + pinned-note IA (D042)

**Did:** Made the digest's notes-scoping a user choice. Recommended (and Viet approved) a **global setting**
over a quick switch — it's a stable preference and matches the existing view prefs. Added
**Settings → Notes → "Notes in digest: In range (default) · This unit"** (`noteScope`, persisted).
Plus the **pinned-note IA**: in range mode the unit's own note(s) sit first, then an "Across {scope}"
hairline, then the rolled-up day/week/year notes — so exact-minded users get their artifact up top even in
rollup mode. Setting only affects notes (tasks/events stay range-based).

**Verified:** `tsc` clean; console clean. Live (month): range = 9 notes with "Across this month" divider
(month note pinned); exact = 5 (month-key notes only, no divider). Real click on the Settings segment flips
`noteScope` (synthetic .click() was flaky in the harness; preview_click confirmed the real path). Screenshot
shows the new Notes control alongside week/year style.

**Next:** push when Viet says ship. Still open: task delete (D040), task date in digest rows, event
grouping at month/year (D041).

---

## 2026-06-04 — Thursday — Scoped digest: Tasks · Events · Notes per view (D041)

**Did:** Made the three primitives "talk together." The right panel is now a **scoped digest** — for the
active view it lists **Tasks · Events · Notes** filtered to that time range (day / week / month / year),
header = scope label, footer "+ Add to {scope}" → N capture. Tasks reuse TaskChip (toggle in place),
events are compact click-through rows, notes keep NoteCard. Sticky chrome + scroll-fade carried over.
- **Range-based for all three — overturns D022** (Viet's call): notes now show everything in range, not
  exact-unit. `rangeFor` + `noteScopeDate` added to lib/date.

**Verified:** `tsc` clean; console clean (only the benign HMR warning). Live counts cohere as scope widens:
Day Fri-May-29 = T1·E2·N2; Week May 24–30 = T2·E8·N4; Month May 2026 = T3·E27·N9; Year 2026 = T3·E28·N11.
Screenshot of the week digest confirms the editorial layout (color dots, mono date·time, flat).

**Next:** push when Viet says ship. Follow-ons: task date in digest rows; event grouping / "+N more" at
month/year scope; task delete (still open from D040).

---

## 2026-06-04 — Thursday — Tasks enter scope + `N` = natural-language capture (D040)

**Did:** Viet exercised **founder's prerogative** to override the #1 anti-goal ("no tasks") — on the record.
Strategist flagged the conflict first; CEO expanded scope. Built it:
- **`Task` primitive** (minimal: title · done · date) + store CRUD; seed tasks in mock-data.
- **`N` → natural-language capture.** One field, auto-detects `task:: / event:: / note::` (no marker →
  event), live type badge, Enter saves, "More options" → full event form. `Shift+Q` aliases it.
- **Tasks render as checkbox chips** on their day — month cells + week/day all-day row; click toggles
  done (strikethrough).
- Boundary held: amended `strategy.md §5` — tasks are a checkable line on a day, **not** kanban/PM
  (no assignees, sub-tasks, priorities, boards). Updated PRD, PRODUCT.md, decision-log (D040).

**Verified:** `tsc` clean; console clean (only the benign HMR script-tag warning). Live (preview): `N` opens
capture; `task:: Buy milk` → "Add task" badge → renders as a checkbox on the focused day; toggling →
done/strikethrough; seed "Renew domain" shows checked; `event:: Team offsite Oct 3` → "Add event" with the
date parsed. Month + all-day rendering confirmed.

**Next:** push when Viet says ship. Follow-ons (logged, not built): task deletion, date-parsing inside
`task::`, recurring tasks, year-view task rendering. Also still open: the year-columns keyboard/a11y pass.

---

## 2026-06-04 — Thursday — Year columns: hover-to-preview (DBT-14, from impeccable critique)

**Did:** Ran `$impeccable critique` on the Year **columns** view (dual-agent: design review + detector).
Detector clean (0 findings); review scored 29/40 — strong craft, weak *information scent* (the event dot
says "something" not "what"). Acted on the cheap, high-leverage fix Viet picked: **wired the existing
`YearDayPopup` hover into columns** (it only existed in the grid year style). Hover *or* focus an event-day
→ same ~400ms delayed, flat preview. Closes **DBT-14**.

**Rejected (on the record):** Viet's first instinct was a right-side slide-in detail panel on day-select.
Critique flagged the fatal collision — the right edge is already the **Notes panel**, the product wedge.
Verdict: keep click → Day view (app-wide consistency); satisfy "see before I commit" with the hover peek;
if a persistent day surface is ever wanted, make the *Notes panel* follow the selected day (a Strategist
scope call), not a competing panel. Parked, not built.

**Verified:** `tsc` clean; console clean. Live (preview, columns style): hover May 4 → "Monday, May 4 ·
Sprint planning 10:00 · Therapy 11:30", anchored + flat (D039). Screenshot confirmed.

**Next:** push when Viet says ship. Open from the critique: the bigger keyboard/a11y pass on columns
(roving tabindex + role=grid + human-readable aria-labels + event-dot text alt) — P1, not yet done.

---

## 2026-06-04 — Thursday — Design system captured + fully-flat overlays (impeccable: document, D039)

**Did:** Ran `$impeccable` to set up the design system, then polished the code to match it.
- **PRODUCT.md + DESIGN.md + `.impeccable/design.json`** — register (product), North Star "The Editorial
  Desk", hex tokens from globals.css, the mono-metadata / one-accent / fully-flat doctrines, drop-in
  component snippets. Synthesized from strategy.md + CLAUDE.md.
- **D039 — removed every drop shadow.** Authoring DESIGN.md exposed that the shipped overlays used
  `shadow-xl` while the chosen doctrine is Fully-Flat. Reconciled all 7 sites (Dialog, ShortcutsHelp,
  EventDetail, QuickCreate, YearDayPopup, SelectionBar, Toggle) to border-strong + surface contrast;
  modals lean on the existing `bg-black/30` scrim. `grep shadow` now returns nothing.

**Verified:** `tsc` clean; console clean. Screenshots in **both themes**: event-detail popover floats
over the month grid on its border edge alone; settings modal reads on the scrim; flat toggle thumb stays
legible by lightness contrast. The flat look is crisper and more editorial than the old soft shadow.

**Next:** push when Viet says ship.

---

## 2026-06-04 — Thursday — Year view: hover a day → event preview, delayed (D038)

**Did:** In Year (grid), hovering a day that has events now shows a small popup of that day's events after
a ~400ms hover-intent delay. Popup lists calendar-color dot · time · title, sorted (all-day first), capped
6 + "+N more". Non-interactive (`pointer-events-none`) so it never flickers; anchored + viewport-clamped;
fades in. Only event-days respond; `onFocus` triggers it too (keyboard parity, D033). One shared popup at
the YearView level, not per-day.

**Verified:** `tsc` clean; console clean. Live (preview): hover Apr 30 → "Thursday, April 30 · 09:30 Coffee
· Sarah" after the delay; quick in/out shows nothing (delay gates it); mouse-out hides it; May 18 (multi)
shows Sprint planning 10:00 + Therapy 11:30, time-sorted. Screenshot confirms the editorial-calm card.

**Scope note:** grid year style only (the default). Columns style preview = follow-on (DBT-14), not built.

**Next:** push when Viet says ship.

---

## 2026-06-04 — Thursday — `W` cycles Week sub-mode W1 ⇄ W2 (D037)

**Did:** `W` now does double duty. From another view → Week timeline (**W1**); press `W` again → agenda
(**W2**); again → back to W1. Entry always starts at W1 (Viet's call), the choice **persists** (same
`weekStyle` Setting — keyboard + AppBar + Settings stay in sync), and the view switch shows a live **W1/W2**
label. One shared `handleView` drives both the key and the AppBar W button (mouse parity, D033).

**Conflict resolved up front:** asked Viet before building — the Week style is a saved preference, so
"W always opens timeline" overrides a saved agenda. He chose fixed-start W1 + persist + visible W1/W2 label.

**Verified:** `tsc` clean; console clean. Live (preview): M→W = W1 timeline; W→W2 agenda (localStorage
`weekStyle` flips to agenda); from agenda, M→W forces W1 timeline (override confirmed); clicking the active
W segment also cycles. Screenshot shows D · W1 · M · Y, no clipping.

**Next:** push when Viet says ship.

---

## 2026-06-04 — Thursday — Notes panel fixed chrome + clickable shortcuts hint (D036)

**Did:** Cleared the top 3 debts from yesterday (DBT-11/12/13).
- **DBT-11 — "? shortcuts" hint is now a button** → opens the help dialog (same as `?`). Mouse parity for
  a keyboard action (D033).
- **DBT-12 — Notes panel header sticks, on one line.** "Notes · {scope}" stays pinned while the list
  scrolls — you never lose which Day/Week/Month the notes belong to.
- **DBT-13 — "+ New note" pinned to the panel bottom** (sticky footer), always reachable for fast capture.
- DBT-12+13 done as one layout pass: the Notes `<aside>` is now sticky header · scrolling list · sticky
  footer (D036).
- **Scroll-edge fade** (Viet liked the fade in/out): the list dissolves into the header/footer via a
  scroll-aware `mask-image` — fades only the edge with content scrolled past it, never at the true ends.

**Verified:** `tsc` clean; console clean. Live (preview, 1440×900): clicking "? shortcuts" opens the help;
Notes header = 57px single line, stays put on scroll (scrollHeight 968 > client 697); footer pinned, holds
the New note button. Screenshot confirms editorial-calm dividers top + bottom.

**Next:** push (auto-deploy) when Viet says ship. Remaining queue trends toward multi-day spans (DBT-03,
blocks drag-to-create) and the v0.2 line (DBT-10 Google integration).

---

## 2026-06-03 — Wednesday — Keyboard-first cluster: quick-create, dbl-click edit, Esc-clear (D033–D035)

**Did:** Shipped Viet's keyboard-first batch.
- **D033 — Keyboard-first is now design principle #6** (`CLAUDE.md`). Every interaction needs a keyboard
  path; Design agent checks it each review. Standing law, not a one-off.
- **D034 — Quick-create on empty slots.** Click an empty month cell (→ all-day) or week/day hour slot
  (→ 1-hour timed) → small autofocused `QuickCreate` popover. Type a title, **Enter saves**, **Esc cancels**,
  **"More options"** opens the full dialog prefilled. `onSlotClick`/`onDayClick` now carry the clicked rect.
- **D035 — Double-click an event → edit.** Single-click stays a peek (D032); since the detail backdrop
  would eat the 2nd click, the single-click popover is **debounced ~200ms** and a dblclick cancels it and
  opens edit directly. **Keyboard twin: Enter in the detail popover edits.** ⌘-dblclick stays select.
- **Esc clears multi-selection** (SelectionBar) — the design-debt item.
- Shortcuts help updated (Esc clear, empty-slot create, event peek/edit).

**Verified:** `tsc` clean; fresh-server console clean. Live (preview): month empty cell → QuickCreate
("Sunday, April 26 · All day"), typed title + Enter → event appears; day hour slot → "Friday, May 29 ·
00:00 – 01:00"; Esc closes. Event single-click → "Event: Therapy" peek only; double-click "Sprint planning"
→ edit form prefilled (no peek flash); Enter from the peek → edit; day-view timed block dbl-click → edit.

**Next:** push (auto-deploy). Then Viet's 4th ask — **drag to create multi-day all-day events** — still
deferred; needs multi-day span rendering (DBT-03). Will present the true-spans vs per-day-instances fork
before building.

---

## 2026-05-29 — Friday — Event click = detail; ⌘-click multi-select + bulk delete (D032)

**Did:** Reframed the event interaction per Viet's insight + Strategist/Design:
- **Single click → a read-first detail popover** (title, date/time, calendar) with **Edit · Delete** — click
  to *recall*, edit is deliberate. Anchored to the event, viewport-flipped, reuses dialog motion.
- **⌘/Ctrl-click → multi-select** (accent ring + floating "N selected · Delete · Clear" bar). **Bulk delete
  confirms with a count.** Only bulk action is delete (Strategist guardrail).
- New `SelectionProvider` context; `onEventClick` → `(event, anchor rect)`; leaves intercept the modifier
  and render the ring; `EventDetail` + `SelectionBar`; `deleteEvents` in the store.

**Verified:** build clean + static; fresh-server console clean. Live: click "Therapy" → "Event: Therapy"
popover (not the edit form); Edit → edit form; ⌘-click two events → "2 selected" + rings, no popover;
bar Delete → "Delete 2 events?" → removed + cleared.

**Next:** push (auto-deploy). DBT-01 now mostly covered (calendar + bulk delete confirm); undo still open.

---

## 2026-05-29 — Friday — Confirm calendar delete (D031, partial DBT-01)

**Did:** Deleting a calendar that has events now prompts first — an inline confirm in the dialog with the
**event count** ("Delete Plan? Its 14 events will be removed too — this can't be undone."). Empty calendars
delete immediately (no nag). Closes the highest-stakes slice of DBT-01.

**Verified:** build clean + static; fresh-server console clean. Live: Delete on Plan (14 events) → confirm
with count; "Delete calendar" → Plan + Sprint events gone; empty "Temp" → deletes with no prompt.

**Next:** push (auto-deploy); remaining DBT-01 = undo + confirm on event/note/set deletes; DBT-02 persistence.

---

## 2026-05-29 — Friday — Calendar CRUD + palette (D030)

**Did:** Made calendars **user-managed** (create/edit/delete), with a **curated 6-color palette** (locked
with Viet over free-hex), and **delete cascades the calendar's events**. Sizable refactor:
- `CalendarId` → string; `Calendar.color` (palette key); `--cal-<key>` light/dark solid+soft vars.
- **Calendars + visibility moved into `DataProvider`** (coupled to events for the cascade); `useCalendarState`
  now owns only view+anchor; AppShell reads visibility from the store. Color via `colorOf(id)` lookups.
- `CalendarDialog` (name + swatch picker); Sidebar Calendars `+` and per-row edit pencil. Sets filter to
  existing calendar ids, so a deleted calendar just drops out.

**Verified:** `npm run build` clean (typechecks across the refactor); fresh-server console clean. Live:
palette colors render; create "Travel"; edit → plum (swatch rgb(133,87,114)); delete "Plan" → its Sprint/
Demo/Plan Q3 events vanish + sidebar row gone.

**Next:** push (auto-deploy); then P1 (persist DBT-02 — calendars/sets persist; events/notes don't yet).

---

## 2026-05-29 — Friday — Calendar Sets (D029)

**Did:** Built **Calendar Sets** — saved, named calendar combinations (Viet's ask: a "Personal" lens =
Personal + Shared·Erich). Discussed scope/flow with Strategist (saved-filter, not a surface — guardrail
against feature creep) + Design (placement, create/apply/edit flow). Term: **Sets** (avoids clashing with
D/W/M/Y "view").
- Sidebar **SETS** section above Calendars: All calendars + saved sets; click to apply (sets visibility);
  active set derived by matching; manual toggle → "Custom". `+` / pencil → create/edit dialog (name +
  calendar checklist). Persisted; seeded **Personal** + **Work**.
- `CalendarSet` type; `calendarSets` CRUD in SettingsProvider; `applyCalendars` in calendar state;
  `CalendarSetDialog` rendered at AppShell root (so `position:fixed` isn't trapped by the panel transform).

**Verified:** build clean + static; fresh-server console clean. Seeds show; Work → Plan+Erich (grid +
checkboxes update, active marked); create "Just me" → appears + persists; edit → delete removes it.

**Next:** push (auto-deploy); then P1 (persist DBT-02, delete undo DBT-01).

---

## 2026-05-29 — Friday — Agenda week style (D028)

**Did:** Added a second Week layout — an **agenda/list** style (from a Google-style reference) rebuilt in
our look: mono day numbers, our calendar-color bars, 24h mono times, gold today dot, "No events"
placeholders, dashed day separators. Switchable in **Settings → Week view** (Timeline / Agenda, persisted).
Refactored Year + Week segmented controls onto a shared `SegmentRow`. Same interactions: event → edit,
day number → Day view.

**Verified:** build clean + static; fresh-server console clean. Agenda renders for the week; Sprint
planning → "Edit event"; day 26 → `?v=d&d=2026-05-26`. Persists.

**Note:** local repo now ahead of the live deploy by D025–D028 + this — push to auto-deploy when ready.

**Next:** P1 (persist DBT-02, delete undo DBT-01); push to refresh the live site.

---

## 2026-05-29 — Friday — Shipped: GitHub + Vercel (v0.1 is live)

**Did:**
- Pushed the project (app + all product/working docs + README) to **github.com/olivervngsf/calendar**
  (public, `main`).
- Deployed to **Vercel production** → **https://calendar-chi-two-67.vercel.app**. Linked the dir to a
  project named `calendar` (the auto-name from "Calendar app" was invalid — spaces/case) and **connected
  the GitHub repo**, so every push to `main` now auto-deploys. No env vars (mock data).
- Verified live: HTTP 200, SSR renders (calendar / May 2026 / Notes / Decision log), edge-cached.

**This completes Phase 7's core exit — public, linkable URL.**

**Next:** P1 polish for the live demo — persist store across reload (DBT-02), delete confirm/undo (DBT-01);
then optional OG image + custom domain.

---

## 2026-05-29 — Friday — Dialogs open on the title; ⌘↵ saves (D027)

**Did:** Opening the event editor focused the close (×) button (first in DOM), not the title. Fixed
`Dialog` to autofocus the **first text field** and **select its contents** (edit-to-replace). Added
**⌘/Ctrl+Enter to save** from anywhere in the Event + Note dialogs. So: open event → type title
immediately → ⌘↵ to save.

**Verified:** build clean + static; console clean. New event → focus on empty title; edit event → title
focused with text selected (13 chars = "Dinner · home"); ⌘+Enter closes/saves.

**Next:** P1 debts (persist DBT-02, delete undo DBT-01), then Vercel ship.

---

## 2026-05-29 — Friday — Week numbers across views (D026)

**Did:** The "Show week numbers" toggle was Month-only. Extended it: **Day/Week** show the period's ISO
week as a "W{n}" label in the time-grid gutter corner; **Year (grid)** gets a week-number column in each
mini-month. Month keeps its row gutter. Year (columns) left as-is (its rows are day-of-month, so a week
column doesn't map — grid style covers "Y"). All via `getISOWeek` so numbers agree everywhere.

**Verified:** build clean + static; console clean. With the toggle on: Week → "W22", Day → "W22", Year
grid → per-mini-month week column (Jan = 1,2,3…). Settings copy updated to "across views".

**Next:** P1 debts (persist DBT-02, delete undo DBT-01), then Vercel ship.

---

## 2026-05-29 — Friday — Dialog entry motion (D025, closes DBT-06)

**Did:** Selecting an event popped the editor in abruptly. Added a smooth **entry animation** to the shared
`Dialog` primitive — overlay fade + panel fade/lift/scale over 200ms ease-out — so the event editor (and
note / quick-add / settings dialogs) ease in. Mirrored on the shortcuts overlay. **Entry only; exit stays
instant** (consistent across all close paths; animating exit needs delayed-unmount plumbing). Reduced-motion
users get instant open via the global rule.

**Verified:** build clean + static; console clean. Mid-transition panel opacity sampled at 0.27 → settles
to 1 (0.2s) — it eases in, no pop. Closes **DBT-06**.

**Next:** P1 debts (persist DBT-02, delete undo DBT-01), then Vercel ship.

---

## 2026-05-29 — Friday — Navigation model: focus day vs zoom (D024)

**Did:** Viet flagged that picking a mini-month date forced Day view. Reframed the model: **anchor = focused
day, view = zoom.** Mini-month now **moves focus and keeps the current view** (`handleFocusDate`); explicit
drill-downs (Year-grid day, Week day-header) still go to Day. Added a **selected-day marker** distinct from
today — today = gold ring, focused day = soft accent fill — across MonthCell, MiniMonth, Week/Day header,
YearMonth, YearColumns. Focus persists across view switches.

**Verified:** build clean + static; fresh-server console clean. In Week, picking May 12 → stays in Week,
title "May 10 – 16", mini marks 12; press D → "Tue, May 12" (focus carried); Month shows 12 filled + 29 ringed.

**Next:** P1 debts (persist DBT-02, delete undo DBT-01), then Vercel ship.

---

## 2026-05-29 — Friday — Mini-month dates are clickable

**Did:** Sidebar mini-month dates (current + next month) are now buttons — clicking any date jumps to that
day's **Day view** (reuses `handleSelectDay`, same pattern as Week day-headers and the Year grid). Added a
hover affordance, which also closes the wireframe Design finding #5 ("mini-month dates have no hover").

**Verified:** build clean + static; console clean; clicking June 12 in the mini-month → `?v=d&d=2026-06-12`.

---

## 2026-05-29 — Friday — Rebind ⌘N off the browser (D023)

**Did:** Viet found `⌘N` opening a new browser window instead of a new note. Confirmed: `⌘N` / `⌘⇧N` are
OS/browser-reserved — a page can't intercept them (`preventDefault` doesn't stop the new window). Rebound:
`N` = new event, **`Shift+N` = new note**, **`Shift+Q` = quick-add**. The shortcut layer now passes all
⌘/Ctrl/Alt combos through to the browser. Updated the `?` help.

**Verified:** build clean + static; console clean; plain N → New event, Shift+N → "New note · …",
Shift+Q → "Quick add".

**Lesson logged (D023):** never bind app actions to ⌘+single-letter (⌘N/⌘T/⌘W/⌘⇧N…) — assume reserved.

**Next:** P1 debts (persist DBT-02, delete undo DBT-01), then Vercel ship.

---

## 2026-05-29 — Friday — The wedge lands: notes scoped to the active view

**Did (D022):** Made the notes panel follow the view — day note on **D**, week note on **W**, month on
**M**, year on **Y**. Discussed first with Strategist (Approved — highest-leverage) + Design (Ship — header
label / empty states / seed data are make-or-break); both logged in `agents-log`.
- `noteScopeFor(view, anchor)` returns the scope `{unit, key}` + label + tag; `NotesPanel` scopes by it
  (scope-aware header, empty state, "New note for {scope}"). `NoteDialog` + ⌘N create at the active scope.
- **Exact-scope only — no auto-roll-up** (anti-goal guard: notes are written, not generated).
- Seeded mock notes at day / week / year scope so switching D/W/M/Y visibly proves the wedge.

**Verified:** build clean + static; fresh-server console clean. Switching D→W→M→Y on May 29 shows four
distinct note sets with matching headers; ⌘N on Week opens "New note · May 24 – 30".

**This closes the Phase 5 exit.** All four views + view-scoped notes are live — v0.1's core is complete.

**Next:** P1 debts (persist store DBT-02, delete undo DBT-01), then Vercel ship.

---

## 2026-05-29 — Friday — Second Year-view style + hydration fix

**Did (D021):**
- Added a **linear-columns Year view** (`YearColumns`) — months as columns, days 1–31 as rows, weekday
  per cell, weekends tinted, today highlighted, event dots. Switchable in **Settings** via a new
  `yearStyle` (grid | columns) preference (persisted). `YearView` branches on it.
- **Fixed a hydration warning:** added `suppressHydrationWarning` to `<body>`. The mismatch was a
  `data-demoway-document-id` attribute the preview/demo viewer injects onto `<body>` before hydration —
  external tooling, not our code, and absent in production.

**Verified:** build clean + static; **fresh-server console clean** (hydration warning gone); Settings →
"Columns" persists (`yearStyle:"columns"`) and renders the planner (JAN–DEC × 01–31, correct weekdays for
2026, May's today + event dots), "Calendar" switches back to the 12 mini-months.

**Next:** P1 debts (persist store DBT-02, delete undo DBT-01), then Vercel ship.

---

## 2026-05-29 — Friday — Quick-add shortcuts (⌘N note, ⌘⇧N natural language)

**Did (D020):**
- `⌘N` → new **note** on the Notes panel (NoteDialog, scoped to the visible month).
- `⌘⇧N` → **natural-language quick-add**. `lib/quickAdd.ts` parses a sentence into title + date +
  optional yearly recurrence; `QuickAddDialog` shows a live preview and creates it, then jumps the
  calendar to that date. Plain `N` stays = new event. Updated the `?` shortcuts overlay.
- **Year defaulting:** no year → current year, rolled to next if the date already passed.
- **Recurrence:** no RRULE engine in v0.1, so "repeat yearly" expands mock instances (resolved year → +4)
  so the birthday recurs across the Year view (consistent with D012).

**Verified:** build clean + static; fresh-server console clean. Live: "I want to create Viet's birthday
every July 23." → preview "Viet's birthday · Thu, July 23, 2026 · REPEATS YEARLY" → Add → calendar jumps
to July 2026 and the all-day event shows on the 23rd. `⌘N` opens the note dialog; help overlay lists both.

**Next:** P1 debts before sharing — persist store (DBT-02), delete confirm/undo (DBT-01); then ship to Vercel.

---

## 2026-05-29 — Friday — Year view (all four views now real)

**Did:**
- Built the **Year view** as a 12-month grid (D019) — the last placeholder. `YearView` + `YearMonth`:
  twelve mini-months for the anchor year, today's gold ring, a small accent dot on days with a visible
  event, and click-through (day → Day view, month name → Month view). `←/→` steps by year.
- Removed the now-unused `ViewPlaceholder` — **D/W/M/Y are all real views now.**

**Verified:** build clean + static; live in light + dark; day-click → `?v=d`, month-click → `?v=m`,
event dots show on May's days, today ringed; notes empty-state renders for months with no notes; console clean.

**Next:** Polish/Phase 6 (motion on dialogs — DBT-06, multi-day spans — DBT-03), or persistence (DBT-02)
+ delete-undo (DBT-01) before sharing the URL. Then Phase 7 ship (Vercel deploy).

---

## 2026-05-29 — Friday — Panel slide animation + app-bar layout fix

**Did:**
- **Animated the panel collapse:** sidebar now slides **left**, notes slides **right** (200ms width +
  translate), and the calendar reflows smoothly to fill — replacing the instant pop. Restructured the
  body from a grid-template swap to flex with always-mounted, overflow-clipped panel wrappers.
- **Fixed an app-bar regression Viet caught (DBT-08/09):** adding the right panel toggle had overflowed
  the fixed-240px right column, wrapping "+ New event" to two lines and clipping the D/W/M/Y switch.
  Columns → `auto/1fr/auto` + `whitespace-nowrap`/`shrink-0`. Both debts marked Addressed.

**Verified:** build clean + static; fresh-server console clean; sidebar `translate:-100%` / notes
`translate:100%` on collapse, canvas reflows (880↔1120↔1440), `[`/`]` + icons work.

**Note:** Tailwind v4 applies translate via the `translate` CSS property (not `transform`) — both are in
the transition. Dialog entry/exit motion (DBT-06) is still open; this pass only animated the panels.

**Next:** Year view (last placeholder); or persist panel state / dialog motion.

---

## 2026-05-29 — Friday — Collapsible side panels

**Did:**
- Added panel-toggle icons to the app bar (far-left = sidebar, far-right = notes panel) so users can
  collapse either panel to give the calendar more room (D018). `[` and `]` toggle them from the keyboard.
- `PanelToggle` icon fills its compartment when the panel is open; the body grid reflows across four
  column templates and collapsed panels are unmounted (not just hidden).

**Verified:** build clean + static; live — sidebar/notes collapse and reopen via icons and `[`/`]`,
grid reflows (240/880/320 → 1120/320 → 1440), `aria-pressed` tracks state, console clean.

**Next:** optional — persist panel state to localStorage (move into SettingsProvider) if it should
survive reload.

---

## 2026-05-29 — Friday — Exported the app into Figma

**Did:**
- Pushed the app into a new Figma file **"Calendar — v0.1"** (Viet's Workspace) — 6 frames: Month, Week,
  Day, each in light + dark. Built via the Figma Plugin API (`use_figma`) from our editorial-calm tokens
  (no Figma design system exists yet, so it's a faithful visual rebuild, not linked components).
- File: https://www.figma.com/design/lMmLbhnGzeOXuNPoUZOTM4

**Notes:**
- Used Inter for all type (JetBrains Mono isn't reliably available via the Plugin API). Time-grid events
  are absolutely positioned from start/end hours; month grid + mini-month generated by loop.
- This is a design artifact, not a design system. If we want linked/updatable components later, that's a
  separate pass (build a Figma component library + Code Connect) — out of scope for this export.

---

## 2026-05-29 — Friday — Week + Day views

**Did:**
- Built **Week** and **Day** views in the Month view's editorial-calm language (D017) — they were placeholders.
- **Shared time grid:** one `TimeGridView` (day header + all-day row + scrollable 24h grid) driven by a
  `days[]` array — Week passes 7 days, Day passes 1. `DayColumn` + `TimeEventBlock` render hour slots and
  positioned events; `lib/timegrid.ts` does the minute math + side-by-side **lane packing** for overlaps.
- **View-aware state:** the anchor is now a specific *day*; ←/→ and Today step by month / week / day per
  the active view; the AppBar title adapts ("May 24 – 30", "Fri, May 29"); URL is `?v=&d=YYYY-MM-DD`.
- **Interactions, consistent with Month:** click event → edit; click empty hour slot → new event prefilled
  at that day + hour; click a week day-header → open that Day. Gold today ring, mono times, scroll-to-morning.

**What worked:**
- Treating Day as Week-with-one-column meant one grid to build and style — both views came out pixel-consistent.
- The lane packer solves overlaps generically; verified the slot-click prefilled 10:00–11:00 on the right day,
  and week day-headers jump to Day view. Dark mode reads cleanly on the new surface.

**What hurt:**
- Nothing notable. The anchor refactor (month→day) touched `useCalendarState` + the AppBar title, but stayed
  contained; build clean, route still static, fresh-load console clean.

**Verification:** `npm run build` clean; Week + Day confirmed live at 1440px (light + dark); nav/title,
slot-create, header-to-day, event-edit all pass; zero console errors on a fresh server.

**Next session:**
- **Year view** (12-month grid) — the last placeholder.
- Open P1 debts still standing: persist store across reload (DBT-02), delete confirm/undo (DBT-01).
- Notes scope for week/day (currently month-scoped regardless of view).

---

## 2026-05-29 — Friday — Settings popup + week numbers; build-tracker becomes a live board

**Did:**
- **Build-tracker ownership model (D015):** turned `build-tracker.md` into a live, agent-maintained board.
  Engineer owns the Status columns; Design + Strategist file debts; Viet reads it to prioritize. Codified
  into all three agent critical paths + added a Debts table seeded with the 7 debts already surfaced (2 P1).
- **Global Settings (D016):** added a centered Settings popup (Esc / × / click-outside) with the first
  toggle — **show week numbers**. Built a `SettingsProvider` (persisted to `localStorage`), a `Toggle`
  switch, a `SettingsDialog`, and `getISOWeek` in `lib/date.ts`. Week numbers render as a left gutter on the
  month grid only when enabled. Opens via an AppBar gear or the new `,` shortcut.
- Switched the `Dialog` primitive's close affordance from "esc" text to an **×** icon (applies to all dialogs).

**What worked:**
- Reusing the `Dialog` primitive meant the Settings popup got centered layout, Esc, click-outside, and
  autofocus for free — one modal pattern, three dialogs.
- Verified live: toggle flips + persists (`localStorage["settings"]` survived a full server restart), gutter
  renders correct ISO weeks (18–22 for May 2026), gear + `,` both open it, fresh-load console clean.

**What hurt:**
- The React 19 inline-script dev warning resurfaced in the console — but only as **HMR accumulation**: a
  fresh server load shows zero errors (confirmed by restarting the preview). Production is unaffected
  (the warning is a dev-only `console.error`). No code change needed; noted so it isn't chased again.

**Verification:** `npm run build` clean, route still static; fresh-server console clean; Settings + week
numbers confirmed end-to-end at 1440px.

**Next session:**
- Week + Day views (then Year). Persist the event/note store across reload (DBT-02).
- Delete confirm/undo (DBT-01). Both are the open P1 debts on the tracker.

---

## 2026-05-29 — Friday — CRUD: events + notes are now writable

**Did:**
- Made events **and** notes fully create / edit / delete — in-session only (D001, no DB).
- **Store (D014):** added `components/providers/DataProvider.tsx` — a Context store seeded from
  `lib/mock-data.ts`, exposing `add/update/delete` for events and notes via `useData()`. Wraps `AppShell`.
  This is the dedicated home the Engineer asked for last pass (not bolted onto `useCalendarState`).
- **Dialogs:** one accessible `Dialog` primitive (overlay, Esc, click-outside, autofocus) +
  `EventDialog` (title / calendar / date / all-day / start-end) and `NoteDialog` (type / title / body).
- **Entry points:** visible **"+ New event"** primary button in the AppBar (Design's outstanding ask) +
  `N` shortcut + click a day to create / click an event to edit. Notes: "+ New note" to create, click a
  card to edit. New notes auto-scope to the visible month (the wedge).
- Switched `MonthView` / `Sidebar` / `NotesPanel` to read from the store instead of the static constants.

**What worked:**
- Verified every path live via the Preview MCP: event create/edit/delete and note create/edit/delete all
  pass; calendar counts update live; new note lands under the right log + month. Build clean, route still
  statically prerendered.

**What hurt:**
- React 19 throws a dev-only warning for **inline** `<script>` rendered through the component tree — our
  no-flash theme bootstrap tripped it (16× in console). Fixed by moving it to an **external**
  `public/theme-init.js` loaded via `next/script beforeInteractive`: zero console errors, no-flash kept,
  route stays static. (The MCP console buffer is cumulative across reloads — had to restart the preview
  server to confirm the fix, since `console.clear()` doesn't clear the capture.)

**Verification:** `npm run build` clean; fresh-server console shows **no errors**; theme applies before
paint; CRUD flows confirmed end-to-end on a 1440px desktop view.

**Next session:**
- Week + Day views (then Year = 12-month grid). Multi-day event **spans** (still per-day badges).
- Persist the in-memory store across reloads (localStorage) as a bridge before the v0.2 Supabase swap.
- Carry-forward a11y: `role="grid"` semantics on the month grid, 44px touch targets at mobile.

---

## 2026-05-29 — Friday — Pixels: first real build (Foundation + Month)

**Did:**
- Left Phase 0 (docs only) and shipped the first **running code**. Stood up the real Next.js app on the
  foundation the wireframe defined. Scope this pass (locked with Viet): **Foundation + Month view** —
  not full v0.1, not shell-only.
- **Scaffold:** Next.js 16 (App Router, TS) + Tailwind v4 (CSS-first `@theme`) at the project root,
  alongside the `.md` docs. Inter + JetBrains Mono via `next/font`. Vercel-ready.
- **Tokens:** ported the wireframe's editorial-calm palette into `app/globals.css`; added a new dark
  palette (D013). No-flash theme bootstrap in `layout.tsx`.
- **Lib layer:** `types.ts`, `date.ts` (real 6×7 month-grid math, no date library), `mock-data.ts`
  (a hand-crafted month of Viet's life × 3 calendars + seed notes), `events.ts`, `notes.ts`.
- **Shell + Month:** three-pane layout (AppBar / Sidebar / NotesPanel), Month grid ported from the
  wireframe, mini-months, calendar visibility toggles, read-only scoped notes panel, keyboard layer
  (D/W/M/Y · T · ←/→ · ? help), light/dark toggle, responsive collapse. W/D/Y show a "coming next" placeholder.
- **Decisions logged:** D011 (URL-mirrored view state), D012 (mock data model shape), D013 (dark palette).
- **Honored the prior Design Block** on the wireframe before logging my own review: dropped the version
  stamp from the brand chrome, replaced the cute "Strategist · challenge aesthetics" event with realistic
  copy ("Dinner · home"), darkened `--text-3` for AA, and gave **today** a distinct gold ring instead of
  the teal fill it shared with the Personal calendar.

**What worked:**
- Porting the wireframe's CSS variables straight into Tailwind v4 `@theme` was nearly 1:1 — the bespoke
  editorial feel survived the move to React intact. The custom-tokens (no shadcn) call paid off.
- URL-mirrored state (D011) makes keyboard view-switching instant and the view shareable. Verified live.

**What hurt:**
- `create-next-app` can't scaffold into a non-empty dir, so config was hand-written. Fine, but pinned
  versions drifted (Next 15→16 for a CVE patch); re-aligned React/Tailwind to match.
- Preview screenshots glitched (rendered tiny) right after a hard reload — a tooling artifact, not a
  layout bug; confirmed correct via computed dimensions (`grid 240/880/320`, main 880px) + clean reshot.

**Verification:** `npm run build` clean (types pass). Live QA via Preview MCP — Month renders May 2026,
today ringed, calendars toggle, notes scoped to month, light+dark both clean, keyboard D/W/M/Y + ←/→
update view and URL, zero console errors.

**Next session:**
- Build the deferred views: **Week** (time slots) and **Day** first, then **Year** (12-month grid, locked).
- **Event create/edit/delete modal** — wire the `N` shortcut and day/event clicks (currently stubs).
- Notes CRUD (the "+ New note" affordance is present but stubbed) — the wedge needs to be writable.
- Carry-forward Design items: multi-day event spans (still per-day badges), a visible "New event" primary
  action, `role="grid"` semantics, and 44px touch targets at mobile.

---

## 2026-05-29 — Friday — Project kickoff

**Did:**
- Brought idea forward: modern calendar to rival Apple + Google. Vercel deploy.
- Locked three foundational decisions (see decision-log D001–D003): scope = UI prototype with mock data, stack = Next.js + Supabase, users = single-user showcase.
- Scaffolded workspace: `CLAUDE.md`, `PRD.md`, `roadmap.md`, `decision-log.md`, `daily-log.md`, `Resources/`.

**Working hypotheses (to validate):**
- The wedge is *time-scoped notes*. Calendar as a thinking surface, not just a scheduler.
- Year view is a differentiator opportunity — most apps treat it as filler.

**Open before Phase 1:**
- Aesthetic philosophy — needs a named direction (Swiss / editorial / brutalist-soft / etc.).
- Notes data model — one note per time unit or many?
- Year view treatment — heatmap, timeline, or 12-month grid?
- Mobile layout — single pane navigation or collapsing panels?

**Later same day:**
- Defined three project agents (Engineer, CEO, Design) as quality gates — D004.
- Scaffolded `Agents/` folder, `agents-log.md`, dashboard artifact.
- Registered agents in `CLAUDE.md`.
- First agent reviews ran: all three weighed in on whether to add a strategy note.
- Adopted `strategy.md` as standing root note — D005. Drafted v1 (thesis, wedge, who, positioning, anti-goals, voice, constraints). Linked from PRD §2 as canonical.

**Evening:**
- Reviewed Mark Kashef's Agentic OS video. All three agents weighed in (CEO/Eng/Design).
- Adopted three patterns: Critical paths in each agent file, `context-primer.md` at root, L1-L4 audit line in CLAUDE.md — D006.
- Rejected: hooks, orchestrator, `/silver-platter` skill — premature for our scale.
- L1-L4 audit: sitting at L1 + L3. Stay there until end of Phase 2.

**Late evening:**
- Clarified roles: **Viet is the CEO / founder** of the project. The agent labeled "CEO" was renamed to **Strategist** — D007.
- Updated CLAUDE.md, context-primer, agent files, README, dashboard.
- Discussed Research agent (4th). Reframed scope (scout + synthesize, no judging). Not yet locked.

**End of day:**
- Hired Research agent — D008. Tripwire: kill if 0 invocations in 3 sessions.
- Locked Vision + Mission at top of `strategy.md` — D009.
- Shipped first-pass Month view: `wireframes/v0-month-view.html`. Editorial-calm direction, mock data (Personal · Plan · Shared with Erich), notes panel populated with real project decisions.
- Bench is now 4 agents (Engineer, Strategist, Design, Research). System on L1 + L3, ready to start pixel work.

**Move:**
- Moved entire project to `/Users/vietnguyen/Documents/05 PRACTICE/Calendar app` — D010. New canonical root.
- Old folder emptied — only the empty mount-point directory remains (can't be removed from sandbox). Viet to delete the empty folder in Finder if desired.

**Next session:**
- Decide aesthetic philosophy. (Consider running CEO challenge first: "Does naming the philosophy now save or cost time?")
- Wireframe notes panel before any other screen — it's the wedge.
- Drop 3–5 visual references into `Resources/` with "what to steal" notes.

---
