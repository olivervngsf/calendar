"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Toggle } from "@/components/ui/Toggle";
import { useSettings, type YearStyle } from "@/components/providers/SettingsProvider";

interface Props {
  onClose: () => void;
}

interface SettingRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function SettingRow({ label, description, checked, onChange }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-text">{label}</div>
        <div className="mt-0.5 text-xs leading-relaxed text-text-3">
          {description}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

const YEAR_STYLES: { value: YearStyle; label: string }[] = [
  { value: "grid", label: "Calendar" },
  { value: "columns", label: "Columns" },
];

export function SettingsDialog({ onClose }: Props) {
  const { showWeekNumbers, setShowWeekNumbers, yearStyle, setYearStyle } =
    useSettings();

  return (
    <Dialog title="Settings" onClose={onClose}>
      <section>
        <h3 className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-3">
          Calendar
        </h3>
        <div className="divide-y divide-border-faint">
          <SettingRow
            label="Week numbers"
            description="Show ISO week numbers across views — month rows, the day/week header, and the year grid."
            checked={showWeekNumbers}
            onChange={setShowWeekNumbers}
          />

          <div className="flex items-center justify-between gap-6 py-3">
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-text">Year view</div>
              <div className="mt-0.5 text-xs leading-relaxed text-text-3">
                Twelve mini-months, or a linear month-by-month planner.
              </div>
            </div>
            <div className="inline-flex shrink-0 overflow-hidden rounded border border-border-strong">
              {YEAR_STYLES.map((s, i) => {
                const active = yearStyle === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setYearStyle(s.value)}
                    className={
                      "px-3 py-1.5 text-xs font-medium transition-colors " +
                      (i > 0 ? "border-l border-border-base " : "") +
                      (active
                        ? "bg-accent text-accent-on "
                        : "bg-surface text-text-2 hover:bg-surface-soft ")
                    }
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Dialog>
  );
}
