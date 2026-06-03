"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Global, persisted user preferences. Kept separate from calendar data (DataProvider)
// and theme (useTheme) — this is the home for "optimize globally" toggles.

export type YearStyle = "grid" | "columns";
export type WeekStyle = "timeline" | "agenda";

interface Settings {
  showWeekNumbers: boolean;
  yearStyle: YearStyle;
  weekStyle: WeekStyle;
}

const DEFAULTS: Settings = {
  showWeekNumbers: false,
  yearStyle: "grid",
  weekStyle: "timeline",
};

const STORAGE_KEY = "settings";

interface SettingsStore extends Settings {
  setShowWeekNumbers: (value: boolean) => void;
  setYearStyle: (value: YearStyle) => void;
  setWeekStyle: (value: WeekStyle) => void;
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

  const value = useMemo<SettingsStore>(
    () => ({ ...settings, setShowWeekNumbers, setYearStyle, setWeekStyle }),
    [settings, setShowWeekNumbers, setYearStyle, setWeekStyle],
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
