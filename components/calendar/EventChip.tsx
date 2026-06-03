"use client";

import type { CalendarEvent } from "@/lib/types";
import { eventTimeLabel } from "@/lib/events";

interface Props {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
}

export function EventChip({ event, onClick }: Props) {
  const time = eventTimeLabel(event);

  if (event.allDay) {
    return (
      <button
        type="button"
        onClick={() => onClick?.(event)}
        style={{ backgroundColor: `var(--cal-${event.calendarId}-soft)` }}
        className="flex w-full items-baseline gap-1.5 rounded px-2 py-1 text-left text-[11px] font-medium leading-snug text-text"
      >
        <span className="truncate">{event.title}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick?.(event)}
      style={{ borderLeftColor: `var(--cal-${event.calendarId})` }}
      className="flex w-full items-baseline gap-1.5 border-l-2 py-0.5 pl-[7px] pr-1.5 text-left text-[11px] leading-snug text-text transition-colors duration-100 hover:bg-surface-soft"
    >
      {time && (
        <span className="shrink-0 font-mono text-[10px] tracking-[0.01em] text-text-3">
          {time}
        </span>
      )}
      <span className="truncate">{event.title}</span>
    </button>
  );
}
