"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CalendarView } from "@/lib/types";
import { TODAY } from "@/lib/mock-data";
import { addDays, addMonths, isoDate } from "@/lib/date";

const VALID_VIEWS: CalendarView[] = ["d", "w", "m", "y"];

function parseInitial(): { view: CalendarView; anchor: Date } {
  if (typeof window === "undefined") return { view: "m", anchor: TODAY };
  const params = new URLSearchParams(window.location.search);
  const v = params.get("v");
  const d = params.get("d"); // "YYYY-MM-DD"
  const view = VALID_VIEWS.includes(v as CalendarView)
    ? (v as CalendarView)
    : "m";
  let anchor = TODAY;
  if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split("-").map(Number);
    anchor = new Date(y, m - 1, day);
  }
  return { view, anchor };
}

// Step the anchor by one period, sized to the current view.
function stepAnchor(anchor: Date, view: CalendarView, dir: number): Date {
  switch (view) {
    case "d":
      return addDays(anchor, dir);
    case "w":
      return addDays(anchor, 7 * dir);
    case "y":
      return addMonths(anchor, 12 * dir);
    default:
      return addMonths(anchor, dir);
  }
}

/**
 * Owns view + anchor (a specific day). Navigation is view-aware: ←/→ steps by
 * month / week / day. Anchor + view mirror to the URL (?v=w&d=2026-05-29) so the
 * view is shareable and reload-safe (JTBD #2). Calendar visibility lives in
 * DataProvider (it's coupled to the calendars themselves).
 */
export function useCalendarState() {
  const [view, setView] = useState<CalendarView>("m");
  const [anchor, setAnchor] = useState<Date>(TODAY);

  // Hydrate from URL once on mount (avoids SSR/client mismatch).
  useEffect(() => {
    const { view: v, anchor: a } = parseInitial();
    setView(v);
    setAnchor(a);
  }, []);

  // Mirror view + anchor to the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("v", view);
    params.set("d", isoDate(anchor));
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
  }, [view, anchor]);

  const goToday = useCallback(() => setAnchor(TODAY), []);
  const goPrev = useCallback(
    () => setAnchor((a) => stepAnchor(a, view, -1)),
    [view],
  );
  const goNext = useCallback(
    () => setAnchor((a) => stepAnchor(a, view, 1)),
    [view],
  );

  /** Jump to a specific day (e.g. clicking a date in month view). */
  const goToDate = useCallback((iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    setAnchor(new Date(y, m - 1, d));
  }, []);

  return useMemo(
    () => ({ view, setView, anchor, goToday, goPrev, goNext, goToDate }),
    [view, anchor, goToday, goPrev, goNext, goToDate],
  );
}
