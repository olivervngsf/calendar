"use client";

import { useMemo } from "react";
import type { CalendarView, Note } from "@/lib/types";
import { noteScopeFor } from "@/lib/date";
import { notesForScope, notesOfType } from "@/lib/notes";
import { useData } from "@/components/providers/DataProvider";

interface Props {
  view: CalendarView;
  anchor: Date;
  onNewNote: () => void;
  onNoteClick: (note: Note) => void;
}

function NoteCard({
  note,
  onClick,
}: {
  note: Note;
  onClick: (note: Note) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(note)}
      className="mb-2 block w-full rounded-[5px] border border-border-base bg-surface px-4 py-3.5 text-left transition-colors duration-100 hover:border-border-strong"
    >
      {note.tag && (
        <div className="mb-2 inline-block rounded-[3px] bg-accent-soft px-[7px] py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-accent">
          {note.tag}
        </div>
      )}
      <div className="mb-1 font-mono text-[10px] tracking-[0.04em] text-text-3">
        {note.date}
      </div>
      <div className="mb-1 text-[13px] font-semibold tracking-[-0.005em] text-text">
        {note.title}
      </div>
      {note.body && (
        <div className="text-xs leading-relaxed text-text-2">{note.body}</div>
      )}
    </button>
  );
}

export function NotesPanel({ view, anchor, onNewNote, onNoteClick }: Props) {
  const { notes } = useData();
  const scope = useMemo(() => noteScopeFor(view, anchor), [view, anchor]);
  const scoped = useMemo(
    () => notesForScope(notes, { unit: scope.unit, key: scope.key }),
    [notes, scope],
  );
  const decisions = notesOfType(scoped, "decision");
  const daily = notesOfType(scoped, "daily");

  return (
    <aside
      aria-label={`Notes — ${scope.label}`}
      className="flex h-full flex-col gap-6 overflow-y-auto border-l border-border-base bg-bg px-6 pb-5 pt-6"
    >
      <header>
        <h2 className="mb-1 text-base font-semibold tracking-[-0.01em] text-text">
          Notes
        </h2>
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-3">
          {scope.label} · {scope.tag}
        </div>
      </header>

      {scoped.length === 0 ? (
        <p className="text-[13px] leading-relaxed text-text-3">
          Nothing for {scope.tag} yet — what was it about?
        </p>
      ) : (
        <>
          {decisions.length > 0 && (
            <section>
              <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-3">
                Decision log
              </h3>
              {decisions.map((n) => (
                <NoteCard key={n.id} note={n} onClick={onNoteClick} />
              ))}
            </section>
          )}

          {daily.length > 0 && (
            <section>
              <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-3">
                Daily log
              </h3>
              {daily.map((n) => (
                <NoteCard key={n.id} note={n} onClick={onNoteClick} />
              ))}
            </section>
          )}
        </>
      )}

      <button
        type="button"
        onClick={onNewNote}
        className="mt-auto rounded-[5px] border border-dashed border-border-strong px-3.5 py-3 text-left text-[13px] text-text-3 transition-colors duration-100 hover:border-text-2 hover:text-text-2"
      >
        <span className="mr-2 font-mono text-sm text-text-3">+</span>
        New note for {scope.tag}
      </button>
    </aside>
  );
}
