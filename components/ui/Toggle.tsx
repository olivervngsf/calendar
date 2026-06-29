"use client";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

/** Accessible on/off switch — role="switch", keyboard-operable as a button. */
export function Toggle({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{ backgroundColor: checked ? "var(--accent)" : "var(--border-strong)" }}
      className="relative inline-flex h-[22px] w-[38px] shrink-0 items-center rounded-full transition-colors duration-150"
    >
      <span
        className={
          "inline-block h-[18px] w-[18px] rounded-full bg-surface transition-transform duration-150 " +
          (checked ? "translate-x-[18px]" : "translate-x-0.5")
        }
      />
    </button>
  );
}
