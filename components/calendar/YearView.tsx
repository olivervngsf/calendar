"use client";

import { useMemo } from "react";
import type { CalendarId } from "@/lib/types";
import { isoDate } from "@/lib/date";
import { eventDateKey } from "@/lib/events";
import { useData } from "@/components/providers/DataProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { YearMonth } from "./YearMonth";
import { YearColumns } from "./YearColumns";

interface Props {
  anchor: Date;
  visible: Set<CalendarId>;
  onSelectDay: (iso: string) => void;
  onSelectMonth: (month: Date) => void;
}

export function YearView({ anchor, visible, onSelectDay, onSelectMonth }: Props) {
  const { events } = useData();
  const { yearStyle } = useSettings();
  const year = anchor.getFullYear();

  const eventDays = useMemo(() => {
    const s = new Set<string>();
    for (const e of events) {
      if (visible.has(e.calendarId)) s.add(eventDateKey(e));
    }
    return s;
  }, [events, visible]);

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, m) => new Date(year, m, 1)),
    [year],
  );
  const selectedIso = isoDate(anchor);

  if (yearStyle === "columns") {
    return (
      <YearColumns
        anchor={anchor}
        eventDays={eventDays}
        selectedIso={selectedIso}
        onSelectDay={onSelectDay}
        onSelectMonth={onSelectMonth}
      />
    );
  }

  return (
    <div className="grid flex-1 auto-rows-min grid-cols-4 gap-x-9 gap-y-7 overflow-y-auto bg-bg px-8 py-7 max-[1200px]:grid-cols-3 max-[820px]:grid-cols-2">
      {months.map((m) => (
        <YearMonth
          key={m.getMonth()}
          month={m}
          eventDays={eventDays}
          selectedIso={selectedIso}
          onSelectDay={onSelectDay}
          onSelectMonth={onSelectMonth}
        />
      ))}
    </div>
  );
}
