---
name: Calendar
description: An editorial-calm calendar where time and thinking live on one surface.
colors:
  accent: "#2e4756"
  accent-soft: "#e5eaee"
  accent-on: "#ffffff"
  bg: "#fafaf8"
  surface: "#ffffff"
  surface-soft: "#f4f1ea"
  border: "#ece9e2"
  border-strong: "#d6d2c7"
  border-faint: "#f2efe8"
  text: "#1a1a1a"
  text-2: "#4a4a4a"
  text-3: "#76736c"
  text-faint: "#c4c0b5"
  today-ring: "#b68843"
  cal-teal: "#2e4756"
  cal-clay: "#a87854"
  cal-slate: "#6b7c8f"
  cal-sage: "#5f7d63"
  cal-plum: "#855772"
  cal-indigo: "#5b6b96"
typography:
  heading:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.1em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "3px"
  base: "4px"
  card: "5px"
  lg: "8px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-on}"
    rounded: "{rounded.base}"
    padding: "6px 12px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-on}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-2}"
    rounded: "{rounded.base}"
    padding: "6px 12px"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.base}"
    padding: "8px 12px"
  input-focus:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
  note-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "14px 16px"
  view-switch-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-on}"
    rounded: "{rounded.base}"
    padding: "6px 12px"
---

# Design System: Calendar

## 1. Overview

**Creative North Star: "The Editorial Desk"**

This is the calm workspace of a senior editor, rendered as software. The page recedes; the
*content* — your hours, your events, your written notes — is the only thing asked to speak. Type
carries the personality and chrome stays quiet: a humanist sans for prose, a monospace for every
number and piece of metadata, the way an editor sets running heads and folios apart from body copy.
Generous negative space is the default, not a reward. Nothing shouts, nothing animates for applause.

The system answers to one product thesis: **time and thinking belong on one surface.** So the visual
language has to make a notes panel feel as native as the grid beside it — same restraint, same warmth,
same quiet confidence. It beats Apple Calendar on calm and Google Calendar on warmth not with more
color but with *less*: muted calendar hues, a single deep-teal accent used sparingly, warm-neutral
surfaces that read as paper-adjacent without ever literally being cream.

It explicitly rejects the cold utilitarian density of Google Calendar, the productivity-bro register
(streaks, XP, nudges, badges), the AI-summarizer dashboard, and the 2026 AI-landing aesthetic
(SaaS-cream backgrounds, per-section uppercase eyebrows, hero-metric templates, identical card grids).
This is a tool you think *with*, not a pitch page.

**Key Characteristics:**
- Negative space first; compact density without crowding.
- Monospace for all numbers and metadata; humanist sans for body.
- One deep-teal accent, used rarely. Calendar colors muted, never saturated.
- Fully flat — depth comes from borders and tonal surfaces, never drop shadows.
- Keyboard-first: every interaction has a visible, calm focus path.
- Motion is intentional and quiet, or absent.

## 2. Colors

A warm-neutral surface system carrying a single deep-teal accent and a muted six-color calendar
palette. Warmth lives in the off-white surfaces and the amber today-marker, never in saturation. Every
pairing clears WCAG AA in both light and dark themes (dark values are the lifted counterparts of each
token, defined under `[data-theme="dark"]`).

### Primary
- **Deep Teal** (`#2e4756`): the single accent. Active view-switch segment, primary buttons,
  focus rings, selected-day fills (as the soft tint), the brand dot. Used on ≤10% of any screen.
- **Teal Mist** (`#e5eaee`, accent-soft): the accent's whisper — selected-day background, soft
  highlights. Carries the accent's hue at low chroma so selection reads without shouting.

### Neutral
- **Warm Paper** (`#fafaf8`, bg): the body canvas. A true near-white with the faintest warmth —
  not cream, not parchment.
- **Pure Surface** (`#ffffff`, surface) / **Soft Surface** (`#f4f1ea`, surface-soft): raised content
  (cards, panels) and recessed/hover fills respectively. Tonal layering, not shadow, separates planes.
- **Ink** (`#1a1a1a`, text) → **Slate** (`#4a4a4a`, text-2) → **Stone** (`#76736c`, text-3) →
  **Haze** (`#c4c0b5`, text-faint): the text ramp, darkening toward ink for primary reading. `text-3`
  is deliberately darkened to clear AA on Warm Paper — do not lighten it for "elegance".
- **Borders** (`#ece9e2` base / `#d6d2c7` strong / `#f2efe8` faint): the primary structural device.
  Hairline borders define every plane; this system leans on them precisely *because* it has no shadows.

### Tertiary — The Calendar Palette
Six muted hues, each with a solid (chip border / dot) and a soft tint (chip fill). Categorical, not
ranked — a user-created calendar picks one swatch.
- **Teal** `#2e4756` · **Clay** `#a87854` · **Slate** `#6b7c8f` · **Sage** `#5f7d63` ·
  **Plum** `#855772` · **Indigo** `#5b6b96`. Soft tints (`--cal-*-soft`) back all-day chips.

### Accent — Amber
- **Amber** (`#b68843`, today-ring): reserved exclusively for the *today* marker (a ring, never a
  fill). The one warm note allowed to differ from the teal accent — because "today" is the one moment
  worth a glance.

### Named Rules
**The One Accent Rule.** Deep Teal appears on ≤10% of any screen. Its rarity is what makes the active
view or the primary action legible at a glance. Never tint chrome teal "to look designed".

**The No-Saturation Rule.** Calendar colors are muted by construction. If a calendar hue looks
vivid next to the surface, it's wrong — desaturate toward the existing palette.

## 3. Typography

**Body Font:** Inter (with -apple-system, BlinkMacSystemFont, sans-serif)
**Number/Metadata Font:** JetBrains Mono (with ui-monospace, SF Mono, Menlo, monospace)

**Character:** A humanist sans paired with a monospace on a true contrast axis — prose vs. data. The
mono isn't decoration; it's load-bearing semantics. Every number, time, date, weekday header, and
label is set in mono so the eye reads "this is metadata" before it reads the value. There is no serif
and no display face: this is a tool, not a magazine cover.

### Hierarchy
- **Heading** (Inter 600, 1.125rem/18px, tracking -0.015em): the app-bar view title and panel
  headers ("Notes"). The largest type in the system — calm by ceiling, never a hero.
- **Section Title** (Inter 600, 1rem/16px): dialog and settings titles.
- **Body** (Inter 400, 0.875rem/14px, line-height 1.5): all prose — note bodies, descriptions.
  Cap measure at 65–75ch in the notes panel.
- **Label** (JetBrains Mono 600, 0.625rem/10px, tracking 0.1em, UPPERCASE): weekday headers, the
  notes scope line, section eyebrows *within* the notes panel ("DECISION LOG").
- **Mono / Numeric** (JetBrains Mono 400, ~0.6875rem/11px): day numbers, event times, week numbers,
  the date metadata on note cards.

### Named Rules
**The Mono-Metadata Rule.** Every number and every piece of metadata is monospace. No exceptions:
day numbers, times, week numbers, dates, counts. Prose is sans; data is mono. This single split
carries most of the system's personality.

**The Calm Ceiling Rule.** The largest type is 18px. There is no display scale, no hero clamp. If a
heading wants to be bigger, the answer is more space around it, not more size.

## 4. Elevation

**Fully flat.** This system has no drop shadows. Depth is conveyed entirely through hairline borders
and tonal surface layering: Warm Paper (bg) recedes, Pure Surface (white) raises, Soft Surface
(`#f4f1ea`) marks hover and recessed states. A bordered white panel on warm paper reads as "above"
without a single pixel of blur. This is the editorial-desk discipline: paper has edges, not shadows.

> **Reconciliation note (2026-06-04):** current overlays (dialogs, the event/quick-create popovers,
> the year hover popup, the selection bar) still use `shadow-xl`. Under the Fully-Flat doctrine these
> should move to a hairline border + a slightly stronger surface contrast (or a 1px ring) instead.
> Track as a polish pass; the spec below is the target.

### Named Rules
**The No-Shadow Rule.** Shadows are forbidden as a depth device. To separate a plane, use a border
(`--border` / `--border-strong`) and a surface step, not `box-shadow`. Overlays included.

**The Border-Defines-Structure Rule.** Because there are no shadows, hairline borders do the
structural work. Keep them ≤1px and from the border ramp; never thicken a border into a "card stripe".

## 5. Components

Refined and restrained: quiet at rest, precise on interaction. Hover is a gentle tonal shift, never a
lift or a bounce. Radii are small (3–8px); only true pills and circular markers go fully round.

### Buttons
- **Shape:** small radius (4px, `rounded.base`). No shadow, ever.
- **Primary** (Deep Teal `#2e4756`, white text, ~6px×12px padding): the one primary action per screen
  — "+ New event", quick-create "Add". Hover: opacity 0.9. That's the whole gesture.
- **Secondary** ("Today", on Surface, `text-2`): bordered/quiet; hover steps the background to
  Soft Surface.
- **Ghost / text** ("More options", "Delete" in the detail popover): `text-3`, hover to `text`/`text-2`,
  no fill. For low-stakes or destructive-but-recoverable actions.
- **Icon buttons** (‹ › nav, panel toggles, gear): 28px square, transparent, hover to Soft Surface
  with a faint border. *(Known debt: below the 44px touch target — DBT-05.)*
- **Focus:** all buttons inherit the global `:focus-visible` — 2px Deep Teal outline, 2px offset.

### Inputs / Fields
- **Style:** Warm Paper background, 1px `border-strong`, 4px radius, 14px text.
- **Focus:** border shifts to Deep Teal (`focus:border-accent`); no glow, no ring beyond the
  global focus outline. Dialogs open with the title field focused and its contents selected (D027).
- **Submit:** `⌘+Enter` saves from any field; `Enter` saves single-field quick-create.

### Cards (Note cards)
- **Corner Style:** 5px radius (`rounded.card`) — the one slightly-softer corner in the system.
- **Background:** Pure Surface on Warm Paper; **border** `--border`, hover to `--border-strong`.
- **Shadow Strategy:** none (see Elevation). The border + surface contrast is the separation.
- **Internal Padding:** ~14px×16px. Date in mono `text-3`, title in sans 600, body in `text-2`.
- Cards are used *only* in the notes panel, where a bounded list of authored entries is the right
  affordance. Do not introduce card grids elsewhere.

### View Switch (signature)
- A segmented control (D/W/M/Y) in mono 11px, 4px-radius bordered group. Active segment = Deep Teal
  fill, white text; inactive = Surface, `text-2`, hover Soft Surface.
- The **W** segment shows its sub-mode (**W1** timeline / **W2** agenda) while Week is active, on a
  fixed min-width so the control never jitters (D037).

### Event Chip (signature)
- **Timed:** a 2px left border in the calendar's solid color + title/time; hover to Soft Surface.
- **All-day / month:** a soft-tint fill (`--cal-*-soft`) pill at 4px radius.
- **States:** selected = 1px Deep Teal ring (⌘-click multi-select, D032); single-click = detail
  popover, double-click / Enter = edit (D035).

### Overlays (popovers, dialogs, tooltips)
- Anchored popovers (event detail, quick-create, year hover preview) and centered dialogs share one
  language: Surface background, hairline border, 8px radius (`rounded.lg`), a quiet fade+scale entry
  (~150ms). Dismiss on Esc and click-outside. Hover previews are `pointer-events-none`.
- Per the Fully-Flat doctrine these should rely on border + surface contrast, not `shadow-xl`
  (see Elevation reconciliation note).

### Navigation / Panels
- Three-pane shell: sidebar · canvas · notes. Side panels slide (width + translate, 200ms) and the
  canvas reflows. Notes panel is fixed-chrome: sticky one-line header, scrolling list with a
  scroll-aware edge fade, sticky "+ New note" footer (D036).

## 6. Do's and Don'ts

### Do:
- **Do** set every number and metadatum in JetBrains Mono; prose in Inter. The split is the system.
- **Do** keep Deep Teal to ≤10% of any screen; let negative space and type do the work.
- **Do** convey depth with borders + tonal surfaces (Warm Paper → Surface → Soft Surface).
- **Do** keep radii small: 3–8px for cards/inputs/buttons; `rounded-full` only for pills, the today
  ring, and the avatar.
- **Do** give every interaction a keyboard path with a visible 2px Deep Teal focus ring (D033).
- **Do** write empty states ("Nothing for this week yet — what was it about?"), never stock them.
- **Do** keep the largest type at 18px; add space, not size.

### Don't:
- **Don't** use drop shadows as a depth device — the system is fully flat. Reconcile existing
  `shadow-xl` overlays to border + surface contrast.
- **Don't** saturate calendar colors. Muted by construction; if a hue looks vivid, it's wrong.
- **Don't** lighten `text-3` (`#76736c`) "for elegance" — it's tuned to clear AA on Warm Paper.
- **Don't** translate "warm/editorial" into a cream/parchment/sand body background. Warm Paper is a
  near-white; warmth comes from type, the amber today-ring, and muted hues — never a tinted near-white.
- **Don't** use a side-stripe `border-left`/`border-right` >1px as a decorative accent on cards,
  callouts, or list items. The 2px left border on **timed event chips** is the *single* sanctioned
  exception — it encodes calendar identity, a functional calendar convention, not decoration.
- **Don't** import the anti-references: Google Calendar's cold utilitarian density; productivity-bro
  patterns (streaks, XP, nudges, badges); AI-summarizer "your week in review" dashboards; or the
  SaaS-AI-landing kit (per-section uppercase eyebrows, hero-metric blocks, identical card grids).
- **Don't** animate for applause. Motion is intentional and quiet, with a `prefers-reduced-motion`
  fallback, or it's absent.
- **Don't** add gradient text, glassmorphism, or numbered/eyebrow section scaffolding. This is a tool.
