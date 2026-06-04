"use client";

import { useMemo } from "react";
import type { CalendarEvent, CalendarId } from "@/lib/types";
import { getWeekDays, isoDate } from "@/lib/date";
import { TODAY } from "@/lib/mock-data";
import { useSettings } from "@/components/providers/SettingsProvider";
import { TimeGridView } from "./TimeGridView";
import { WeekAgenda } from "./WeekAgenda";

interface Props {
  anchor: Date;
  visible: Set<CalendarId>;
  onEventClick?: (event: CalendarEvent, anchor: DOMRect) => void;
  onEventEdit?: (event: CalendarEvent) => void;
  onSlotClick?: (iso: string, hour: number, anchor: DOMRect) => void;
  onSelectDay?: (iso: string) => void;
}

export function WeekView({
  anchor,
  visible,
  onEventClick,
  onEventEdit,
  onSlotClick,
  onSelectDay,
}: Props) {
  const { weekStyle } = useSettings();
  const days = useMemo(() => getWeekDays(anchor, TODAY), [anchor]);

  if (weekStyle === "agenda") {
    return (
      <WeekAgenda
        anchor={anchor}
        visible={visible}
        onEventClick={onEventClick}
        onEventEdit={onEventEdit}
        onSelectDay={onSelectDay}
      />
    );
  }

  return (
    <TimeGridView
      days={days}
      visible={visible}
      selectedIso={isoDate(anchor)}
      onEventClick={onEventClick}
      onEventEdit={onEventEdit}
      onSlotClick={onSlotClick}
      onSelectDay={onSelectDay}
    />
  );
}
