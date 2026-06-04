"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { monthLabel } from "@/lib/date";
import { useData } from "@/components/providers/DataProvider";

const WEEKDAY = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
const WIDTH = 256;
const pad = (n: number) => String(n).padStart(2, "0");

interface Props {
  /** ISO date "YYYY-MM-DD" of the clicked slot. */
  date: string;
  /** Start hour (timed). undefined → all-day (month cell). */
  hour?: number;
  /** Bounding rect of the clicked slot, to anchor the popover. */
  anchor: DOMRect;
  onClose: () => void;
  /** Open the full event form, prefilled. */
  onMore: () => void;
}

/** Keyboard-first quick-create: type a title, Enter to save. Esc cancels. */
export function QuickCreate({ date, hour, anchor, onClose, onMore }: Props) {
  const { addEvent, calendars } = useData();
  const [title, setTitle] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [show, setShow] = useState(false);

  const d = new Date(`${date}T00:00`);
  const dateLine = `${WEEKDAY[d.getDay()]}, ${monthLabel(d)} ${d.getDate()}`;
  const timeLine =
    hour === undefined ? "All day" : `${pad(hour)}:00 – ${pad((hour + 1) % 24)}:00`;

  function save() {
    const t = title.trim();
    if (!t) return;
    const calendarId = calendars[0]?.id ?? "personal";
    if (hour === undefined) {
      addEvent({
        calendarId,
        title: t,
        start: `${date}T00:00`,
        end: `${date}T23:59`,
        allDay: true,
        visibility: "default",
      });
    } else {
      addEvent({
        calendarId,
        title: t,
        start: `${date}T${pad(hour)}:00`,
        end: `${date}T${pad((hour + 1) % 24)}:00`,
        allDay: false,
        visibility: "default",
      });
    }
    onClose();
  }

  useLayoutEffect(() => {
    const h = ref.current?.offsetHeight ?? 130;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let top = anchor.bottom + 6;
    if (top + h + 8 > vh) top = Math.max(8, anchor.top - h - 6);
    const left = Math.min(Math.max(8, anchor.left), vw - WIDTH - 8);
    setPos({ top, left });
    inputRef.current?.focus();
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, [anchor]);

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-label="Quick create event"
        style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, width: WIDTH }}
        className={
          "fixed z-50 rounded-lg border border-border-base bg-surface p-3.5 shadow-xl transition duration-150 ease-out " +
          (show ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]")
        }
      >
        <input
          ref={inputRef}
          value={title}
          placeholder="Add title"
          autoComplete="off"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              save();
            }
          }}
          className="w-full rounded border border-border-strong bg-bg px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
        />
        <div className="mt-1.5 font-mono text-[11px] tracking-[0.01em] text-text-3">
          {dateLine} · {timeLine}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onMore}
            className="text-[12px] text-text-3 transition-colors hover:text-text"
          >
            More options
          </button>
          <button
            type="button"
            onClick={save}
            disabled={title.trim().length === 0}
            className="rounded bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-on transition-opacity disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}
