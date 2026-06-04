"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "@/lib/types";
import { HOUR_PX, layoutTimedEvents } from "@/lib/timegrid";
import { TimeEventBlock } from "./TimeEventBlock";

interface Props {
  iso: string;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent, anchor: DOMRect) => void;
  onEventEdit?: (event: CalendarEvent) => void;
  onSlotClick?: (iso: string, hour: number, anchor: DOMRect) => void;
  /** Hide the right border on the last column. */
  last?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function DayColumn({ iso, events, onEventClick, onEventEdit, onSlotClick, last }: Props) {
  const placed = useMemo(() => layoutTimedEvents(events), [events]);

  return (
    <div
      className={"relative " + (last ? "" : "border-r border-border-faint")}
      style={{ height: 24 * HOUR_PX }}
    >
      {/* Hour slots — clickable to create */}
      {HOURS.map((h) => (
        <button
          key={h}
          type="button"
          aria-label={`${iso} ${String(h).padStart(2, "0")}:00`}
          onClick={(e) => onSlotClick?.(iso, h, e.currentTarget.getBoundingClientRect())}
          style={{ height: HOUR_PX }}
          className="block w-full border-b border-border-faint transition-colors hover:bg-surface-soft/60"
        />
      ))}

      {/* Positioned events */}
      {placed.map((p) => (
        <TimeEventBlock
          key={p.event.id}
          placed={p}
          onClick={onEventClick}
          onDoubleClick={onEventEdit}
        />
      ))}
    </div>
  );
}
