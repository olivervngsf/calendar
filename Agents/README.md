# Agents

Four agents on the bench. **Viet is the CEO / founder** — agents recommend, he decides.

| Agent | Trigger | Owns |
|---|---|---|
| **Engineer** | Before any code change | Code review, stack consistency, perf, type safety, a11y wiring |
| **Strategist** | Before scope changes / when defending a concept | Concept challenge, scope discipline, strategic tradeoffs |
| **Design** | After any UI work | Visual craft, IxD, accessibility (WCAG AA), microcopy, motion |
| **Research** | When external material needs scouting | External research, pattern recognition, structured readouts. *Informs; does not judge.* |

*(Strategist was named "CEO" until 2026-05-29 — renamed in D007. Research hired in D008 with a tripwire: kill if 0 invocations in 3 sessions. Old file `ceo.md` is a tombstone.)*

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
- All four respect locked decisions in `decision-log.md`. Violating a locked decision = automatic Block.
- All four serve Viet (CEO). They recommend; he decides. Founder's prerogative overrides any verdict — but only on the record (logged in `decision-log.md`).

## Adding a new agent
Don't, unless a real gap shows up across multiple weeks. Current scope: 4 (per D004 + D008). Mark Kashef's rule (which we adopted): hire when overburdened, not before.
