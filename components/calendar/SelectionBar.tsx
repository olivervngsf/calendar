"use client";

import { useEffect, useState } from "react";

interface Props {
  count: number;
  onDelete: () => void;
  onClear: () => void;
}

/** Floating bar shown while events are multi-selected. Only bulk action: delete. */
export function SelectionBar({ count, onDelete, onClear }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={
        "fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-all duration-200 ease-out " +
        (show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
      }
    >
      <div className="flex items-center gap-3 rounded-full border border-border-strong bg-surface px-2 py-2 pl-4 shadow-xl">
        {confirming ? (
          <>
            <span className="text-[13px] text-text">
              Delete {count} {count === 1 ? "event" : "events"}?
            </span>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-full px-3 py-1.5 text-[13px] text-text-2 transition-colors hover:bg-surface-soft"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full bg-text px-3.5 py-1.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-90"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <span className="text-[13px] font-medium text-text">
              {count} selected
            </span>
            <span className="h-4 w-px bg-border-base" />
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-full px-3 py-1.5 text-[13px] text-text-2 transition-colors hover:bg-surface-soft hover:text-text"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-full px-3 py-1.5 text-[13px] text-text-3 transition-colors hover:bg-surface-soft hover:text-text"
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}
