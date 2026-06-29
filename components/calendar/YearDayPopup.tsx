"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CalendarEvent } from "@/lib/types";
import { monthLabel } from "@/lib/date";
import { eventTimeLabel } from "@/lib/events";
import { useData } from "@/components/providers/DataProvider";

const WEEKDAY = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
const WIDTH = 232;
const MAX = 6;

interface Props {
  /** ISO date "YYYY-MM-DD" of the hovered day. */
  iso: string;
  /** Events on that day (pre-sorted: all-day first, then by start). */
  events: CalendarEvent[];
  /** Bounding rect of the hovered day cell, to anchor the popup. */
  anchor: DOMRect;
}

/**
 * Read-only hover preview of a day's events in Year view. Non-interactive
 * (pointer-events-none) so it never steals the hover and flickers.
 */
export function YearDayPopup({ iso, events, anchor }: Props) {
  const { colorOf } = useData();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [show, setShow] = useState(false);

  const d = new Date(`${iso}T00:00`);
  const dateLine = `${WEEKDAY[d.getDay()]}, ${monthLabel(d)} ${d.getDate()}`;
  const shown = events.slice(0, MAX);
  const overflow = events.length - shown.length;

  useLayoutEffect(() => {
    const h = ref.current?.offsetHeight ?? 120;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let top = anchor.bottom + 6;
    if (top + h + 8 > vh) top = Math.max(8, anchor.top - h - 6);
    // Center on the day cell, then clamp to the viewport.
    let left = anchor.left + anchor.width / 2 - WIDTH / 2;
    left = Math.min(Math.max(8, left), vw - WIDTH - 8);
    setPos({ top, left });
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, [anchor]);

  return (
    <div
      ref={ref}
      role="tooltip"
      aria-label={`Events on ${iso}`}
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, width: WIDTH }}
      className={
        "pointer-events-none fixed z-50 rounded-lg border border-border-strong bg-surface p-3 transition duration-150 ease-out " +
        (show ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]")
      }
    >
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-text-3">
        {dateLine}
      </div>
      <ul className="flex flex-col gap-1.5">
        {shown.map((e) => (
          <li key={e.id} className="flex items-baseline gap-2">
            <span
              aria-hidden
              style={{ backgroundColor: `var(--cal-${colorOf(e.calendarId)})` }}
              className="mt-[3px] h-2 w-2 shrink-0 rounded-full"
            />
            {!e.allDay && (
              <span className="shrink-0 font-mono text-[10px] tracking-[0.01em] text-text-3">
                {eventTimeLabel(e)}
              </span>
            )}
            <span className="truncate text-[12px] leading-snug text-text">
              {e.title}
            </span>
          </li>
        ))}
      </ul>
      {overflow > 0 && (
        <div className="mt-1.5 font-mono text-[10px] tracking-[0.02em] text-text-3">
          +{overflow} more
        </div>
      )}
    </div>
  );
}
