// Domain types for the calendar app.
// Shaped for the future (per Research readout 2026-05-29): every event carries its
// source calendar (always surfaced in UI) and a visibility field, even while v0.1 is
// mock-only. Retrofitting these later would break every row.

// Calendars are user-managed, so the id is an opaque string (seed ids stay stable).
export type CalendarId = string;

/** Curated calendar palette keys — map to `--cal-<key>` / `--cal-<key>-soft`. */
export type CalendarColor =
  | "teal"
  | "clay"
  | "slate"
  | "sage"
  | "plum"
  | "indigo";

export const CALENDAR_COLORS: CalendarColor[] = [
  "teal",
  "clay",
  "slate",
  "sage",
  "plum",
  "indigo",
];

export type CalendarView = "d" | "w" | "m" | "y";

export interface Calendar {
  id: CalendarId;
  name: string;
  color: CalendarColor;
}

/** A saved, named combination of calendars (a lens you can flip to). */
export interface CalendarSet {
  id: string;
  name: string;
  calendarIds: CalendarId[];
}

export interface CalendarEvent {
  id: string;
  calendarId: CalendarId;
  title: string;
  /** ISO date-time (local). For all-day events the time portion is ignored. */
  start: string;
  end: string;
  allDay: boolean;
  /** "default" = topic visible; "busy" = show-busy-hide-topic. Shape only in v0.1. */
  visibility: "default" | "busy";
}

export type NoteUnit = "day" | "week" | "month" | "year";
export type NoteType = "decision" | "daily";

export interface NoteScope {
  unit: NoteUnit;
  /** Stable key for the time unit, e.g. "2026-05" (month) or "2026-05-29" (day). */
  key: string;
}

export interface Note {
  id: string;
  scope: NoteScope;
  type: NoteType;
  title: string;
  body: string;
  /** ISO date the note was written. */
  date: string;
  /** Optional short tag shown above the note, e.g. "D009" or "today". */
  tag?: string;
}
