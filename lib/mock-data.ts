import type { Calendar, CalendarEvent, Note } from "./types";

// v0.1 is mock-only (D001). For a coherent showcase, anchor "today" to a fixed date
// so the hand-crafted month of Viet's life always lines up — rather than real `new Date()`,
// which would open on an empty current month. Mock data is a content-design problem (D001).
export const TODAY = new Date(2026, 4, 29); // 2026-05-29, Friday

export const CALENDARS: Calendar[] = [
  { id: "personal", name: "Personal", color: "teal" },
  { id: "plan", name: "Plan", color: "clay" },
  { id: "erich", name: "Shared · Erich", color: "slate" },
];

// A realistic month of Viet's life across three calendars (May 2026).
// Ported and extended from wireframes/v0-month-view.html.
function ev(
  id: string,
  calendarId: CalendarEvent["calendarId"],
  title: string,
  date: string,
  startTime: string | null,
  endTime: string | null,
): CalendarEvent {
  const allDay = startTime === null;
  return {
    id,
    calendarId,
    title,
    start: allDay ? `${date}T00:00` : `${date}T${startTime}`,
    end: allDay ? `${date}T23:59` : `${date}T${endTime}`,
    allDay,
    visibility: "default",
  };
}

export const EVENTS: CalendarEvent[] = [
  // late April (trailing into the May grid)
  ev("e-0430-coffee", "personal", "Coffee · Sarah", "2026-04-30", "09:30", "10:30"),

  // week of May 4
  ev("e-0504-sprint", "plan", "Sprint planning", "2026-05-04", "10:00", "11:00"),
  ev("e-0504-therapy", "personal", "Therapy", "2026-05-04", "11:30", "12:30"),
  ev("e-0505-erich", "erich", "1:1 · Erich", "2026-05-05", "11:00", "11:30"),
  ev("e-0506-crit", "plan", "Design crit", "2026-05-06", "14:00", "15:00"),
  ev("e-0508-demo", "plan", "Demo", "2026-05-08", "16:00", "16:30"),

  // week of May 11
  ev("e-0511-sprint", "plan", "Sprint planning", "2026-05-11", "10:00", "11:00"),
  ev("e-0511-therapy", "personal", "Therapy", "2026-05-11", "11:30", "12:30"),
  ev("e-0512-erich", "erich", "1:1 · Erich", "2026-05-12", "11:00", "11:30"),
  ev("e-0513-run", "personal", "Run · 5k", "2026-05-13", "07:00", "07:45"),
  ev("e-0515-demo", "plan", "Demo", "2026-05-15", "16:00", "16:30"),

  // week of May 18 — build sprint
  ev("e-0518-sprint", "plan", "Sprint planning", "2026-05-18", "10:00", "11:00"),
  ev("e-0518-therapy", "personal", "Therapy", "2026-05-18", "11:30", "12:30"),
  ev("e-0519-erich", "erich", "1:1 · Erich", "2026-05-19", "11:00", "11:30"),
  ev("e-0519-build", "plan", "Calendar app · build sprint", "2026-05-19", null, null),
  ev("e-0520-build", "plan", "Build sprint", "2026-05-20", null, null),
  ev("e-0521-build", "plan", "Build sprint", "2026-05-21", null, null),
  ev("e-0521-review", "erich", "Design review · Erich", "2026-05-21", "15:00", "16:00"),
  ev("e-0522-build", "plan", "Build sprint", "2026-05-22", null, null),
  ev("e-0522-demo", "plan", "Demo", "2026-05-22", "16:00", "16:30"),

  // week of May 25 — today is May 29
  ev("e-0525-sprint", "plan", "Sprint planning", "2026-05-25", "10:00", "11:00"),
  ev("e-0525-therapy", "personal", "Therapy", "2026-05-25", "11:30", "12:30"),
  ev("e-0526-erich", "erich", "1:1 · Erich", "2026-05-26", "11:00", "11:30"),
  ev("e-0527-run", "personal", "Run · 5k", "2026-05-27", "07:00", "07:45"),
  ev("e-0527-q3", "plan", "Plan Q3", "2026-05-27", "14:00", "15:30"),
  ev("e-0529-kickoff", "plan", "v0.1 kickoff · build sprint", "2026-05-29", null, null),
  ev("e-0529-dinner", "personal", "Dinner · home", "2026-05-29", "18:30", "20:00"),
  ev("e-0530-park", "personal", "Park run", "2026-05-30", "08:00", "09:00"),
];

// Notes scoped to the visible month (the wedge: time-scoped notes).
// Seeded with the project's real decision + daily log entries.
export const NOTES: Note[] = [
  {
    id: "n-d009",
    scope: { unit: "month", key: "2026-05" },
    type: "decision",
    title: "Lock Vision + Mission in strategy.md",
    body: "World-class craft, calm pace, every minute earned through clarity — not engagement. Beat Apple on calm, Google on warmth.",
    date: "2026-05-29",
    tag: "decision · D009",
  },
  {
    id: "n-d008",
    scope: { unit: "month", key: "2026-05" },
    type: "decision",
    title: "Hire Research agent",
    body: "Scout + synthesize, no judging. Tripwire: kill if 0 invocations in 3 sessions.",
    date: "2026-05-29",
    tag: "decision · D008",
  },
  {
    id: "n-d001",
    scope: { unit: "month", key: "2026-05" },
    type: "decision",
    title: "v0.1 = UI prototype with mock data",
    body: "No real OAuth, no real DB writes. UI craft + mock-data narrative. Real integration is v0.2.",
    date: "2026-05-29",
    tag: "decision · D001",
  },
  {
    id: "n-daily-0529",
    scope: { unit: "month", key: "2026-05" },
    type: "daily",
    title: "v0.1 kickoff",
    body: "Scaffolded workspace, locked stack + scope, hired 4-agent bench (Engineer · Strategist · Design · Research), drafted strategy + first-pass Month view.",
    date: "2026-05-29",
    tag: "today",
  },
  {
    id: "n-daily-0522",
    scope: { unit: "month", key: "2026-05" },
    type: "daily",
    title: "Sketches",
    body: "Started thinking about the 3-pane layout. Time-scoped notes feels right. Apple is beautiful but cold; Google is dense but utility-first.",
    date: "2026-05-22",
  },

  // ── Day scope (Fri, May 29) ──
  {
    id: "n-day-0529-d",
    scope: { unit: "day", key: "2026-05-29" },
    type: "decision",
    title: "Cut the heatmap year view",
    body: "Year ships as a 12-month grid first. Heatmap was novelty over clarity — revisit only if it earns its place.",
    date: "2026-05-29",
    tag: "today",
  },
  {
    id: "n-day-0529-l",
    scope: { unit: "day", key: "2026-05-29" },
    type: "daily",
    title: "Good build day",
    body: "Shell + Month landed and felt right on first paint. The editorial-calm direction holds under real data.",
    date: "2026-05-29",
    tag: "today",
  },

  // ── Week scope (week of May 24–30) ──
  {
    id: "n-week-0524-d",
    scope: { unit: "week", key: "2026-05-24" },
    type: "decision",
    title: "Protect the build sprint",
    body: "No new scope this week. Foundation + Month, then CRUD. Everything else is a debt on the tracker, not a detour.",
    date: "2026-05-25",
  },
  {
    id: "n-week-0524-l",
    scope: { unit: "week", key: "2026-05-24" },
    type: "daily",
    title: "The week of the v0.1 push",
    body: "Momentum is high. Notes-as-wedge is starting to feel obvious as the views come online.",
    date: "2026-05-29",
  },

  // ── Year scope (2026) ──
  {
    id: "n-year-2026-d",
    scope: { unit: "year", key: "2026" },
    type: "decision",
    title: "Ship v0.1 as a showcase, not a product",
    body: "Mock data, single user, craft-first. Real OAuth + persistence is v0.2. Prove the experience before the integration.",
    date: "2026-05-29",
  },
  {
    id: "n-year-2026-l",
    scope: { unit: "year", key: "2026" },
    type: "daily",
    title: "The year time and thinking merged",
    body: "Set out to prove a calendar can hold prose. 2026 is about making that obvious in 60 seconds.",
    date: "2026-05-29",
  },
];
