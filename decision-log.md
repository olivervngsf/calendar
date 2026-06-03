# Decision Log

Every meaningful decision in this project. Newest at top.

---

## 2026-05-29 — D027: Dialogs focus the title field on open; ⌘/Ctrl+Enter saves

**Context:** Opening the event editor put focus on the close (×) button (it's first in the DOM), so users
couldn't type immediately. Viet wanted to type/edit right away, then save with ⌘+Enter.

**Choice:**
- `Dialog` autofocuses the **first text field** (input/textarea/select), not the first focusable — and
  **selects its contents** so editing an existing value is type-to-replace. For the event editor that's the
  title; note editor → note title; quick-add → its input.
- **⌘/Ctrl+Enter saves** from anywhere in the Event and Note dialogs (form-level keydown). Plain Enter on
  single-line inputs still saves (quick path); the textarea keeps Enter for newlines.

**Why:** the title is the thing you almost always want to type first; landing there (and selecting on edit)
removes a click/tab. ⌘+Enter is the conventional "commit" gesture and works even from the multi-line note body.

**How to apply:** focus/select logic in `components/ui/Dialog.tsx`; ⌘+Enter handlers on the content root of
`EventDialog` and `NoteDialog`.

---

## 2026-05-29 — D026: Week numbers across all views (was Month-only)

**Context:** The "Show week numbers" setting only added the gutter to **Month**. Viet wanted the ISO week
visible in **Day, Week, and Year** too.

**Choice (when the setting is on):**
- **Month** — per-row week gutter (existing).
- **Day / Week** — the period's ISO week as a small "W{n}" label in the time-grid gutter corner
  (keyed off the week's Thursday, or the day itself in Day view).
- **Year (grid)** — a leading week-number column in each mini-month, mirroring Month.
- **Year (columns)** — left unchanged: that planner's rows are day-of-month (1–31), so a single
  week-number column doesn't map. Noted limitation; the grid year style covers "Y".

**Why:** week numbers are a planning aid; surfacing them consistently wherever a week is legible makes the
toggle actually global (its label now says "across views"). All numbers use the same `getISOWeek` (Thursday
rule), so they agree everywhere.

**How to apply:** `TimeGridView` reads `useSettings()` and renders the gutter label (covers D + W);
`YearMonth` chunks into weeks and adds the gutter column. Settings copy updated.

---

## 2026-05-29 — D025: Dialog entry motion (smooth open) — closes DBT-06

**Context:** Viet: selecting an event made the editor pop in abruptly — wanted a smooth interaction.

**Choice:** The shared `Dialog` primitive eases in on open — overlay fade + panel fade/lift/scale
(opacity 0→1, translateY 4px→0, scale .98→1) over **200ms ease-out**. Mirrored on the `ShortcutsHelp`
overlay. Covers the event editor + note / quick-add / settings dialogs (all use `Dialog`).

**Why / rules:**
- **Entry only; exit stays instant.** Animating exit cleanly would require delaying unmount across every
  close path (Esc / × / backdrop / Save / Cancel / Delete) — and `Dialog` is the *parent's* child, so a
  context/delayed-unmount refactor. Instant exit is **consistent across all close paths** and the calm,
  common pattern; the abruptness Viet noticed was the *open*, which is now smooth.
- Reduced-motion is handled by the global `prefers-reduced-motion` rule (transitions → ~0ms), so those
  users get an instant open — no extra code.
- Mechanism: a `show` state flips true on the next animation frame after mount, triggering the transition.

**How to apply:** `components/ui/Dialog.tsx` (+ `ShortcutsHelp.tsx`). New dialogs get this for free via the
primitive. If symmetric exit motion is ever wanted, add a delayed-unmount close path (context) — logged as
the only remaining motion nicety.

---

## 2026-05-29 — D024: Navigation model — focus day vs zoom; mini-month moves focus, keeps view

**Context:** Viet: in Week view, picking the 30th in the mini-month forced Day view. He expected to stay
in Week (showing the week of the 30th). Discussed the navigation model.

**Model (locked):** the **anchor is the "focused day"; the view (D/W/M/Y) is the zoom.** Picking a date
moves focus and the view shows the period around it; switching views preserves the focus.

**Two date gestures, deliberately different:**
- **Navigator** (sidebar mini-month) → **move focus, keep current view** (`handleFocusDate` = `goToDate`,
  no `setView`). Matches macOS/Google mini-calendars; it's always-present so it shouldn't change zoom.
- **Drill-down** (Year-grid day, Week day-header) → **go to Day view**. There the gesture is overview→detail.

**Selected-day marker (locked):** the focused day gets a distinct highlight so you can see where focus is.
Consistent everywhere: **today = gold ring** (`--today-ring`), **focused day = soft accent fill**
(`--accent-soft`); when focus == today, the ring wins (no double-mark). Applied in MonthCell, MiniMonth,
Week/Day header (TimeGridView), YearMonth, and YearColumns (today = gold left-bar there).

**Why:** it's the conventional, less-surprising navigator behavior and makes the anchor a coherent,
persistent focus across zoom levels. No aggregation/new state needed — anchor already existed.

**How to apply:** `AppShell.handleFocusDate` for the mini-month (vs `handleSelectDay` for drill-downs);
each view derives `selectedIso = isoDate(anchor)` and marks the matching day (excluding today).

---

## 2026-05-29 — D023: Rebind create shortcuts off ⌘N (browser-reserved) → Shift+N / Shift+Q

**Context:** D020 bound new-note to `⌘N` and quick-add to `⌘⇧N`. In practice the browser opens a new
window — `⌘N` / `⌘⇧N` are OS/browser-reserved and a web page **cannot** intercept them (`preventDefault`
doesn't stop the new window). Viet hit this directly. The Engineer note at D020 had flagged the risk.

**Choice (supersedes D020's bindings):** `N` = new event (unchanged), **`Shift+N` = new note**,
**`Shift+Q` = quick-add**. Plain/Shift+letter keys are not browser-reserved and intercept reliably.

**Why:**
- It's a hard browser constraint, not a fixable bug — the only real options were "rebind" or "drop." Rebind keeps the feature.
- Shift+letter is mnemonic (N = note, Q = quick) and collision-free; matched on `e.code` + `e.shiftKey` so it's layout/caps-safe.
- ⌘/Ctrl/Alt combos are now explicitly passed through to the browser (the shortcut layer returns early on them).

**How to apply:** `hooks/useKeyboardShortcuts.ts` handles `KeyN` (shift → note, else event) and `Shift+Q`
(quick-add) before the unmodified switch. Help overlay updated. **Lesson:** never bind app actions to
⌘N/⌘T/⌘W/⌘⇧N etc. — assume any ⌘+single-letter may be reserved.

---

## 2026-05-29 — D022: Notes panel scoped to the active view (the wedge, fully live)

**Context:** The notes panel was month-scoped regardless of view — only 1 of the 4 promised scopes
(`strategy.md §2`) was live. Discussed with Strategist + Design (see `agents-log` 2026-05-30). Both: build it.

**Choice:** The notes panel scopes to the active view's exact time unit:
- **D** → day note (key `2026-05-29`, header "Fri, May 29 · this day")
- **W** → week note (key = week-start `2026-05-24`, "May 24 – 30 · this week")
- **M** → month note (key `2026-05`, "May 2026 · this month")
- **Y** → year note (key `2026`, "2026 · this year")

Switching D/W/M/Y (or navigating ←/→) reloads the panel to that unit. "+ New note" and ⌘N create at the
**current** scope. Decision log + daily log stay at every scope.

**Why / rules:**
- It's the wedge and the Phase 5 exit ("M→W reloads the panel… feels obvious"). Not building it was the gap.
- **Exact-scope only — no auto-roll-up** (CEO call, both agents agreed): coarser views do *not* assemble
  finer notes. Aggregation drifts toward the "your-week-in-review by AI" anti-goal (`§5`); notes are
  written, not generated. Cross-scope recall, if ever needed, is a v0.2 "notes timeline."
- The data model already supported this (`scope: {unit, key}`, D012) — this wired the scope to the view.
- **Seeded mock notes at all four scopes** so switching visibly proves the wedge in the demo (Design's
  highest-risk flag — empty W/D/Y would read as broken).

**How to apply:**
- `noteScopeFor(view, anchor)` in `lib/date.ts` (unit + key + label + tag). `NotesPanel` takes `view`,
  scopes via it, and renders scope-aware header / empty state / "New note for {scope}". `NoteDialog` takes
  a `scope` + `scopeLabel` and creates there. Week key = Sunday-start ISO date.

---

## 2026-05-29 — D021: Two Year-view styles (calendar grid / linear columns), switchable in Settings

**Context:** Viet wanted a second Year layout — the "year planner" style (months as columns, days 1–31
as rows) — selectable alongside the existing 12-mini-month grid. Also fixed a hydration warning.

**Choice:**
- Add `yearStyle: "grid" | "columns"` to `SettingsProvider` (persisted), with a segmented control in the
  Settings dialog. `YearView` branches on it: `grid` → existing 12 mini-months; `columns` → new
  `YearColumns` (12 month columns × 31 day rows; each cell shows day# + weekday; weekends tinted, today
  highlighted, event dot; click day → Day, month header → Month).
- **Hydration fix:** added `suppressHydrationWarning` to `<body>`. The mismatch came from a
  `data-demoway-document-id` attribute injected onto `<body>` by the preview/demo viewer before React
  hydrates (an external-tool/extension case, not our code; absent in production). `<html>` already had it.

**Why:**
- The linear planner is a recognized "year at a glance" format; offering both lets the calendar suit
  either a navigational (grid) or planning (columns) mindset without picking a winner.
- A persisted setting (not a per-session toggle) fits — it's a durable preference, like week numbers.

**How to apply:**
- `components/calendar/YearColumns.tsx`; branch in `YearView.tsx`; `yearStyle` in `SettingsProvider`;
  segmented control in `SettingsDialog`. Both styles share the same `eventDays` set + click handlers.

---

## 2026-05-29 — D020: ⌘N new note, ⌘⇧N natural-language quick-add

**Context:** Viet wanted more create shortcuts: `⌘N` to make a **note** on the Notes panel, and `⌘⇧N`
for a **natural-language quick-add** (e.g. "Viet's birthday every July 23" → an event on July 23, 2026,
repeating yearly). Plain `N` stays = new event.

**Choice:**
- `⌘N` → opens the existing NoteDialog (create), scoped to the visible month.
- `⌘⇧N` → opens a `QuickAddDialog`: one text field + a live preview that parses the sentence into
  title + date + optional yearly recurrence; Add creates it and jumps the calendar to that date.

**Why / rules:**
- **Year defaulting:** if the sentence omits a year, assume the current year, rolled forward to next year
  if the date already passed (relative to the app's `TODAY`). "July 23" today (2026-05-29) → 2026.
- **Recurrence without an engine:** v0.1 has no RRULE engine (PRD out-of-scope). "repeat yearly" is
  honored by **expanding mock instances** for the resolved year through +4 (5 all-day events), so the
  birthday actually recurs across the Year view — consistent with D012's "expanded mock instances."
- **Parser is heuristic, not NLP** (`lib/quickAdd.ts`): month-name±day regex (both orders), optional
  year, recurrence via `yearly|annually|every <month>|repeat…year`; title = input minus filler/date/recur
  phrases. Date-less input shows an inline error in the preview rather than failing silently.
- **Keyboard:** the shortcut layer now handles ⌘/Ctrl combos before the typing-guard so `⌘N`/`⌘⇧N`
  work even while a field is focused; matched on `e.code === "KeyN"` (shift-safe).

**How to apply:**
- `lib/quickAdd.ts` (`parseQuickAdd`), `components/calendar/QuickAddDialog.tsx`; wired in `AppShell`
  (`onNewNote`, `onQuickAdd`, jump-to-date via `cal.goToDate`). Help overlay + this entry updated.
- When real recurrence lands (v0.2), replace instance-expansion with a recurrence field + view expansion.

---

## 2026-05-29 — D019: Year view as a 12-month grid (with event dots + click-through)

**Context:** Year was the last placeholder. Treatment was locked earlier as a **12-month grid** (over a
density heatmap or hybrid). This builds it in the editorial-calm language.

**Choice:** A scrollable 4×3 grid of mini-months for the anchor year. Each shows the month name, weekday
initials, and day numbers; today carries the gold ring; days with a visible event get a small accent dot
("what was the year about" at a glance, without a heavy heatmap).

**Why:**
- The 12-month grid is the familiar, calm treatment that fits the product voice; the event dots add a
  light "thinking surface" signal without drifting into engagement-style density viz.
- Navigation makes the year a launchpad: click a **day** → Day view; click a **month name** → Month view
  (`handleSelectDay` / `handleSelectMonth` in `AppShell`). `←/→` already step by year (`stepAnchor`).
- Reuses existing primitives — `getMonthGrid`, `monthLabel`, `WEEKDAY_INITIAL`, `eventDateKey` — so the
  grid math and today logic match the rest of the app exactly.

**How to apply:**
- `components/calendar/YearView.tsx` (builds the event-day set + 12 months) + `YearMonth.tsx` (one
  mini-month). Wired into `AppShell`; the old `ViewPlaceholder` is removed (all four views are now real).
- Year-scoped notes are still deferred — the notes panel stays month-scoped to the anchor for now.

---

## 2026-05-29 — D018: Collapsible side panels (sidebar + notes) via app-bar toggles

**Context:** Viet wanted panel-toggle icons (left + right) so users can collapse the sidebar and the
notes panel to give the calendar more room.

**Options:**
1. Two `PanelToggle` icon buttons in the app bar — far-left toggles the sidebar, far-right toggles the
   notes panel; the body grid template adapts. State held in `AppShell` (session).
2. A single "focus mode" that hides both at once. Rejected: less control; users want them independent.
3. Persist open/closed to `localStorage` (settings). Deferred: session state is enough for now; the
   default (both open) is the showcase state.

**Choice:** Option 1.

**Why:**
- Independent left/right toggles match the mental model (and the icon Viet shared) — collapse what you
  don't need. Far-left/far-right placement mirrors the panels they control.
- The grid switches between four literal column templates by open-state; collapsed panels are unmounted,
  so the layout truly reflows (not just hidden). Below 900px both panels stay hidden as before.
- Keyboard parity: `[` toggles the sidebar, `]` toggles the notes panel (added to the shortcut layer + help).

**How to apply:**
- `components/ui/PanelToggle.tsx` (fills the panel compartment when open). Wired in `AppBar`; state +
  dynamic `gridCols` in `AppShell`.
- If panel state should survive reload later, move `sidebarOpen`/`notesOpen` into `SettingsProvider`.

---

## 2026-05-29 — D017: Week + Day views on a shared time grid; day-anchored, view-aware navigation

**Context:** Week and Day views were placeholders. Viet wanted them built in the Month view's
editorial-calm language. Both are fundamentally the same surface — a time grid — at different widths.

**Options:**
1. One shared `TimeGridView` (header + all-day row + scrollable hour grid) driven by a `days[]` array;
   Week passes 7 days, Day passes 1. Anchor becomes a specific *day*; nav/title become view-aware.
2. Two separate hand-built components. Rejected: duplicates the hour grid, all-day row, and layout math.
3. A calendar/time-grid library. Rejected: new dep + fights the bespoke tokens (strategy §7).

**Choice:** Option 1.

**Why:**
- Day is Week with one column — a shared `TimeGridView` keeps them pixel-consistent and halves the surface
  area to maintain. WeekView/DayView are thin wrappers that just compute the day list.
- The anchor had to graduate from "a month" to "a specific day" so ←/→ and Today can step by
  month / week / day depending on the active view (`stepAnchor` in `useCalendarState`). URL is now
  `?v=&d=YYYY-MM-DD` (full date), still shareable and reload-safe (JTBD #2).
- Overlapping events are packed into side-by-side lanes (`lib/timegrid.ts`) so they never stack —
  the multi-event problem solved once, in pure logic, covered by both views.

**How to apply:**
- Grid: `components/calendar/TimeGridView.tsx` + `DayColumn.tsx` + `TimeEventBlock.tsx`; layout math in
  `lib/timegrid.ts` (`HOUR_PX`, `layoutTimedEvents`, `minutesOf`). Wrappers: `WeekView.tsx`, `DayView.tsx`.
- Consistency carried from Month: gold today ring, calendar-colored events, mono times, hairline borders,
  scroll-to-morning on open. All-day events sit in a row above the grid.
- Interactions: click an event → edit; click an empty hour slot → new event prefilled at that day+hour;
  click a week day-header → open that Day. Year view remains the only placeholder (12-month grid still to build).

---

## 2026-05-29 — D016: Global Settings — a persisted preferences store + dialog (first toggle: week numbers)

**Context:** Viet wanted a Settings surface — a centered popup (Esc / × / click-outside to close) where
users globally optimize the app. First option: **show week numbers** on the month view, toggle on/off.

**Options:**
1. A `SettingsProvider` Context holding global prefs, persisted to `localStorage`; a `SettingsDialog`
   reusing the existing `Dialog` primitive; a reusable `Toggle` switch.
2. Fold settings into the existing `DataProvider`. Rejected: prefs aren't calendar *data* — different
   lifecycle and concern (data is session-only D001; prefs persist).
3. Local component state. Rejected: not global, not persisted — fails "optimize globally."

**Choice:** Option 1.

**Why:**
- Settings are global, cross-cutting prefs with their own persistence — a dedicated provider keeps them
  cleanly separate from calendar data (`DataProvider`) and theme (`useTheme`), and gives later toggles a home.
- Reusing the `Dialog` primitive means the Settings popup inherits centered layout, Esc, click-outside,
  autofocus, and the new **×** close for free — one consistent modal pattern across the app.
- **Week numbers** are computed (ISO 8601, `getISOWeek` in `lib/date.ts`) keyed off each row's Thursday,
  so the number is correct for the Sunday-start grid. Rendered as a left gutter column only when enabled.

**How to apply:**
- Store: `components/providers/SettingsProvider.tsx` (`useSettings()`), persisted under `localStorage["settings"]`,
  wraps `<AppShell>` in `app/page.tsx`. Dialog: `components/layout/SettingsDialog.tsx`. Switch: `components/ui/Toggle.tsx`.
- Open via the AppBar gear, or the `,` shortcut (added to the keyboard layer + shortcut help).
- The `Dialog` close affordance is now an **×** icon (was "esc" text) — applies to all dialogs.
- New global prefs go in `Settings` (add a field + default + a `SettingRow` in the dialog). Keep them prefs, not data.

---

## 2026-05-29 — D015: `build-tracker.md` is a live, agent-maintained status board

**Context:** Viet (CEO) wanted a flat, scannable "what's built / what's owed" view to decide focus from —
faster than reading the phased `roadmap.md`. The question was who keeps it current so it doesn't drift.

**Options:**
1. Agent-maintained board with clear ownership: Engineer owns Status, Design + Strategist file debts,
   Viet reads it to prioritize. Codify into each agent's critical path.
2. Viet-maintained — he updates it himself. Rejected: capture-heavy, output-light risk; it would rot.
3. Auto-generated from roadmap/agents-log. Rejected: premature tooling (L4); we're holding at L1+L3.

**Choice:** Option 1.

**Why:**
- Each agent already touches the relevant signal during its review — folding the update into the existing
  critical path costs ~one line per review and keeps the board honest without new ceremony.
- Debts named only in `agents-log.md` get buried; a standing Debts table keeps them in Viet's eyeline with
  a priority, which is the actual decision surface he asked for.
- Clean ownership mirrors the project's role model (D004/D007): agents surface, the CEO decides.

**How to apply:**
- **Engineer** flips feature Status (⬜→🟡→✅) after each build review + files build debts. (Critical-path step 7.)
- **Design** files design debts (craft / IxD / a11y / microcopy / motion). (Critical-path step 9.)
- **Strategist** files strategy debts (scope drift / positioning / anti-goal risk). (Critical-path step 10.)
- **Viet** reads the Debts table, sets/overrides priority (P1/P2/P3), decides focus. Consumes, doesn't maintain.
- A debt closes when its owner (or Viet) marks it Addressed + dated; Engineer reflects the feature status.

---

## 2026-05-29 — D014: CRUD via a dedicated in-memory store (Context), not lifted ad hoc

**Context:** Events and notes needed full create/edit/delete. The Engineer note from the foundation
pass warned against bolting CRUD onto `useCalendarState`. v0.1 stays mock-only (D001) — writes persist
for the session, no DB.

**Options:**
1. A dedicated `DataProvider` React Context holding events + notes, exposing add/update/delete; one editor
   `Dialog` primitive + `EventDialog` / `NoteDialog` forms.
2. Lift event/note arrays into `AppShell` and prop-drill setters — fewer files, but couples view-state
   and data-state and drills through every layer.
3. Add a state library (Zustand/Jotai) — rejected; new runtime dep needs justification (strategy §7) and
   the store is small.

**Choice:** Option 1.

**Why:**
- Multiple consumers across the tree (MonthView, Sidebar counts, NotesPanel) read the same data — a
  Context store gives one home and avoids prop-drilling, exactly the separation the Engineer asked for.
- Keeping the store seeded from `lib/mock-data.ts` means v0.2 swaps the seed + actions for Supabase
  calls with no change to consumers.
- One `Dialog` primitive (overlay, Esc, click-outside, autofocus) keeps both editors consistent and
  accessible without a component library.

**How to apply:**
- Store: `components/providers/DataProvider.tsx` (`useData()` hook); wraps `<AppShell>` in `app/page.tsx`.
- Events: visible "+ New event" primary action (Design's ask) + `N` shortcut + click a day cell (create)
  / click an event (edit) → `EventDialog`. Notes: "+ New note" (create) / click a card (edit) → `NoteDialog`.
- New notes are scoped to the **visible month** automatically (the wedge: time-scoped notes).
- Theme bootstrap moved to an **external** `public/theme-init.js` via `next/script beforeInteractive` —
  React 19 warns on *inline* scripts rendered through the tree; external avoids it, keeps no-flash, stays static.
- When v0.2 lands persistence, replace the store's seed + actions with Supabase; consumers unchanged.

---

## 2026-05-29 — D013: Editorial-calm dark palette (warm-neutral darks, not pure black)

**Context:** The wireframe (`v0-month-view.html`) is light-only, but the PRD (§5) requires light
**and** dark mode respecting system preference. Dark needed a deliberate palette, not an inversion.

**Options:**
1. Warm-neutral dark palette (`--bg #16150f`), calendar colors *lifted* for contrast on dark.
2. Pure-black OLED dark (`#000`) — higher contrast, but cold and harsh; fights the editorial-calm voice.
3. Auto-invert the light palette — fast, but muddy and off-brand.

**Choice:** Option 1.

**Why:**
- "Calm" reads warmer than pure black; warm-neutral darks keep the editorial register in both themes.
- Saturated-but-muted calendar colors go muddy on dark — they must be lifted (teal `#2e4756`→`#7fa8be`,
  clay `#a87854`→`#cd9c74`, slate `#6b7c8f`→`#9fb2c4`) to stay legible as event chips.
- Both palettes must clear WCAG 2.1 AA (strategy §7). Light `--text-3` darkened `#8a8780`→`#76736c`
  to clear AA on `--bg` (flagged in the wireframe Design review).

**How to apply:**
- Tokens live as CSS variables in `app/globals.css`; dark values under `[data-theme="dark"]`.
- Theme is set before paint by a bootstrap script in `layout.tsx` (no flash); `useTheme` owns toggle +
  `localStorage` persistence; first load honors `prefers-color-scheme`.
- Every new color must be defined in both themes. Adding a one-theme color is a bug.

---

## 2026-05-29 — D012: Mock data model — shaped for the future, mocked for now

**Context:** v0.1 is mock-only (D001), but the Research readout
(`Research/2026-05-29-calendar-user-pain-points.md`) warned that source-calendar, visibility, and
recurrence are structural — retrofitting them later "breaks every row." Needed the *shape* now.

**Options:**
1. Encode forward-looking shape on mock data (per-event `calendarId` + `visibility`; notes keyed by
   time-unit scope), without building the behavior.
2. Minimal mock shape (title + date only) — least code now, painful migration in v0.2.
3. Full engine now (RRULE, real visibility logic) — out of scope for v0.1, weeks of work.

**Choice:** Option 1.

**Why:**
- Cheap insurance: a `visibility` field and a visible `calendarId` cost nothing today and de-risk v0.2.
- The wedge is **time-scoped notes**, so notes are keyed by `{unit, key}` (e.g. `month:"2026-05"`),
  many notes per unit, two types (`decision` | `daily`) — matching strategy §2.
- Recurrence is represented as expanded mock instances (no RRULE engine — PRD out-of-scope), but the
  type leaves room for it.
- **Showcase anchor:** "today" is pinned to a fixed `TODAY = 2026-05-29` in `lib/mock-data.ts` so the
  hand-crafted month always lines up, rather than real `new Date()` opening on an empty current month.

**How to apply:**
- Types in `lib/types.ts`; data in `lib/mock-data.ts`; scope filter in `lib/notes.ts`; event grouping in
  `lib/events.ts`. Every event carries its source calendar and is always color-tagged in the UI.
- When v0.2 adds persistence, these types map onto Supabase rows with no reshape of the UI layer.

---

## 2026-05-29 — D011: Client view-state mirrored to URL (not hard view routes)

**Context:** Roadmap (Phase 2) left it open whether views are real routes (`/d /w /m /y`) or a param.
JTBD #2 — "switch zoom without losing my place" — and the keyboard layer (D/W/M/Y) make this load-bearing.

**Options:**
1. Single route `/`; view + anchor date in React state, mirrored to URL search params
   (`/?v=m&d=2026-05`) via `history.replaceState`.
2. Hard route segments `/d` `/w` `/m` `/y` — each a real navigation.
3. Pure in-memory state, no URL — simplest, but not shareable and lost on reload.

**Choice:** Option 1.

**Why:**
- Keyboard view-switching must be instant; full route navigation per keypress is the wrong feel
  (violates the <200ms transition budget and the "smooth interactions" principle).
- URL mirroring keeps the view **shareable and reload-safe** (JTBD #2) without a navigation cost.
- `replaceState` (not `pushState`) avoids polluting browser history on every D/W/M/Y press.

**How to apply:**
- Owned by `hooks/useCalendarState.ts`: `view`, `anchor`, `visible` calendars, URL sync, nav actions.
- `/` with no params defaults to month + `TODAY`. Invalid params fall back gracefully.
- Revisit only if deep-linking to a specific event/day later needs a richer URL grammar.

---

## 2026-05-29 — D010: Move project to `/05 PRACTICE/Calendar app`

**Context:** Project was scaffolded inside Cowork's auto-managed scratchpad area. Viet wanted notes — and the rest of the project — to live in his personal organized workspace.

**Options:**
1. Move the entire project to `/05 PRACTICE/Calendar app`. New canonical root.
2. Move only the 7 notes; leave Agents/, wireframes/, etc. in old location.
3. Mirror notes (keep both copies in sync).

**Choice:** Option 1.

**Why:**
- The `/05 PRACTICE/` parent matches Viet's organizational convention (numeric prefixes, intentional naming).
- One canonical location avoids cross-reference fragmentation between two folders.
- Old location was Cowork's default scratchpad — not where finished work belongs.

**Tradeoff:** Old folder remains as a snapshot until Viet manually deletes it (sandbox can't delete the old project files). Old `CLAUDE.md` rewritten as a tombstone redirect so any future Claude session there knows to switch context.

**How to apply:**
- All work now happens in `/Users/vietnguyen/Documents/05 PRACTICE/Calendar app`.
- All cross-references in agent files, context-primer, CLAUDE.md remain relative — they resolve correctly inside the new folder.
- Memory updated to point at the new canonical location.
- Viet deletes the old folder when convenient.

---

## 2026-05-29 — D009: Lock Vision + Mission at top of `strategy.md`

**Context:** Strategy doc had thesis, wedge, positioning, anti-goals, voice, constraints — but no explicit Vision or Mission. Viet (CEO) named the goal: "create the world-class calendar." That ambition needed to be codified above the strategy mechanics.

**Options:**
1. Add Vision + Mission as new top-of-document sections in `strategy.md` (above §1 Thesis).
2. Create separate `vision-mission.md` file.
3. Fold into PRD §1 Purpose.

**Choice:** Option 1.

**Why:**
- Vision + Mission are load-bearing; they belong in the same one-page doc every agent reads.
- Separating them into their own file fragments the canonical reference.
- PRD changes often; Vision + Mission rarely should — wrong altitude.
- Sections inserted unnumbered above §1 so existing cross-references (`§5 Anti-goals`, `§6 Voice`, `§7 Constraints`) don't break.

**Vision (locked):**
> The default calendar for knowledge workers who plan in prose — where time and thinking live on one surface, and you never reach for a separate notes app to decide, remember, or reflect.

**Mission (locked):**
> Build the calendar that proves time and thinking belong together. World-class craft, calm pace, every minute earned through clarity — not engagement tricks. Beat Apple Calendar on calm and Google Calendar on warmth.

**How to apply:**
- Every "should we build X" question gets weighed against Vision first, then anti-goals, then phase boundary.
- Strategist agent enforces. If a proposal moves away from Vision → Sharpen or Kill.
- Vision/Mission rarely change. If they do, log a new D-entry — don't edit silently.

---

## 2026-05-29 — D008: Hire Research agent (scout + synthesize, no judging)

**Context:** Viet asked whether to add a 4th agent. All three current agents weighed in (logged in the conversation, summary in `agents-log.md` next session). Strategist Approved with hard scope; Engineer warned on single-responsibility; Design demanded the readout format be the contract.

**Options:**
1. Hire Research agent with reframed scope (scout + synthesize, no judging, no editing).
2. Keep Viet's original pitch (Research challenges other agents directly + agents "learn") — rejected for loop risk and vagueness.
3. Don't hire — we're not overburdened yet.

**Choice:** Option 1.

**Why:**
- Today's Kashef synthesis was a research-style task; formalizing the role now prevents ad-hoc drift later.
- Reframed scope (scout-only, no judging) keeps clean role separation — Research informs, the other three judge.
- Structured 1-page readout format gives every readout a consistent contract. Without it the doc dies on the page.
- Saved to `Research/YYYY-MM-DD-topic.md` for traceability.

**Tradeoff:** A 4th agent adds maintenance overhead. Mitigated by a **tripwire**: if Research is invoked 0 times in the next 3 working sessions, kill it. Don't keep scaffolding that doesn't fire.

**How to apply:**
- Invoke by name: "Research, scan X" / "Research, do a readout on Y."
- Every readout ends with **Implications per agent** + **Recommended adaptations** (specific file edits).
- Viet routes implications to the relevant agent. Research never lobbies.
- Research has Read, Grep, Glob, WebSearch, WebFetch. **No Edit** — Research doesn't write code or modify other agents' files.
- First scheduled use case: aesthetic philosophy readout (when Viet calls for it).

---

## 2026-05-29 — D007: Rename "CEO agent" → "Strategist." Viet is the CEO/founder.

**Context:** Naming friction surfaced — the agent labeled "CEO" was doing Strategist work (concept challenge, scope discipline, tradeoff naming). Viet is the actual CEO/founder of the project. The "CEO" label on an advisor agent created implied hierarchy that doesn't reflect reality.

**Options:**
1. Rename "CEO agent" → "Strategist." Mark Viet explicitly as CEO/Founder in CLAUDE.md and context-primer.
2. Keep "CEO" label — treat it as a fun internal alter-ego.
3. Rename to something else (Advisor, Chief of Staff, etc.).

**Choice:** Option 1.

**Why:**
- Roles in a multi-agent system need clean ownership. Viet is the CEO; agents are his bench. Sharing a label collapses that hierarchy.
- "Strategist" names what the agent actually does — concept challenge, scope discipline, tradeoffs — rather than borrowing a hat.
- Future-Viet reading the system in 6 months will not have to mentally translate "which CEO does this mean."

**Tradeoff:** Light refactor across CLAUDE.md, context-primer, Agents/, dashboard. Acceptable — done on day 1, no momentum lost.

**How to apply:**
- Agent definition: `Agents/strategist.md`. `Agents/ceo.md` retained as a tombstone redirect.
- Invocation: "Strategist, challenge X."
- All forward-looking agents-log entries use "Strategist."
- Historical entries (D004-D006, prior agents-log entries) preserved as-is. The rename is captured here.
- New section in CLAUDE.md + context-primer makes Viet's CEO/founder role explicit.
- Founder's prerogative — Viet can override any agent verdict, but only on the record (logged in this file).

---

## 2026-05-29 — D006: Adopt critical paths + context-primer + L1-L4 audit (from Mark Kashef synthesis)

**Context:** Reviewed Mark Kashef's Agentic OS video. Asked: what fits our scale and problem class? Three agents weighed in (logged in `agents-log.md`).

**Agent verdicts:** CEO Approved (partial) · Engineer Ship-with-notes · Design Ship-with-notes.

**Options:**
1. Adopt three patterns — critical paths in each agent, `context-primer.md`, L1-L4 audit line in CLAUDE.md.
2. Adopt all of Mark's framework wholesale (hooks, orchestrator, /silver-platter skill, data map HTML).
3. Adopt nothing — our system is already enough.

**Choice:** Option 1.

**Why:**
- Mark's video targets consultancy clients with disparate business data. Our problem class is solo cognition, not data integration. Different problem.
- The three adopted patterns close real gaps: agents had personas but no SOPs; new sessions had to re-read 7 files to load context; the project had no diagnostic for where it sits on the agentic stack.
- Rejected: hooks (premature — no code to gate yet), orchestrator (3 agents with explicit invocation doesn't need routing), `/silver-platter` skill (built for users with 38 skills + 16 rules; we have 0 of each), consultancy framing (different problem class).

**Tradeoff:** Each agent file ~25% longer; CLAUDE.md has a new audit section. Acceptable — the repetition pays back on every agent invocation.

**How to apply:**
- Every agent invocation now follows the Critical path step-by-step. No skipping steps = no valid review.
- Every new Claude session reads `context-primer.md` first. Drills deeper only on demand.
- Re-audit the L1-L4 stack at end of Phase 2 (post-shell + tokens).
- Hooks, orchestrator, audit skills stay deferred until a real burden appears.

---

## 2026-05-29 — D005: Adopt `strategy.md` as standing root note

**Context:** Question raised — does the project need a strategic-logic doc separate from PRD? Sent to all three agents.

**Agent verdicts:** CEO Approved-with-sharpening · Engineer Ship-with-notes · Design Ship-with-notes (logged in `agents-log.md`).

**Options:**
1. New `strategy.md` at root (one page, six sections).
2. Expand PRD §2 ("Why this exists") in place — no new file.
3. No new doc — strategy lives implicitly in PRD + decision-log.

**Choice:** Option 1.

**Why:**
- PRD is "what we're building." Strategy is "why this exists and how it wins." Different audiences — designer/dev vs. founder/hiring manager.
- A 1-page strategy doc settles every "should we build X" debate before it restarts. Single source of truth for thesis, wedge, positioning, anti-goals, voice, constraints.
- For a portfolio piece, `strategy.md` is part of the showcase — a hiring manager reads it in 60 seconds and gets it.

**Tradeoff:** One more doc to keep updated. Acceptable — strategy changes rarely; PRD changes often.

**How to apply:**
- `strategy.md` joins `decision-log.md` and `daily-log.md` as standing root notes.
- Every agent reads it before acting (added to their sources of truth in next agent update).
- Anti-goals section is binding — CEO kills features that drift toward it.
- Voice section is binding — Design enforces it on every UI review.
- Constraints section feeds back into Engineer's review checklist.

---

## 2026-05-29 — D004: Three opinionated agents as quality gates

**Context:** Solo 0→1 project. Risk: Viet's own blind spots ship to production. Need standing reviewers across three lenses without hiring.

**Options:**
1. Three subagents in `Agents/` — Engineer, CEO, Design — each with its own system prompt, scope, and tool list.
2. Personas Claude adopts on demand (lighter, faster, less rigorous).
3. Mix (subagents for review, personas for quick checks).

**Choice:** Option 1 — three subagents, project-scoped.

**Why:**
- Each agent is a distinct lens with non-overlapping mandates → forces clean separation of concerns.
- Subagent files travel with the project as portfolio artifacts (shows systems thinking).
- Each agent reads `CLAUDE.md` + `PRD.md` + `decision-log.md` before acting → grounded, not generic.
- Output format is structured (verdict + findings + next) → feeds the dashboard cleanly.

**Tradeoff:** More setup than personas. Acceptable — the prompts are reusable and the rigor pays back on every review.

**How to apply:**
- Before any code change → invoke Engineer.
- Before any scope change → invoke CEO.
- After any UI work → invoke Design.
- All three append to `agents-log.md`. Dashboard cowork artifact `agents-dashboard` visualizes activity.
- Agents respect locked decisions. Violating a locked decision = automatic Block.

---

## 2026-05-29 — D003: Single-user showcase, not multi-user

**Context:** v1 audience question. Demo for portfolio vs. real shared product.

**Options:**
1. Single-user — only Viet. Shared calendars mocked.
2. You + a few invited people (Erich, etc.) — real shared logic.
3. Public multi-user product — open signups.

**Choice:** Option 1.

**Why:**
- Auth + invites + permissions = weeks of work before any visual payoff.
- "Shared with Erich" can be demoed entirely with mock data and a name label.
- Multi-user is the v1.0 upgrade path, not the v0.1 cut.

**Tradeoff:** No real validation of sharing UX in v0.1. Acceptable — sharing is a known pattern, not the wedge.

---

## 2026-05-29 — D002: Stack = Next.js + Supabase

**Context:** Backend + data layer choice for Vercel deploy.

**Options:**
1. Next.js + Supabase (Postgres + auth + realtime)
2. Next.js + Vercel Postgres + NextAuth (all-Vercel)
3. Next.js + Convex (reactive backend)
4. Pure frontend, no backend

**Choice:** Option 1 — Next.js + Supabase.

**Why:**
- Auth, Postgres, realtime, file storage in one SDK. No glue.
- Free tier handles showcase load.
- Realistic upgrade path when v0.2 needs real persistence.
- Supabase auth supports Google OAuth out of box — when v0.2 lands, half the integration is done.

**Tradeoff:** Two providers (Vercel + Supabase) instead of one. Acceptable — Vercel's Postgres is younger and less feature-complete.

---

## 2026-05-29 — D001: v0.1 = polished UI prototype with mock data

**Context:** First ship target. How real does v0.1 need to be?

**Options:**
1. Polished UI prototype, mock data — portfolio-grade visuals, no OAuth.
2. Functional MVP — real Google OAuth + notes + D/W/M views.
3. Full vision v1 — Google + Apple + groups + all views + notes.
4. Decide after wireframes.

**Choice:** Option 1.

**Why:**
- The differentiator is the *experience*, not the integration. Mock data lets us craft a perfect day-in-the-life narrative we control.
- OAuth + sync bugs eat weeks. We don't have that budget yet.
- Real integration becomes credible once the UI is irresistible. Reverse order kills morale.
- Mock data is a content-design problem, which is in Viet's strike zone.

**Tradeoff:** "It's just a mockup" risk. Mitigation: hand-craft mock data so realistic it reads as live.

**How to apply:** If a v0.1 task requires real OAuth, real Google API, or real DB writes — it's v0.2. Push back.
