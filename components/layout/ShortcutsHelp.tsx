"use client";

import { useEffect, useState } from "react";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["D"], label: "Day view" },
  { keys: ["W"], label: "Week view" },
  { keys: ["M"], label: "Month view" },
  { keys: ["Y"], label: "Year view" },
  { keys: ["T"], label: "Jump to today" },
  { keys: ["←", "→"], label: "Previous / next month" },
  { keys: ["N"], label: "New event" },
  { keys: ["⇧", "N"], label: "New note" },
  { keys: ["⇧", "Q"], label: "Quick add (natural language)" },
  { keys: ["/"], label: "Search" },
  { keys: [","], label: "Settings" },
  { keys: ["["], label: "Toggle sidebar" },
  { keys: ["]"], label: "Toggle notes panel" },
  { keys: ["?"], label: "This help" },
];

export function ShortcutsHelp({ onClose }: { onClose: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true));
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className={
        "fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 transition-opacity duration-200 ease-out " +
        (show ? "opacity-100" : "opacity-0")
      }
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={onClose}
    >
      <div
        className={
          "w-full max-w-sm rounded-lg border border-border-base bg-surface p-6 shadow-xl transition duration-200 ease-out " +
          (show
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-1 scale-[0.98]")
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-base font-semibold tracking-[-0.01em] text-text">
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[11px] text-text-3 hover:text-text-2"
          >
            esc
          </button>
        </div>
        <ul className="flex flex-col gap-2.5">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between">
              <span className="text-[13px] text-text-2">{s.label}</span>
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="min-w-[22px] rounded-[3px] border border-border-strong bg-bg px-1.5 py-px text-center font-mono text-[11px] text-text-2"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
