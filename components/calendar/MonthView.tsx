"use client";

import { useMemo } from "react";
import type { CalendarEvent, CalendarId } from "@/lib/types";
import type { GridDay } from "@/lib/date";
import { getISOWeek, getMonthGrid, isoDate, WEEKDAY_SHORT } from "@/lib/date";
import { eventsByDay } from "@/lib/events";
import { TODAY } from "@/lib/mock-data";
import { useData } from "@/components/providers/DataProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { MonthCell } from "./MonthCell";

interface Props {
  anchor: Date;
  visible: Set<CalendarId>;
  onEventClick?: (event: CalendarEvent, anchor: DOMRect) => void;
  onEventEdit?: (event: CalendarEvent) => void;
  onDayClick?: (iso: string, anchor: DOMRect) => void;
}

const WEEK_GUTTER = "2.25rem";

export function MonthView({ anchor, visible, onEventClick, onEventEdit, onDayClick }: Props) {
  const { events } = useData();
  const { showWeekNumbers } = useSettings();
  const selectedIso = isoDate(anchor);
  const grid = useMemo(() => getMonthGrid(anchor, TODAY), [anchor]);
  const byDay = useMemo(() => eventsByDay(events, visible), [events, visible]);

  // Chunk the flat 42-day grid into 6 rows of 7.
  const rows = useMemo(() => {
    const out: GridDay[][] = [];
    for (let i = 0; i < grid.length; i += 7) out.push(grid.slice(i, i + 7));
    return out;
  }, [grid]);

  const cols = showWeekNumbers
    ? `${WEEK_GUTTER} repeat(7, minmax(0, 1fr))`
    : "repeat(7, minmax(0, 1fr))";

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-bg">
      {/* Weekday header */}
      <div
        className="grid border-b border-border-base px-7 pb-3 pt-4"
        style={{ gridTemplateColumns: cols }}
      >
        {showWeekNumbers && (
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-faint">
            Wk
          </div>
        )}
        {WEEKDAY_SHORT.map((d) => (
          <div
            key={d}
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-3"
          >
            {d}
          </div>
        ))}
      </div>

      {/* 6×7 grid (+ optional week-number gutter) */}
      <div
        className="grid flex-1 auto-rows-fr px-7 pb-7"
        style={{ gridTemplateColumns: cols }}
      >
        {rows.map((week, i) => (
          <div key={i} className="contents">
            {showWeekNumbers && (
              <div className="flex items-start justify-center border-b border-r border-border-faint pr-1.5 pt-2.5 font-mono text-[10px] tracking-[0.02em] text-text-faint">
                {getISOWeek(week[4].date)}
              </div>
            )}
            {week.map((day) => (
              <MonthCell
                key={day.iso}
                day={day}
                events={byDay.get(day.iso) ?? []}
                selected={!day.isToday && day.iso === selectedIso}
                onEventClick={onEventClick}
                onEventEdit={onEventEdit}
                onDayClick={onDayClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
