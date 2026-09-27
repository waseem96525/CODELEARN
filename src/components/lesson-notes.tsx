"use client";

import * as React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";



export interface NoteData {
  id: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Per-lesson notes. Server actions own persistence; the local state is only an
 * optimistic mirror so typing never waits on a round trip.
 */
export function LessonNotes({
  lessonId,
  initialNotes,
}: {
  lessonId: string;
  initialNotes: NoteData[];
}) {
  const [notes, setNotes] = React.useState<NoteData[]>(initialNotes);
  const [draft, setDraft] = React.useState("");
  const [editing, setEditing] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  async function add() {
    const content = draft.trim();
    if (!content) return;

    const actions = await import("@/app/(app)/actions/user-content");
    startTransition(async () => {
      const response = await actions.createNote(lessonId, content);
      if (!response.ok) {
        toast.error(response.error ?? "Could not save your note.");
        return;
      }
      setNotes((prev) => [
        {
          id: response.id ?? String(Date.now()),
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...prev,
      ]);
      setDraft("");
      toast.success("Note saved");
    });
  }

  async function save(id: string) {
    const content = editDraft.trim();
    if (!content) return;

    const actions = await import("@/app/(app)/actions/user-content");
    startTransition(async () => {
      const response = await actions.updateNote(id, content);
      if (!response.ok) {
        toast.error(response.error ?? "Could not update your note.");
        return;
      }
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, content, updatedAt: new Date() } : n)),
      );
      setEditing(null);
      toast.success("Note updated");
    });
  }

  async function remove(id: string) {
    const actions = await import("@/app/(app)/actions/user-content");
    const snapshot = notes;
    setNotes((prev) => prev.filter((n) => n.id !== id));

    startTransition(async () => {
      const response = await actions.deleteNote(id);
      if (!response.ok) {
        setNotes(snapshot);
        toast.error(response.error ?? "Could not delete your note.");
      }
    });
  }

  async function copyNote(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Note copied");
    } catch {
      toast.error("Could not copy the note.");
    }
  }

  return (
    <section className="space-y-3" aria-labelledby="notes-heading">
      <h2 id="notes-heading" className="text-xl font-bold tracking-tight">
        Your notes
      </h2>
      <p className="text-sm text-muted-foreground">
        Notes are private to you and saved to your account.
      </p>

      <div className="space-y-2">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Remember: function parameters receive values when the function is called."
          aria-label="New note"
          maxLength={5000}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{draft.length} / 5000</span>
          <Button size="sm" onClick={add} disabled={!draft.trim()} loading={pending}>
            Save note
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
          Your learning notes will appear here.
        </p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg border border-border bg-card p-4">
              {editing === note.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    aria-label="Edit note"
                    maxLength={5000}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => save(note.id)} loading={pending}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(note.id);
                        setEditDraft(note.content);
                      }}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => copyNote(note.content)}
                      className="ml-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(note.id)}
                      className="ml-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-danger"
                    >
                      <X className="size-3" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

