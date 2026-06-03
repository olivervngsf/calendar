"use client";

import type { CalendarView } from "@/lib/types";
import { viewTitle } from "@/lib/date";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PanelToggle } from "@/components/ui/PanelToggle";

interface Props {
  anchor: Date;
  view: CalendarView;
  onView: (view: CalendarView) => void;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  onNewEvent: () => void;
  onOpenSettings: () => void;
  sidebarOpen: boolean;
  notesOpen: boolean;
  onToggleSidebar: () => void;
  onToggleNotes: () => void;
}

export function AppBar({
  anchor,
  view,
  onView,
  onToday,
  onPrev,
  onNext,
  onNewEvent,
  onOpenSettings,
  sidebarOpen,
  notesOpen,
  onToggleSidebar,
  onToggleNotes,
}: Props) {
  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-border-base bg-bg px-7 py-[18px] max-[900px]:grid-cols-1 max-[900px]:gap-3 max-[900px]:px-[18px] max-[900px]:py-3.5">
      <div className="flex items-center gap-2.5">
        <PanelToggle side="left" open={sidebarOpen} onClick={onToggleSidebar} />
        <div className="text-[13px] font-semibold tracking-[-0.005em] text-text">
          <span className="mr-2.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-accent align-middle" />
          calendar
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 max-[900px]:justify-start">
        <div className="flex items-center gap-0.5">
          <IconButton onClick={onPrev} aria-label="Previous month">
            ‹
          </IconButton>
          <Button onClick={onToday}>Today</Button>
          <IconButton onClick={onNext} aria-label="Next month">
            ›
          </IconButton>
        </div>
        {(() => {
          const { primary, secondary } = viewTitle(view, anchor);
          return (
            <span className="ml-2 whitespace-nowrap text-lg font-semibold tracking-[-0.015em] text-text">
              {primary}
              {secondary && (
                <span className="ml-1.5 font-normal text-text-3">{secondary}</span>
              )}
            </span>
          );
        })()}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 max-[900px]:flex-wrap max-[900px]:justify-start">
        <button
          type="button"
          onClick={onNewEvent}
          title="New event (N)"
          className="shrink-0 whitespace-nowrap rounded bg-accent px-3 py-1.5 text-xs font-medium text-accent-on transition-opacity hover:opacity-90"
        >
          + New event
        </button>
        <div className="shrink-0">
          <ViewSwitch value={view} onChange={onView} />
        </div>
        <ThemeToggle />
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Settings"
          title="Settings"
          className="inline-flex h-7 w-7 items-center justify-center rounded border border-transparent text-text-2 transition-colors duration-100 hover:border-border-base hover:bg-surface-soft"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <div
          aria-label="Viet"
          className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-cal-personal text-xs font-semibold tracking-[0.02em] text-accent-on"
        >
          V
        </div>
        <PanelToggle side="right" open={notesOpen} onClick={onToggleNotes} />
      </div>
    </header>
  );
}
