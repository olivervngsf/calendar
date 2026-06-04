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
  onSlotClick?: (iso: string, hour: number) => void;
  onSelectDay?: (iso: string) => void;
}

export function WeekView({
  anchor,
  visible,
  onEventClick,
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
      onSlotClick={onSlotClick}
      onSelectDay={onSelectDay}
    />
  );
}
