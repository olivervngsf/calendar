"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { CalendarEvent, Note } from "@/lib/types";
import { EVENTS, NOTES } from "@/lib/mock-data";

// In-memory store (v0.1 = no DB writes, D001). Seeded from mock data; mutations
// persist for the session only. A dedicated store (not bolted onto useCalendarState)
// so CRUD has one home — per the Engineer note from the foundation pass.

export type EventInput = Omit<CalendarEvent, "id">;
export type NoteInput = Omit<Note, "id">;

interface DataStore {
  events: CalendarEvent[];
  notes: Note[];
  addEvent: (input: EventInput) => void;
  updateEvent: (id: string, input: EventInput) => void;
  deleteEvent: (id: string) => void;
  addNote: (input: NoteInput) => void;
  updateNote: (id: string, input: NoteInput) => void;
  deleteNote: (id: string) => void;
}

const DataContext = createContext<DataStore | null>(null);

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(EVENTS);
  const [notes, setNotes] = useState<Note[]>(NOTES);

  const addEvent = useCallback((input: EventInput) => {
    setEvents((prev) => [...prev, { ...input, id: newId("e") }]);
  }, []);

  const updateEvent = useCallback((id: string, input: EventInput) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...input, id } : e)),
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
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

  const value = useMemo<DataStore>(
    () => ({
      events,
      notes,
      addEvent,
      updateEvent,
      deleteEvent,
      addNote,
      updateNote,
      deleteNote,
    }),
    [
      events,
      notes,
      addEvent,
      updateEvent,
      deleteEvent,
      addNote,
      updateNote,
      deleteNote,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataStore {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
