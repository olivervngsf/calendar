"use client";

import { useState } from "react";
import type { Calendar, CalendarColor } from "@/lib/types";
import { CALENDAR_COLORS } from "@/lib/types";
import { useData } from "@/components/providers/DataProvider";
import { Dialog, fieldControl, fieldLabel } from "@/components/ui/Dialog";

interface Props {
  /** Editing an existing calendar, or creating a new one. */
  calendar?: Calendar;
  onClose: () => void;
}

export function CalendarDialog({ calendar, onClose }: Props) {
  const { addCalendar, updateCalendar, deleteCalendar } = useData();
  const isEdit = Boolean(calendar);

  const [name, setName] = useState(calendar?.name ?? "");
  const [color, setColor] = useState<CalendarColor>(calendar?.color ?? "teal");

  const canSave = name.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    const input = { name: name.trim(), color };
    if (calendar) updateCalendar(calendar.id, input);
    else addCalendar(input);
    onClose();
  }

  function handleDelete() {
    if (calendar) deleteCalendar(calendar.id);
    onClose();
  }

  return (
    <Dialog title={isEdit ? "Edit calendar" : "New calendar"} onClose={onClose}>
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
          <label className={fieldLabel} htmlFor="cal-name">
            Name
          </label>
          <input
            id="cal-name"
            className={fieldControl}
            value={name}
            placeholder="Travel"
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <span className={fieldLabel}>Color</span>
          <div className="flex gap-2.5">
            {CALENDAR_COLORS.map((c) => {
              const active = c === color;
              return (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  aria-pressed={active}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: `var(--cal-${c})` }}
                  className={
                    "h-7 w-7 rounded-full transition-transform " +
                    (active
                      ? "ring-2 ring-text ring-offset-2 ring-offset-surface"
                      : "hover:scale-110")
                  }
                />
              );
            })}
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between">
          {isEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              title="Deletes this calendar and its events"
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
              {isEdit ? "Save" : "Create calendar"}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
