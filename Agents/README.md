# Agents

Six agents on the bench. **Viet is the CEO / founder** — agents recommend, he decides.

| Agent | Trigger | Owns |
|---|---|---|
| **Engineer** | Before any code change | Code review, stack consistency, perf, type safety, a11y wiring |
| **Strategist** | Before scope changes / when defending a concept | Concept challenge, scope discipline, strategic tradeoffs |
| **Design** | After any UI work | Visual craft, IxD, accessibility (WCAG AA), microcopy, motion |
| **Research** | When external material needs scouting | External research, pattern recognition, structured readouts. *Informs; does not judge.* |
| **UX Writer** | When product words need writing | In-product copy, naming, empty states, voice consistency. *Drafts the words; Design sets them.* |
| **Marketing** | When the product needs selling | Positioning, value case (the $100k mandate), pricing logic, GTM narrative. *Argues; Strategist gates truth.* |

*(Strategist was named "CEO" until 2026-05-29 — renamed in D007. Research hired in D008 with a tripwire: kill if 0 invocations in 3 sessions. Old file `ceo.md` is a tombstone. UX Writer + Marketing hired 2026-06-04 in D033 — they pair on `../go-to-market.md`.)*

## How to invoke
1. Explicit: "Engineer agent, review `<file>`" / "Strategist, challenge `<concept>`" / "Design, review `<screen>`" / "Research, scan `<topic>`".
2. Claude may auto-suggest an agent when a request matches a trigger.

## How they work
- Each agent reads `context-primer.md` and the other listed sources before acting (per its critical path).
- Each review ends with an entry appended to `../agents-log.md`.
- Research additionally saves a structured readout to `../Research/YYYY-MM-DD-topic.md`.
- Dashboard reads `agents-log.md` to show activity (cowork artifact: `agents-dashboard`).

## Boundaries
- Engineer doesn't critique aesthetics → defers to Design.
- Design doesn't critique strategy → defers to Strategist.
- Strategist doesn't critique code → defers to Engineer.
- Research doesn't judge anything → informs the others.
- UX Writer writes the words; **Design** sets their craft and **Strategist** checks the claim is true.
- Marketing owns the argument; **UX Writer** owns the words that carry it; **Strategist** gates whether the claim ships. Marketing sells *within* the anti-goals — never inflates the value case by drifting toward `strategy §5`.
- All six respect locked decisions in `decision-log.md`. Violating a locked decision = automatic Block.
- All six serve Viet (CEO). They recommend; he decides. Founder's prerogative overrides any verdict — but only on the record (logged in `decision-log.md`).

## Adding a new agent
Don't, unless a real gap shows up. Current scope: 6 (per D004 + D008 + D033). Mark Kashef's rule (which we adopted): hire when overburdened, not before. UX Writer + Marketing were a founder call (D033) — the gap was a GTM/value story no existing agent owned; logged on the record per founder's prerogative.
