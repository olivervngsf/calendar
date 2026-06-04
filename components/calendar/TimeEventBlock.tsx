"use client";

import type { CalendarEvent } from "@/lib/types";
import type { PlacedEvent } from "@/lib/timegrid";
import { HOUR_PX } from "@/lib/timegrid";
import { eventTimeLabel } from "@/lib/events";
import { useData } from "@/components/providers/DataProvider";

interface Props {
  placed: PlacedEvent;
  onClick?: (event: CalendarEvent) => void;
}

export function TimeEventBlock({ placed, onClick }: Props) {
  const { colorOf } = useData();
  const { event, startMin, endMin, lane, lanes } = placed;
  const color = colorOf(event.calendarId);
  const top = (startMin / 60) * HOUR_PX;
  const height = Math.max(((endMin - startMin) / 60) * HOUR_PX, 18);
  const widthPct = 100 / lanes;
  const leftPct = lane * widthPct;
  const compact = height < 34;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      style={{
        top,
        height,
        left: `calc(${leftPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
        backgroundColor: `var(--cal-${color}-soft)`,
        borderLeftColor: `var(--cal-${color})`,
      }}
      className="absolute z-10 flex flex-col gap-px overflow-hidden rounded-r-[3px] border-l-2 px-1.5 py-1 text-left text-text transition-[filter] hover:brightness-[0.97]"
    >
      <span
        className={
          "truncate font-medium leading-tight " + (compact ? "text-[10px]" : "text-[11px]")
        }
      >
        {event.title}
      </span>
      {!compact && (
        <span className="truncate font-mono text-[9px] tracking-[0.01em] text-text-3">
          {eventTimeLabel(event)}
        </span>
      )}
    </button>
  );
}
