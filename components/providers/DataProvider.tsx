"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type {
  Calendar,
  CalendarColor,
  CalendarEvent,
  CalendarId,
  Note,
  Task,
} from "@/lib/types";
import { CALENDARS, EVENTS, NOTES, TASKS } from "@/lib/mock-data";

// In-memory store (v0.1 = no DB writes, D001). Seeded from mock data; mutations
// persist for the session only. Owns calendars + their visibility + events + notes,
// since deleting a calendar cascades to its events.

export type EventInput = Omit<CalendarEvent, "id">;
export type NoteInput = Omit<Note, "id">;
export type CalendarInput = Omit<Calendar, "id">;
export type TaskInput = Omit<Task, "id" | "done" | "createdAt">;

interface DataStore {
  calendars: Calendar[];
  /** Currently-shown calendar ids. */
  visible: Set<CalendarId>;
  events: CalendarEvent[];
  notes: Note[];
  tasks: Task[];
  colorOf: (id: CalendarId) => CalendarColor;
  toggleCalendar: (id: CalendarId) => void;
  applyCalendars: (ids: CalendarId[]) => void;
  addCalendar: (input: CalendarInput) => void;
  updateCalendar: (id: CalendarId, input: CalendarInput) => void;
  deleteCalendar: (id: CalendarId) => void;
  addEvent: (input: EventInput) => void;
  updateEvent: (id: string, input: EventInput) => void;
  deleteEvent: (id: string) => void;
  deleteEvents: (ids: string[]) => void;
  addNote: (input: NoteInput) => void;
  updateNote: (id: string, input: NoteInput) => void;
  deleteNote: (id: string) => void;
  addTask: (input: TaskInput) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const DataContext = createContext<DataStore | null>(null);

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [calendars, setCalendars] = useState<Calendar[]>(CALENDARS);
  const [visible, setVisible] = useState<Set<CalendarId>>(
    () => new Set(CALENDARS.map((c) => c.id)),
  );
  const [events, setEvents] = useState<CalendarEvent[]>(EVENTS);
  const [notes, setNotes] = useState<Note[]>(NOTES);
  const [tasks, setTasks] = useState<Task[]>(TASKS);

  const colorOf = useCallback(
    (id: CalendarId): CalendarColor =>
      calendars.find((c) => c.id === id)?.color ?? "teal",
    [calendars],
  );

  const toggleCalendar = useCallback((id: CalendarId) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const applyCalendars = useCallback((ids: CalendarId[]) => {
    setVisible(new Set(ids));
  }, []);

  const addCalendar = useCallback((input: CalendarInput) => {
    const id = newId("cal");
    setCalendars((prev) => [...prev, { ...input, id }]);
    setVisible((prev) => new Set(prev).add(id)); // new calendar shows by default
  }, []);

  const updateCalendar = useCallback((id: CalendarId, input: CalendarInput) => {
    setCalendars((prev) => prev.map((c) => (c.id === id ? { ...input, id } : c)));
  }, []);

  const deleteCalendar = useCallback((id: CalendarId) => {
    setCalendars((prev) => prev.filter((c) => c.id !== id));
    setEvents((prev) => prev.filter((e) => e.calendarId !== id)); // cascade
    setVisible((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const addEvent = useCallback((input: EventInput) => {
    setEvents((prev) => [...prev, { ...input, id: newId("e") }]);
  }, []);

  const updateEvent = useCallback((id: string, input: EventInput) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...input, id } : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const deleteEvents = useCallback((ids: string[]) => {
    const drop = new Set(ids);
    setEvents((prev) => prev.filter((e) => !drop.has(e.id)));
  }, []);

  const addNote = useCallback((input: NoteInput) => {
    setNotes((prev) => [{ ...input, id: newId("n") }, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, input: NoteInput) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...input, id } : n)));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addTask = useCallback((input: TaskInput) => {
    const createdAt = input.date;
    setTasks((prev) => [
      ...prev,
      { ...input, id: newId("t"), done: false, createdAt },
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo<DataStore>(
    () => ({
      calendars,
      visible,
      events,
      notes,
      tasks,
      colorOf,
      toggleCalendar,
      applyCalendars,
      addCalendar,
      updateCalendar,
      deleteCalendar,
      addEvent,
      updateEvent,
      deleteEvent,
      deleteEvents,
      addNote,
      updateNote,
      deleteNote,
      addTask,
      toggleTask,
      deleteTask,
    }),
    [
      calendars,
      visible,
      events,
      notes,
      tasks,
      colorOf,
      toggleCalendar,
      applyCalendars,
      addCalendar,
      updateCalendar,
      deleteCalendar,
      addEvent,
      updateEvent,
      deleteEvent,
      deleteEvents,
      addNote,
      updateNote,
      deleteNote,
      addTask,
      toggleTask,
      deleteTask,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataStore {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
