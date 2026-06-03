"use client";

import type { GridDay } from "@/lib/date";
import type { CalendarEvent } from "@/lib/types";
import { EventChip } from "./EventChip";

interface Props {
  day: GridDay;
  events: CalendarEvent[];
  /** The focused day (highlighted distinctly from today). */
  selected?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onDayClick?: (iso: string) => void;
}

const MAX_VISIBLE = 3;

export function MonthCell({ day, events, selected, onEventClick, onDayClick }: Props) {
  const shown = events.slice(0, MAX_VISIBLE);
  const overflow = events.length - shown.length;

  return (
    <div
      className={
        "relative flex min-h-0 flex-col gap-1.5 border-b border-r border-border-faint px-2.5 pb-2 pt-2.5 " +
        (day.faded ? "bg-bg" : "bg-surface")
      }
    >
      <button
        type="button"
        onClick={() => onDayClick?.(day.iso)}
        aria-label={day.iso}
        className={
          "inline-flex h-[22px] w-[22px] items-center justify-center self-start rounded-full font-mono text-xs tracking-[0.01em] transition-colors " +
          (day.isToday
            ? "border-2 border-today-ring font-semibold text-text "
            : selected
              ? "bg-accent-soft font-semibold text-accent "
              : day.faded
                ? "text-text-faint hover:bg-surface-soft "
                : "text-text-2 hover:bg-surface-soft ")
        }
      >
        {day.day}
      </button>

      {shown.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {shown.map((e) => (
            <EventChip key={e.id} event={e} onClick={onEventClick} />
          ))}
        </div>
      )}

      {overflow > 0 && (
        <span className="ml-2 mt-0.5 font-mono text-[10px] tracking-[0.04em] text-text-3">
          +{overflow} more
        </span>
      )}
    </div>
  );
}
