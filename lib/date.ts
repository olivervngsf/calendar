// Date helpers. Plain Date math, no date library (constraint: new libs need justification).
// Week starts on Sunday to match the wireframe.

import type { CalendarView, NoteUnit } from "./types";

export interface GridDay {
  date: Date;
  day: number;
  /** Belongs to a month other than the grid's anchor month (leading/trailing days). */
  faded: boolean;
  isToday: boolean;
  /** "YYYY-MM-DD" key for matching events/notes. */
  iso: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "YYYY-MM" month key used for month-scoped notes. */
export function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function monthLabel(d: Date): string {
  return MONTH_NAMES[d.getMonth()];
}

export function addMonths(d: Date, delta: number): Date {
  // Preserve day-of-month where possible (clamp to month length).
  const day = d.getDate();
  const target = new Date(d.getFullYear(), d.getMonth() + delta, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, lastDay));
  return target;
}

export function addDays(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta);
}

/** The Sunday-start week (7 days) containing `anchor`. */
export function getWeekDays(anchor: Date, today: Date = new Date()): GridDay[] {
  const start = addDays(anchor, -anchor.getDay());
  const days: GridDay[] = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    days.push({
      date,
      day: date.getDate(),
      faded: false,
      isToday: isSameDay(date, today),
      iso: isoDate(date),
    });
  }
  return days;
}

const WEEKDAY_LONG = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

/** View-aware header title — primary + subdued secondary, matching the month two-tone. */
export function viewTitle(
  view: "d" | "w" | "m" | "y",
  anchor: Date,
): { primary: string; secondary: string } {
  if (view === "y") {
    return { primary: String(anchor.getFullYear()), secondary: "" };
  }
  if (view === "d") {
    return {
      primary: `${WEEKDAY_LONG[anchor.getDay()].slice(0, 3)}, ${monthLabel(anchor)} ${anchor.getDate()}`,
      secondary: String(anchor.getFullYear()),
    };
  }
  if (view === "w") {
    const week = getWeekDays(anchor, anchor);
    const start = week[0].date;
    const end = week[6].date;
    const sameMonth = start.getMonth() === end.getMonth();
    const primary = sameMonth
      ? `${monthLabel(start)} ${start.getDate()} – ${end.getDate()}`
      : `${monthLabel(start)} ${start.getDate()} – ${monthLabel(end)} ${end.getDate()}`;
    return { primary, secondary: String(end.getFullYear()) };
  }
  return { primary: monthLabel(anchor), secondary: String(anchor.getFullYear()) };
}

/**
 * Build the 6×7 (42-cell) month grid for the anchor date's month.
 * `today` is injected for testability; defaults to now.
 */
export function getMonthGrid(anchor: Date, today: Date = new Date()): GridDay[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  // Sunday-first: how many leading days from the previous month to show.
  const lead = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - lead);

  const days: GridDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    );
    days.push({
      date,
      day: date.getDate(),
      faded: date.getMonth() !== month,
      isToday: isSameDay(date, today),
      iso: isoDate(date),
    });
  }
  return days;
}

/** Mini-month grid (same 42-cell shape) for the sidebar. */
export function getMiniMonthGrid(anchor: Date, today: Date = new Date()): GridDay[] {
  return getMonthGrid(anchor, today);
}

/**
 * ISO 8601 week number (1–53) of the week containing `d`.
 * ISO weeks are Monday-based and identified by their Thursday — so for a
 * Sunday-start grid row, pass the row's Thursday to get the intuitive number.
 */
export function getISOWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // Thursday of this week
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  return (
    1 +
    Math.round(
      (date.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000),
    )
  );
}

/**
 * The note scope for the active view + anchor — the wedge: notes scoped to the
 * exact time unit you're looking at. `key` is the stable id used to match notes.
 */
export function noteScopeFor(
  view: CalendarView,
  anchor: Date,
): { unit: NoteUnit; key: string; label: string; tag: string } {
  switch (view) {
    case "d":
      return {
        unit: "day",
        key: isoDate(anchor),
        label: `${WEEKDAY_LONG[anchor.getDay()].slice(0, 3)}, ${monthLabel(anchor)} ${anchor.getDate()}`,
        tag: "this day",
      };
    case "w": {
      const start = addDays(anchor, -anchor.getDay());
      const end = addDays(start, 6);
      const sameMonth = start.getMonth() === end.getMonth();
      const label = sameMonth
        ? `${monthLabel(start)} ${start.getDate()} – ${end.getDate()}`
        : `${monthLabel(start)} ${start.getDate()} – ${monthLabel(end)} ${end.getDate()}`;
      return { unit: "week", key: isoDate(start), label, tag: "this week" };
    }
    case "y":
      return {
        unit: "year",
        key: String(anchor.getFullYear()),
        label: String(anchor.getFullYear()),
        tag: "this year",
      };
    default:
      return {
        unit: "month",
        key: monthKey(anchor),
        label: `${monthLabel(anchor)} ${anchor.getFullYear()}`,
        tag: "this month",
      };
  }
}

export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAY_INITIAL = ["S", "M", "T", "W", "T", "F", "S"];
