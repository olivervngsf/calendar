import type { Note, NoteScope, NoteType } from "./types";

/** Notes matching a given time-unit scope (e.g. the visible month). */
export function notesForScope(notes: Note[], scope: NoteScope): Note[] {
  return notes.filter(
    (n) => n.scope.unit === scope.unit && n.scope.key === scope.key,
  );
}

/** Notes of one type within an already-scoped list. */
export function notesOfType(notes: Note[], type: NoteType): Note[] {
  return notes.filter((n) => n.type === type);
}
