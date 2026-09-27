"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { noteSchema, firstError } from "@/lib/auth/validation";

// ---------------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------------

/**
 * Toggles a bookmark. Every write is filtered by userId, so a user can only
 * ever modify their own bookmarks regardless of the id they submit.
 */
export async function toggleBookmark(input: {
  contentType: "LESSON" | "CHALLENGE" | "PROJECT";
  contentId: string;
}): Promise<{ ok: boolean; bookmarked: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, bookmarked: false, error: "You need to be signed in." };

  const { contentType, contentId } = input;
  if (!contentId) return { ok: false, bookmarked: false, error: "Missing content id." };

  // Confirm the target exists and is published before bookmarking it, so the
  // bookmarks page never links to unpublished or missing content.
  const exists =
    contentType === "LESSON"
      ? await prisma.lesson.findFirst({ where: { id: contentId, published: true }, select: { id: true } })
      : contentType === "CHALLENGE"
        ? await prisma.challenge.findFirst({ where: { id: contentId, published: true }, select: { id: true } })
        : await prisma.project.findFirst({ where: { id: contentId, published: true }, select: { id: true } });

  if (!exists) return { ok: false, bookmarked: false, error: "That content is not available." };

  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_contentType_contentId: { userId: user.id, contentType, contentId },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    revalidatePath("/bookmarks");
    return { ok: true, bookmarked: false };
  }

  const fk =
    contentType === "LESSON"
      ? { lessonId: contentId }
      : contentType === "CHALLENGE"
        ? { challengeId: contentId }
        : { projectId: contentId };

  await prisma.bookmark.create({
    data: { userId: user.id, contentType, contentId, ...fk },
  });

  revalidatePath("/bookmarks");
  return { ok: true, bookmarked: true };
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

export async function createNote(lessonId: string, content: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const parsed = noteSchema.safeParse({ lessonId, content });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, published: true },
    select: { id: true },
  });
  if (!lesson) return { ok: false, error: "Lesson not found." };

  const note = await prisma.note.create({
    data: { userId: user.id, lessonId, content: parsed.data.content },
  });

  revalidatePath("/notes");
  return { ok: true, id: note.id };
}

/** `noteId` alone is not enough — the userId filter is what enforces ownership. */
export async function updateNote(noteId: string, content: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const trimmed = content.trim();
  if (trimmed.length < 1) return { ok: false, error: "Note cannot be empty." };
  if (trimmed.length > 5000) return { ok: false, error: "Note is too long." };

  const result = await prisma.note.updateMany({
    where: { id: noteId, userId: user.id },
    data: { content: trimmed },
  });
  if (result.count === 0) return { ok: false, error: "Note not found." };

  revalidatePath("/notes");
  return { ok: true };
}

export async function deleteNote(noteId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const result = await prisma.note.deleteMany({ where: { id: noteId, userId: user.id } });
  if (result.count === 0) return { ok: false, error: "Note not found." };

  revalidatePath("/notes");
  return { ok: true };
}

export async function getNotesForLesson(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) return [];
  return prisma.note.findMany({
    where: { userId: user.id, lessonId },
    orderBy: { updatedAt: "desc" },
  });
}
