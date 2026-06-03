"use client";

import { useEffect, useMemo, useRef } from "react";
import type { CalendarEvent, CalendarId } from "@/lib/types";
import type { GridDay } from "@/lib/date";
import { getISOWeek, WEEKDAY_SHORT } from "@/lib/date";
import { eventsByDay } from "@/lib/events";
import { HOUR_PX, hourLabel } from "@/lib/timegrid";
import { useData } from "@/components/providers/DataProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { DayColumn } from "./DayColumn";
import { EventChip } from "./EventChip";

interface Props {
  days: GridDay[];
  visible: Set<CalendarId>;
  /** The focused day's ISO date (highlighted distinctly from today). */
  selectedIso?: string;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (iso: string, hour: number) => void;
  onSelectDay?: (iso: string) => void;
}

const AXIS_PX = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function TimeGridView({
  days,
  visible,
  selectedIso,
  onEventClick,
  onSlotClick,
  onSelectDay,
}: Props) {
  const { events } = useData();
  const { showWeekNumbers } = useSettings();
  const byDay = useMemo(() => eventsByDay(events, visible), [events, visible]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ISO week for the shown period — keyed off the Thursday (week) or the day itself.
  const weekNo = getISOWeek((days[4] ?? days[0]).date);

  // Open scrolled to the morning, not midnight.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 7 * HOUR_PX;
  }, []);

  const cols = `${AXIS_PX}px repeat(${days.length}, minmax(0, 1fr))`;
  const hasAllDay = days.some((d) =>
    (byDay.get(d.iso) ?? []).some((e) => e.allDay),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-bg">
      {/* Day header */}
      <div
        className="grid border-b border-border-base px-7 pt-4"
        style={{ gridTemplateColumns: cols }}
      >
        <div className="flex items-end justify-center pb-1">
          {showWeekNumbers && (
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-text-faint">
              W{weekNo}
            </span>
          )}
        </div>
        {days.map((d) => {
          const header = (
            <>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-3">
                {WEEKDAY_SHORT[d.date.getDay()]}
              </span>
              <span
                className={
                  "mt-1 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 font-mono text-sm " +
                  (d.isToday
                    ? "border-2 border-today-ring font-semibold text-text"
                    : d.iso === selectedIso
                      ? "bg-accent-soft font-semibold text-accent"
                      : "text-text-2")
                }
              >
                {d.day}
              </span>
            </>
          );
          return (
            <div key={d.iso} className="flex flex-col items-center pb-3">
              {onSelectDay ? (
                <button
                  type="button"
                  onClick={() => onSelectDay(d.iso)}
                  className="flex flex-col items-center rounded transition-opacity hover:opacity-80"
                  title="Open day"
                >
                  {header}
                </button>
              ) : (
                <div className="flex flex-col items-center">{header}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* All-day row */}
      {hasAllDay && (
        <div
          className="grid border-b border-border-base px-7 py-1.5"
          style={{ gridTemplateColumns: cols }}
        >
          <div className="flex items-center justify-end pr-3 font-mono text-[9px] uppercase tracking-[0.1em] text-text-faint">
            all-day
          </div>
          {days.map((d) => {
            const allDay = (byDay.get(d.iso) ?? []).filter((e) => e.allDay);
            return (
              <div key={d.iso} className="flex flex-col gap-1 px-1">
                {allDay.map((e) => (
                  <EventChip key={e.id} event={e} onClick={onEventClick} />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-7 pb-6">
        <div className="grid" style={{ gridTemplateColumns: cols }}>
          {/* Time axis */}
          <div className="relative" style={{ height: 24 * HOUR_PX }}>
            {HOURS.filter((h) => h > 0).map((h) => (
              <div
                key={h}
                style={{ top: h * HOUR_PX }}
                className="absolute right-3 -translate-y-1/2 font-mono text-[10px] text-text-faint"
              >
                {hourLabel(h)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((d, i) => (
            <DayColumn
              key={d.iso}
              iso={d.iso}
              events={byDay.get(d.iso) ?? []}
              onEventClick={onEventClick}
              onSlotClick={onSlotClick}
              last={i === days.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
