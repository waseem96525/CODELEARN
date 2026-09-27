"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { settingsSchema, profileSchema, firstError } from "@/lib/auth/validation";
import { checkAchievements } from "@/lib/achievements";
import { recordActivity, getLevelInfo } from "@/lib/gamification";

export async function updateSettings(input: {
  name: string;
  dailyGoalMinutes: number;
  editorTheme: "light" | "dark" | "system";
  notifyLessons: boolean;
  notifyStreaks: boolean;
  notifyBadges: boolean;
  notifyProjects: boolean;
  notifyMarketing: boolean;
  reduceMotion: boolean;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  // id comes from the session, never from the form.
  await prisma.user.update({
    where: { id: user.id },
    data: { ...parsed.data },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { ok: true, success: "Settings saved." };
}

export async function updateProfile(input: {
  name: string;
  bio?: string;
  dailyGoalMinutes: number;
  editorTheme: "light" | "dark" | "system";
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio ?? null,
      dailyGoalMinutes: parsed.data.dailyGoalMinutes,
      editorTheme: parsed.data.editorTheme,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: true, success: "Profile updated." };
}

/** Fires when a user marks notifications read from the bell menu. */
export async function markNotificationsRead() {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function markNotificationRead(id: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  // userId filter keeps one user from touching another's notification.
  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { readAt: new Date() },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteNotification(id: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  await prisma.notification.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Claims the daily-login bonus exactly once per day. */
export async function claimDailyBonus() {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const outcome = await recordActivity(user.id, {
    reason: "DAILY_LOGIN",
    amount: 0,
  });

  return {
    ok: true,
    alreadyClaimed: !outcome.isFirstActivityToday,
    totalXp: outcome.totalXp,
    level: outcome.level,
    levelName: getLevelInfo(outcome.totalXp).name,
  };
}

export async function refreshAchievements() {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  const unlocked = await checkAchievements(user.id);
  revalidatePath("/achievements");
  return { ok: true, unlocked: unlocked.map((u) => u.key) };
}
