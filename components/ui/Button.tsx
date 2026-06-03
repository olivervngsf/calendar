"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

/** Quiet, editorial button — used for "Today" and similar secondary actions. */
export function Button({ className = "", children, ...props }: Props) {
  return (
    <button
      type="button"
      className={
        "rounded border border-border-strong bg-surface px-3.5 py-1.5 text-xs font-medium " +
        "text-text tracking-[0.005em] transition-colors duration-100 hover:border-text-2 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
