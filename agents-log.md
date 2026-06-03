# Agents Log

Every agent review, decision challenge, or critique gets one entry here. Newest at top.

## Format
```
## YYYY-MM-DD HH:MM — <Engineer | Strategist | Design>
**Target:** <what was reviewed>
**Verdict:** <Ship | Ship with notes | Block | Approved | Sharpen | Kill | Park>
**Findings / Reasoning:**
- <bullets>
**Next:** <one action>
```

*Note: "Strategist" was named "CEO" in entries before D007 (2026-05-29). Historical labels preserved as-is.*

---

## 2026-05-30 13:30 — Engineer
**Target:** Calendar Sets build (D029) — `CalendarSet` type, `calendarSets` CRUD, `applyCalendars`, `Sidebar` SETS section, `CalendarSetDialog`.
**Verdict:** Ship

**Findings:**
- Clean separation: sets are *preferences* → live in `SettingsProvider` (persisted), not the session calendar state. `applyCalendars` mutates only visibility. No new coupling.
- **Active set is derived** (match `visible` to ids), not a stored id — one source of truth, can't desync. No `any`; back-compat via `{...DEFAULTS}` merge so the seeds appear for fresh users.
- **Correct call: dialog rendered at AppShell root, not in the Sidebar.** The sidebar sits inside the panel's `translate-x` wrapper; a `position:fixed` modal there would be trapped by the transform. Matches every other dialog.
- Reuses the `Dialog` primitive (autofocus title, ⌘↵ save, entry motion). Build static, fresh-console clean.

**Next:** When real persistence lands (DBT-02), sets already persist — events/notes should join them.

## 2026-05-30 13:25 — Design
**Target:** Calendar Sets — sidebar UX (D029).
**Verdict:** Ship

**Findings:**
- The flow reads as intended: SETS above the raw calendar toggles (lens above its controls), filled-dot active marker echoing the calendar checkboxes, quiet `+` and hover-pencil (no per-row clutter). "All calendars" as the always-present default — no empty-state nag.
- Applying a set visibly updates the checkboxes *and* the grid — the cause/effect is legible. Manual toggle → "Custom" (nothing highlighted) is honest.
- Create/edit dialog matches the rest (autofocus name, color-swatch checklist mirroring the sidebar). Editorial voice intact.

**Accessibility:** Pass — sets are labelled buttons with `aria-current`; pencil reachable via `focus-visible`.
**Next:** None.

## 2026-05-30 12:45 — Strategist
**Target:** "Custom views" — let users save a named combination of calendars (e.g. "Personal" = Personal + Shared·Erich).
**Verdict:** Approved — with a tight definition

**Reasoning:**
- It's a **saved filter**, not a new surface. Reframe it that way and it's cheap, craft-y, and on-thesis (less noise, less click-depth — `Research §insights`). A power user carrying ≥2 calendars wants to flip between lenses ("just my life", "just work") without re-toggling. Real job.
- **Anti-goal check — passes**, *if* scoped to "a named set of calendars." It must NOT grow into per-view layouts, per-view colors, sharing, or a "workspace" — that's project-manager/team drift (`strategy §5`). One concept: name + which calendars. Full stop.
- Naming risk: "view" already means D/W/M/Y (zoom). Two meanings of "view" in one product is a tax. Recommend a distinct word — **"Calendar sets"** or **"Groups"** — internally and in the UI, even if Viet thinks of them as views.
- Cheapest falsification: seed 1–2 sets, see if flipping between them feels better than the checkboxes. If it doesn't earn its space in the sidebar, cut it.

**Next:** Build as named calendar sets (name + member calendars), persisted; seed examples; resist every feature past that line.

## 2026-05-30 12:50 — Design
**Target:** UX flow for custom calendar sets.
**Verdict:** Ship with notes (build the flow below)

**Findings:**
- **Placement:** a "GROUPS" (or "VIEWS") section *above* "Calendars" in the sidebar — the lens sits above the raw toggles it controls. Default row "All calendars" (everything on). Custom sets below; active one marked (accent dot/fill, like the calendar checkboxes).
- **Create:** a small "+" by the section header → reuse the `Dialog` primitive: name field (autofocus, per D027) + a checklist of calendars (the same color swatches as the sidebar). Save / Cancel. New set becomes active.
- **Apply:** clicking a set sets calendar visibility to its members; the Calendars checkboxes below update to match. Manually toggling a calendar drops you to an unnamed "Custom" state (no set highlighted) — honest, not sticky.
- **Edit/Delete:** click an active set's name (or a hover affordance) → same dialog with a Delete. Keep it quiet — no per-row buttons cluttering the list.
- **Voice/empty state:** before any set exists, show only "All calendars" — no empty-state nag.
- Must clear `aria-current` on the active set; sets are buttons.

**Next:** Confirm the term (Groups vs Views) with Viet, then build: a persisted `calendarSets` store + sidebar section + a create/edit dialog reusing `Dialog`.
**Target:** Agenda (list) Week style + Settings switch (D028).
**Verdict:** Ship

**Findings:**
- The reference was adapted, not aped — exactly the brief ("prioritize our look"). Mono day numbers, our calendar-color bars, 24h mono times, gold today *dot* (vs the reference's red), dashed `border-faint` separators. Reads unmistakably as our product in a new shape.
- Airy and calm: generous row rhythm, "No events" stated plainly (voice), event titles tint to accent on hover. Good restraint.
- Consistent system: a second view-style toggle that mirrors the Year pattern (D021); folding both onto one `SegmentRow` keeps Settings tidy and scalable. Interactions match the app (event→edit, day→Day).

**Accessibility:** Pass — date and events are labelled buttons; the agenda is keyboard-reachable and screen-reader-linear (arguably more so than the time grid).
**Next:** None. If a third Week style is ever proposed, push back unless it earns its place — two is plenty.

---

## 2026-05-30 11:25 — Design
**Target:** Dialog opens on title + ⌘↵ to save (D027).
**Verdict:** Ship

**Findings:**
- Real friction removed: the editor opened with focus on the × button, so you had to click into the title. Now it lands on the title and selects existing text — type-to-create, edit-to-replace, no extra click. This is exactly "smooth interactions over flashy ones."
- ⌘/Ctrl+Enter is the conventional commit and works from the note body textarea too (where plain Enter is a newline). Plain Enter on single-line inputs still quick-saves — both paths feel natural.

**Accessibility:** Pass — focus is explicit and predictable on open; save reachable by keyboard without reaching for the mouse.
**Next:** None.

---

## 2026-05-30 11:00 — Design
**Target:** Week numbers across D/W/Y (D026).
**Verdict:** Ship

**Findings:**
- The toggle now behaves globally: a quiet "W{n}" in the day/week gutter corner and a faint week column in the year-grid mini-months. All subtle (`text-faint`), so density holds — doesn't fight the calm overview.
- Consistent source (`getISOWeek`, Thursday rule) means M/D/W/Y all agree — no off-by-one between views.
- Year **columns** style correctly left out — its rows are day-of-month, so a week column would be meaningless. Good restraint; the grid style satisfies "Y". Worth a one-liner if a "week numbers" help ever ships.

**Accessibility:** Pass (decorative labels; no interaction change).
**Next:** None.

---

## 2026-05-30 10:35 — Design
**Target:** Dialog entry motion (D025) — closes DBT-06.
**Verdict:** Ship

**Findings:**
- The event editor (and all dialogs + shortcuts overlay) now ease in — overlay fade + a subtle panel lift/scale, 200ms ease-out. Reads as intentional, not flashy; squarely on the "smooth interactions over flashy ones" principle. Closes the long-standing DBT-06.
- Entry-only with instant exit is a defensible, consistent call (all close paths behave the same). The abruptness flagged was the open — fixed.
- Verified the panel genuinely interpolates (mid-fade opacity 0.27 → 1), and reduced-motion users get it instantly via the global block.

**Accessibility:** Pass — motion respects `prefers-reduced-motion`; focus still lands in the panel on open.
**Next:** Only remaining motion nicety is symmetric exit + a view-switch cross-fade — both optional, not blocking.

---

## 2026-05-30 10:10 — Design
**Target:** Navigation model (focus vs zoom) + selected-day marker (D024).
**Verdict:** Ship

**Findings:**
- The right model: mini-month moves *focus* and keeps the zoom — matches every mainstream calendar's mini-navigator and removes the jarring forced jump to Day. Drill-downs (Year/Week) correctly still change zoom. The distinction (always-present navigator vs overview→detail content) is principled and consistent.
- The selected-day marker is the polish that makes it legible: **today = gold ring, focus = soft accent fill** is a clean two-token language, reused identically across Month, mini-month, Week/Day header, and both Year styles. When focus == today the ring wins — no muddy double-mark. Holds the calm voice.
- Focus persisting across view switches makes the anchor feel like one coherent cursor through time. Nice.

**Accessibility:** Pass — focused day carries `aria-current="date"`; today and focus are distinct, not color-only-on-color.
**Next:** None. (A future cross-fade on view switch — DBT-06 — would make the focus move feel even smoother.)

---

## 2026-05-30 09:40 — Design
**Target:** Clickable sidebar mini-month dates → jump to Day.
**Verdict:** Ship

**Findings:**
- Mini-month is now a real navigator, not decoration — clicking any date opens that Day, matching the Week day-header and Year-grid pattern (one consistent "click a date → see that day" model). Good.
- Adds the hover affordance the wireframe review flagged (finding #5) — closes that long-standing gap. Today keeps its ring; faded adjacent-month days are clickable too (they're real dates).

**Accessibility:** Pass — each date is a labelled button (`aria-label` = ISO date).
**Next:** None.

---

## 2026-05-30 09:15 — Engineer
**Target:** View-scoped notes implementation (D022) — `noteScopeFor`, `NotesPanel`, `NoteDialog`, seed data.
**Verdict:** Ship

**Findings:**
- Clean: scope logic is one pure function `noteScopeFor(view, anchor)` → `{unit, key, label, tag}`; `NotesPanel` and `NoteDialog` both consume it, so the panel and the create-flow can't disagree on scope. No `any`.
- Data model needed no change — `scope: {unit, key}` (D012) already carried it; `notesForScope` already filtered on it. This was wiring, exactly as the forward-looking model intended. Satisfying.
- Week key = Sunday-start ISO date, computed the same way in `noteScopeFor` and the seed data — verified they match (week of May 29 → `2026-05-24`).
- Exact-scope only; no aggregation code paths added. Build static, fresh-console clean.

**Next:** None. The notes layer is feature-complete for v0.1.

---

## 2026-05-30 08:40 — Strategist
**Target:** Make the notes panel scope follow the active view — day note on D, week note on W, month on M, year on Y (currently month-only).
**Verdict:** Approved — highest-leverage thing on the board

**Reasoning:**
- This *is* the wedge. `strategy.md §2`: "Every view (D/W/M/Y) carries a notes panel scoped to that exact time unit." Right now we ship the claim with only one of four scopes live — the differentiator is 75% dark. It's also the literal Phase 5 exit ("switching M→W reloads the note panel to the relevant week. Feels obvious"). We deferred it; time to land it.
- First principles: the product's one reason to exist is "time + thinking on one surface." A notes panel that ignores the zoom level breaks that promise the moment a user switches views. Building it isn't scope creep — *not* building it is the gap.
- **Anti-goal guard (the one real risk):** do NOT let coarser views auto-aggregate finer notes ("here's your month, assembled from your days"). That's one step from the "AI-summarizer / your-week-in-review" anti-goal (`§5`). Notes are *written, not generated*. Recommend **exact-scope only** for v0.1: the week view shows notes authored at week scope, full stop. The two altitudes (decision log = deliberate, daily log = reflective) already give users the right level to write at.
- Tradeoff to name out loud: exact-scope means a month note won't surface the day notes inside it. That's intended — it asks the user to think at the altitude they're viewing. If recall-across-scopes becomes a real ask later, that's a v0.2 "notes timeline," not a v0.1 auto-roll-up.
- Cheapest falsification: seed mock notes at all four scopes and click D/W/M/Y. If switching doesn't feel "obvious," the scope indicator (Design's job) is the fix, not the model.

**Next:** Build it as exact-scope (no aggregation); keep decision/daily at every scope; seed cross-scope mock data so the demo proves the wedge. Log the scope-key scheme as a decision.

---

## 2026-05-30 08:45 — Design
**Target:** UX of view-scoped notes (D/W/M/Y) + what makes scope-switching "obvious."
**Verdict:** Ship with notes (build it; these are the make-or-break details)

**Findings:**
1. **[P4 — notes first-class]** This is the principle's whole point. Approve building. But the wedge only lands if the *scope is unmistakable* — the panel header must restate the exact unit and track the view: "Fri, May 29 · today" (D) / "May 24–30 · this week" (W) / "May 2026 · this month" (M) / "2026 · this year" (Y). The label is load-bearing, not decoration.
2. **[Demo reality]** All mock notes are month-scoped today, so W/D/Y would render empty and the feature would look broken in the 60-second demo. **Must seed a few real notes at each scope** (a day reflection, a week decision, a year intention) so switching D→W→M→Y visibly changes the panel. This is the single highest-risk item.
3. **[Empty states — voice]** Each scope needs a written, non-generic empty state: "Nothing for this week yet — what's it about?" not "No notes." (`strategy.md §6`.)
4. **[Microcopy]** "+ New note" must name the scope it writes into: "New note for this week" / "…for today" / "…for 2026". Otherwise users won't trust where it lands.
5. **[Motion]** Switching views should cross-fade the panel content (~150ms), not hard-swap — otherwise it reads as a page fl: ties into the open dialog/motion debt (DBT-06).
6. **[Hold the line]** Agree with Strategist: no auto-roll-up. Aggregating day notes into the month view would clutter the panel and break the "one clear altitude" feel. If anything, a *quiet* future affordance ("3 day-notes this week →") could hint at finer notes without showing them — v0.2.

**Accessibility:** scope label should be announced (it's the context for everything in the panel) — make it the panel's `aria-label`/heading.
**Next:** Build exact-scope; ship the four header labels + scope-aware empty states + "New note for {scope}" + cross-scope seed data. Cross-fade is a nice-to-have (DBT-06).
**Target:** `<body>` hydration fix + second Year style (`YearColumns`, `yearStyle` setting). (D021)
**Verdict:** Ship

**Findings:**
- **Hydration:** the mismatch was a `data-demoway-document-id` attribute injected on `<body>` by the preview/demo viewer before React hydrates — external tooling, not our code (absent in prod). `suppressHydrationWarning` on `<body>` is the correct, scoped fix (already on `<html>`). Verified: fresh-server console clean.
- **YearColumns:** pure render off `year` + injected `TODAY`; reuses `WEEKDAY_SHORT`/`isSameDay`/`isoDate`/`eventDateKey`, so weekday/today/event logic matches the rest. Both styles share one `eventDays` set. `yearStyle` merged into the persisted settings blob (back-compat via `{...DEFAULTS}`). No `any`. Build static.
- 372 day cells rendered — trivial. Empty cells (day > month length) are inert divs, not buttons. Good.

**Next:** None.

---

## 2026-05-30 07:45 — Design
**Target:** Linear-columns Year view + Settings segmented control.
**Verdict:** Ship

**Findings:**
- The planner reads cleanly — month columns, day+weekday per cell, weekends in a quiet `surface-soft` tint (not the loud blue of the reference — keeps the calm voice), today in `accent-soft`, a small accent event dot. Holds editorial register at high density.
- Settings segmented control matches the view-switch styling; copy ("Twelve mini-months, or a linear month-by-month planner") is plain and clear. Persisted choice is the right call for a durable preference.
- Both year styles share click-through (day → Day, month → Month), so the mental model is consistent.

**Accessibility:** Pass — day cells are labelled buttons; horizontal scroll for narrow widths.
**Notes:** Offering two layouts is a nice "suit your mindset" touch without over-configuring. Don't add a third without a reason.
**Next:** None.

---

## 2026-05-30 07:20 — Engineer
**Target:** ⌘N / ⌘⇧N shortcuts, `lib/quickAdd.ts` parser, `QuickAddDialog` (D020).
**Verdict:** Ship with notes

**Findings:**
- Shortcut layer now branches ⌘/Ctrl combos before the typing-guard; `e.code === "KeyN"` is shift-safe. `e.preventDefault()` on the combo — note that browser ⌘N (new window) may still win in some browsers; acceptable, in-app it fires.
- Parser is contained + pure (`parseQuickAdd(text, today)`), returns a discriminated `{...}|{error}`; no `any`. Year-default + roll-forward logic keys off injected `today` (testable).
- Recurrence expands 5 mock instances (year→+4) — matches D012; honest given no RRULE engine. Capped, no runaway.
- jump-to-date on create means the user actually sees the result. Build static, fresh-console clean.

**Note / carry-forward:** quick-add only parses *dates*, not times (all-day) and not weekly/monthly recurrence — fine for v0.1; expand the grammar when real recurrence lands. The 5-instance expansion is invisible to month/week filters beyond those years.
**Next:** Replace instance-expansion with a real recurrence field + view expansion in v0.2.

---

## 2026-05-30 07:05 — Design
**Target:** QuickAddDialog UX + updated shortcuts overlay.
**Verdict:** Ship

**Findings:**
- The live preview ("title · weekday, Month D, YYYY · REPEATS YEARLY") makes the parse legible *before* commit — turns an opaque NL box into something trustworthy. Strong call; matches the Research note that NL must be predictable, not magic.
- Reuses the `Dialog` primitive (Esc/×/click-outside, autofocus). Empty/date-less input shows a calm inline hint, not an error state. Voice holds.
- Shortcuts overlay now complete and consistent (⌘ / ⇧ glyphs).

**Accessibility:** Pass — labelled input, keyboard-submit (Enter), disabled Add until valid.
**Next:** None for this surface.

---

## 2026-05-30 06:40 — Design
**Target:** Year view — 12-month grid (`YearView`/`YearMonth`).
**Verdict:** Ship

**Findings:**
- Calm, familiar 12-month grid — holds the editorial voice, no engagement-style density viz. Today's gold ring is consistent with every other view. Event dots are a subtle, honest "thinking surface" signal.
- Click-through makes the year a launchpad (day → Day, month → Month) — discoverable, matches the week day-header pattern. Reads cleanly in light + dark.

**Notes:** No event dot color-coding by calendar (single accent dot) — correct call at this density; revisit only if users ask. Year-scoped notes still deferred (notes stay month-scoped).
**Accessibility:** Pass — day cells are labelled buttons; faded days disabled.
**Next:** None for this surface.

---

## 2026-05-30 06:30 — Engineer
**Target:** Year view build + `ViewPlaceholder` removal.
**Verdict:** Ship

**Findings:**
- Clean reuse: `getMonthGrid`/`monthLabel`/`WEEKDAY_INITIAL`/`eventDateKey` — no new date logic, so today/faded/event behavior matches the app exactly. Event-day set is memoized over events+visible.
- All four views now real; removed the dead `ViewPlaceholder` (no remaining refs). Build static, console clean on fresh load. No `any`.
- Note: Year renders 12 × 42 = 504 day buttons — trivial, but if a multi-year view ever lands, memoize per-month grids by key.

**Next:** None — view layer is feature-complete for v0.1 (pending polish + the open P1 debts).

---

## 2026-05-30 06:10 — Design
**Target:** Panel collapse motion — sidebar slides left, notes slides right.
**Verdict:** Ship

**Findings:**
- The pop-in/out I flagged at D018 is resolved: panels now slide (200ms width + translate, ease-out) and the canvas reflows in step — calm, intentional motion, not decorative.
- Direction maps to the panel side (sidebar ← left, notes → right), matching the toggle placement. Reduced-motion users get an instant change (global `prefers-reduced-motion` block covers it).
- Implementation is clean: always-mounted, overflow-clipped wrappers with animated width + Tailwind `translate`.

**Notes:** Dialog entry/exit motion (DBT-06) remains open — that's a separate surface. Apply the same easing/duration there for consistency.
**Accessibility:** Pass.
**Next:** Animate dialogs (DBT-06) with matching 200ms ease-out.

---

## 2026-05-30 05:45 — Design
**Target:** App bar layout regression (flagged by Viet) — "+ New event" wrapping + D/W/M/Y clipped.
**Verdict:** Ship with notes

**Findings:**
- **Root cause:** the app bar's fixed `grid-cols-[240px_1fr_240px]` couldn't hold the right cluster once the panel toggle was added — the 240px right column squeezed the New-event button (text wrapped to 2 lines) and clipped the view switch to just "D W". Filed DBT-08 + DBT-09.
- **Fix:** columns → `auto / 1fr / auto` so left/right size to content and the center flexes; `whitespace-nowrap` on the button and `shrink-0` on the switch as guards. Verified: button single-line, all four segments (D W M Y) visible at 1440px.

**Notes:** Adding any further app-bar control should keep the cluster content-sized — don't reintroduce a fixed right column. Both debts marked Addressed in `build-tracker.md`.
**Accessibility:** Pass.
**Next:** None — regression closed.

---

## 2026-05-30 05:20 — Design
**Target:** Collapsible side panels — `PanelToggle` icons + reflow (D018).
**Verdict:** Ship with notes

**Findings:**
- **[P1 — negative space]** Collapsing panels gives the calendar room without breaking the calm — far-left/far-right placement maps cleanly to the panel each controls. Good.
- **[IxD]** Icon fills its compartment when open (clear on/off affordance); `aria-pressed` + descriptive labels make it accessible. `[`/`]` keyboard parity is on-brand.
- **[Craft]** Collapsed panels unmount and the grid truly reflows (no empty gutters). Verified 240/880/320 → 1120/320 → 1440.

**Notes / carry-forward:**
- No slide/width transition on collapse — panels pop in/out. A motion pass (DBT-06) should animate this.
- Panel state is session-only; resets on reload. Fine for now (D018); persist via SettingsProvider if desired.

**Accessibility:** Pass.
**Next:** Animate panel open/close with the broader motion pass.

---

## 2026-05-30 04:10 — Design
**Target:** Week + Day views — `TimeGridView`, `DayColumn`, `TimeEventBlock`, view-aware AppBar title.
**Verdict:** Ship with notes

**Findings:**
- **[Consistency]** Both views speak the Month view's language — gold today ring, mono times, calendar-colored blocks, hairline borders. They read as one product, not three screens. Good.
- **[P1 — negative space]** Time grid opens scrolled to morning, hour labels are `text-faint`, all-day row only appears when there are all-day events. Calm holds.
- **[Craft]** Overlapping events lane-pack side by side instead of stacking — the detail most web calendars get wrong.
- **[IxD]** Slot-click-to-create and day-header-to-day are discoverable and match Month's click-to-create. Hover state on hour slots signals they're live.

**Notes / carry-forward:**
- No "now" line on today's column. Deliberate (mock TODAY vs real clock) but worth revisiting when data is real.
- Event blocks shorter than ~18min are floored to a min height — fine, but very short events hide their time. Low priority.
- Carry-forwards unchanged: motion (DBT-06), `role="grid"`/44px (DBT-04/05), multi-day spans in Month (DBT-03).

**Accessibility:** Pass for this surface (hour slots + blocks are labelled buttons; keyboard-reachable).
**Next:** Add a subtle current-time line once the data layer is real (v0.2).

---

## 2026-05-30 03:50 — Engineer
**Target:** Week/Day build — `TimeGridView`/`DayColumn`/`TimeEventBlock`, `lib/timegrid.ts`, `useCalendarState` refactor.
**Verdict:** Ship with notes

**Findings:**
- **Architecture — clean.** One `TimeGridView` driven by `days[]`; Week/Day are thin wrappers. No duplication of the hour grid or all-day row. Layout math isolated in `lib/timegrid.ts` (pure, testable).
- **Anchor refactor — sound.** Month→day anchor with `stepAnchor` makes ←/→ view-aware; URL `d` is now full ISO date. `goPrev/goNext` correctly depend on `view`. No regression to Month (verified).
- **Overlap packing — correct.** Greedy lane assignment within transitive-overlap clusters; widths split evenly. Handles the common sequential case at full width.
- **Type safety — clean.** `PlacedEvent` typed; no `any`. `GridDay` reused for day headers.
- **Perf — fine.** `layoutTimedEvents` memoized per column; 24 slot buttons × 7 columns is trivial. Build static, console clean on fresh load.
- **Note — fixed 24h render.** Each column renders all 24 hours (168 slot buttons in week). Acceptable now; if perf ever bites, virtualize or clamp the visible hour range.
- **Note — `addHour` wraps at 24** (23:00 → 00:00 end). Cosmetic for now; revisit with end-after-start validation (carried from DBT-07).

**Next:** Fold the end-after-start + 24h-wrap validation into `EventDialog` when the time grid makes bad ranges visible.

---

## 2026-05-30 02:40 — Design
**Target:** Settings popup + week-number gutter + Toggle + `Dialog` × close.
**Verdict:** Ship with notes

**Findings:**
- **[Consistency]** Settings reuses the `Dialog` primitive — same centered modal, Esc, click-outside as Event/Note dialogs. The new **×** close is clearer than the old "esc" text and now applies everywhere. Good.
- **[P1 — negative space]** Week-number gutter is restrained — `text-faint`, narrow 36px column, only present when enabled. Doesn't crowd the grid. Holds the calm principle.
- **[Voice]** Setting copy ("Show the week number beside each row in the month view.") is plain and editorial. Good.
- **[a11y]** `Toggle` is a real `role="switch"` with `aria-checked` + label; keyboard-operable. Settings reachable by gear *and* `,`.
- Note: week numbers don't appear in the mini-months — correct call (would crowd), but worth a one-line mention in any future "week numbers" help so it's not read as a bug.

**Accessibility:** Pass (for this surface; global carry-forwards DBT-04/05 unchanged).
**Next:** When a second setting lands, group settings under labeled sections so the dialog scales without becoming a wall of toggles.

---

## 2026-05-30 02:20 — Engineer
**Target:** Settings feature — `SettingsProvider`, `SettingsDialog`, `Toggle`, `getISOWeek`, MonthView gutter, `,` shortcut.
**Verdict:** Ship with notes

**Findings:**
- **Architecture — correct.** Global prefs live in their own `SettingsProvider` (persisted `localStorage["settings"]`), cleanly separate from `DataProvider` (session data) and `useTheme`. Matches the separation logged in D016.
- **Type safety — clean.** `Settings` interface + defaults merged on hydrate (`{...DEFAULTS, ...parsed}`) so adding a field won't break stored blobs. No `any`.
- **`getISOWeek` — correct.** Standard ISO 8601 (Thursday-anchored); MonthView keys off each row's Thursday (`week[4]`), right for a Sunday-start grid. Verified 18–22 for May 2026.
- **Layout — sound.** Week gutter via dynamic `gridTemplateColumns` + `display:contents` row wrappers; no extra DOM cost when off. Build stays static (`○ /`).
- **Console — clean on fresh load.** The React inline-script warning is dev-HMR accumulation only; verified zero on a restarted server. No action.
- **Note — minor coupling.** `setShowWeekNumbers` depends on `settings` (whole object) so its identity changes each toggle. Fine at this size; if settings grow, switch to a functional updater to keep action identities stable.

**Next:** Use a functional state updater in `SettingsProvider` before adding more toggles, to avoid stale-closure churn.

---

## 2026-05-30 01:15 — Design
**Target:** Event + Note CRUD UI — `EventDialog`, `NoteDialog`, `Dialog` primitive, "+ New event" action.
**Verdict:** Ship with notes

**Resolved:**
- **[P3 — primary action]** The "New event" button Design flagged twice (wireframe + foundation pass) now exists in the AppBar, accent-styled, with an `N` hint. ✓
- **[Wedge]** Notes are now *writable*, not just displayed — and new notes auto-scope to the visible month. The wedge is interactive. ✓
- **[Voice]** Microcopy holds the calm/editorial register — "The detail — written, not generated." quietly restates the anti-AI-summarizer stance (strategy §5) inside the note editor. Good.
- Dialogs are consistent (shared primitive), Esc/click-outside close, first field autofocuses.

**Notes / carry-forward:**
- **Delete is one-click, no confirm.** Calm ≠ silent (Research pain point #10). Add an undo affordance or a confirm step on delete before this ships publicly.
- Dialogs are functional but unanimated — entry/exit motion still owed (Phase 1 motion principles).
- Still no `role="grid"` semantics / 44px targets (carried from prior review).
- Multi-day events still render as per-day badges.

**Next:** Add delete-undo (toast or inline) — it's the one real UX gap in this pass.

---

## 2026-05-30 00:50 — Engineer
**Target:** CRUD pass — `DataProvider`, `Dialog`/`EventDialog`/`NoteDialog`, store wiring, theme-script fix.
**Verdict:** Ship with notes

**Findings:**
- **Architecture — correct.** CRUD lives in a dedicated `DataProvider` Context, not bolted onto `useCalendarState` (resolves my foundation-pass note). Consumers read via `useData()`; store seeded from `lib/mock-data.ts` so the v0.2 Supabase swap touches the store only. Logged as D014 before this entry.
- **Type safety — clean.** `EventInput`/`NoteInput` = `Omit<…, "id">`; no `any`. IDs via `crypto.randomUUID()` with a fallback.
- **Scope (D001) — respected.** State is in-memory, session-only; no persistence, no network. Correct for v0.1.
- **Console — now clean.** React 19's inline-script dev warning (16×, from the no-flash bootstrap) eliminated by moving it to external `public/theme-init.js` via `next/script beforeInteractive`. Verified zero errors on a fresh server; route stays static (`○ /`).
- **Note — store resets on reload.** Acceptable for a mock showcase, but a demo viewer who adds an event and refreshes loses it. A `localStorage` bridge is cheap and worth doing before sharing the URL widely.
- **Note — controlled inputs are fine**, but `EventDialog` doesn't validate end-after-start. Low stakes in v0.1; tighten when the time grid (Week/Day) makes overlaps visible.

**Next:** Add a `localStorage` persistence layer to the store so session edits survive reload before the link is shared.

---

## 2026-05-29 23:30 — Design
**Target:** Live Month view + three-pane shell (`components/**`, light + dark) — first real build, pass 1.
**Verdict:** Ship with notes

**Resolved from the wireframe Block (2026-05-29 19:05):**
- **[Voice]** Version stamp removed from chrome — brand now reads "calendar" (`AppBar.tsx`). ✓
- **[Voice]** Cute self-referential event "Strategist · challenge aesthetics" replaced with realistic copy "Dinner · home" (`lib/mock-data.ts`). ✓
- **[Craft / today indicator]** Today no longer shares `--accent` with Personal — now a distinct `--today-ring` gold outline (`MonthCell.tsx`, `MiniMonth.tsx`). Ambiguity gone. ✓
- **[A11y — contrast]** `--text-3` darkened `#8a8780`→`#76736c` to clear AA on `--bg`. ✓
- **[A11y — focus]** Project-wide `:focus-visible` ring added (`globals.css`). ✓
- **[A11y — reduced motion]** `prefers-reduced-motion` block added. ✓
- **[Craft]** Calendar toggles and view switch have real hover/active affordances; transitions ≤120ms.

**Carried forward (not regressions — deferred scope, logged so they're not forgotten):**
- **[P3 — primary action]** Still no visible "New event" button; only the `N` shortcut (stubbed). Add a findable primary action when the event modal lands next pass.
- **[P1 — multi-day events]** All-day/build-sprint events still render as per-day soft badges, not true spans. The multi-day span problem is deferred with the Week/Day work.
- **[A11y — semantics]** Calendar grid is `<div>`-based, not `role="grid"`/`gridcell`. Toggles are `<button aria-pressed>` (acceptable). Add grid roles when day cells become interactive.
- **[A11y — touch targets]** Icon buttons are 28px; below the 44px AA target at mobile. Bump at the mobile breakpoint.
- **Mini-months** are display-only (no click-to-navigate yet).

**Next:** When building the event modal, add the visible "New event" primary action and `role="grid"` semantics in the same pass.

---

## 2026-05-29 22:10 — Engineer
**Target:** Pass-1 implementation — `app/**`, `components/**`, `hooks/**`, `lib/**`, scaffold config.
**Verdict:** Ship with notes

**Findings:**
- **Stack — clean.** Next.js App Router + Tailwind v4 only; zero runtime deps beyond `next`/`react` (`package.json`). No date library — month math is hand-rolled in `lib/date.ts`. Honors strategy §7.
- **Type safety — clean.** No `any`, no unsafe assertions; domain types centralized in `lib/types.ts`. Unused stub args prefixed `_` in `AppShell.tsx`.
- **Locked decisions — respected.** No OAuth, no DB writes, no analytics (D001/D003). New decisions D011–D013 logged *before* this entry, as required.
- **Perf — within budget.** Static prerender (`○ /`), build clean. Token transitions 120–200ms. `next/font` self-hosts Inter/JetBrains (no FOUT). Theme set pre-paint (no flash).
- **a11y wiring — adequate for pass 1.** `:focus-visible`, reduced-motion, semantic landmarks (`header`/`main`/`aside`), labelled controls. Gaps (`role="grid"`, 44px targets) are Design's to track — deferred, not hidden.
- **Note — `next dev` CVE.** Initial `next@15.1.6` carried CVE-2025-66478; upgraded to `next@16.2.6`. Keep an eye on advisories before deploy.
- **Note — fixed showcase date.** `TODAY` pinned to 2026-05-29 in `lib/mock-data.ts` (D012). Correct for a mock showcase; must become real `new Date()` when v0.2 adds live data.

**Next:** Before the event-modal pass, decide the in-memory event store shape (Context vs. lifted state) so CRUD doesn't get bolted onto `useCalendarState` ad hoc.

---

## 2026-05-29 20:30 — Research
**Target:** Calendar user pain points across forums and social platforms (Reddit, HN, Apple Community, Google Calendar Community, Quora, comparison posts).
**Output:** `Research/2026-05-29-calendar-user-pain-points.md`
**Implications named for:** Engineer | Strategist | Design (all three).
**Key signal:** Top pain — notes/tasks/calendar live in three apps — directly validates our wedge (`context-primer.md`). Top 10 + 15 follow-on items captured with real-source citations. One caveat: a few Reddit-targeted queries returned no results from the search API; verify on Reddit directly before quoting any specific number to a third party.
**Next:** Viet to review readout and route — (1) `strategy.md §3` positive-frame edit → Strategist; (2) data-model shape (visibility, source, recurrence exceptions) → Engineer; (3) event-vs.-intent visual distinction → Design.

---

## 2026-05-29 19:05 — Design
**Target:** `wireframes/v0-month-view.html` — first-pass Month view
**Verdict:** Block

**Findings (principle violations):**

1. **[P3 — One clear primary action]** No "New event" button anywhere in the chrome. The single most-used action on a calendar is missing. *Fix:* add a primary "New event" button at top-right of the canvas header (next to the view switcher), or as a small floating action near the today indicator. Must be findable in <2s.

2. **[P1 — Negative space / craft]** Multi-day events render as 4 separate per-day badges. "Calendar app · build sprint" appears redundantly on May 19, 20, 21, 22. *Fix:* implement true spans — either CSS grid column-span across the row, or an absolute-positioned overlay layer that drapes events across cells. This is the multi-day event problem every calendar has to solve; ship a real solution, not parallel badges.

3. **[Voice — never cute]** Event copy on today (May 29): "Strategist · challenge aesthetics". Self-referential, meta, cute. *Fix:* replace with realistic personal copy — "Coffee · Erich", "Walk · evening", "Dinner · home". The mockup's mock data is supposed to read as a real week, not a wink at the build.

4. **[Voice — never loud]** Brand chrome reads "calendar · v0.1". Version stamp leaks dev metadata into the UI. *Fix:* brand text is just "calendar" (or the final name when chosen). Version belongs in metadata or a discreet footer, not the chrome.

**Findings (craft + discoverability):**

5. **Mini-month dates have no hover state** — they read as static text, not interactive. *Fix:* add `:hover` background (`var(--surface-soft)`) + `cursor: pointer` on `.mm-d:not(.faded)`.

6. **Calendar list rows have no hover affordance** — checkboxes look decorative. *Fix:* add `.cal:hover` row background + cursor:pointer. Also: the cal-count value styles inconsistently with the rest of the type system — align to a token.

7. **Today indicator uses the same `--accent` color as Personal calendar.** Visual confusion possible (is May 29 today, or just Personal?). *Fix:* introduce a distinct `--today-ring` token (currently declared but unused) and use it for the today circle.

**Accessibility — Issues found (multiple WCAG 2.1 AA fails):**

- **Focus visibility — FAIL (2.4.7).** No `:focus-visible` styles defined anywhere. Keyboard users see nothing when tabbing. *Fix:* add a project-wide `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: inherit; }` and audit for any `outline: none`.
- **Touch targets — FAIL (2.5.5).** `.iconbtn` is 28×28px; mini-month `.mm-d` is ~20×20. AA minimum is 44×44. *Fix:* iconbtn → 36×36 desktop, 44×44 at mobile breakpoint; same for mini-month days.
- **Semantic markup — FAIL (4.1.2).** Calendar checkboxes are `<span class="cb">` not `<input type="checkbox">`. Calendar grid is `<div>` soup with no `role="grid"` / `role="gridcell"`. Screen readers can't navigate this as a calendar. *Fix:* real `<input type="checkbox">` with visually-hidden labels; `role="grid"` on `.grid`, `role="row"` on each row, `role="gridcell"` + `aria-label="Friday May 29"` on each cell.
- **Reduced motion — FAIL.** No `@media (prefers-reduced-motion: reduce)` block. *Fix:* wrap all `transition` properties in a reduced-motion exception.
- **Contrast — borderline.** `--text-3: #8A8780` on `--bg: #FAFAF8` measures ~4.1:1; below 4.5:1 for body text. Used in cal-count, mm-dh, scope labels. *Fix:* darken to `#76736C` (~5:1).

**Quality checklist:**
- [x] Honors negative space — generous padding, hairline borders.
- [ ] Primary action obvious in 2s — FAIL.
- [x] Body contrast pass for primary/secondary; borderline tertiary.
- [ ] Touch targets ≥44 — FAIL.
- [ ] Focus visible — FAIL.
- [ ] Reduced motion — FAIL.
- [x] Layout 360→1920 — responsive collapse works.
- [ ] Copy human — passes mostly; cute meta-references break it.
- [ ] Empty states — N/A in mockup; must be specified for v1.
- [ ] Beats Apple/Google — Notes panel + editorial typography pull ahead; primary action gap pulls back. Net: not yet.

**Next:** Ship v1 with these four blockers fixed first — (a) Primary "New event" button, (b) Multi-day event spans, (c) `:focus-visible` + 44px targets + semantic markup, (d) replace cute mock event copy. Re-invoke Design on v1.

---

## 2026-05-29 18:02 — Design
**Target:** Mark Kashef's Agentic OS video — which patterns affect our system?
**Verdict:** Ship with notes
**Findings:**
- "Silver platter" idea = put prerequisite context on a platter so agents spend tokens on synthesis, not retrieval. Adopt as `context-primer.md` — prose twin of the dashboard.
- Primer must include the voice line + anti-goals so any new session inherits the boundaries immediately.
- Dashboard already serves Mark's "data map HTML" role. No duplication needed.
- Reject Mark's pantry/prep/plate taxonomy — wrong frame for a UI showcase project.

**Accessibility:** N/A — meta artifact.
**Next:** Write `context-primer.md` as the 30-second boot sequence for any new Claude session.

---

## 2026-05-29 18:01 — Engineer
**Target:** Mark Kashef's Agentic OS video — which patterns to implement?
**Verdict:** Ship with notes
**Findings:**
- Critical paths per agent — adopt. Closes the persona-to-SOP gap. Highest-leverage move from the video.
- Hooks — defer. Cowork's hook story ≠ Claude Code CLI's. Adopting now = premature complexity tax. Revisit at v0.2 when real code exists.
- `/silver-platter` audit skill — skip. Built for users with 38 skills + 16 rules. We have 0 of each.
- Orchestrator pattern — skip. With 3 agents and explicit invocation, no routing needed. Mark's own rule: hire when overburdened, not before.

**Next:** Add Critical path section to each `Agents/*.md`. Numbered, repeatable, no judgment calls.

---

## 2026-05-29 18:00 — CEO
**Target:** Mark Kashef's Agentic OS video — should we adopt his framework?
**Verdict:** Approved (partial adoption only)
**Reasoning:**
- Mark's video targets consultancy clients with messy business data (Shopify, QuickBooks, CRMs). Different problem class from solo cognition. Don't import their problems.
- The 4-layer mental model (Identity → Knowledge → Workers → Automation) is useful as a diagnostic. We sit at L1 + L3 — exactly right for Phase 0.
- L4 automation (hooks, orchestrator) = premature. No code to gate yet. Stay at L3.
- Reject consultancy framing (Marco / Sally / Dr. Anwar). Their problems don't map.
- Adopt: critical paths in each agent, `context-primer.md`, L1-L4 audit line in CLAUDE.md.

**Next:** Sign off the three additions. Re-audit the L1-L4 stack at end of Phase 2.

---

## 2026-05-29 17:32 — Design
**Target:** Question — "Do we need a strategy note documenting the product's logic?"
**Verdict:** Ship with notes
**Findings:**
- Strategy directly shapes copy register and visual tone — without it, every microcopy decision restarts from zero ("is this voice playful or editorial?" re-asked weekly).
- Doc must produce one explicit *voice + feel* sentence I can hold every screen and string to. Otherwise the doc is decoration.
- "Calm. Editorial. Confident. Never cute. Never corporate. Never loud." is the line I'll enforce on every UI review.

**Accessibility:** N/A — meta artifact.
**Next:** Cite §6 of `strategy.md` in every Design review verdict.

---

## 2026-05-29 17:31 — Engineer
**Target:** Question — "Do we need a strategy note documenting the product's logic?"
**Verdict:** Ship with notes
**Findings:**
- Not my lane — strategy doesn't change code unless it changes principles or scope.
- If strategy introduces new code-level rules, those belong in `CLAUDE.md` + `PRD.md`, not buried in `strategy.md`. Don't make me cross-reference three docs.
- A "Constraints" pull-out section at the end of `strategy.md` solves this — code-level rules I can enforce in review.

**Next:** Once `strategy.md` lands, audit its constraints section against `CLAUDE.md` and reconcile any divergence.

---

## 2026-05-29 17:30 — CEO
**Target:** Question — "Do we need a strategy note documenting the product's logic?"
**Verdict:** Approved with sharpening
**Reasoning:**
- Strategy at Phase 0 is the cheapest insurance against drift. Without a written thesis, every scope debate restarts from zero — same arguments at week 3 and week 6.
- For a *showcase* (not a startup), strategy = the story a hiring manager remembers in 60 seconds.
- Risk: bloat. A 5-page strategy doc is a tax. A 1-page thesis is a weapon.
- Lock structure: thesis · wedge · who · positioning · anti-goals · voice · constraints. Six to seven sections, one page rendered.

**Next:** Write `strategy.md` today, max 1 page, bullet density. Promote to standing root note in `CLAUDE.md`. If a future scope debate ignores this doc, that's a process failure, not a strategy failure.

---
