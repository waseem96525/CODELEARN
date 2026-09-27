import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { getNotes } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app-shell";
import { NotesManager, type NoteItem } from "@/components/notes-manager";

export const metadata: Metadata = {
  title: "Notes",
  description: "Your private notes, grouped by lesson.",
  robots: { index: false, follow: false },
};

export default async function NotesPage() {
  const user = await requireUser("/notes");
  const notes = await getNotes(user.id);

  // Dates cross the server/client boundary as strings so the client component
  // can format them without a serialisation mismatch.
  const items: NoteItem[] = notes.map((note) => ({
    id: note.id,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
    lesson: note.lesson,
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader title="Notes" description="Only you can see these.">
        <Badge tone="neutral">
          {items.length} note{items.length === 1 ? "" : "s"}
        </Badge>
      </PageHeader>

      <NotesManager notes={items} />
    </div>
  );
}
