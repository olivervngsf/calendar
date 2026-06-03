"use client";

import type { CalendarId } from "@/lib/types";
import { CALENDARS } from "@/lib/mock-data";
import { addMonths } from "@/lib/date";
import { countByCalendar } from "@/lib/events";
import { useData } from "@/components/providers/DataProvider";
import { MiniMonth } from "@/components/calendar/MiniMonth";

interface Props {
  anchor: Date;
  visible: Set<CalendarId>;
  onToggle: (id: CalendarId) => void;
  /** Pick a date in a mini-month — moves focus, keeps the current view. */
  onPickDate: (iso: string) => void;
  /** The focused day's ISO date (highlighted distinctly from today). */
  selectedIso: string;
}

export function Sidebar({
  anchor,
  visible,
  onToggle,
  onPickDate,
  selectedIso,
}: Props) {
  const { events } = useData();
  const counts = countByCalendar(events);
  const nextMonth = addMonths(anchor, 1);

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
