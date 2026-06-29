"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CalendarEvent, CalendarView, Note } from "@/lib/types";
import { noteScopeFor, rangeFor, noteScopeDate } from "@/lib/date";
import { eventDateKey, eventTimeLabel } from "@/lib/events";
import { useData } from "@/components/providers/DataProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { TaskChip } from "@/components/calendar/TaskChip";

type CreateKind = "task" | "event" | "note";

interface Props {
  view: CalendarView;
  anchor: Date;
  /** Open the unified capture, optionally preset to a kind (section + buttons). */
  onCreate: (kind?: CreateKind) => void;
  onNoteClick: (note: Note) => void;
  /** Jump to a day (used by event rows in week/month/year). */
  onSelectDay: (iso: string) => void;
}

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${WD[date.getDay()]} ${MO[m - 1]} ${d}`;
}

/** Collapsible section with a count and an inline "+" create button (D043). */
function Section({
  label,
  count,
  collapsed,
  onToggle,
  onCreate,
  children,
}: {
  label: string;
  count: number;
  collapsed: boolean;
  onToggle: () => void;
  onCreate: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          className="group flex items-center gap-1.5 text-text-3 transition-colors hover:text-text-2"
        >
          <svg
            width="9"
            height="9"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
            className={"transition-transform duration-150 " + (collapsed ? "-rotate-90" : "")}
          >
            <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]">
            {label}
          </h3>
          <span className="font-mono text-[10px] tabular-nums text-text-faint">{count}</span>
        </button>
        <button
          type="button"
          onClick={onCreate}
          aria-label={`New ${label.replace(/s$/, "").toLowerCase()}`}
          className="flex h-5 w-5 items-center justify-center rounded text-text-3 transition-colors hover:bg-surface-soft hover:text-text"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M6 2.5v7M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {!collapsed && children}
    </section>
  );
}

function EventRow({
  event,
  showDate,
  color,
  onClick,
}: {
  event: CalendarEvent;
  showDate: boolean;
  color: string;
  onClick: () => void;
}) {
  const time = eventTimeLabel(event);
  const unscheduled = !!event.scope;
  return (
    <button
      type="button"
      onClick={unscheduled ? undefined : onClick}
      className={
        "group flex w-full items-baseline gap-2 rounded px-1 py-1 text-left transition-colors " +
        (unscheduled ? "cursor-default" : "hover:bg-surface-soft")
      }
    >
      <span
        aria-hidden
        style={{ backgroundColor: `var(--cal-${color})` }}
        className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] leading-snug text-text group-hover:text-accent">
          {event.title}
        </span>
        <span className="font-mono text-[10px] tracking-[0.01em] text-text-3">
          {unscheduled ? (
            "Unscheduled"
          ) : (
            <>
              {showDate ? shortDate(eventDateKey(event)) : ""}
              {showDate && (time || event.allDay) ? " · " : ""}
              {event.allDay ? "All day" : time}
            </>
          )}
        </span>
      </span>
    </button>
  );
}

function NoteCard({ note, onClick }: { note: Note; onClick: (n: Note) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(note)}
      className="mb-2 block w-full rounded-[5px] border border-border-base bg-surface px-4 py-3 text-left transition-colors duration-100 hover:border-border-strong"
    >
      {note.tag && (
        <div className="mb-1.5 inline-block rounded-[3px] bg-accent-soft px-[7px] py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-accent">
          {note.tag}
        </div>
      )}
      <div className="mb-1 font-mono text-[10px] tracking-[0.04em] text-text-3">
        {note.date}
      </div>
      <div className="mb-1 text-[13px] font-semibold tracking-[-0.005em] text-text">
        {note.title}
      </div>
      {note.body && (
        <div className="line-clamp-3 text-xs leading-relaxed text-text-2">{note.body}</div>
      )}
    </button>
  );
}

/**
 * Scoped digest (D041): Tasks · Events · Notes for the active view's time unit.
 * Everything is range-based — on Month you see the whole month's items (notes
 * range-based too, overturning D022). The three primitives in one surface.
 */
export function NotesPanel({ view, anchor, onCreate, onNoteClick, onSelectDay }: Props) {
  const { notes, events, tasks, visible, colorOf } = useData();
  const { noteScope } = useSettings();
  const [collapsed, setCollapsed] = useState({
    tasks: false,
    events: false,
    notes: false,
  });
  const toggle = (k: "tasks" | "events" | "notes") =>
    setCollapsed((c) => ({ ...c, [k]: !c[k] }));
  const scope = useMemo(() => noteScopeFor(view, anchor), [view, anchor]);
  const { startIso, endIso } = useMemo(() => rangeFor(view, anchor), [view, anchor]);
  const showDate = view !== "d";

  // Unscheduled (scoped) items pin to the top of each section (D044).
  const rangeTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.date >= startIso && t.date <= endIso)
        .sort(
          (a, b) =>
            Number(!!b.scope) - Number(!!a.scope) ||
            Number(a.done) - Number(b.done) ||
            a.date.localeCompare(b.date),
        ),
    [tasks, startIso, endIso],
  );
  const rangeEvents = useMemo(
    () =>
      events
        .filter(
          (e) =>
            visible.has(e.calendarId) &&
            eventDateKey(e) >= startIso &&
            eventDateKey(e) <= endIso,
        )
        .sort(
          (a, b) =>
            Number(!!b.scope) - Number(!!a.scope) ||
            a.start.localeCompare(b.start),
        ),
    [events, visible, startIso, endIso],
  );
  const rangeNotes = useMemo(
    () =>
      notes
        .filter((n) => {
          const d = noteScopeDate(n.scope.unit, n.scope.key);
          return d >= startIso && d <= endIso;
        })
        .sort((a, b) => b.date.localeCompare(a.date)),
    [notes, startIso, endIso],
  );

  // "This unit's own note" (exact scope) vs the rolled-up rest (D041 IA).
  const isOwn = useCallback(
    (n: Note) => n.scope.unit === scope.unit && n.scope.key === scope.key,
    [scope],
  );
  const ownNotes = useMemo(() => rangeNotes.filter(isOwn), [rangeNotes, isOwn]);
  const otherNotes = useMemo(
    () => rangeNotes.filter((n) => !isOwn(n)),
    [rangeNotes, isOwn],
  );
  // Setting (D042): "exact" shows only this unit's note; "range" rolls up the rest.
  const notesShown = noteScope === "exact" ? ownNotes : rangeNotes;

  const total = rangeTasks.length + rangeEvents.length + notesShown.length;

  // Scroll-edge fade (D036) — fade only the edge with content scrolled past it.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });
  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const top = el.scrollTop > 4;
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 4;
    setEdges((p) => (p.top === top && p.bottom === bottom ? p : { top, bottom }));
  }, []);
  useEffect(() => {
    updateEdges();
  }, [total, view, updateEdges]);

  const FADE = 28;
  const mask = `linear-gradient(to bottom, ${
    edges.top ? "transparent 0px" : "black 0px"
  }, black ${FADE}px, black calc(100% - ${FADE}px), ${
    edges.bottom ? "transparent 100%" : "black 100%"
  })`;

  return (
    <aside
      aria-label={`Agenda — ${scope.label}`}
      className="flex h-full flex-col border-l border-border-base bg-bg"
    >
      {/* Sticky header — the scope this digest is showing */}
      <header className="flex shrink-0 items-baseline justify-between gap-3 border-b border-border-faint px-6 py-4">
        <h2 className="shrink-0 text-base font-semibold tracking-[-0.01em] text-text">
          {scope.label}
        </h2>
        <div className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-text-3">
          {scope.tag}
        </div>
      </header>

      {/* Scrollable digest */}
      <div
        ref={scrollRef}
        onScroll={updateEdges}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5"
      >
        {total === 0 ? (
          <p className="text-[13px] leading-relaxed text-text-3">
            Nothing for {scope.tag} yet. Press{" "}
            <span className="font-mono text-text-2">N</span> to capture a task,
            event, or note.
          </p>
        ) : (
          <>
            {rangeTasks.length > 0 && (
              <Section
                label="Tasks"
                count={rangeTasks.length}
                collapsed={collapsed.tasks}
                onToggle={() => toggle("tasks")}
                onCreate={() => onCreate("task")}
              >
                <div className="flex flex-col gap-0.5">
                  {rangeTasks.map((t) => (
                    <TaskChip key={t.id} task={t} />
                  ))}
                </div>
              </Section>
            )}

            {rangeEvents.length > 0 && (
              <Section
                label="Events"
                count={rangeEvents.length}
                collapsed={collapsed.events}
                onToggle={() => toggle("events")}
                onCreate={() => onCreate("event")}
              >
                <div className="flex flex-col gap-0.5">
                  {rangeEvents.map((e) => (
                    <EventRow
                      key={e.id}
                      event={e}
                      showDate={showDate}
                      color={colorOf(e.calendarId)}
                      onClick={() => onSelectDay(eventDateKey(e))}
                    />
                  ))}
                </div>
              </Section>
            )}

            {notesShown.length > 0 && (
              <Section
                label="Notes"
                count={notesShown.length}
                collapsed={collapsed.notes}
                onToggle={() => toggle("notes")}
                onCreate={() => onCreate("note")}
              >
                {noteScope === "exact" ? (
                  ownNotes.map((n) => (
                    <NoteCard key={n.id} note={n} onClick={onNoteClick} />
                  ))
                ) : (
                  <>
                    {/* This unit's own note(s) pinned first */}
                    {ownNotes.map((n) => (
                      <NoteCard key={n.id} note={n} onClick={onNoteClick} />
                    ))}
                    {otherNotes.length > 0 && (
                      <>
                        {ownNotes.length > 0 && (
                          <div className="mb-2 mt-1 border-t border-border-faint pt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-text-faint">
                            Across {scope.tag}
                          </div>
                        )}
                        {otherNotes.map((n) => (
                          <NoteCard key={n.id} note={n} onClick={onNoteClick} />
                        ))}
                      </>
                    )}
                  </>
                )}
              </Section>
            )}
          </>
        )}
      </div>

      {/* Sticky footer — capture anything into this scope */}
      <div className="shrink-0 border-t border-border-faint px-6 py-4">
        <button
          type="button"
          onClick={() => onCreate()}
          className="block w-full rounded-[5px] border border-dashed border-border-strong px-3.5 py-3 text-left text-[13px] text-text-3 transition-colors duration-100 hover:border-text-2 hover:text-text-2"
        >
          <span className="mr-2 font-mono text-sm text-text-3">+</span>
          Add to {scope.tag}
        </button>
      </div>
    </aside>
  );
}
