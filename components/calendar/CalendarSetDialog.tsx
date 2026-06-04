"use client";

import { useState } from "react";
import type { CalendarId, CalendarSet } from "@/lib/types";
import { useData } from "@/components/providers/DataProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { Dialog, fieldControl, fieldLabel } from "@/components/ui/Dialog";

interface Props {
  /** Editing an existing set, or creating a new one. */
  set?: CalendarSet;
  onClose: () => void;
  /** Apply a calendar selection to the current view. */
  onApply: (ids: CalendarId[]) => void;
}

export function CalendarSetDialog({ set, onClose, onApply }: Props) {
  const { calendars } = useData();
  const { addCalendarSet, updateCalendarSet, deleteCalendarSet } = useSettings();
  const ALL = calendars.map((c) => c.id);
  const isEdit = Boolean(set);

  const [name, setName] = useState(set?.name ?? "");
  const [ids, setIds] = useState<Set<CalendarId>>(
    () => new Set(set?.calendarIds ?? (calendars[0] ? [calendars[0].id] : [])),
  );

  const toggle = (id: CalendarId) =>
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const canSave = name.trim().length > 0 && ids.size > 0;

  function handleSave() {
    if (!canSave) return;
    const selected = ALL.filter((id) => ids.has(id)); // stable order
    const input = { name: name.trim(), calendarIds: selected };
    if (set) updateCalendarSet(set.id, input);
    else addCalendarSet(input);
    onApply(selected);
    onClose();
  }

  function handleDelete() {
    if (set) deleteCalendarSet(set.id);
    onApply(ALL); // fall back to all calendars
    onClose();
  }

  return (
    <Dialog
      title={isEdit ? "Edit set" : "New calendar set"}
      onClose={onClose}
    >
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
          <label className={fieldLabel} htmlFor="set-name">
            Name
          </label>
          <input
            id="set-name"
            className={fieldControl}
            value={name}
            placeholder="Personal"
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <span className={fieldLabel}>Calendars in this set</span>
          <div className="flex flex-col">
            {calendars.map((cal) => {
              const on = ids.has(cal.id);
              return (
                <button
                  key={cal.id}
                  type="button"
                  onClick={() => toggle(cal.id)}
                  aria-pressed={on}
                  className="flex items-center gap-2.5 py-1.5 text-left"
                >
                  <span
                    aria-hidden
                    style={{
                      backgroundColor: on
                        ? `var(--cal-${cal.color})`
                        : "transparent",
                      borderColor: on ? `var(--cal-${cal.color})` : undefined,
                    }}
                    className={
                      "inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] " +
                      (on ? "" : "border-border-strong bg-surface")
                    }
                  >
                    {on && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden>
                        <path
                          d="M1 3.5L3.2 5.7L8 1"
                          stroke="var(--accent-on)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-[13px] text-text">{cal.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between">
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
              {isEdit ? "Save" : "Create set"}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
