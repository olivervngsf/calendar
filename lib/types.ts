// Domain types for the calendar app.
// Shaped for the future (per Research readout 2026-05-29): every event carries its
// source calendar (always surfaced in UI) and a visibility field, even while v0.1 is
// mock-only. Retrofitting these later would break every row.

export type CalendarId = "personal" | "plan" | "erich";

export type CalendarView = "d" | "w" | "m" | "y";

export interface Calendar {
  id: CalendarId;
  name: string;
  /** CSS variable name carrying this calendar's color, e.g. "--cal-personal". */
  colorVar: string;
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
