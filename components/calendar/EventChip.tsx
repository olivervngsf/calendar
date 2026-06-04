"use client";

import type { MouseEvent } from "react";
import type { CalendarEvent } from "@/lib/types";
import { eventTimeLabel } from "@/lib/events";
import { useData } from "@/components/providers/DataProvider";
import { useSelection } from "@/components/providers/SelectionProvider";

interface Props {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent, anchor: DOMRect) => void;
}

export function EventChip({ event, onClick }: Props) {
  const { colorOf } = useData();
  const { isSelected, toggle } = useSelection();
  const color = colorOf(event.calendarId);
  const selected = isSelected(event.id);
  const time = eventTimeLabel(event);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      toggle(event.id);
      return;
    }
    onClick?.(event, e.currentTarget.getBoundingClientRect());
  }

  if (event.allDay) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={selected}
        style={{ backgroundColor: `var(--cal-${color}-soft)` }}
        className={
          "flex w-full items-baseline gap-1.5 rounded px-2 py-1 text-left text-[11px] font-medium leading-snug text-text " +
          (selected ? "ring-1 ring-accent" : "")
        }
      >
        <span className="truncate">{event.title}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={selected}
      style={{ borderLeftColor: `var(--cal-${color})` }}
      className={
        "flex w-full items-baseline gap-1.5 border-l-2 py-0.5 pl-[7px] pr-1.5 text-left text-[11px] leading-snug text-text transition-colors duration-100 hover:bg-surface-soft " +
        (selected ? "rounded-r ring-1 ring-accent" : "")
      }
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
