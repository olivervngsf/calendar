"use client";

import { useMemo } from "react";
import type { CalendarEvent, CalendarId } from "@/lib/types";
import { getWeekDays, isoDate } from "@/lib/date";
import { TODAY } from "@/lib/mock-data";
import { TimeGridView } from "./TimeGridView";

interface Props {
  anchor: Date;
  visible: Set<CalendarId>;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (iso: string, hour: number) => void;
  onSelectDay?: (iso: string) => void;
}

export function WeekView({ anchor, visible, onEventClick, onSlotClick, onSelectDay }: Props) {
  const days = useMemo(() => getWeekDays(anchor, TODAY), [anchor]);
  return (
    <TimeGridView
      days={days}
      visible={visible}
      selectedIso={isoDate(anchor)}
      onEventClick={onEventClick}
      onSlotClick={onSlotClick}
      onSelectDay={onSelectDay}
    />
  );
}
