"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/** Accessible modal shell: overlay, Escape to close, click-outside, autofocus first field.
 *  Eases in on open (fade + subtle lift/scale); reduced-motion users get it instantly. */
export function Dialog({ title, onClose, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Flip to the visible state on the next frame so the transition plays.
    const raf = requestAnimationFrame(() => setShow(true));
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    // Focus the first *text* field so users can type/edit right away (not the
    // close button, which comes first in the DOM). Select its contents on edit.
    const field = panelRef.current?.querySelector<HTMLElement>(
      "input:not([type='checkbox']):not([type='radio']), textarea, select",
    );
    const target = field ?? panelRef.current?.querySelector<HTMLElement>("button");
    target?.focus();
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.select();
    }
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
      aria-label={title}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className={
          "w-full max-w-md rounded-lg border border-border-strong bg-surface p-6 transition duration-200 ease-out " +
          (show
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-1 scale-[0.98]")
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-base font-semibold tracking-[-0.01em] text-text">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 inline-flex h-7 w-7 items-center justify-center rounded text-text-3 transition-colors hover:bg-surface-soft hover:text-text"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Shared form-control classes — editorial tokens, keeps the dialogs consistent.
export const fieldLabel =
  "mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-text-3";
export const fieldControl =
  "w-full rounded border border-border-strong bg-bg px-3 py-2 text-[13px] text-text " +
  "outline-none transition-colors focus:border-accent";
