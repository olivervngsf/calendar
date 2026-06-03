"use client";

import type { CalendarId, CalendarSet } from "@/lib/types";
import { CALENDARS } from "@/lib/mock-data";
import { addMonths } from "@/lib/date";
import { countByCalendar } from "@/lib/events";
import { useData } from "@/components/providers/DataProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { MiniMonth } from "@/components/calendar/MiniMonth";

const ALL_CALENDARS: CalendarId[] = ["personal", "plan", "erich"];

interface Props {
  anchor: Date;
  visible: Set<CalendarId>;
  onToggle: (id: CalendarId) => void;
  /** Apply a saved set's calendars to the current view. */
  onApplyCalendars: (ids: CalendarId[]) => void;
  onNewSet: () => void;
  onEditSet: (set: CalendarSet) => void;
  /** Pick a date in a mini-month — moves focus, keeps the current view. */
  onPickDate: (iso: string) => void;
  /** The focused day's ISO date (highlighted distinctly from today). */
  selectedIso: string;
}

export function Sidebar({
  anchor,
  visible,
  onToggle,
  onApplyCalendars,
  onNewSet,
  onEditSet,
  onPickDate,
  selectedIso,
}: Props) {
  const { events } = useData();
  const { calendarSets } = useSettings();
  const counts = countByCalendar(events);
  const nextMonth = addMonths(anchor, 1);

  // Which set (if any) matches the current calendar visibility.
  const allActive = visible.size === ALL_CALENDARS.length;
  const setMatches = (ids: CalendarId[]) =>
    ids.length === visible.size && ids.every((id) => visible.has(id));
  const activeSetId = allActive
    ? "all"
    : (calendarSets.find((s) => setMatches(s.calendarIds))?.id ?? null);

  return (
    <aside className="flex h-full flex-col gap-7 overflow-y-auto border-r border-border-base bg-bg px-5 pb-5 pt-6">
      {/* Account */}
      <section className="flex items-center gap-3 border-b border-border-faint pb-[22px]">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cal-personal text-[13px] font-semibold tracking-[0.02em] text-accent-on">
          V
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="text-sm font-semibold tracking-[-0.005em]">Viet</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-3">
            CEO · founder
          </div>
        </div>
      </section>

      {/* Calendar sets */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-3">
            Sets
          </h3>
          <button
            type="button"
            onClick={onNewSet}
            aria-label="New calendar set"
            title="New calendar set"
            className="inline-flex h-5 w-5 items-center justify-center rounded text-text-3 transition-colors hover:bg-surface-soft hover:text-text"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col">
          <li>
            <SetRow
              name="All calendars"
              active={activeSetId === "all"}
              onApply={() => onApplyCalendars(ALL_CALENDARS)}
            />
          </li>
          {calendarSets.map((s) => (
            <li key={s.id}>
              <SetRow
                name={s.name}
                active={activeSetId === s.id}
                onApply={() => onApplyCalendars(s.calendarIds)}
                onEdit={() => onEditSet(s)}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Calendars */}
      <section>
        <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-3">
          Calendars
        </h3>
        <ul className="flex flex-col">
          {CALENDARS.map((cal) => {
            const on = visible.has(cal.id);
            return (
              <li key={cal.id}>
                <button
                  type="button"
                  onClick={() => onToggle(cal.id)}
                  aria-pressed={on}
                  className="flex w-full items-center gap-2.5 py-1.5 text-left"
                >
                  <span
                    aria-hidden
                    style={{
                      backgroundColor: on ? `var(${cal.colorVar})` : "transparent",
                      borderColor: on ? `var(${cal.colorVar})` : undefined,
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
                  <span className="flex flex-1 items-baseline justify-between">
                    <span className="text-[13px] text-text">{cal.name}</span>
                    <span className="font-mono text-[10px] text-text-3">
                      {counts[cal.id]}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Mini months */}
      <div className="flex flex-col gap-[22px] border-t border-border-faint pt-[22px]">
        <MiniMonth month={anchor} onPickDate={onPickDate} selectedIso={selectedIso} />
        <MiniMonth month={nextMonth} onPickDate={onPickDate} selectedIso={selectedIso} />
      </div>

      {/* Command hint */}
      <div className="mt-auto flex items-center gap-2 rounded-md border border-dashed border-border-base px-3 py-2.5 font-mono text-[11px] text-text-3">
        <kbd className="rounded-[3px] border border-border-strong bg-surface px-1.5 py-px text-[10px] text-text-2">
          ?
        </kbd>
        <span>shortcuts</span>
      </div>
    </aside>
  );
}

function SetRow({
  name,
  active,
  onApply,
  onEdit,
}: {
  name: string;
  active: boolean;
  onApply: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="group flex items-center">
      <button
        type="button"
        onClick={onApply}
        aria-current={active ? "true" : undefined}
        className="flex flex-1 items-center gap-2.5 py-1.5 text-left"
      >
        <span
          className={
            "h-3 w-3 shrink-0 rounded-full border-[1.5px] " +
            (active ? "border-accent bg-accent" : "border-border-strong")
          }
        />
        <span
          className={
            "text-[13px] " + (active ? "font-medium text-text" : "text-text-2")
          }
        >
          {name}
        </span>
      </button>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${name}`}
          title="Edit set"
          className="ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-text-3 opacity-0 transition-opacity hover:bg-surface-soft hover:text-text focus-visible:opacity-100 group-hover:opacity-100"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
          </svg>
        </button>
      )}
    </div>
  );
}
