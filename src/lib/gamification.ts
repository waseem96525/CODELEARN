import "server-only";
import { prisma } from "@/lib/prisma";
import type { XpReason } from "@/lib/types";
import { getLevelInfo } from "@/lib/levels";

/**
 * Server-side gamification: the XP ledger, streaks and daily activity.
 * The level ladder itself lives in `@/lib/levels` so client components can read
 * it too, and is re-exported here for server callers.
 */
export { LEVELS, XP_REWARDS, getLevelInfo } from "@/lib/levels";

export function utcDay(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const ms = Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

export interface ActivityOutcome {
  xpGained: number;
  totalXp: number;
  level: number;
  levelUp: boolean;
  levelName: string;
  streak: number;
  goalMet: boolean;
  goalMinutes: number;
  minutesLearnedToday: number;
  isFirstActivityToday: boolean;
}

/**
 * Single entry point for anything that earns XP. Keeps the User.xp / level /
 * streak fields, the XpEvent audit log and the DailyActivity rollup in sync —
 * no other module should write XP directly.
 */
export async function recordActivity(
  userId: string,
  opts: { reason: XpReason; amount: number; note?: string; secondsLearned?: number },
): Promise<ActivityOutcome> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { xp: true, level: true, streak: true, lastActiveOn: true, dailyGoalMinutes: true },
  });

  const today = utcDay();
  const isFirstActivityToday = user.lastActiveOn !== today;

  // Streak: same day is a no-op, consecutive day increments, a gap resets to 1.
  let streak = user.streak;
  if (isFirstActivityToday) {
    streak = daysBetween(today, user.lastActiveOn ?? today) === 1 ? user.streak + 1 : 1;
  }

  const totalXp = user.xp + opts.amount;
  const info = getLevelInfo(totalXp);
  const levelUp = info.level > user.level;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        xp: totalXp,
        level: info.level,
        streak,
        longestStreak: { set: Math.max(streak, user.streak) },
        lastActiveOn: today,
      },
    });

    await tx.xpEvent.create({
      data: {
        userId,
        reason: opts.reason,
        amount: opts.amount,
        note: opts.note ?? null,
      },
    });

    const activity = await tx.dailyActivity.findUnique({
      where: { userId_date: { userId, date: today } },
    });
    const secondsLearned = (activity?.secondsLearned ?? 0) + (opts.secondsLearned ?? 0);
    const xpEarned = (activity?.xpEarned ?? 0) + opts.amount;
    const activitiesCount = (activity?.activitiesCount ?? 0) + 1;
    const goalMet = secondsLearned >= user.dailyGoalMinutes * 60;

    await tx.dailyActivity.upsert({
      where: { userId_date: { userId, date: today } },
      create: {
        userId,
        date: today,
        xpEarned,
        secondsLearned,
        activitiesCount,
        goalMet,
      },
      update: { xpEarned, secondsLearned, activitiesCount, goalMet },
    });
  });

  return {
    xpGained: opts.amount,
    totalXp,
    level: info.level,
    levelUp,
    levelName: info.name,
    streak,
    goalMet: (await todayActivity(userId)).goalMet,
    goalMinutes: user.dailyGoalMinutes,
    minutesLearnedToday: Math.round((await todayActivity(userId)).secondsLearned / 60),
    isFirstActivityToday,
  };
}

async function todayActivity(userId: string) {
  return (
    (await prisma.dailyActivity.findUnique({
      where: { userId_date: { userId, date: utcDay() } },
    })) ?? { secondsLearned: 0, goalMet: false, xpEarned: 0, activitiesCount: 0 }
  );
}

export async function getTodayActivity(userId: string) {
  return todayActivity(userId);
}
