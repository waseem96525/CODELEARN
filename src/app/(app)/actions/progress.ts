"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { XP_REWARDS, recordActivity, getLevelInfo, getTodayActivity } from "@/lib/gamification";
import { checkAchievements, type UnlockedAchievement } from "@/lib/achievements";
import { notify } from "@/lib/notifications";
import { getCourseProgress, getNextLesson } from "@/lib/queries";
import { parseLessonContent } from "@/lib/queries";

export interface ProgressResult {
  ok: boolean;
  error?: string;
  xpGained: number;
  totalXp: number;
  level: number;
  levelName: string;
  levelUp: boolean;
  levelProgress: number;
  streak: number;
  goalMet: boolean;
  goalMinutes: number;
  minutesToday: number;
  achievements: UnlockedAchievement[];
  coursePercent: number;
  nextHref: string | null;
  courseCompleted: boolean;
}

/**
 * Awards achievement badge XP + notifications, then returns the new badge list.
 * Split out because every progress action ends the same way.
 */
async function finalize(
  userId: string,
  base: Omit<
    ProgressResult,
    "achievements" | "coursePercent" | "nextHref" | "courseCompleted" | "ok"
  >,
  courseId?: string,
): Promise<ProgressResult> {
  const unlocked = await checkAchievements(userId);

  let badgeXp = 0;
  for (const badge of unlocked) {
    badgeXp += badge.xpReward;
    await notify(
      userId,
      "BADGE",
      `🏆 Badge unlocked: ${badge.name}`,
      `${badge.description} +${badge.xpReward} XP`,
      "/achievements",
    );
  }

  // Badge XP is granted without a second DailyActivity bump, so it is applied
  // directly and recorded in the ledger for an accurate audit trail.
  let totalXp = base.totalXp;
  let level = base.level;
  if (badgeXp > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: badgeXp } },
    });
    await prisma.xpEvent.createMany({
      data: unlocked.map((b) => ({
        userId,
        reason: "BADGE",
        amount: b.xpReward,
        note: b.name,
      })),
    });
    totalXp += badgeXp;
    level = getLevelInfo(totalXp).level;
    await prisma.user.update({ where: { id: userId }, data: { level } });
  }

  const progress = courseId ? await getCourseProgress(userId) : [];
  const mine = courseId ? progress.find((p) => p.courseId === courseId) : undefined;
  const next = await getNextLesson(userId);

  return {
    ...base,
    ok: true,
    totalXp,
    level,
    levelName: getLevelInfo(totalXp).name,
    levelProgress: getLevelInfo(totalXp).progress,
    achievements: unlocked,
    coursePercent: mine?.percent ?? 0,
    courseCompleted: mine ? mine.completed === mine.total && mine.total > 0 : false,
    nextHref: next
      ? `/learn/${next.courseSlug}/${next.lessonSlug}`
      : null,
  };
}

/** Marks a lesson complete. Idempotent — re-completing does not double XP. */
export async function completeLesson(lessonId: string): Promise<ProgressResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ...emptyResult(), ok: false, error: "You need to be signed in." };
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, courseId: true, title: true, estimatedMinutes: true },
  });
  if (!lesson) return { ...emptyResult(), ok: false, error: "Lesson not found." };

  const existing = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId } },
  });

  if (existing?.completed) {
    // Already done: report current state without granting more XP.
    return finalize(user.id, await snapshotFields(user.id), lesson.courseId);
  }

  const outcome = await recordActivity(user.id, {
    reason: "LESSON",
    amount: XP_REWARDS.LESSON,
    note: lesson.title,
    secondsLearned: Math.max(lesson.estimatedMinutes, 1) * 60,
  });

  await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: {
      userId: user.id,
      courseId: lesson.courseId,
      lessonId,
      completed: true,
      completedAt: new Date(),
      secondsSpent: lesson.estimatedMinutes * 60,
    },
    update: { completed: true, completedAt: new Date() },
  });

  await notify(
    user.id,
    "LESSON",
    "🎉 Lesson completed!",
    `${lesson.title} — +${XP_REWARDS.LESSON} XP`,
    `/learn/${await courseSlug(lesson.courseId)}/${await lessonSlug(lessonId)}`,
  );

  const result = await finalize(
    user.id,
    {
      ...toResultFields(outcome),
      levelProgress: getLevelInfo(outcome.totalXp).progress,
      streak: outcome.streak,
      goalMet: outcome.goalMet,
      goalMinutes: outcome.goalMinutes,
      minutesToday: outcome.minutesLearnedToday,
    },
    lesson.courseId,
  );

  revalidatePath("/dashboard");
  revalidatePath("/learn");
  return result;
}

/** Reads current gamification state without changing anything. */
async function snapshotFields(userId: string) {
  const [user, activity] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { xp: true, level: true, streak: true, dailyGoalMinutes: true },
    }),
    getTodayActivity(userId),
  ]);
  const info = getLevelInfo(user.xp);

  return {
    xpGained: 0,
    totalXp: user.xp,
    level: user.level,
    levelName: info.name,
    levelUp: false,
    levelProgress: info.progress,
    streak: user.streak,
    goalMet: activity.goalMet,
    goalMinutes: user.dailyGoalMinutes,
    minutesToday: Math.round(activity.secondsLearned / 60),
  };
}

function toResultFields(o: {
  xpGained: number;
  totalXp: number;
  level: number;
  levelName: string;
  levelUp: boolean;
}) {
  return {
    xpGained: o.xpGained,
    totalXp: o.totalXp,
    level: o.level,
    levelName: o.levelName,
    levelUp: o.levelUp,
  };
}

function emptyResult(): ProgressResult {
  return {
    ok: true,
    xpGained: 0,
    totalXp: 0,
    level: 1,
    levelName: "Beginner",
    levelUp: false,
    levelProgress: 0,
    streak: 0,
    goalMet: false,
    goalMinutes: 0,
    minutesToday: 0,
    achievements: [],
    coursePercent: 0,
    nextHref: null,
    courseCompleted: false,
  };
}

async function courseSlug(courseId: string) {
  return (await prisma.course.findUnique({ where: { id: courseId }, select: { slug: true } }))?.slug ?? "";
}

async function lessonSlug(lessonId: string) {
  return (await prisma.lesson.findUnique({ where: { id: lessonId }, select: { slug: true } }))?.slug ?? "";
}

/** Records time spent without awarding XP, so the daily goal reflects real study. */
export async function trackStudyTime(lessonId: string, seconds: number) {
  const user = await getCurrentUser();
  if (!user || seconds <= 0) return { ok: false };

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { courseId: true },
  });
  if (!lesson) return { ok: false };

  const today = new Date().toISOString().slice(0, 10);

  await prisma.$transaction([
    prisma.userProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      create: {
        userId: user.id,
        courseId: lesson.courseId,
        lessonId,
        completed: false,
        secondsSpent: seconds,
      },
      update: { secondsSpent: { increment: seconds } },
    }),
    prisma.dailyActivity.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      create: {
        userId: user.id,
        date: today,
        secondsLearned: seconds,
        activitiesCount: 1,
        goalMet: false,
      },
      update: { secondsLearned: { increment: seconds } },
    }),
  ]);

  return { ok: true };
}

export { parseLessonContent };
