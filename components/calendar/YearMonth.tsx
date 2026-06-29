"use client";

import { Fragment, useMemo } from "react";
import type { GridDay } from "@/lib/date";
import { getISOWeek, getMonthGrid, monthLabel, WEEKDAY_INITIAL } from "@/lib/date";
import { TODAY } from "@/lib/mock-data";
import { useSettings } from "@/components/providers/SettingsProvider";

interface Props {
  /** First day of the month to render. */
  month: Date;
  /** ISO dates ("YYYY-MM-DD") that carry at least one visible event. */
  eventDays: Set<string>;
  /** The focused day's ISO date (highlighted distinctly from today). */
  selectedIso: string;
  onSelectDay: (iso: string) => void;
  onSelectMonth: (month: Date) => void;
  /** Hover/focus a day that has events → preview its events (delayed in parent). */
  onDayHover?: (iso: string, anchor: DOMRect) => void;
  onDayHoverEnd?: () => void;
}

export function YearMonth({
  month,
  eventDays,
  selectedIso,
  onSelectDay,
  onSelectMonth,
  onDayHover,
  onDayHoverEnd,
}: Props) {
  const { showWeekNumbers } = useSettings();
  const grid = useMemo(() => getMonthGrid(month, TODAY), [month]);
  const weeks = useMemo(() => {
    const out: GridDay[][] = [];
    for (let i = 0; i < grid.length; i += 7) out.push(grid.slice(i, i + 7));
    return out;
  }, [grid]);

  const dayButton = (d: GridDay) => {
    const hasEvent = !d.faded && eventDays.has(d.iso);
    const selected = !d.isToday && !d.faded && d.iso === selectedIso;
    return (
      <button
        key={d.iso}
        type="button"
        disabled={d.faded}
        onClick={() => onSelectDay(d.iso)}
        onMouseEnter={
          hasEvent
            ? (e) => onDayHover?.(d.iso, e.currentTarget.getBoundingClientRect())
            : undefined
        }
        onMouseLeave={hasEvent ? onDayHoverEnd : undefined}
        onFocus={
          hasEvent
            ? (e) => onDayHover?.(d.iso, e.currentTarget.getBoundingClientRect())
            : undefined
        }
        onBlur={hasEvent ? onDayHoverEnd : undefined}
        aria-label={d.iso}
        className={
          "relative mx-auto flex h-[19px] w-[19px] items-center justify-center rounded-full font-mono text-[10px] transition-colors " +
          (d.isToday
            ? "border border-today-ring font-semibold text-text "
            : selected
              ? "bg-accent-soft font-semibold text-accent "
              : d.faded
                ? "text-text-faint "
                : "text-text-2 hover:bg-surface-soft ")
        }
      >
        {d.day}
        {hasEvent && (
          <span className="absolute -bottom-[1px] h-[3px] w-[3px] rounded-full bg-accent" />
        )}
      </button>
    );
  };

  const cols = showWeekNumbers
    ? "0.95rem repeat(7, minmax(0, 1fr))"
    : "repeat(7, minmax(0, 1fr))";

  return (
    <section className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onSelectMonth(month)}
        title="Open month"
        className="self-start rounded text-[13px] font-semibold tracking-[-0.005em] text-text transition-colors hover:text-accent"
      >
        {monthLabel(month)}
      </button>

      <div className="grid gap-y-0.5" style={{ gridTemplateColumns: cols }}>
        {showWeekNumbers && <div className="pb-0.5" />}
        {WEEKDAY_INITIAL.map((w, i) => (
          <div
            key={i}
            className="pb-0.5 text-center font-mono text-[8px] font-medium uppercase tracking-[0.06em] text-text-faint"
          >
            {w}
          </div>
        ))}

        {showWeekNumbers
          ? weeks.map((week, wi) => (
              <Fragment key={wi}>
                <div className="flex items-center justify-center font-mono text-[8px] text-text-faint">
                  {getISOWeek(week[4].date)}
                </div>
                {week.map(dayButton)}
              </Fragment>
            ))
          : grid.map(dayButton)}
      </div>
    </section>
  );
}
