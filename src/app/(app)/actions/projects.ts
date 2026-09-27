"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { recordActivity, getLevelInfo } from "@/lib/gamification";
import { checkAchievements } from "@/lib/achievements";
import { notify } from "@/lib/notifications";
import { projectSaveSchema, firstError } from "@/lib/auth/validation";
import { generateToken } from "@/lib/auth/crypto";

export interface ProjectSaveResult {
  ok: boolean;
  error?: string;
  completed: boolean;
  justCompleted: boolean;
  xpGained: number;
  totalXp: number;
  level: number;
  levelName: string;
  levelUp: boolean;
  levelProgress: number;
  newBadges: { key: string; name: string; icon: string; xpReward: number }[];
  certificateId: string | null;
}

/**
 * Saves a user's project files and checklist, and handles first-time completion.
 *
 * Ownership is enforced with a `userId` filter in the update, so a user cannot
 * write to another user's project by guessing an id.
 */
export async function saveProject(input: {
  projectId: string;
  name: string;
  files: Record<string, string>;
  checklist: number[];
  completed: boolean;
}): Promise<ProjectSaveResult> {
  const user = await getCurrentUser();
  const base: ProjectSaveResult = {
    ok: false,
    completed: false,
    justCompleted: false,
    xpGained: 0,
    totalXp: 0,
    level: 1,
    levelName: "Beginner",
    levelUp: false,
    levelProgress: 0,
    newBadges: [],
    certificateId: null,
  };

  if (!user) return { ...base, error: "You need to be signed in." };

  const parsed = projectSaveSchema.safeParse(input);
  if (!parsed.success) return { ...base, error: firstError(parsed.error) };

  const { projectId, name, files, checklist, completed } = parsed.data;

  const project = await prisma.project.findFirst({
    where: { id: projectId, published: true },
    select: { id: true, title: true, xpReward: true, track: true },
  });
  if (!project) return { ...base, error: "Project not found." };

  const existing = await prisma.userProject.findFirst({
    where: { userId: user.id, projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, completed: true, completedAt: true },
  });

  const wasCompleted = existing?.completed ?? false;

  // First open creates the row; later saves update it. Not a unique upsert,
  // because a user may legitimately own several copies of one project.
  const record = existing
    ? await prisma.userProject.update({
        where: { id: existing.id },
        data: {
          name,
          files: JSON.stringify(files),
          checklist: JSON.stringify(checklist),
          completed,
          // Keep the original completion date when re-saving a finished project.
          completedAt: completed ? (wasCompleted ? existing?.completedAt ?? new Date() : new Date()) : null,
        },
        select: { id: true, completed: true },
      })
    : await prisma.userProject.create({
        data: {
          userId: user.id,
          projectId,
          name,
          files: JSON.stringify(files),
          checklist: JSON.stringify(checklist),
          completed,
          completedAt: completed ? new Date() : null,
        },
        select: { id: true, completed: true },
      });

  let totalXp = user.xp;
  let level = user.level;
  let xpGained = 0;
  const justCompleted = completed && !wasCompleted;

  if (justCompleted) {
    const outcome = await recordActivity(user.id, {
      reason: "PROJECT",
      amount: project.xpReward,
      note: project.title,
      secondsLearned: 1800,
    });
    totalXp = outcome.totalXp;
    level = outcome.level;
    xpGained = project.xpReward;

    await notify(
      user.id,
      "PROJECT",
      "🚀 Project completed!",
      `${name} — +${project.xpReward} XP. It is now in your portfolio.`,
      `/projects/${project.track === "JAVASCRIPT" ? "todo-app" : project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    );

    const unlocked = await checkAchievements(user.id);
    if (unlocked.length > 0) {
      const badgeXp = unlocked.reduce((sum, b) => sum + b.xpReward, 0);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          xp: { increment: badgeXp },
          level: getLevelInfo(totalXp + badgeXp).level,
        },
      });
      await prisma.xpEvent.createMany({
        data: unlocked.map((b) => ({
          userId: user.id,
          reason: "BADGE",
          amount: b.xpReward,
          note: b.name,
        })),
      });
      totalXp += badgeXp;
      level = getLevelInfo(totalXp).level;
      xpGained += badgeXp;

      for (const badge of unlocked) {
        await notify(
          user.id,
          "BADGE",
          `🏆 Badge unlocked: ${badge.name}`,
          `${badge.description} +${badge.xpReward} XP`,
          "/achievements",
        );
      }

      void unlocked;
    }
  }

  // Issue a certificate when every course in the assigned path is complete.
  let certificateId: string | null = null;
  if (justCompleted) {
    certificateId = await maybeIssueCertificate(user.id);
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  revalidatePath("/profile");

  return {
    ok: true,
    completed: record.completed,
    justCompleted,
    xpGained,
    totalXp,
    level,
    levelName: getLevelInfo(totalXp).name,
    levelUp: level > user.level,
    levelProgress: getLevelInfo(totalXp).progress,
    newBadges: [],
    certificateId,
  };
}

/**
 * Awards a certificate if the user's assigned learning path is fully complete.
 * Idempotent: a user has at most one certificate per path (enforced by a unique
 * constraint as well as an existence check).
 */
async function maybeIssueCertificate(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { assignedPathId: true },
  });
  if (!user?.assignedPathId) return null;

  const path = await prisma.learningPath.findUnique({
    where: { id: user.assignedPathId },
    include: { stages: { orderBy: { orderIndex: "asc" } } },
  });
  if (!path) return null;

  for (const stage of path.stages) {
    const [total, done] = await Promise.all([
      prisma.lesson.count({ where: { courseId: stage.courseId, published: true } }),
      prisma.userProgress.count({ where: { userId, courseId: stage.courseId, completed: true } }),
    ]);
    if (total === 0 || done < total) return null;
  }

  const existing = await prisma.certificate.findUnique({
    where: { userId_pathId: { userId, pathId: path.id } },
  });
  if (existing) return existing.serial;

  const serial = `CL-${generateToken(8).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)}`;
  const certificate = await prisma.certificate.create({
    data: { userId, pathId: path.id, serial },
  });

  await notify(
    userId,
    "PROJECT",
    "📜 Certificate earned!",
    `You completed ${path.title}. View your certificate.`,
    `/certificate/${certificate.serial}`,
  );

  return certificate.serial;
}

export async function renameProject(projectId: string, name: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 80) {
    return { ok: false, error: "Name must be between 1 and 80 characters." };
  }

  const result = await prisma.userProject.updateMany({
    where: { id: projectId, userId: user.id },
    data: { name: trimmed },
  });
  if (result.count === 0) return { ok: false, error: "Project not found." };

  revalidatePath("/projects");
  return { ok: true };
}

export async function deleteProject(projectId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  // deleteMany with a userId filter means a user can only delete their own copy.
  const result = await prisma.userProject.deleteMany({
    where: { id: projectId, userId: user.id },
  });
  if (result.count === 0) return { ok: false, error: "Project not found." };

  revalidatePath("/projects");
  return { ok: true };
}

export async function duplicateProject(projectId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const source = await prisma.userProject.findFirst({
    where: { id: projectId, userId: user.id },
    include: { project: { select: { id: true, title: true, starterFiles: true } } },
  });
  if (!source) return { ok: false, error: "Project not found." };

  const copy = await prisma.userProject.create({
    data: {
      userId: user.id,
      projectId: source.project.id,
      name: `${source.name} (copy)`,
      // Copy the user's current work, not the starter files, so duplicating is
      // a genuine fork of where they got to.
      files: source.files,
      checklist: source.checklist,
      completed: source.completed,
      completedAt: source.completedAt,
    },
    select: { id: true },
  });

  revalidatePath("/projects");
  return { ok: true, newId: copy.id };
}

export async function resetProject(projectId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const record = await prisma.userProject.findFirst({
    where: { id: projectId, userId: user.id },
    include: { project: { select: { starterFiles: true, title: true } } },
  });
  if (!record) return { ok: false, error: "Project not found." };

  await prisma.userProject.update({
    where: { id: record.id },
    data: {
      name: record.project.title,
      files: record.project.starterFiles,
      checklist: "[]",
      completed: false,
      completedAt: null,
    },
  });

  revalidatePath("/projects");
  return { ok: true };
}
