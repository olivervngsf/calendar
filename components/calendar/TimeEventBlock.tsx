"use client";

import type { MouseEvent } from "react";
import type { CalendarEvent } from "@/lib/types";
import type { PlacedEvent } from "@/lib/timegrid";
import { HOUR_PX } from "@/lib/timegrid";
import { eventTimeLabel } from "@/lib/events";
import { useData } from "@/components/providers/DataProvider";
import { useSelection } from "@/components/providers/SelectionProvider";

interface Props {
  placed: PlacedEvent;
  onClick?: (event: CalendarEvent, anchor: DOMRect) => void;
  onDoubleClick?: (event: CalendarEvent) => void;
}

export function TimeEventBlock({ placed, onClick, onDoubleClick }: Props) {
  const { colorOf } = useData();
  const { isSelected, toggle } = useSelection();
  const { event, startMin, endMin, lane, lanes } = placed;
  const color = colorOf(event.calendarId);
  const selected = isSelected(event.id);
  const top = (startMin / 60) * HOUR_PX;
  const height = Math.max(((endMin - startMin) / 60) * HOUR_PX, 18);
  const widthPct = 100 / lanes;
  const leftPct = lane * widthPct;
  const compact = height < 34;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          toggle(event.id);
          return;
        }
        onClick?.(event, e.currentTarget.getBoundingClientRect());
      }}
      onDoubleClick={(e: MouseEvent<HTMLButtonElement>) => {
        if (e.metaKey || e.ctrlKey) return;
        e.stopPropagation();
        onDoubleClick?.(event);
      }}
      style={{
        top,
        height,
        left: `calc(${leftPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
        backgroundColor: `var(--cal-${color}-soft)`,
        borderLeftColor: `var(--cal-${color})`,
      }}
      className={
        "absolute z-10 flex flex-col gap-px overflow-hidden rounded-r-[3px] border-l-2 px-1.5 py-1 text-left text-text transition-[filter] hover:brightness-[0.97] " +
        (selected ? "ring-1 ring-accent" : "")
      }
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
