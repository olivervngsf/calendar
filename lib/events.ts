import type { CalendarEvent, CalendarId } from "./types";

/** The ISO date ("YYYY-MM-DD") portion of an event's start. */
export function eventDateKey(e: CalendarEvent): string {
  return e.start.slice(0, 10);
}

/** Short time label ("09:30") or "" for all-day events. */
export function eventTimeLabel(e: CalendarEvent): string {
  return e.allDay ? "" : e.start.slice(11, 16);
}

/**
 * Group visible events by ISO day. All-day events sort first, then by start time.
 */
export function eventsByDay(
  events: CalendarEvent[],
  visible: Set<CalendarId>,
): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    if (!visible.has(e.calendarId)) continue;
    const key = eventDateKey(e);
    const list = map.get(key);
    if (list) list.push(e);
    else map.set(key, [e]);
  }
  for (const list of map.values()) {
    list.sort((a, b) => {
      if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
      return a.start.localeCompare(b.start);
    });
  }
  return map;
}

/** Count of visible events per calendar id, for the sidebar tally. */
export function countByCalendar(
  events: CalendarEvent[],
): Record<CalendarId, number> {
  const counts: Record<CalendarId, number> = { personal: 0, plan: 0, erich: 0 };
  for (const e of events) counts[e.calendarId]++;
  return counts;
}
