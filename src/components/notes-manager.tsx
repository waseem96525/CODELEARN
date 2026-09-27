"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, NotebookPen, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { TrackChip } from "@/components/track-icon";
import { updateNote, deleteNote } from "@/app/(app)/actions/user-content";
import { timeAgo } from "@/lib/utils";

export interface NoteItem {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  lesson: {
    title: string;
    slug: string;
    course: { slug: string; title: string; track: string };
  };
}

/** All of a user's notes, grouped by lesson, with inline edit and delete. */
export function NotesManager({ notes }: { notes: NoteItem[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const groups = notes.reduce<Map<string, { lesson: NoteItem["lesson"]; notes: NoteItem[] }>>(
    (map, note) => {
      const key = `${note.lesson.course.slug}/${note.lesson.slug}`;
      const existing = map.get(key);
      if (existing) existing.notes.push(note);
      else map.set(key, { lesson: note.lesson, notes: [note] });
      return map;
    },
    new Map(),
  );

  function startEditing(note: NoteItem) {
    setEditingId(note.id);
    setDraft(note.content);
  }

  function save() {
    if (!editingId) return;
    const id = editingId;
    const content = draft.trim();
    if (content.length < 1) {
      toast.error("A note cannot be empty.");
      return;
    }

    startTransition(async () => {
      const response = await updateNote(id, content);
      if (!response.ok) {
        toast.error(response.error ?? "Could not save the note.");
        return;
      }
      setEditingId(null);
      toast.success("Note saved");
      router.refresh();
    });
  }

  function remove(id: string) {
    const confirmed = window.confirm("Delete this note? This cannot be undone.");
    if (!confirmed) return;

    setDeletingId(id);
    startTransition(async () => {
      const response = await deleteNote(id);
      setDeletingId(null);
      if (!response.ok) {
        toast.error(response.error ?? "Could not delete the note.");
        return;
      }
      toast.success("Note deleted");
      router.refresh();
    });
  }

  if (notes.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 border-dashed px-6 py-14 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <NotebookPen className="size-5" />
        </div>
        <div>
          <p className="font-semibold">No notes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Open any lesson and add a note from the notes panel. Notes are private to you.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/learn">Open a lesson</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {[...groups.values()].map(({ lesson, notes: group }) => (
        <section key={`${lesson.course.slug}/${lesson.slug}`} className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <TrackChip track={lesson.course.track} />
            <h2 className="font-semibold">{lesson.title}</h2>
            <Badge tone="neutral">{group.length}</Badge>
            <Link
              href={`/learn/${lesson.course.slug}/${lesson.slug}`}
              className="ml-auto text-sm font-medium text-primary hover:underline"
            >
              Open lesson
            </Link>
          </div>

          <ul className="space-y-2">
            {group.map((note) => (
              <li key={note.id}>
                <Card className="p-4">
                  {editingId === note.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        rows={4}
                        aria-label="Edit note"
                      />
                      <div className="flex items-center gap-2">
                        <Button onClick={save} size="sm" loading={pending}>
                          <Check />
                          Save
                        </Button>
                        <Button onClick={() => setEditingId(null)} size="sm" variant="ghost">
                          <X />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <p className="min-w-0 flex-1 whitespace-pre-line text-[15px] leading-7">
                        {note.content}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          onClick={() => startEditing(note)}
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Edit note"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          onClick={() => remove(note.id)}
                          size="icon-sm"
                          variant="ghost"
                          disabled={deletingId === note.id}
                          aria-label="Delete note"
                          className="text-danger hover:bg-danger-soft"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  )}

                  {editingId !== note.id && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Updated {timeAgo(note.updatedAt)}
                    </p>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
