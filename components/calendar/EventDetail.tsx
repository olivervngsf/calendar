"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CalendarEvent } from "@/lib/types";
import { monthLabel } from "@/lib/date";
import { useData } from "@/components/providers/DataProvider";

const WEEKDAY = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

interface Props {
  event: CalendarEvent;
  /** Bounding rect of the clicked event, to anchor the popover. */
  anchor: DOMRect;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const WIDTH = 264;

/** Read-first detail popover for an event. Click opens this; edit is deliberate. */
export function EventDetail({ event, anchor, onEdit, onDelete, onClose }: Props) {
  const { calendars, colorOf } = useData();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [show, setShow] = useState(false);

  const cal = calendars.find((c) => c.id === event.calendarId);
  const color = cal?.color ?? colorOf(event.calendarId);
  const name = cal?.name ?? "Calendar";

  const start = new Date(event.start);
  const dateStr = `${WEEKDAY[start.getDay()]}, ${monthLabel(start)} ${start.getDate()}, ${start.getFullYear()}`;
  const timeStr = event.allDay
    ? "All day"
    : `${event.start.slice(11, 16)} – ${event.end.slice(11, 16)}`;

  // Place near the event, flipped/clamped to the viewport.
  useLayoutEffect(() => {
    const h = ref.current?.offsetHeight ?? 150;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let top = anchor.bottom + 6;
    if (top + h + 8 > vh) top = Math.max(8, anchor.top - h - 6);
    const left = Math.min(Math.max(8, anchor.left), vw - WIDTH - 8);
    setPos({ top, left });
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, [anchor]);

  // Keyboard path (D033): Esc closes; Enter opens edit — the keyboard
  // equivalent of double-clicking the event.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "Enter") {
        e.preventDefault();
        onEdit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onEdit]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-label={`Event: ${event.title}`}
        style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, width: WIDTH }}
        className={
          "fixed z-50 rounded-lg border border-border-base bg-surface p-4 shadow-xl transition duration-150 ease-out " +
          (show ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]")
        }
      >
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden
            style={{ backgroundColor: `var(--cal-${color})` }}
            className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-snug text-text">
              {event.title}
            </div>
            <div className="mt-1 font-mono text-[11px] leading-relaxed text-text-3">
              {dateStr}
              <br />
              {timeStr}
            </div>
            <div className="mt-1.5 text-xs text-text-3">{name}</div>
          </div>
        </div>

        <div className="mt-3.5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onDelete}
            className="rounded border border-transparent px-3 py-1.5 text-[13px] text-text-3 transition-colors hover:border-border-strong hover:text-text"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-on transition-opacity hover:opacity-90"
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
}
