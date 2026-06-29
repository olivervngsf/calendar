"use client";

import { useMemo, useState } from "react";
import type { CalendarView } from "@/lib/types";
import { isoDate, monthLabel, noteScopeFor, noteScopeDate } from "@/lib/date";
import { parseQuickAdd } from "@/lib/quickAdd";
import { parseCaptureKind, CAPTURE_LABEL } from "@/lib/quickCapture";
import { TODAY } from "@/lib/mock-data";
import { useData } from "@/components/providers/DataProvider";
import { Dialog, fieldControl, fieldLabel } from "@/components/ui/Dialog";

interface Props {
  view: CalendarView;
  anchor: Date;
  /** Prefill the input (e.g. "task:: ") when opened from a section's + button. */
  initialText?: string;
  onClose: () => void;
  /** Open the full event form, prefilled with the typed title + the focused day. */
  onMore: (title: string, iso: string) => void;
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Natural-language capture (D040). `N` opens this. A leading `task:: / event:: /
 * note::` marker auto-routes; no marker → event. One field, Enter to save.
 */
export function QuickCapture({ view, anchor, initialText, onClose, onMore }: Props) {
  const { addTask, addEvent, addNote, calendars } = useData();
  const [text, setText] = useState(initialText ?? "");
  const defaultCalendarId = calendars[0]?.id ?? "personal";
  const focusedIso = isoDate(anchor);

  const cap = useMemo(() => parseCaptureKind(text), [text]);
  const eventParse = useMemo(
    () => (cap.kind === "event" && cap.text.trim() ? parseQuickAdd(cap.text, TODAY) : null),
    [cap],
  );
  const canSave = cap.text.trim().length > 0;

  // Ambiguous date on week/month/year → an unscheduled item scoped to the view (D044).
  const s = useMemo(() => noteScopeFor(view, anchor), [view, anchor]);
  const unscheduled = view !== "d";
  const scopeRep = noteScopeDate(s.unit, s.key);
  const scopeField = { unit: s.unit, key: s.key };

  function save() {
    const title = cap.text.trim();
    if (!title) return;

    if (cap.kind === "task") {
      if (unscheduled) addTask({ title, date: scopeRep, scope: scopeField });
      else addTask({ title, date: focusedIso });
    } else if (cap.kind === "note") {
      addNote({
        scope: scopeField,
        type: "daily",
        title,
        body: "",
        date: isoDate(TODAY),
      });
    } else if (eventParse && !("error" in eventParse)) {
      // event with a parsed specific date → scheduled, all-day.
      const p = eventParse;
      const isoOf = (y: number) =>
        `${y}-${String(p.month + 1).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
      const make = (iso: string) =>
        addEvent({
          calendarId: defaultCalendarId,
          title: p.title,
          start: `${iso}T00:00`,
          end: `${iso}T23:59`,
          allDay: true,
          visibility: "default",
        });
      if (p.recurrence === "yearly") {
        for (let y = p.year; y <= p.year + 4; y++) make(isoOf(y));
      } else {
        make(isoOf(p.year));
      }
    } else {
      // event, no specific date → scheduled on the focused day (Day view) or
      // unscheduled scoped to the view (week/month/year).
      const iso = unscheduled ? scopeRep : focusedIso;
      addEvent({
        calendarId: defaultCalendarId,
        title,
        start: `${iso}T00:00`,
        end: `${iso}T23:59`,
        allDay: true,
        visibility: "default",
        ...(unscheduled ? { scope: scopeField } : {}),
      });
    }
    onClose();
  }

  const focusedLabel = `${WEEKDAY[anchor.getDay()]}, ${monthLabel(anchor)} ${anchor.getDate()}`;

  return (
    <Dialog title="Quick capture" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div>
          <label className={fieldLabel} htmlFor="qc-input">
            What's on your mind?
          </label>
          <div className="relative">
            <input
              id="qc-input"
              className={fieldControl + " pr-20"}
              value={text}
              placeholder="task:: book dentist  ·  or just “Lunch Oct 3”"
              autoComplete="off"
              autoFocus
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSave) {
                  e.preventDefault();
                  save();
                }
              }}
            />
            {/* Live detected-kind badge */}
            <span
              className={
                "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-[3px] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] " +
                (cap.explicit
                  ? "bg-accent text-accent-on"
                  : "bg-accent-soft text-accent")
              }
            >
              {CAPTURE_LABEL[cap.kind]}
            </span>
          </div>
        </div>

        {/* Live preview */}
        <div className="min-h-[44px] rounded border border-border-faint bg-bg px-3 py-2.5 text-[13px]">
          {!canSave ? (
            <span className="text-text-3">
              Start with{" "}
              <span className="font-mono text-text-2">task::</span> or{" "}
              <span className="font-mono text-text-2">note::</span> — or just type an
              event. <span className="text-text-2">“Lunch Oct 3”</span>.
            </span>
          ) : cap.kind === "task" ? (
            <span className="text-text-2">
              New <span className="font-medium text-text">task</span> ·{" "}
              <span className="font-mono text-[11px] text-text-3">
                {unscheduled ? `${s.label} · no specific day` : focusedLabel}
              </span>
            </span>
          ) : cap.kind === "note" ? (
            <span className="text-text-2">
              New <span className="font-medium text-text">note</span> ·{" "}
              <span className="font-mono text-[11px] text-text-3">{s.label}</span>
            </span>
          ) : eventParse && !("error" in eventParse) ? (
            <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-medium text-text">{eventParse.title}</span>
              <span className="font-mono text-[11px] text-text-3">
                {WEEKDAY[new Date(eventParse.year, eventParse.month, eventParse.day).getDay()]},{" "}
                {monthLabel(new Date(eventParse.year, eventParse.month, 1))}{" "}
                {eventParse.day}, {eventParse.year}
              </span>
              {eventParse.recurrence === "yearly" && (
                <span className="rounded-[3px] bg-accent-soft px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.1em] text-accent">
                  repeats yearly
                </span>
              )}
            </span>
          ) : (
            <span className="text-text-2">
              New <span className="font-medium text-text">event</span> ·{" "}
              <span className="font-mono text-[11px] text-text-3">
                {unscheduled ? `${s.label} · unscheduled` : `all-day on ${focusedLabel}`}
              </span>
              <span className="ml-1 text-text-3">(add a date, e.g. “Oct 3”)</span>
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onMore(cap.text.trim(), focusedIso)}
            className="text-[12px] text-text-3 transition-colors hover:text-text"
          >
            More options
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-border-strong bg-surface px-3.5 py-1.5 text-[13px] text-text-2 transition-colors hover:border-text-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!canSave}
              className="rounded bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-on transition-opacity disabled:opacity-40"
            >
              Add {CAPTURE_LABEL[cap.kind].toLowerCase()}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
