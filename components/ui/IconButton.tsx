"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ className = "", children, ...props }: Props) {
  return (
    <button
      type="button"
      className={
        "inline-flex h-7 w-7 items-center justify-center rounded border border-transparent " +
        "text-text-2 transition-colors duration-100 hover:border-border-base hover:bg-surface-soft " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
