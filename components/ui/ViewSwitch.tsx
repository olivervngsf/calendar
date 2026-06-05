"use client";

import type { CalendarView } from "@/lib/types";
import type { WeekStyle } from "@/components/providers/SettingsProvider";

const VIEWS: { id: CalendarView; label: string; full: string }[] = [
  { id: "d", label: "D", full: "Day" },
  { id: "w", label: "W", full: "Week" },
  { id: "m", label: "M", full: "Month" },
  { id: "y", label: "Y", full: "Year" },
];

interface Props {
  value: CalendarView;
  onChange: (view: CalendarView) => void;
  /** Active week style — drives the W1/W2 label while Week view is selected. */
  weekStyle: WeekStyle;
}

export function ViewSwitch({ value, onChange, weekStyle }: Props) {
  return (
    <div
      className="inline-flex overflow-hidden rounded border border-border-strong"
      role="tablist"
      aria-label="Calendar view"
    >
      {VIEWS.map((v, i) => {
        const active = v.id === value;
        // Week segment shows its sub-mode (W1 timeline / W2 agenda) while active.
        const isWeek = v.id === "w";
        const label =
          isWeek && active ? (weekStyle === "timeline" ? "W1" : "W2") : v.label;
        const title = isWeek
          ? `Week (W) — press W to switch: W1 timeline ⇄ W2 agenda`
          : `${v.full} (${v.label})`;
        return (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={isWeek && active ? `Week — ${weekStyle}` : v.full}
            title={title}
            onClick={() => onChange(v.id)}
            className={
              "font-mono text-[11px] font-medium tracking-[0.08em] px-3 py-1.5 text-center tabular-nums transition-colors duration-100 " +
              (isWeek ? "min-w-[34px] " : "") +
              (i < VIEWS.length - 1 ? "border-r border-border-base " : "") +
              (active
                ? "bg-accent text-accent-on "
                : "bg-surface text-text-2 hover:bg-surface-soft ")
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
