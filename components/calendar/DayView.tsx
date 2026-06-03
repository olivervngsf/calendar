"use client";

import { useMemo } from "react";
import type { CalendarEvent, CalendarId } from "@/lib/types";
import type { GridDay } from "@/lib/date";
import { isoDate, isSameDay } from "@/lib/date";
import { TODAY } from "@/lib/mock-data";
import { TimeGridView } from "./TimeGridView";

interface Props {
  anchor: Date;
  visible: Set<CalendarId>;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (iso: string, hour: number) => void;
}

export function DayView({ anchor, visible, onEventClick, onSlotClick }: Props) {
  const days = useMemo<GridDay[]>(
    () => [
      {
        date: anchor,
        day: anchor.getDate(),
        faded: false,
        isToday: isSameDay(anchor, TODAY),
        iso: isoDate(anchor),
      },
    ],
    [anchor],
  );
  return (
    <TimeGridView
      days={days}
      visible={visible}
      onEventClick={onEventClick}
      onSlotClick={onSlotClick}
    />
  );
}
