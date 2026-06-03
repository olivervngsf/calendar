"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CalendarSet } from "@/lib/types";

// Global, persisted user preferences. Kept separate from calendar data (DataProvider)
// and theme (useTheme) — this is the home for "optimize globally" toggles.

export type YearStyle = "grid" | "columns";
export type WeekStyle = "timeline" | "agenda";

interface Settings {
  showWeekNumbers: boolean;
  yearStyle: YearStyle;
  weekStyle: WeekStyle;
  calendarSets: CalendarSet[];
}

const DEFAULTS: Settings = {
  showWeekNumbers: false,
  yearStyle: "grid",
  weekStyle: "timeline",
  // Seeded examples so the feature is alive in the demo.
  calendarSets: [
    { id: "set-personal", name: "Personal", calendarIds: ["personal", "erich"] },
    { id: "set-work", name: "Work", calendarIds: ["plan", "erich"] },
  ],
};

const STORAGE_KEY = "settings";

interface SettingsStore extends Settings {
  setShowWeekNumbers: (value: boolean) => void;
  setYearStyle: (value: YearStyle) => void;
  setWeekStyle: (value: WeekStyle) => void;
  addCalendarSet: (input: Omit<CalendarSet, "id">) => void;
  updateCalendarSet: (id: string, input: Omit<CalendarSet, "id">) => void;
  deleteCalendarSet: (id: string) => void;
}

const SettingsContext = createContext<SettingsStore | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: Settings) => {
    setSettings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const setShowWeekNumbers = useCallback(
    (value: boolean) => persist({ ...settings, showWeekNumbers: value }),
    [settings, persist],
  );

  const setYearStyle = useCallback(
    (value: YearStyle) => persist({ ...settings, yearStyle: value }),
    [settings, persist],
  );

  const setWeekStyle = useCallback(
    (value: WeekStyle) => persist({ ...settings, weekStyle: value }),
    [settings, persist],
  );

  const newSetId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `set-${crypto.randomUUID()}`
      : `set-${Date.now()}`;

  const addCalendarSet = useCallback(
    (input: Omit<CalendarSet, "id">) =>
      persist({
        ...settings,
        calendarSets: [...settings.calendarSets, { ...input, id: newSetId() }],
      }),
    [settings, persist],
  );

  const updateCalendarSet = useCallback(
    (id: string, input: Omit<CalendarSet, "id">) =>
      persist({
        ...settings,
        calendarSets: settings.calendarSets.map((s) =>
          s.id === id ? { ...input, id } : s,
        ),
      }),
    [settings, persist],
  );

  const deleteCalendarSet = useCallback(
    (id: string) =>
      persist({
        ...settings,
        calendarSets: settings.calendarSets.filter((s) => s.id !== id),
      }),
    [settings, persist],
  );

  const value = useMemo<SettingsStore>(
    () => ({
      ...settings,
      setShowWeekNumbers,
      setYearStyle,
      setWeekStyle,
      addCalendarSet,
      updateCalendarSet,
      deleteCalendarSet,
    }),
    [
      settings,
      setShowWeekNumbers,
      setYearStyle,
      setWeekStyle,
      addCalendarSet,
      updateCalendarSet,
      deleteCalendarSet,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsStore {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
