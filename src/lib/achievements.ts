import "server-only";
import { prisma } from "@/lib/prisma";
import { fromJson } from "@/lib/json";
import { utcDay } from "@/lib/gamification";

/**
 * Achievements are declarative: a row in `Achievement.criteria` describes the
 * condition, and `checkAchievements` re-evaluates every unearned one after a
 * meaningful event. Adding a badge is a seed change, not a code change.
 */
export type Criteria =
  | { type: "lessonsCompleted"; count: number }
  | { type: "lessonsInTrack"; track: string; count: number }
  | { type: "courseCompleted"; track: string }
  | { type: "challengesCompleted"; count: number }
  | { type: "challengesInTrack"; track: string; count: number }
  | { type: "projectsCompleted"; count: number }
  | { type: "streak"; days: number }
  | { type: "perfectQuizzes"; count: number }
  | { type: "xp"; amount: number }
  | { type: "bookmarks"; count: number }
  | { type: "notes"; count: number }
  | { type: "distinctActivities"; days: number };

export interface UnlockedAchievement {
  key: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}

/** One day of learning history as a Set of YYYY-MM-DD strings. */
async function activeDaySet(userId: string, limitDays: number): Promise<Set<string>> {
  const rows = await prisma.dailyActivity.findMany({
    where: { userId, activitiesCount: { gt: 0 } },
    orderBy: { date: "desc" },
    take: 400,
    select: { date: true },
  });
  void limitDays;
  return new Set(rows.map((r) => r.date));
}

/** Longest run of consecutive active days ending today or yesterday. */
function longestRun(days: Set<string>): number {
  if (days.size === 0) return 0;
  const sorted = [...days].sort();
  const set = new Set(sorted);
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = Date.parse(`${sorted[i - 1]}T00:00:00Z`);
    const cur = Date.parse(`${sorted[i]}T00:00:00Z`);
    if (cur - prev === 86_400_000) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }
  void set;
  return best;
}

async function courseCompleteMap(userId: string): Promise<Map<string, number>> {
  const [courses, progress] = await Promise.all([
    prisma.course.findMany({ select: { id: true, track: true, _count: { select: { lessons: true } } } }),
    prisma.userProgress.findMany({
      where: { userId, completed: true },
      select: { courseId: true },
    }),
  ]);
  const done = new Set(progress.map((p) => p.courseId));
  const out = new Map<string, number>();
  for (const course of courses) {
    if (course._count.lessons === 0) continue;
    out.set(course.track, (out.get(course.track) ?? 0) + (done.has(course.id) ? 1 : 0));
  }
  return out;
}

async function lessonsPerTrack(userId: string): Promise<Map<string, number>> {
  const rows = await prisma.userProgress.findMany({
    where: { userId, completed: true },
    select: { lesson: { select: { course: { select: { track: true } } } } },
  });
  const out = new Map<string, number>();
  for (const r of rows) {
    const track = r.lesson.course.track;
    out.set(track, (out.get(track) ?? 0) + 1);
  }
  return out;
}

async function passes(userId: string, c: Criteria): Promise<boolean> {
  switch (c.type) {
    case "lessonsCompleted":
      return (
        (await prisma.userProgress.count({ where: { userId, completed: true } })) >= c.count
      );

    case "lessonsInTrack": {
      const map = await lessonsPerTrack(userId);
      return (map.get(c.track) ?? 0) >= c.count;
    }

    case "courseCompleted": {
      const map = await courseCompleteMap(userId);
      return (map.get(c.track) ?? 0) >= 1;
    }

    case "challengesCompleted":
      return (
        (
          await prisma.challengeSubmission.groupBy({
            by: ["challengeId"],
            where: { userId, passed: true },
            _count: { challengeId: true },
          })
        ).length >= c.count
      );

    case "challengesInTrack": {
      const rows = await prisma.challengeSubmission.findMany({
        where: { userId, passed: true, challenge: { track: c.track } },
        select: { challengeId: true },
        distinct: ["challengeId"],
      });
      return rows.length >= c.count;
    }

    case "projectsCompleted":
      return (
        (await prisma.userProject.count({ where: { userId, completed: true } })) >= c.count
      );

    case "streak": {
      const days = await activeDaySet(userId, 0);
      return longestRun(days) >= c.days;
    }

    case "perfectQuizzes":
      return (
        (
          await prisma.quizAttempt.findMany({
            where: { userId, correct: true },
            select: { questionId: true },
            distinct: ["questionId"],
          })
        ).length >= c.count
      );

    case "xp": {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { xp: true } });
      return (user?.xp ?? 0) >= c.amount;
    }

    case "bookmarks":
      return (await prisma.bookmark.count({ where: { userId } })) >= c.count;

    case "notes":
      return (await prisma.note.count({ where: { userId } })) >= c.count;

    case "distinctActivities": {
      const days = await activeDaySet(userId, 0);
      return days.size >= c.days;
    }

    default:
      return false;
  }
}

/**
 * Evaluates all not-yet-earned achievements. Returns the ones earned by this
 * call so the caller can celebrate them (XP + notification).
 * Safe to call often: earned rows are skipped and uniqueness is enforced by
 * the `@@unique([userId, achievementId])` constraint.
 */
export async function checkAchievements(userId: string): Promise<UnlockedAchievement[]> {
  const [user, all, owned] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
  ]);
  if (!user) return [];

  const ownedIds = new Set(owned.map((o) => o.achievementId));
  const candidates = all.filter((a) => !ownedIds.has(a.id));

  const unlocked: UnlockedAchievement[] = [];
  for (const a of candidates) {
    const criteria = fromJson<Criteria | null>(a.criteria, null);
    if (!criteria) continue;
    if (await passes(userId, criteria)) {
      unlocked.push({
        key: a.key,
        name: a.name,
        description: a.description,
        icon: a.icon,
        xpReward: a.xpReward,
      });
    }
  }
  return unlocked;
}

export async function todayString(): Promise<string> {
  return utcDay();
}
