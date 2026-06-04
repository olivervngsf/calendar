# Go-to-Market — The $100k Value Case

**Date:** 2026-06-04
**Status:** Working draft v0.1
**Owners:** Marketing (the argument) + UX Writer (the words). They draft here together.
**Reviewed by:** none yet — Strategist to verify claims, Design to set the words, Viet to decide.

> **How to read this note.** Every idea is **attributed to the agent who proposed it** — `— Marketing` for
> positioning / value / pricing, `— UX Writer` for the lines and naming. When the two disagree, both takes
> are kept so Viet can pick. This is a draft surface, not law: nothing here ships until Strategist verifies
> the claim is true and Viet signs off. Voice holds throughout (`strategy.md §6`): **calm, editorial,
> confident — never cute, corporate, or loud.**

---

## 1. The buyer and the moment

> The buyer isn't "people who need a calendar" — everyone has one. The buyer is a **knowledge worker who
> already keeps Notion open next to their calendar and resents the context switch** (`strategy §3`). The
> moment we're selling into is the 10 seconds they spend deciding whether this is "another calendar" or
> "the thing that finally puts my thinking next to my time."
> — **Marketing**

> So the first line can't describe the product. It has to name *their* problem back to them. The reader
> should think "that's me" before they think "what is this."
> — **UX Writer**

---

## 2. The load-bearing claim

> One claim, not five. **"The only calendar where your notes live where your time does."** Everything else
> — the views, the palette, the motion — is proof of that one sentence. The wedge (time-scoped notes, no
> competitor does it, `strategy §2`) *is* the pitch.
> — **Marketing**

> Drafting the hero line off that claim — three options, recommend the first:
>
> 1. **"Time, with a place to think."** ← recommended. Calm, editorial, says the whole thesis in four words.
> 2. "Your calendar, finally with a memory."
> 3. "Plan in prose. Remember in narrative."
>
> Why #1: it's the quietest, and quiet is our register. #2 leans clever ("finally"); #3 is sharper but
> reads more like a manifesto than a hero.
> — **UX Writer**

> Take #1 as the hero, keep #3 as the section header further down the page — it earns its edge once the
> reader is already in.
> — **Marketing**

---

## 3. Where's the $100k

The mandate: make the value legible at **over $100k** — without betraying an anti-goal (`strategy §5`) to
get there. Three framings, math shown. Recommended framing for v0.1 first.

### Framing A — Career value *(recommended for v0.1)*
> v0.1 is a **portfolio piece** (`strategy §1`). Its job is to return six figures in *Viet's* career, not in
> subscription revenue. The math: one senior/staff product-design role moved up a band, or landed a quarter
> sooner, is **$30–60k in comp delta**; a single 3-month design retainer at $12–15k/mo is **$36–45k**; the
> artifact opening *one* door that wouldn't have opened otherwise clears **$100k** on its own. The product
> we're "selling" here is **Viet's judgment**, and the calendar is the evidence.
> — **Marketing**

> Then the artifact has to *sound* like a senior built it. That's why the empty states, the error copy, the
> one-sentence pitch all matter — a hiring manager reads craft in the small words. The portfolio line:
> **"A calendar I built to prove time and thinking belong on one surface."** Calm, first-person, no hype.
> — **UX Writer**

### Framing B — Prosumer ARR
> If it becomes a real tool: a calm, paid product for knowledge workers (`§3`). The math at a fair prosumer
> price — **$9/mo ≈ $100/yr** — means **~1,000 paying users = ~$100k ARR**. That's a *small, reachable*
> base for a sharply-positioned niche tool, not a growth-hacking moonshot. On-strategy **only** if it never
> drifts into seats/team-scheduling to pad the number (`§5`).
> — **Marketing**

> Pricing-page copy, kept honest and unembarrassed about charging:
> **"$9 a month. No free-with-your-data tier, no ads, no upsell maze. You're the customer, not the product."**
> — **UX Writer**

### Framing C — Acquisition / IP value
> The defensible asset is the **wedge itself** — time-scoped notes as a first-class primitive. "No competitor
> does this" (`§2`) is exactly what makes the concept, not just the code, worth paying for. This is the
> framing for a *buyer of the idea*, not a user of the app.
> — **Marketing**

> **Recommendation: lead with A, hold B in reserve, mention C only in a founder conversation.** For a
> showcase, the honest and strongest story is career value — and honesty *is* the brand.
> — **Marketing**

---

## 4. The 60-second pitch

> Structure: problem → wedge → proof → ask. Marketing's frame, UX Writer's words.
> — **Marketing**

> **The pitch (read it aloud, it should take ~50 seconds):**
>
> "You already plan in two places. Your calendar holds the hours; your notes app holds the thinking. Every
> day you pay a small tax moving between them — and the *why* behind a meeting lives a tab away from the
> meeting.
>
> This calendar closes that gap. Every view — day, week, month, year — carries a notes panel scoped to
> exactly that span. The week's decisions sit next to the week. The year's reflections sit next to the year.
> Two note types out of the box: a decision log and a daily log.
>
> No other calendar treats notes as a first-class citizen. Apple keeps them an afterthought; Google
> optimizes for scheduling, not reflection. This one is built for people who treat the calendar as a memory,
> not just a timetable.
>
> It's calm on purpose — no streaks, no nudges, no AI writing your week for you. Just time, with a place to
> think."
> — **UX Writer**

> Holds. Note the last paragraph does double duty — it's the close *and* it pre-empts the "is this another
> AI productivity app" objection by naming the anti-goals as features. Keep it.
> — **Marketing**

---

## 5. Landing page — section skeleton

> Order matters. Each section earns the scroll to the next. One primary action on the page: **see the
> calendar** (live demo), not "sign up." (`CLAUDE.md`: one clear primary action.)
> — **Marketing**

| # | Section | Argument (Marketing) | Words (UX Writer) |
|---|---|---|---|
| 1 | Hero | The thesis in one breath | **"Time, with a place to think."** + 1-line subhead |
| 2 | The gap | Name the two-tab tax | **"Your calendar holds the hours. Your notes hold the why. They've never been in the same place."** |
| 3 | The wedge | Time-scoped notes, shown | **"Plan in prose. Remember in narrative."** + the panel, live |
| 4 | Proof | D/W/M/Y, each with its note | Captions, not adjectives — show the month note next to the month |
| 5 | What it isn't | Anti-goals as a promise | **"No streaks. No nudges. No AI writing your week. You write it."** |
| 6 | Close | The quiet ask | **"See the calendar →"** (demo, not signup) |

> The primary CTA is **"See the calendar →"**, not "Get started" or "Try free." We're confident enough to
> just show it. Lower-confidence verbs ("Try", "Start") undercut the calm.
> — **UX Writer**

---

## 6. Proof points (must stay true — Strategist to verify)

> Claims we can stand behind today, each tied to something real in the build:
> - **"Notes scoped to every view"** → the wedge, in `strategy §2` and the wireframes.
> - **"Two note types: decision log + daily log"** → in PRD / strategy, shipped in the month-view wireframe.
> - **"Calm by design — no engagement metrics"** → anti-goals, `§5`, enforced by agents.
> - **"Read-first: click an event to recall it, not mutate it"** → D032, a real interaction decision.
> — **Marketing**

> Each proof point becomes a one-line caption under its screenshot. No claim ships without a screenshot
> behind it — that's the rule that keeps the page honest.
> — **UX Writer**

---

## 7. Open decisions for Viet

- [ ] **Which $100k framing leads?** Marketing recommends **A (career value)** for v0.1.
- [ ] **Hero line:** UX Writer recommends **"Time, with a place to think."**
- [ ] **Pricing stance:** publish a price now (Framing B), or hold pricing until v0.2 has real persistence?
- [ ] **Primary CTA:** confirm **"See the calendar →"** over a signup-first page.

> When Viet picks, log the choices in `decision-log.md` and we'll lock this note from draft to v1.
> — **Marketing**

---

*Linked: [strategy](strategy.md) · [PRD](PRD.md) · [Agents](Agents/README.md) · [decision-log](decision-log.md)*
*Agents: [Marketing](Agents/marketing.md) · [UX Writer](Agents/ux-writer.md)*
