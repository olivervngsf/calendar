"use client";

import { useMemo } from "react";
import {
  getMiniMonthGrid,
  monthLabel,
  WEEKDAY_INITIAL,
} from "@/lib/date";
import { TODAY } from "@/lib/mock-data";

interface Props {
  /** First day of the month to render. */
  month: Date;
  /** Pick a date — moves focus, keeps the current view. */
  onPickDate: (iso: string) => void;
  /** The focused day's ISO date (highlighted distinctly from today). */
  selectedIso: string;
}

export function MiniMonth({ month, onPickDate, selectedIso }: Props) {
  const grid = useMemo(() => getMiniMonthGrid(month, TODAY), [month]);
  const label = `${monthLabel(month)} ${month.getFullYear()}`;

  return (
    <section>
      <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-3">
        {label}
      </h3>
      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAY_INITIAL.map((d, i) => (
          <div
            key={i}
            className="py-1 text-center font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-text-faint"
          >
            {d}
          </div>
        ))}
        {grid.map((day) => {
          const selected = !day.isToday && day.iso === selectedIso;
          return (
            <button
              key={day.iso}
              type="button"
              onClick={() => onPickDate(day.iso)}
              aria-label={day.iso}
              aria-current={selected ? "date" : undefined}
              className={
                "flex aspect-square items-center justify-center rounded-full py-1 text-center font-mono text-[11px] transition-colors " +
                (day.isToday
                  ? "border-2 border-today-ring font-medium text-text "
                  : selected
                    ? "bg-accent-soft font-medium text-accent "
                    : day.faded
                      ? "text-text-faint hover:bg-surface-soft "
                      : "text-text-2 hover:bg-surface-soft ")
              }
            >
              {day.day}
            </button>
          );
        })}
      </div>
    </section>
  );
}
