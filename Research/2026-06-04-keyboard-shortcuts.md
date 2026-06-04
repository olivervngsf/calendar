# Readout: Keyboard shortcuts — Apple vs Google vs Notion, and the best-fit set for us

**Date:** 2026-06-04
**Scout:** Research agent
**Triggered by:** Viet — "analyze shortcuts from Apple, Google, Notion as 10-yr user research. Pick the best options (easy to use, accessible). Produce a design-debt list in table form to review before adding to build-tracker."

---

## TL;DR
- Three distinct philosophies: **Apple = modifier chords** (⌘1–4), **Google = bare single-keys** (opt-in), **Notion = hybrid: bare keys + a ⌘K command palette**. Notion's hybrid is the best-of-breed pattern for "easy + accessible."
- We already have the bare-key layer (D/W/M/Y · T · ←/→ · N · ⇧N · ⇧Q · / · , · [ · ] · ?). The gaps are **discoverability (⌘K palette), keyboard-operate-on-events, and one real WCAG conformance hole (2.1.4 Character Key Shortcuts)** — not more keys.
- The calm/anti-productivity-bro mandate means the recommendation is to **curate, not maximize**. Notion ships 69 shortcuts; we should ship ~18 well-chosen ones plus a searchable palette.

---

## Sources
- [Use keyboard shortcuts in Google Calendar — Google Help](https://support.google.com/calendar/answer/37034?hl=en&co=GENIE.Platform%3DDesktop) — official GCal list (opt-in; `?` reveals all).
- [Keyboard shortcuts in Calendar on Mac — Apple Support](https://support.apple.com/guide/calendar/keyboard-shortcuts-ical002/mac) — official Apple Calendar list (chorded).
- [Notion Calendar keyboard shortcuts — Notion Help](https://www.notion.com/help/notion-calendar-keyboard-shortcuts) — official; `?` reveals + searchable.
- [Global keyboard shortcuts — Cron/Notion](https://cronhq.notion.site/Global-keyboard-shortcuts-e933a55e7fb648028b09cedf933d3e76) — Notion's system-wide layer.
- [Google Calendar shortcuts cheat sheet — How-To Geek](https://www.howtogeek.com/670718/keyboard-shortcuts-for-google-calendar-a-cheat-sheet/) — secondary confirmation.
- [WCAG 2.1 SC 2.1.4 Character Key Shortcuts (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html) — the conformance rule that governs bare single-key shortcuts.
- [WAI-ARIA APG: Grid pattern (roving tabindex)](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) — keyboard navigation model for date grids.

*Official Apple/Google/Notion pages 403 on automated fetch; key sets below are reconstructed from their search snippets + secondary cheat-sheets + domain knowledge. Items I couldn't confirm verbatim are marked **(verify)**.*

---

## The three sets (as scouted)

**Google Calendar** — bare single-key, must be enabled in Settings, `?` reveals all:
- Views: `1`/`D` day · `2`/`W` week · `3`/`M` month · `4`/`X` 4-day · `5`/`A` schedule
- Nav: `J`/`N` next · `K`/`P` prev · `T` today · `G` go-to-date
- Actions: `C` create · `E` edit/details · `Backspace`/`Del` delete · `Z` undo · `R` refresh · `S` settings · `Esc` back
- App: `/` search · `?` / `⇧/` help

**Apple Calendar** — modifier chords, shown in the menu bar (self-documenting):
- Views: `⌘1` day · `⌘2` week · `⌘3` month · `⌘4` year
- Nav: `⌘←` prev · `⌘→` next · `⌘T` today · `⇧⌘T` go-to-date **(verify)**
- Actions: `⌘N` new event · `⌥⌘N` new calendar · `⌫` delete · `⌘E` edit/Get Info **(verify)** · `⌘R` refresh
- App: `⌘F` find · `⌘,` preferences

**Notion Calendar** — hybrid (bare nav keys + command palette + system-wide layer):
- Views: `1`–`9` show N-day span (`1`=day … `7`=week) · `T` today
- Nav: `J` next · `K` prev **(verify)** · `Z` time-zone travel
- Actions: **`⌘K` command menu (flagship)** · `S` share availability · NL create via palette · `⌘K` toggle weekends **(verify — conflicts with command-menu binding in sources)**
- App: `?` searchable shortcut list · system-wide shortcuts via menu-bar settings

---

## Insights — patterns, not summaries
- **Bare single-keys win on speed; chords win on safety and self-documentation.** Apple's chords never collide with typing and show themselves in the menu bar — but they're two-handed and slower. Google's bare keys are fastest but invisible until you press `?`, and they're a known accessibility footgun.
- **The command palette (`⌘K`) is the one pattern that is simultaneously fast, discoverable, and accessible** — you don't memorize, you search. It's Notion's strongest idea and the thing both Apple and Google lack. It also happens to already be on our board as `⌘K` ⬜.
- **Numbers are the universal view-switch.** All three use `1/2/3/4`. We use letters (D/W/M/Y). Letters are more mnemonic; numbers are more muscle-memory and language-independent. Best practice is to offer **both** (cheap aliases).
- **Operating on an event by keyboard is table stakes everywhere but here.** Apple/Google both let you select an event and press `E` (edit) or `Delete`. Our chips are focusable `<button>`s (good), but there's no roving arrow-nav, no select-then-act, and the month grid lacks `role="grid"` (already DBT-04). Keyboard users can navigate views but can't fluidly act on events.
- **Bare single-key shortcuts are a real WCAG conformance issue, not a nicety.** SC 2.1.4 (Level **A**) requires that single-character shortcuts can be turned off, remapped, or limited to component focus. We fire `D/W/M/Y/T/N/Q/...` globally with no off-switch — and they collide with screen-reader browse-mode quick-nav (NVDA/JAWS use single letters to jump by element). This is the one item that's a defect, not a feature gap.
- **Restraint is on-brand.** Notion's 69 shortcuts are the productivity-bro maximalism our `strategy.md §5` anti-goals reject. The win is a *small, calm, discoverable* set + a palette — not parity on count.

---

## Recommended "best options" set (easy + accessible)
Synthesis: **keep our bare-key layer, add a searchable `⌘K` palette as the memorization-free spine, add cheap numeric/vim aliases, and close the keyboard-operate-on-event gap.**

| Intent | Recommend | Borrowed from | Why |
|---|---|---|---|
| Switch view | keep `D/W/M/Y` **+ add `1/2/3/4`** | All three | Mnemonic *and* muscle-memory; numbers are language-independent |
| Today | keep `T` | All three | Universal |
| Prev / next | keep `←/→` **+ add `J`/`K`** | Google, Notion, Vim | Redundant reach; home-row option |
| Go to date | **add `G`** | Google (`G`), Apple (`⇧⌘T`) | Recall / "search-the-past" affordance (ties to pain-points readout #3) |
| Create event | keep `N` | — (Apple `⌘N`, Google `C`) | Already ours; keep |
| Universal actions / search-don't-memorize | **add `⌘K` command palette** | Notion | The single biggest accessibility + discoverability win |
| Operate on focused event | **add select → `E` edit, `⌫` delete, `↵` open** | Apple, Google | Closes the keyboard-only operation gap |
| Search | keep `/` | Google, Notion | Universal |
| Help | keep `?` **+ make it searchable & grouped** | Notion | Scales as the set grows |
| Conformance | **add a "single-key shortcuts" off/remap toggle in Settings** | (WCAG 2.1.4) | Turns an A-level defect into compliance |

---

## Proposed design-debt table (for Viet to review → then add to build-tracker)
IDs continue from DBT-09. Not yet filed — pending review.

| ID | Type | Item | Why it matters | Priority | Raised |
|---|---|---|---|---|---|
| DBT-10 | Design / a11y | Bare single-key shortcuts have no off/remap mechanism (WCAG 2.1.4, Level **A**) | Fires `D/W/M/Y/T/N/Q…` globally; collides with screen-reader quick-nav; an A-level conformance defect, not a gap | **P1** | Research · 06-04 |
| DBT-11 | Design | No command palette (`⌘K`) | The memorization-free, searchable action spine — Notion's best idea; already `⬜` on the board | **P1** | Research · 06-04 |
| DBT-12 | Design / a11y | Can't operate on a focused event by keyboard (no roving nav, no select→edit/delete) | Chips are focusable but there's no arrow-roam, no `E`/`⌫` on selection; depends on `role="grid"` (DBT-04) | P2 | Research · 06-04 |
| DBT-13 | Design | No visible "selected event" state for keyboard | Operate-on-event (DBT-12) needs a distinct keyboard-selected style, separate from hover | P2 | Research · 06-04 |
| DBT-14 | Design | `?` overlay is a flat 14-row list — not grouped or searchable | Doesn't scale; Notion's is searchable + categorized; ours gets harder to scan as keys grow | P3 | Research · 06-04 |
| DBT-15 | Design | No view number aliases (`1/2/3/4`) or `J`/`K` nav | Every competitor offers numeric + vim/next-prev redundancy; cheap muscle-memory + reach win | P3 | Research · 06-04 |
| DBT-16 | Design | No "go to date" jump (`G`) | Direct date recall; Google `G` / Apple `⇧⌘T`; supports the search-the-past wedge moment | P3 | Research · 06-04 |
| DBT-17 | Design | Shortcuts undiscoverable in-context (no menu/tooltip hints) | Apple shows keys in the menu bar, Google on hover; ours are invisible until `?`. Balance against the "invisible onboarding" principle | P3 | Research · 06-04 |

---

## Implications
**For Engineer:** DBT-10 is the load-bearing one — the global `keydown` listener in `hooks/useKeyboardShortcuts.ts` needs (a) a settings-backed enable/disable for bare single-keys and/or (b) scoping bare keys to app focus, to satisfy WCAG 2.1.4. The `isTypingTarget` guard already covers notes (`<input>`/`<textarea>` in `NoteDialog`) — good, but it does not satisfy 2.1.4 on its own. A `⌘K` palette (DBT-11) is additive and doesn't disturb the existing layer.
**For Strategist:** The anti-goal tension is *count*. Notion's 69 shortcuts are exactly the productivity-bro maximalism `strategy.md §5` rejects. Recommend an explicit ceiling: ship the curated ~18 + palette, and treat "add another shortcut" as requiring justification — same bar as a new lib.
**For Design:** DBT-12/13 (keyboard-operate-on-event + selected state) is where craft meets a11y. The selected-event state should read as calm/editorial, not a loud OS-blue highlight — reuse the focus-ring/`--text` token language already in `EventChip`.

## Recommended adaptations
- `build-tracker.md` (Debts table) — add DBT-10 … DBT-17 as filed above (Viet prioritizes; Research does not edit the tracker).
- `build-tracker.md` (App shell row) — `Command palette (⌘K)` is already `⬜`; link it to DBT-11 so the debt and the feature row stay in sync.
- `Agents/design.md` (Critical path) — add a check: *"any new global single-key shortcut → is there an off/remap path (WCAG 2.1.4)?"*
- `decision-log.md` — open a question: *"Letters vs numbers vs both for view-switch; and do we cap the shortcut count?"* — defer the answer, lock the question.

## Open questions
- Should bare single-keys be **opt-in like Google** (off by default, calm) or **on by default with a remap/off toggle** (faster, still 2.1.4-compliant)? Design + Strategist call.
- Is `⌘K` in v0.1 scope, or does it wait for real search/data in v0.2? (It's already `⬜` on the board — Strategist to confirm scope.)
- Do we adopt numeric aliases at the cost of "two ways to do one thing" (mild against the "one clear action" principle)? Design's call.
