# Context Primer

**Read this first if you just joined the project. It loads you in 30 seconds.**
*Dated: 2026-05-29*

---

## What this is
Modern calendar app rivaling Apple Calendar + Google Calendar. 0→1 portfolio piece by Viet. Deploys on Vercel. v0.1 = polished UI prototype with mock data.

## Vision
The default calendar for knowledge workers who plan in prose — where time and thinking live on one surface.

## Mission
World-class craft. Calm pace. Every minute earned through clarity, not engagement. Beat Apple on calm, Google on warmth.

## The wedge
**Time-scoped notes.** Every view (D/W/M/Y) carries a notes panel scoped to that exact time unit. Two note types: decision log and daily log. No competitor does this.

## Where we are
- **Phase 0 (Foundation).** Pre-pixels. PRD + strategy + agents locked. Aesthetic philosophy is the next decision teed up.
- **Stack locked** — Next.js (App Router) + Supabase + Tailwind on Vercel.
- **Single-user showcase.** Auth scaffolded, not enforced.

## Roles
- **Viet — CEO / Founder.** Owns vision, rules, scope. Edits the law. Makes every final call. Agents recommend; Viet decides.
- **Agents — the bench.** They surface signal and block bad calls; they don't ship and don't outrank Viet.

## Locked decisions (full reasoning in `decision-log.md`)
- **D001** — v0.1 = UI prototype with mock data. No real OAuth/DB writes.
- **D002** — Stack: Next.js + Supabase on Vercel.
- **D003** — Single-user. "Shared with Erich" via mock data only.
- **D004** — Three agents as quality gates (Engineer, Strategist, Design). *(Strategist was originally "CEO" — see D007.)*
- **D005** — `strategy.md` as standing root note.
- **D006** — Critical paths in each agent + `context-primer.md` + L1-L4 audit.
- **D007** — Renamed "CEO agent" → "Strategist." Viet is the CEO/founder of the project.
- **D008** — Hired Research agent (scout + synthesize, no judging). Tripwire: kill if 0 invocations in 3 sessions.
- **D009** — Locked Vision + Mission at top of `strategy.md`.
- **D010** — Moved project to `/05 PRACTICE/Calendar app` (canonical root).
- **D011–D014** — First real build: URL view-state, mock data model, dark palette, in-memory CRUD store.
- **D015** — `build-tracker.md` is the live status board. Engineer owns Status; Design/Strategist file debts; Viet prioritizes.
- **D016–D032** — Build decisions (calendars CRUD, palette, delete-confirm, event detail-on-click + multi-select). See `decision-log.md`.
- **D033** — Hired UX Writer + Marketing (bench → 6). They pair on `go-to-market.md`; built to make the value legible at >$100k without drifting into anti-goals. Founder call on the record.

## Anti-goals (binding — `strategy.md` §5)
Not a project manager. Not a team scheduler. Not a productivity-bro app. Not an AI summarizer. Not a notification engine. Not engagement-optimized.

If a proposed feature drifts toward these → CEO auto-Kill.

## Voice (binding — `strategy.md` §6)
**Calm. Editorial. Confident. Never cute. Never corporate. Never loud.**

If copy drifts from this → Design Ship-with-notes minimum.

## The six agents
- **Engineer** (`Agents/engineer.md`) — before any code change. Each follows a Critical path.
- **Strategist** (`Agents/strategist.md`) — before any scope change.
- **Design** (`Agents/design.md`) — after any UI work.
- **Research** (`Agents/research.md`) — when external material needs scouting. Informs, does not judge. *(Tripwire: kill if 0 invocations in 3 sessions.)*
- **UX Writer** (`Agents/ux-writer.md`) — when product words need writing (microcopy, naming, taglines). Drafts the words; Design sets them. *(Hired D033.)*
- **Marketing** (`Agents/marketing.md`) — when the product needs selling (positioning, the $100k value case, pricing, GTM). Sells within the anti-goals; Strategist gates truth. *(Hired D033.)*

UX Writer + Marketing pair on `go-to-market.md` — ideas there are attributed to whichever proposed them. All six append to `agents-log.md`. Dashboard: cowork artifact `agents-dashboard`. They serve Viet (CEO); recommendations only.

## Agentic OS audit (per D006)
- **L1 Identity** — strong. CLAUDE.md, strategy, decision-log, context-primer.
- **L2 Knowledge** — thin (notes only, no skills/MCPs in project). Acceptable for v0.1.
- **L3 Workers** — in place. 6 agents (added UX Writer + Marketing, D033).
- **L4 Automation** — empty. Stay empty until v0.2.

Re-audit at end of Phase 2.

## How to act
1. Read this primer.
2. **Strategy / scope question** → Strategist.
3. **Code change** → Engineer reviews before commit.
4. **UI work** → Design reviews after.
5. Every meaningful decision → log to `decision-log.md`.
6. End of session → entry in `daily-log.md`.

## Deeper files (read on demand)
- `CLAUDE.md` — project rules, design principles
- `strategy.md` — thesis, positioning, anti-goals, voice, constraints
- `PRD.md` — what we're building in v0.1
- `roadmap.md` — phase plan, exit criteria
- `build-tracker.md` — live status board + debts (Engineer owns Status; Design/Strategist file debts; Viet prioritizes — D015)
- `decision-log.md` — full reasoning per decision
- `daily-log.md` — what happened recently
- `agents-log.md` — every agent verdict
