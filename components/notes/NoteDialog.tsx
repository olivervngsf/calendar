"use client";

import { useState } from "react";
import type { Note, NoteScope, NoteType } from "@/lib/types";
import { TODAY } from "@/lib/mock-data";
import { isoDate } from "@/lib/date";
import { useData } from "@/components/providers/DataProvider";
import { Dialog, fieldControl, fieldLabel } from "@/components/ui/Dialog";

interface Props {
  /** Editing an existing note, or creating a new one. */
  note?: Note;
  /** Scope the new note belongs to (the active view's time unit). */
  scope: NoteScope;
  /** Human label for the scope, e.g. "May 24 – 30" or "May 2026". */
  scopeLabel: string;
  onClose: () => void;
}

export function NoteDialog({ note, scope, scopeLabel, onClose }: Props) {
  const { addNote, updateNote, deleteNote } = useData();
  const isEdit = Boolean(note);

  const [type, setType] = useState<NoteType>(note?.type ?? "daily");
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");

  const canSave = title.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    const input = {
      scope: note?.scope ?? scope,
      type,
      title: title.trim(),
      body: body.trim(),
      date: note?.date ?? isoDate(TODAY),
      tag: note?.tag,
    };
    if (note) updateNote(note.id, input);
    else addNote(input);
    onClose();
  }

  function handleDelete() {
    if (note) deleteNote(note.id);
    onClose();
  }

  return (
    <Dialog
      title={isEdit ? "Edit note" : `New note · ${scopeLabel}`}
      onClose={onClose}
    >
      <div
        className="flex flex-col gap-4"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleSave();
          }
        }}
      >
        <div>
          <label className={fieldLabel} htmlFor="note-type">
            Type
          </label>
          <select
            id="note-type"
            className={fieldControl}
            value={type}
            onChange={(e) => setType(e.target.value as NoteType)}
          >
            <option value="decision">Decision log</option>
            <option value="daily">Daily log</option>
          </select>
        </div>

        <div>
          <label className={fieldLabel} htmlFor="note-title">
            Title
          </label>
          <input
            id="note-title"
            className={fieldControl}
            value={title}
            placeholder="What did you decide, or what happened?"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className={fieldLabel} htmlFor="note-body">
            Note
          </label>
          <textarea
            id="note-body"
            className={fieldControl + " min-h-[110px] resize-y leading-relaxed"}
            value={body}
            placeholder="The detail — written, not generated."
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          {isEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded border border-transparent px-3 py-1.5 text-[13px] text-text-3 transition-colors hover:border-border-strong hover:text-text"
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-border-strong bg-surface px-3.5 py-1.5 text-[13px] text-text-2 transition-colors hover:border-text-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="rounded bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-on transition-opacity disabled:opacity-40"
            >
              {isEdit ? "Save" : "Add note"}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
