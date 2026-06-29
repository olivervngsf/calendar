// Natural-language capture parsing (D040). The `N` capture reads a leading
// `kind::` marker to auto-detect what you're creating, then hands the rest of the
// text to the type-specific parser (events reuse `parseQuickAdd`).

export type CaptureKind = "task" | "event" | "note";

export interface CaptureParse {
  kind: CaptureKind;
  /** The text after the marker (or the whole input when no marker is present). */
  text: string;
  /** True when the user typed an explicit `kind::` marker. */
  explicit: boolean;
}

/**
 * Detect a leading `task::` / `event::` / `note::` marker (case-insensitive,
 * tolerant of surrounding space). No marker → defaults to an event, preserving
 * the prior quick-add behavior.
 */
export function parseCaptureKind(input: string): CaptureParse {
  const m = input.match(/^\s*(task|event|note)\s*::\s*(.*)$/i);
  if (m) {
    return { kind: m[1].toLowerCase() as CaptureKind, text: m[2], explicit: true };
  }
  return { kind: "event", text: input.trim(), explicit: false };
}

export const CAPTURE_LABEL: Record<CaptureKind, string> = {
  task: "Task",
  event: "Event",
  note: "Note",
};
