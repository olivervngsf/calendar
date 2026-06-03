"use client";

import { useMemo, useState } from "react";
import { TODAY } from "@/lib/mock-data";
import { monthLabel } from "@/lib/date";
import { parseQuickAdd } from "@/lib/quickAdd";
import { useData } from "@/components/providers/DataProvider";
import { Dialog, fieldControl, fieldLabel } from "@/components/ui/Dialog";

interface Props {
  onClose: () => void;
  /** Jump the calendar to the created date so the user sees it. */
  onCreated: (iso: string) => void;
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function QuickAddDialog({ onClose, onCreated }: Props) {
  const { addEvent } = useData();
  const [text, setText] = useState("");

  const parsed = useMemo(
    () => (text.trim() ? parseQuickAdd(text, TODAY) : null),
    [text],
  );
  const ok = parsed !== null && !("error" in parsed);

  function handleAdd() {
    if (!parsed || "error" in parsed) return;
    const { title, year, month, day, recurrence } = parsed;
    const makeAllDay = (y: number) => {
      const iso = `${y}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      addEvent({
        calendarId: "personal",
        title,
        start: `${iso}T00:00`,
        end: `${iso}T23:59`,
        allDay: true,
        visibility: "default",
      });
      return iso;
    };
    if (recurrence === "yearly") {
      // No RRULE engine in v0.1 — expand a few yearly instances (mock recurrence).
      for (let y = year; y <= year + 4; y++) makeAllDay(y);
    } else {
      makeAllDay(year);
    }
    onCreated(parsed.iso);
    onClose();
  }

  return (
    <Dialog title="Quick add" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div>
          <label className={fieldLabel} htmlFor="qa-input">
            Describe it
          </label>
          <input
            id="qa-input"
            className={fieldControl}
            value={text}
            placeholder="Viet’s birthday, July 23, repeat yearly"
            autoComplete="off"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && ok) handleAdd();
            }}
          />
        </div>

        {/* Live preview */}
        <div className="min-h-[44px] rounded border border-border-faint bg-bg px-3 py-2.5 text-[13px]">
          {!parsed ? (
            <span className="text-text-3">
              Type a title and a date — e.g.{" "}
              <span className="text-text-2">“Team offsite Oct 3”</span>.
            </span>
          ) : "error" in parsed ? (
            <span className="text-text-3">{parsed.error}</span>
          ) : (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-medium text-text">{parsed.title}</span>
              <span className="font-mono text-[11px] text-text-3">
                {WEEKDAY[new Date(parsed.year, parsed.month, parsed.day).getDay()]},{" "}
                {monthLabel(new Date(parsed.year, parsed.month, 1))} {parsed.day},{" "}
                {parsed.year}
              </span>
              {parsed.recurrence === "yearly" && (
                <span className="rounded-[3px] bg-accent-soft px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.1em] text-accent">
                  repeats yearly
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-1 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-border-strong bg-surface px-3.5 py-1.5 text-[13px] text-text-2 transition-colors hover:border-text-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!ok}
            className="rounded bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-on transition-opacity disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </Dialog>
  );
}
