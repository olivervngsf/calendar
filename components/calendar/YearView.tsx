"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CalendarId } from "@/lib/types";
import { isoDate } from "@/lib/date";
import { eventsByDay } from "@/lib/events";
import { useData } from "@/components/providers/DataProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { YearMonth } from "./YearMonth";
import { YearColumns } from "./YearColumns";
import { YearDayPopup } from "./YearDayPopup";

const HOVER_DELAY = 400; // ms — wait for hover intent before previewing

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

  // Map of ISO day → that day's events (pre-sorted). Keys are the days with dots.
  const byDay = useMemo(() => eventsByDay(events, visible), [events, visible]);
  const eventDays = useMemo(() => new Set(byDay.keys()), [byDay]);

  // Hover preview: show a day's events after a short hover-intent delay (also on focus).
  const [hover, setHover] = useState<{ iso: string; anchor: DOMRect } | null>(null);
  const timer = useRef<number | null>(null);
  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const handleDayHover = useCallback((iso: string, rect: DOMRect) => {
    clearTimer();
    timer.current = window.setTimeout(() => {
      setHover({ iso, anchor: rect });
      timer.current = null;
    }, HOVER_DELAY);
  }, []);
  const handleDayHoverEnd = useCallback(() => {
    clearTimer();
    setHover(null);
  }, []);
  useEffect(() => () => clearTimer(), []);

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
          onDayHover={handleDayHover}
          onDayHoverEnd={handleDayHoverEnd}
        />
      ))}

      {hover && (
        <YearDayPopup
          iso={hover.iso}
          events={byDay.get(hover.iso) ?? []}
          anchor={hover.anchor}
        />
      )}
    </div>
  );
}
