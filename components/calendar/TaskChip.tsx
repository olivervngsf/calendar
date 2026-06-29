"use client";

import type { MouseEvent } from "react";
import type { Task } from "@/lib/types";
import { useData } from "@/components/providers/DataProvider";

/** A day-scoped to-do rendered on the calendar (D040): a checkbox + title. */
export function TaskChip({ task }: { task: Task }) {
  const { toggleTask } = useData();

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation(); // don't trigger the cell's quick-create
    toggleTask(task.id);
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={task.done}
      aria-label={`${task.title}${task.done ? " (done)" : ""}`}
      onClick={handleClick}
      className="flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left transition-colors hover:bg-surface-soft"
    >
      <span
        aria-hidden
        className={
          "flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-[3px] border transition-colors " +
          (task.done
            ? "border-accent bg-accent text-accent-on"
            : "border-border-strong text-transparent")
        }
      >
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M2.5 6.5l2.5 2.5 4.5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={
          "truncate text-[11px] leading-snug " +
          (task.done ? "text-text-3 line-through" : "text-text")
        }
      >
        {task.title}
      </span>
    </button>
  );
}
