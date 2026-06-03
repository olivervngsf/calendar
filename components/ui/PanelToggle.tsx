"use client";

interface Props {
  side: "left" | "right";
  open: boolean;
  onClick: () => void;
}

/** Sidebar/notes panel collapse toggle. Fills the panel compartment when open. */
export function PanelToggle({ side, open, onClick }: Props) {
  const isLeft = side === "left";
  const dividerX = isLeft ? 9 : 15;
  const compartmentX = isLeft ? 3 : 15;
  const label = `${open ? "Hide" : "Show"} ${isLeft ? "sidebar" : "notes panel"}`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={open}
      title={`${label} (${isLeft ? "[" : "]"})`}
      className="inline-flex h-7 w-7 items-center justify-center rounded border border-transparent text-text-2 transition-colors duration-100 hover:border-border-base hover:bg-surface-soft"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {open && (
          <rect
            x={compartmentX}
            y={3}
            width={6}
            height={18}
            rx={1.5}
            fill="currentColor"
            fillOpacity={0.18}
            stroke="none"
          />
        )}
        <rect x={3} y={3} width={18} height={18} rx={2.5} />
        <line x1={dividerX} y1={3} x2={dividerX} y2={21} />
      </svg>
    </button>
  );
}
