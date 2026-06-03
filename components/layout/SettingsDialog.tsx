"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Toggle } from "@/components/ui/Toggle";
import {
  useSettings,
  type YearStyle,
  type WeekStyle,
} from "@/components/providers/SettingsProvider";

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

function SegmentRow<T extends string>({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  description: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-text">{label}</div>
        <div className="mt-0.5 text-xs leading-relaxed text-text-3">
          {description}
        </div>
      </div>
      <div className="inline-flex shrink-0 overflow-hidden rounded border border-border-strong">
        {options.map((o, i) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={
                "px-3 py-1.5 text-xs font-medium transition-colors " +
                (i > 0 ? "border-l border-border-base " : "") +
                (active
                  ? "bg-accent text-accent-on "
                  : "bg-surface text-text-2 hover:bg-surface-soft ")
              }
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const WEEK_STYLES: { value: WeekStyle; label: string }[] = [
  { value: "timeline", label: "Timeline" },
  { value: "agenda", label: "Agenda" },
];
const YEAR_STYLES: { value: YearStyle; label: string }[] = [
  { value: "grid", label: "Calendar" },
  { value: "columns", label: "Columns" },
];

export function SettingsDialog({ onClose }: Props) {
  const {
    showWeekNumbers,
    setShowWeekNumbers,
    yearStyle,
    setYearStyle,
    weekStyle,
    setWeekStyle,
  } = useSettings();

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

          <SegmentRow
            label="Week view"
            description="A time-grid timeline, or an agenda list of the week's days."
            value={weekStyle}
            options={WEEK_STYLES}
            onChange={setWeekStyle}
          />

          <SegmentRow
            label="Year view"
            description="Twelve mini-months, or a linear month-by-month planner."
            value={yearStyle}
            options={YEAR_STYLES}
            onChange={setYearStyle}
          />
        </div>
      </section>
    </Dialog>
  );
}
