"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Calendar, CalendarEvent, CalendarSet, Note } from "@/lib/types";
import { useCalendarState } from "@/hooks/useCalendarState";
import { useData } from "@/components/providers/DataProvider";
import { useSelection } from "@/components/providers/SelectionProvider";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { isoDate, noteScopeFor } from "@/lib/date";
import { TODAY } from "@/lib/mock-data";
import { AppBar } from "./AppBar";
import { Sidebar } from "./Sidebar";
import { NotesPanel } from "./NotesPanel";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { SettingsDialog } from "./SettingsDialog";
import { MonthView } from "@/components/calendar/MonthView";
import { WeekView } from "@/components/calendar/WeekView";
import { DayView } from "@/components/calendar/DayView";
import { YearView } from "@/components/calendar/YearView";
import { EventDialog } from "@/components/calendar/EventDialog";
import { EventDetail } from "@/components/calendar/EventDetail";
import { QuickCreate } from "@/components/calendar/QuickCreate";
import { SelectionBar } from "@/components/calendar/SelectionBar";
import { CalendarDialog } from "@/components/calendar/CalendarDialog";
import { CalendarSetDialog } from "@/components/calendar/CalendarSetDialog";
import { QuickAddDialog } from "@/components/calendar/QuickAddDialog";
import { NoteDialog } from "@/components/notes/NoteDialog";

type EventDialogState =
  | { event: CalendarEvent; date?: undefined; startHour?: undefined }
  | { event?: undefined; date: string; startHour?: number };
type NoteDialogState = { note?: Note };

const pad2 = (n: number) => String(n).padStart(2, "0");

export function AppShell() {
  const cal = useCalendarState();
  const data = useData();
  const selection = useSelection();
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(true);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [setDialog, setSetDialog] = useState<{ set?: CalendarSet } | null>(null);
  const [calendarDialog, setCalendarDialog] = useState<{
    calendar?: Calendar;
  } | null>(null);
  const [eventDialog, setEventDialog] = useState<EventDialogState | null>(null);
  const [eventDetail, setEventDetail] = useState<{
    event: CalendarEvent;
    anchor: DOMRect;
  } | null>(null);
  const [quickCreate, setQuickCreate] = useState<{
    date: string;
    hour?: number;
    anchor: DOMRect;
  } | null>(null);
  const [noteDialog, setNoteDialog] = useState<NoteDialogState | null>(null);

  // Default date for a brand-new event: today if it's in the visible month, else the 1st.
  const defaultEventDate = useCallback(() => {
    const sameMonth =
      cal.anchor.getFullYear() === TODAY.getFullYear() &&
      cal.anchor.getMonth() === TODAY.getMonth();
    return sameMonth
      ? isoDate(TODAY)
      : isoDate(new Date(cal.anchor.getFullYear(), cal.anchor.getMonth(), 1));
  }, [cal.anchor]);

  const openNewEvent = useCallback(() => {
    setEventDialog({ date: defaultEventDate() });
  }, [defaultEventDate]);

  // Single click → read-first detail popover; double-click → jump straight to edit.
  // We defer the single-click popover briefly so a double-click can cancel it —
  // otherwise the detail backdrop would swallow the second click and dblclick
  // would never fire. ⌘/Ctrl-click (select) is handled in the event components.
  const clickTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (clickTimer.current) clearTimeout(clickTimer.current);
  }, []);

  const handleEventClick = useCallback(
    (event: CalendarEvent, anchor: DOMRect) => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickTimer.current = window.setTimeout(() => {
        setEventDetail({ event, anchor });
        clickTimer.current = null;
      }, 200);
    },
    [],
  );

  // Double-click → edit directly. Cancels the pending detail popover. Keyboard
  // equivalent (D033): Enter inside the detail popover opens the same edit form.
  const handleEventEdit = useCallback((event: CalendarEvent) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    setEventDetail(null);
    setEventDialog({ event });
  }, []);

  // Click an empty month day cell → quick-create an all-day event there.
  const handleDayClick = useCallback((iso: string, anchor: DOMRect) => {
    setQuickCreate({ date: iso, anchor });
  }, []);

  // Click an empty time slot (week/day) → quick-create at that day + hour.
  const handleSlotClick = useCallback(
    (iso: string, hour: number, anchor: DOMRect) => {
      setQuickCreate({ date: iso, hour, anchor });
    },
    [],
  );

  // Click a day (week header / year grid) → open that day.
  const handleSelectDay = useCallback(
    (iso: string) => {
      cal.goToDate(iso);
      cal.setView("d");
    },
    [cal],
  );

  // Navigator (mini-month): move focus to the date, keep the current view.
  const handleFocusDate = useCallback(
    (iso: string) => cal.goToDate(iso),
    [cal],
  );

  // Click a month name in the year grid → open that month.
  const handleSelectMonth = useCallback(
    (d: Date) => {
      cal.goToDate(isoDate(d));
      cal.setView("m");
    },
    [cal],
  );

  const openNewNote = useCallback(() => setNoteDialog({}), []);
  const handleNoteClick = useCallback((note: Note) => setNoteDialog({ note }), []);

  useKeyboardShortcuts({
    onView: cal.setView,
    onToday: cal.goToday,
    onPrev: cal.goPrev,
    onNext: cal.goNext,
    onNew: openNewEvent,
    onHelp: () => setHelpOpen((v) => !v),
    onSettings: () => setSettingsOpen((v) => !v),
    onToggleSidebar: () => setSidebarOpen((v) => !v),
    onToggleNotes: () => setNotesOpen((v) => !v),
    onNewNote: openNewNote,
    onQuickAdd: () => setQuickAddOpen(true),
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppBar
        anchor={cal.anchor}
        view={cal.view}
        onView={cal.setView}
        onToday={cal.goToday}
        onPrev={cal.goPrev}
        onNext={cal.goNext}
        onNewEvent={openNewEvent}
        onOpenSettings={() => setSettingsOpen(true)}
        sidebarOpen={sidebarOpen}
        notesOpen={notesOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onToggleNotes={() => setNotesOpen((v) => !v)}
      />

      <div className="flex min-h-0 flex-1">
        {/* Sidebar — slides left on collapse */}
        <div
          className="shrink-0 overflow-hidden transition-[width] duration-200 ease-out max-[900px]:hidden"
          style={{ width: sidebarOpen ? 240 : 0 }}
        >
          <div
            className={`h-full w-60 transition-transform duration-200 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <Sidebar
              anchor={cal.anchor}
              visible={data.visible}
              onToggle={data.toggleCalendar}
              onApplyCalendars={data.applyCalendars}
              onNewSet={() => setSetDialog({})}
              onEditSet={(set) => setSetDialog({ set })}
              onNewCalendar={() => setCalendarDialog({})}
              onEditCalendar={(calendar) => setCalendarDialog({ calendar })}
              onPickDate={handleFocusDate}
              selectedIso={isoDate(cal.anchor)}
              onOpenShortcuts={() => setHelpOpen(true)}
            />
          </div>
        </div>

        <main className="flex min-w-0 flex-1 flex-col bg-bg">
          {cal.view === "m" && (
            <MonthView
              anchor={cal.anchor}
              visible={data.visible}
              onEventClick={handleEventClick}
              onEventEdit={handleEventEdit}
              onDayClick={handleDayClick}
            />
          )}
          {cal.view === "w" && (
            <WeekView
              anchor={cal.anchor}
              visible={data.visible}
              onEventClick={handleEventClick}
              onEventEdit={handleEventEdit}
              onSlotClick={handleSlotClick}
              onSelectDay={handleSelectDay}
            />
          )}
          {cal.view === "d" && (
            <DayView
              anchor={cal.anchor}
              visible={data.visible}
              onEventClick={handleEventClick}
              onEventEdit={handleEventEdit}
              onSlotClick={handleSlotClick}
            />
          )}
          {cal.view === "y" && (
            <YearView
              anchor={cal.anchor}
              visible={data.visible}
              onSelectDay={handleSelectDay}
              onSelectMonth={handleSelectMonth}
            />
          )}
        </main>

        {/* Notes — slides right on collapse */}
        <div
          className="shrink-0 overflow-hidden transition-[width] duration-200 ease-out max-[900px]:hidden"
          style={{ width: notesOpen ? 320 : 0 }}
        >
          <div
            className={`h-full w-80 transition-transform duration-200 ease-out ${notesOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <NotesPanel
              view={cal.view}
              anchor={cal.anchor}
              onNewNote={openNewNote}
              onNoteClick={handleNoteClick}
            />
          </div>
        </div>
      </div>

      {eventDetail && (
        <EventDetail
          event={eventDetail.event}
          anchor={eventDetail.anchor}
          onEdit={() => {
            setEventDialog({ event: eventDetail.event });
            setEventDetail(null);
          }}
          onDelete={() => {
            data.deleteEvent(eventDetail.event.id);
            setEventDetail(null);
          }}
          onClose={() => setEventDetail(null)}
        />
      )}

      {quickCreate && (
        <QuickCreate
          date={quickCreate.date}
          hour={quickCreate.hour}
          anchor={quickCreate.anchor}
          onClose={() => setQuickCreate(null)}
          onMore={() => {
            setEventDialog({
              date: quickCreate.date,
              startHour: quickCreate.hour,
            });
            setQuickCreate(null);
          }}
        />
      )}

      {selection.count > 0 && (
        <SelectionBar
          count={selection.count}
          onDelete={() => {
            data.deleteEvents([...selection.selected]);
            selection.clear();
          }}
          onClear={selection.clear}
        />
      )}

      {eventDialog && (
        <EventDialog
          event={eventDialog.event}
          defaultDate={eventDialog.date ?? defaultEventDate()}
          defaultStart={
            eventDialog.startHour !== undefined
              ? `${pad2(eventDialog.startHour)}:00`
              : undefined
          }
          onClose={() => setEventDialog(null)}
        />
      )}

      {noteDialog &&
        (() => {
          const s = noteScopeFor(cal.view, cal.anchor);
          return (
            <NoteDialog
              note={noteDialog.note}
              scope={{ unit: s.unit, key: s.key }}
              scopeLabel={s.label}
              onClose={() => setNoteDialog(null)}
            />
          );
        })()}

      {quickAddOpen && (
        <QuickAddDialog
          onClose={() => setQuickAddOpen(false)}
          onCreated={(iso) => cal.goToDate(iso)}
        />
      )}

      {setDialog && (
        <CalendarSetDialog
          set={setDialog.set}
          onApply={data.applyCalendars}
          onClose={() => setSetDialog(null)}
        />
      )}

      {calendarDialog && (
        <CalendarDialog
          calendar={calendarDialog.calendar}
          onClose={() => setCalendarDialog(null)}
        />
      )}

      {settingsOpen && <SettingsDialog onClose={() => setSettingsOpen(false)} />}

      {helpOpen && <ShortcutsHelp onClose={() => setHelpOpen(false)} />}
    </div>
  );
}
