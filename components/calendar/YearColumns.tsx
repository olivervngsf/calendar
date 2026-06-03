"use client";

import { useMemo } from "react";
import type { CalendarId } from "@/lib/types";
import { isoDate, isSameDay, monthLabel, WEEKDAY_SHORT } from "@/lib/date";
import { TODAY } from "@/lib/mock-data";

interface Props {
  anchor: Date;
  eventDays: Set<string>;
  /** The focused day's ISO date (highlighted distinctly from today). */
  selectedIso: string;
  onSelectDay: (iso: string) => void;
  onSelectMonth: (month: Date) => void;
}

const ROWS = Array.from({ length: 31 }, (_, i) => i + 1);

/** Linear "year planner": months as columns, days 1–31 as rows. */
export function YearColumns({
  anchor,
  eventDays,
  selectedIso,
  onSelectDay,
  onSelectMonth,
}: Props) {
  const year = anchor.getFullYear();
  const months = useMemo(
    () => Array.from({ length: 12 }, (_, m) => new Date(year, m, 1)),
    [year],
  );

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-bg px-7 py-5">
      <div
        className="grid min-w-[760px] border-l border-t border-border-faint"
        style={{ gridTemplateColumns: "repeat(12, minmax(58px, 1fr))" }}
      >
        {/* Header — month names */}
        {months.map((m) => (
          <button
            key={`h${m.getMonth()}`}
            type="button"
            onClick={() => onSelectMonth(m)}
            title="Open month"
            className="border-b border-r border-border-faint bg-bg px-2 py-2 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-text-3 transition-colors hover:text-accent"
          >
            {monthLabel(m).slice(0, 3)}
          </button>
        ))}

        {/* Day rows */}
        {ROWS.map((day) =>
          months.map((m) => {
            const mi = m.getMonth();
            const daysInMonth = new Date(year, mi + 1, 0).getDate();
            if (day > daysInMonth) {
              return (
                <div
                  key={`${mi}-${day}`}
                  className="border-b border-r border-border-faint bg-surface-soft/30"
                />
              );
            }
            const date = new Date(year, mi, day);
            const weekday = WEEKDAY_SHORT[date.getDay()].toUpperCase();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isToday = isSameDay(date, TODAY);
            const iso = isoDate(date);
            const hasEvent = eventDays.has(iso);
            const selected = !isToday && iso === selectedIso;
            return (
              <button
                key={`${mi}-${day}`}
                type="button"
                onClick={() => onSelectDay(iso)}
                aria-label={iso}
                aria-current={selected ? "date" : undefined}
                className={
                  "flex items-baseline gap-1 border-b border-r border-border-faint px-2 py-[5px] text-left transition-colors hover:bg-surface-soft " +
                  (isToday ? "border-l-2 border-l-today-ring " : "") +
                  (selected
                    ? "bg-accent-soft "
                    : isWeekend
                      ? "bg-surface-soft/60 "
                      : "bg-bg ")
                }
              >
                <span
                  className={
                    "font-mono text-[10px] tabular-nums " +
                    (isToday ? "font-semibold text-accent" : "text-text-2")
                  }
                >
                  {String(day).padStart(2, "0")}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.04em] text-text-faint">
                  {weekday}
                </span>
                {hasEvent && (
                  <span className="ml-auto h-[4px] w-[4px] shrink-0 self-center rounded-full bg-accent" />
                )}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
