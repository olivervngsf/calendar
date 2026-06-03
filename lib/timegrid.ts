import type { CalendarEvent } from "./types";

/** Pixels per hour in the week/day time grid. */
export const HOUR_PX = 48;
export const DAY_START_HOUR = 0;
export const DAY_END_HOUR = 24;

/** Minutes from midnight for an event endpoint ("YYYY-MM-DDTHH:MM"). */
export function minutesOf(iso: string): number {
  const h = Number(iso.slice(11, 13));
  const m = Number(iso.slice(14, 16));
  return h * 60 + m;
}

export interface PlacedEvent {
  event: CalendarEvent;
  startMin: number;
  endMin: number;
  /** Column index within an overlap cluster. */
  lane: number;
  /** Total columns in this event's cluster. */
  lanes: number;
}

/**
 * Lay out timed (non-all-day) events into side-by-side lanes so overlaps don't
 * stack on top of each other. Events that don't overlap each other use the full
 * width; a cluster of mutually overlapping events splits the width evenly.
 */
export function layoutTimedEvents(events: CalendarEvent[]): PlacedEvent[] {
  const timed = events
    .filter((e) => !e.allDay)
    .map((e) => ({ e, s: minutesOf(e.start), end: minutesOf(e.end) }))
    .sort((a, b) => a.s - b.s || a.end - b.end);

  const result: PlacedEvent[] = [];
  let cluster: { e: CalendarEvent; s: number; end: number; lane: number }[] = [];
  let clusterEnd = -1;

  const flush = () => {
    const laneEnds: number[] = [];
    for (const item of cluster) {
      let lane = laneEnds.findIndex((end) => end <= item.s);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(item.end);
      } else {
        laneEnds[lane] = item.end;
      }
      item.lane = lane;
    }
    const lanes = laneEnds.length || 1;
    for (const item of cluster) {
      result.push({
        event: item.e,
        startMin: item.s,
        endMin: Math.max(item.end, item.s + 15), // floor tiny/zero durations
        lane: item.lane,
        lanes,
      });
    }
    cluster = [];
    clusterEnd = -1;
  };

  for (const item of timed) {
    if (cluster.length && item.s >= clusterEnd) flush();
    cluster.push({ ...item, lane: 0 });
    clusterEnd = Math.max(clusterEnd, item.end);
  }
  if (cluster.length) flush();

  return result;
}

/** Hour labels (e.g. "9 AM") for the time axis. */
export function hourLabel(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}
