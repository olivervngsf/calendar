"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  // Soft fade where the list meets the sticky header/footer — but only on the
  // edge that actually has content scrolled past it (no fade at the true ends).
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });
  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const top = el.scrollTop > 4;
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 4;
    setEdges((p) => (p.top === top && p.bottom === bottom ? p : { top, bottom }));
  }, []);
  // Re-check when the scoped notes change (list height shifts).
  useEffect(() => {
    updateEdges();
  }, [scoped, updateEdges]);

  const FADE = 28; // px
  const mask = `linear-gradient(to bottom, ${
    edges.top ? "transparent 0px" : "black 0px"
  }, black ${FADE}px, black calc(100% - ${FADE}px), ${
    edges.bottom ? "transparent 100%" : "black 100%"
  })`;

  return (
    <aside
      aria-label={`Notes — ${scope.label}`}
      className="flex h-full flex-col border-l border-border-base bg-bg"
    >
      {/* Sticky header — title + scope on one line, stays put while the list scrolls */}
      <header className="flex shrink-0 items-baseline justify-between gap-3 border-b border-border-faint px-6 py-4">
        <h2 className="shrink-0 text-base font-semibold tracking-[-0.01em] text-text">
          Notes
        </h2>
        <div className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-text-3">
          {scope.label} · {scope.tag}
        </div>
      </header>

      {/* Scrollable list — soft fade at the edges as content scrolls under the chrome */}
      <div
        ref={scrollRef}
        onScroll={updateEdges}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5"
      >
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
      </div>

      {/* Sticky footer — always reachable for fast capture */}
      <div className="shrink-0 border-t border-border-faint px-6 py-4">
        <button
          type="button"
          onClick={onNewNote}
          className="block w-full rounded-[5px] border border-dashed border-border-strong px-3.5 py-3 text-left text-[13px] text-text-3 transition-colors duration-100 hover:border-text-2 hover:text-text-2"
        >
          <span className="mr-2 font-mono text-sm text-text-3">+</span>
          New note for {scope.tag}
        </button>
      </div>
    </aside>
  );
}
