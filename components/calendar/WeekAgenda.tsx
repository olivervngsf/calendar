"use client";

import { useMemo } from "react";
import type { MouseEvent } from "react";
import type { CalendarEvent, CalendarId } from "@/lib/types";
import { getWeekDays, isoDate, WEEKDAY_SHORT, monthLabel } from "@/lib/date";
import { eventsByDay } from "@/lib/events";
import { TODAY } from "@/lib/mock-data";
import { useData } from "@/components/providers/DataProvider";
import { useSelection } from "@/components/providers/SelectionProvider";

interface Props {
  anchor: Date;
  visible: Set<CalendarId>;
  onEventClick?: (event: CalendarEvent, anchor: DOMRect) => void;
  onSelectDay?: (iso: string) => void;
}

function timeLabel(e: CalendarEvent): string {
  if (e.allDay) return "All day";
  return `${e.start.slice(11, 16)} – ${e.end.slice(11, 16)}`;
}

/** Agenda (list) week style: one row per day, events listed with calendar-color bars. */
export function WeekAgenda({ anchor, visible, onEventClick, onSelectDay }: Props) {
  const { events, colorOf } = useData();
  const { isSelected, toggle } = useSelection();
  const days = useMemo(() => getWeekDays(anchor, TODAY), [anchor]);
  const byDay = useMemo(() => eventsByDay(events, visible), [events, visible]);
  const selectedIso = isoDate(anchor);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-bg px-7 py-4">
      <div className="mx-auto max-w-3xl">
        {days.map((d, i) => {
          const dayEvents = byDay.get(d.iso) ?? [];
          const focused = !d.isToday && d.iso === selectedIso;
          return (
            <div
              key={d.iso}
              className={
                "flex gap-6 py-5 " +
                (i < days.length - 1
                  ? "border-b border-dashed border-border-faint"
                  : "")
              }
            >
              {/* Date column */}
              <button
                type="button"
                onClick={() => onSelectDay?.(d.iso)}
                title="Open day"
                className="flex w-[104px] shrink-0 items-start gap-3 text-left"
              >
                <span
                  className={
                    "font-mono text-[26px] leading-none tracking-[-0.01em] " +
                    (d.isToday
                      ? "font-semibold text-text"
                      : focused
                        ? "font-semibold text-accent"
                        : "text-text")
                  }
                >
                  {d.day}
                </span>
                <div className="pt-0.5">
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-text">
                    {monthLabel(d.date)}
                    {d.isToday && (
                      <span className="h-[5px] w-[5px] rounded-full bg-today-ring" />
                    )}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-text-3">
                    {WEEKDAY_SHORT[d.date.getDay()]}
                  </div>
                </div>
              </button>

              {/* Events column */}
              <div className="flex flex-1 flex-col gap-3.5 pt-0.5">
                {dayEvents.length === 0 ? (
                  <div className="flex items-stretch gap-3">
                    <span className="w-[3px] shrink-0 rounded-full bg-border-strong" />
                    <span className="text-sm text-text-3">No events</span>
                  </div>
                ) : (
                  dayEvents.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      aria-pressed={isSelected(e.id)}
                      onClick={(ev: MouseEvent<HTMLButtonElement>) => {
                        if (ev.metaKey || ev.ctrlKey) {
                          ev.preventDefault();
                          toggle(e.id);
                          return;
                        }
                        onEventClick?.(e, ev.currentTarget.getBoundingClientRect());
                      }}
                      className={
                        "group flex items-stretch gap-3 rounded text-left " +
                        (isSelected(e.id) ? "ring-1 ring-accent ring-offset-2 ring-offset-bg" : "")
                      }
                    >
                      <span
                        style={{
                          backgroundColor: `var(--cal-${colorOf(e.calendarId)})`,
                        }}
                        className="w-[3px] shrink-0 self-stretch rounded-full"
                      />
                      <div className="min-w-0">
                        <div className="text-sm leading-snug text-text transition-colors group-hover:text-accent">
                          {e.title}
                        </div>
                        <div className="mt-0.5 font-mono text-[11px] tracking-[0.01em] text-text-3">
                          {timeLabel(e)}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
