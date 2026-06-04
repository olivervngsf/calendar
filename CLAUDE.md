# Calendar App — Project Rules

## Project intent
Build a modern calendar app to rival Apple Calendar + Google Calendar. Showcase piece. 0→1 by Viet. Deploys on Vercel.

## Notes convention (this folder only)
- All project notes are `.md` files. All notes are dated.
- Standing root notes:
  - `context-primer.md` — 30-second boot sequence for any new Claude session. Read **first**.
  - `strategy.md` — load-bearing thesis: thesis, wedge, who, positioning, anti-goals, voice, constraints. One page.
  - `PRD.md` — what we're building in v0.1.
  - `roadmap.md` — phased plan, exit criteria.
  - `decision-log.md` — every non-trivial decision. Format: date, context, options, tradeoffs, choice, why.
  - `daily-log.md` — daily entry. What we did, what worked, what hurt, what's next.
  - `agents-log.md` — every agent review or challenge.
- `Resources/` — references, samples, screenshots, inspiration.
- `Agents/` — the three reviewer prompts.
- Additional themed notes are fine (e.g. `wireframes.md`, `ia.md`) — must be dated.

## Agentic OS audit (2026-05-29 — see D006)
Where we sit on the 4-layer agentic stack:
- **L1 Identity** — strong (this file, `strategy.md`, `decision-log.md`, `context-primer.md`).
- **L2 Knowledge** — thin (project notes only; no project skills/MCPs). Acceptable for v0.1.
- **L3 Workers** — in place (3 agents in `Agents/`).
- **L4 Automation** — empty. Stay empty until v0.2.

Re-audit at end of Phase 2. Do not drift toward L4 (hooks, orchestrator, audit skills) prematurely.

## Stack (locked 2026-05-29)
- Next.js (App Router) on Vercel
- Supabase (Postgres + auth) — wired in shell, mocked for v0.1
- Tailwind + shadcn/ui (or unstyled primitives + custom tokens — TBD in design phase)

## Scope (locked 2026-05-29)
- v0.1: polished UI prototype with mock data. No real OAuth, no real DB writes.
- v0.2: real Google OAuth + Supabase persistence.
- v0.3: Apple Calendar integration.
- v1.0: multi-user, shared calendars (real, not mocked).

## Users
- Single-user showcase. Auth scaffolded but not enforced.
- "Shared with Erich" demoed via mock data only in v0.1.

## Design principles (load-bearing)
1. Negative space first. Compact density without crowding.
2. Smooth interactions over flashy ones. Intent > novelty.
3. One clear primary action per screen.
4. Notes are first-class — accessible from every view, scoped to the view.
5. Onboarding is invisible. No tour, no modal — discoverable affordances.
6. **Keyboard-first (D033).** Every interaction must have a keyboard path. Users should be able to stay on the keyboard — create, edit, navigate, dismiss — without reaching for the mouse. Mouse-only flows are the exception (e.g. drag), and even those keep a keyboard equivalent. Design agent checks the keyboard path on every review.

## Roles (locked 2026-05-29 — see D007)
- **Viet — CEO / Founder.** Owns vision, rules, scope. Edits the law (this file, `strategy.md`, `decision-log.md`, agent files). Makes every final call. Agents recommend; Viet decides. Founder's prerogative overrides any agent verdict — but only on the record.
- **Agents — the bench.** Three opinionated reviewers (below) plus Research (under consideration). They surface signal, name tradeoffs, block bad calls. They do not ship and they do not outrank Viet.

## Agents (locked 2026-05-29 — see D004, D007, D008)
Four agents: three opinionated reviewers + one scout. Definitions in `Agents/`. Each appends to `agents-log.md`. Dashboard: cowork artifact `agents-dashboard`.

- **Engineer** (`Agents/engineer.md`) — invoke before any code change. Owns code review, stack consistency, perf, type safety, a11y wiring.
- **Strategist** (`Agents/strategist.md`) — invoke before scope changes or when defending a concept. Owns concept challenge, scope discipline, strategic tradeoffs. *(Renamed from "CEO" in D007.)*
- **Design** (`Agents/design.md`) — invoke after any UI work. Owns visual craft, IxD, accessibility (WCAG AA), microcopy, motion.
- **Research** (`Agents/research.md`) — invoke when external material needs scouting/synthesizing. Owns external research, pattern recognition, structured readouts. Does NOT judge — informs. *(Hired in D008. Tripwire: kill if 0 invocations in next 3 sessions.)*

Invocation: explicit by name ("Engineer, review X" / "Strategist, challenge Y" / "Design, review Z" / "Research, scan W"). Claude may auto-suggest the relevant agent when a request matches a trigger.

## Behavior rules for Claude in this project
- **Start every new session by reading `context-primer.md`.** Then drill into deeper files only on demand.
- Lead with decisions, not exploration of options, unless asked.
- Every meaningful choice goes in `decision-log.md` before code changes.
- End each working session with an entry in `daily-log.md`.
- Convert relative dates ("Thursday") to absolute (`2026-05-29`) in all logs.
- Before code changes → engage Engineer agent. Before scope changes → engage Strategist. After UI work → engage Design.
- Every agent follows the Critical path defined in its file. Skipped steps = invalid review.
- When an agent runs, it appends to `agents-log.md` in the format defined in its prompt.
