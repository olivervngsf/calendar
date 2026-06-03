"use client";

import type { CalendarView } from "@/lib/types";

const VIEWS: { id: CalendarView; label: string; full: string }[] = [
  { id: "d", label: "D", full: "Day" },
  { id: "w", label: "W", full: "Week" },
  { id: "m", label: "M", full: "Month" },
  { id: "y", label: "Y", full: "Year" },
];

interface Props {
  value: CalendarView;
  onChange: (view: CalendarView) => void;
}

export function ViewSwitch({ value, onChange }: Props) {
  return (
    <div
      className="inline-flex overflow-hidden rounded border border-border-strong"
      role="tablist"
      aria-label="Calendar view"
    >
      {VIEWS.map((v, i) => {
        const active = v.id === value;
        return (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={v.full}
            title={`${v.full} (${v.label})`}
            onClick={() => onChange(v.id)}
            className={
              "font-mono text-[11px] font-medium tracking-[0.08em] px-3 py-1.5 transition-colors duration-100 " +
              (i < VIEWS.length - 1 ? "border-r border-border-base " : "") +
              (active
                ? "bg-accent text-accent-on "
                : "bg-surface text-text-2 hover:bg-surface-soft ")
            }
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
