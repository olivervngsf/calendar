"use client";

import { useState } from "react";
import type { CalendarEvent, CalendarId } from "@/lib/types";
import { useData } from "@/components/providers/DataProvider";
import { Dialog, fieldControl, fieldLabel } from "@/components/ui/Dialog";

interface Props {
  /** Editing an existing event, or creating a new one. */
  event?: CalendarEvent;
  /** Default ISO date ("YYYY-MM-DD") when creating. */
  defaultDate: string;
  /** Default start time ("HH:MM") when creating from a clicked time slot. */
  defaultStart?: string;
  onClose: () => void;
}

function addHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function EventDialog({ event, defaultDate, defaultStart, onClose }: Props) {
  const { calendars, addEvent, updateEvent, deleteEvent } = useData();
  const isEdit = Boolean(event);

  const [title, setTitle] = useState(event?.title ?? "");
  const [calendarId, setCalendarId] = useState<CalendarId>(
    event?.calendarId ?? calendars[0]?.id ?? "personal",
  );
  const [date, setDate] = useState(event ? event.start.slice(0, 10) : defaultDate);
  const [allDay, setAllDay] = useState(event?.allDay ?? false);
  const [startTime, setStartTime] = useState(
    event && !event.allDay ? event.start.slice(11, 16) : (defaultStart ?? "09:00"),
  );
  const [endTime, setEndTime] = useState(
    event && !event.allDay
      ? event.end.slice(11, 16)
      : addHour(defaultStart ?? "09:00"),
  );

  const canSave = title.trim().length > 0 && Boolean(date);

  function handleSave() {
    if (!canSave) return;
    const input = {
      calendarId,
      title: title.trim(),
      start: allDay ? `${date}T00:00` : `${date}T${startTime}`,
      end: allDay ? `${date}T23:59` : `${date}T${endTime}`,
      allDay,
      visibility: event?.visibility ?? ("default" as const),
    };
    if (event) updateEvent(event.id, input);
    else addEvent(input);
    onClose();
  }

  function handleDelete() {
    if (event) deleteEvent(event.id);
    onClose();
  }

  return (
    <Dialog title={isEdit ? "Edit event" : "New event"} onClose={onClose}>
      <div
        className="flex flex-col gap-4"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleSave();
          }
        }}
      >
        <div>
          <label className={fieldLabel} htmlFor="ev-title">
            Title
          </label>
          <input
            id="ev-title"
            className={fieldControl}
            value={title}
            placeholder="Coffee · Sarah"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={fieldLabel} htmlFor="ev-cal">
              Calendar
            </label>
            <select
              id="ev-cal"
              className={fieldControl}
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value as CalendarId)}
            >
              {calendars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={fieldLabel} htmlFor="ev-date">
              Date
            </label>
            <input
              id="ev-date"
              type="date"
              className={fieldControl}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-[13px] text-text-2">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
          />
          All day
        </label>

        {!allDay && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={fieldLabel} htmlFor="ev-start">
                Start
              </label>
              <input
                id="ev-start"
                type="time"
                className={fieldControl}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className={fieldLabel} htmlFor="ev-end">
                End
              </label>
              <input
                id="ev-end"
                type="time"
                className={fieldControl}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between">
          {isEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded border border-transparent px-3 py-1.5 text-[13px] text-text-3 transition-colors hover:border-border-strong hover:text-text"
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-border-strong bg-surface px-3.5 py-1.5 text-[13px] text-text-2 transition-colors hover:border-text-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="rounded bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-on transition-opacity disabled:opacity-40"
            >
              {isEdit ? "Save" : "Add event"}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
