import "server-only";
import { prisma } from "@/lib/prisma";

const PREFERENCE_KEY: Record<string, keyof NotificationPrefs> = {
  LESSON: "notifyLessons",
  STREAK: "notifyStreaks",
  BADGE: "notifyBadges",
  PROJECT: "notifyProjects",
  WELCOME: "notifyLessons",
  CHALLENGE: "notifyProjects",
};

export interface NotificationPrefs {
  notifyLessons: boolean;
  notifyStreaks: boolean;
  notifyBadges: boolean;
  notifyProjects: boolean;
  notifyMarketing: boolean;
}

/**
 * Creates a notification unless the user muted that category in settings.
 * `type` maps to a preference column so notification preferences actually
 * do something instead of being decorative.
 */
export async function notify(
  userId: string,
  type: string,
  title: string,
  body: string,
  href?: string,
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      notifyLessons: true,
      notifyStreaks: true,
      notifyBadges: true,
      notifyProjects: true,
      notifyMarketing: true,
    },
  });
  if (!user) return;

  const prefKey = PREFERENCE_KEY[type];
  if (prefKey && !user[prefKey]) return;

  await prisma.notification.create({
    data: { userId, type, title, body, href: href ?? null },
  });
}
