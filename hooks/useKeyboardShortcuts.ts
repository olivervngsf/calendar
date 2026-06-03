"use client";

import { useEffect } from "react";

export interface ShortcutHandlers {
  onView?: (view: "d" | "w" | "m" | "y") => void;
  onToday?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onNew?: () => void;
  onSearch?: () => void;
  onHelp?: () => void;
  onSettings?: () => void;
  onToggleSidebar?: () => void;
  onToggleNotes?: () => void;
  onNewNote?: () => void;
  onQuickAdd?: () => void;
}

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

/**
 * Global keyboard layer (PRD §5): D/W/M/Y switch view, T today, ←/→ period,
 * N new event, / search, ? help. Disabled while typing in a field.
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // ⌘/Ctrl/Alt combos are left to the browser (⌘N etc. are reserved and
      // can't be intercepted by a page) — our create shortcuts use Shift+letter.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      // Create actions — N / Shift+N / Shift+Q (matched by code, shift-aware).
      if (e.code === "KeyN") {
        e.preventDefault();
        if (e.shiftKey) handlers.onNewNote?.();
        else handlers.onNew?.();
        return;
      }
      if (e.code === "KeyQ" && e.shiftKey) {
        e.preventDefault();
        handlers.onQuickAdd?.();
        return;
      }

      switch (e.key) {
        case "d":
        case "D":
          handlers.onView?.("d");
          break;
        case "w":
        case "W":
          handlers.onView?.("w");
          break;
        case "m":
        case "M":
          handlers.onView?.("m");
          break;
        case "y":
        case "Y":
          handlers.onView?.("y");
          break;
        case "t":
        case "T":
          handlers.onToday?.();
          break;
        case "ArrowLeft":
          handlers.onPrev?.();
          break;
        case "ArrowRight":
          handlers.onNext?.();
          break;
        case "/":
          e.preventDefault();
          handlers.onSearch?.();
          break;
        case "?":
          e.preventDefault();
          handlers.onHelp?.();
          break;
        case ",":
          e.preventDefault();
          handlers.onSettings?.();
          break;
        case "[":
          e.preventDefault();
          handlers.onToggleSidebar?.();
          break;
        case "]":
          e.preventDefault();
          handlers.onToggleNotes?.();
          break;
        default:
          return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
