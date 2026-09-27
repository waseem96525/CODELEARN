import type { Metadata } from "next";
import { Award, Lock } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getAchievementStats, type AchievementStats } from "@/lib/queries";
import { fromJson } from "@/lib/json";
import type { Criteria } from "@/lib/achievements";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app-shell";
import { AchievementCheckButton } from "@/components/achievement-check-button";
import { timeAgo, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Every badge in CodeLearn and how close you are to unlocking it.",
  robots: { index: false, follow: false },
};

/** Maps an achievement's declarative criteria onto a current value and a target. */
function progressFor(
  criteria: Criteria,
  stats: AchievementStats,
): { value: number; target: number; label: string } {
  switch (criteria.type) {
    case "lessonsCompleted":
      return { value: stats.lessonsCompleted, target: criteria.count, label: "lessons complete" };
    case "lessonsInTrack":
      return {
        value: stats.lessonsByTrack[criteria.track] ?? 0,
        target: criteria.count,
        label: `${criteria.track.toLowerCase()} lessons`,
      };
    case "courseCompleted":
      return {
        value: stats.coursesCompletedByTrack[criteria.track] ?? 0,
        target: 1,
        label: `${criteria.track.toLowerCase()} course`,
      };
    case "challengesCompleted":
      return {
        value: stats.challengesCompleted,
        target: criteria.count,
        label: "challenges passed",
      };
    case "challengesInTrack":
      return {
        value: stats.challengesByTrack[criteria.track] ?? 0,
        target: criteria.count,
        label: `${criteria.track.toLowerCase()} challenges`,
      };
    case "projectsCompleted":
      return { value: stats.projectsCompleted, target: criteria.count, label: "projects shipped" };
    case "streak":
      return { value: stats.streak, target: criteria.days, label: "day streak" };
    case "perfectQuizzes":
      return { value: stats.perfectQuizzes, target: criteria.count, label: "perfect answers" };
    case "xp":
      return { value: stats.xp, target: criteria.amount, label: "total XP" };
    case "bookmarks":
      return { value: stats.bookmarks, target: criteria.count, label: "bookmarks" };
    case "notes":
      return { value: stats.notes, target: criteria.count, label: "notes written" };
    case "distinctActivities":
      return { value: stats.activeDays, target: criteria.days, label: "active days" };
    default:
      return { value: 0, target: 1, label: "" };
  }
}

export default async function AchievementsPage() {
  const user = await requireUser("/achievements");

  const [achievements, earned, stats] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { name: "asc" } }),
    prisma.userAchievement.findMany({
      where: { userId: user.id },
      select: { achievementId: true, earnedAt: true },
    }),
    getAchievementStats(user.id),
  ]);

  const earnedAt = new Map(earned.map((row) => [row.achievementId, row.earnedAt]));
  const unlocked = achievements.filter((a) => earnedAt.has(a.id));
  const locked = achievements.filter((a) => !earnedAt.has(a.id));

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader
        title="Achievements"
        description="Badges unlock automatically as you hit their conditions."
      >
        <AchievementCheckButton />
      </PageHeader>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-primary" />
            <p className="text-sm font-semibold">Collection</p>
            <Badge tone="neutral">
              {unlocked.length}/{achievements.length}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatXpEarned(unlocked)} XP earned from badges
          </p>
        </div>
        <Progress
          value={achievements.length === 0 ? 0 : (unlocked.length / achievements.length) * 100}
          label="Badge collection progress"
          className="mt-3"
        />
      </Card>

      {/* ----------------------------- Unlocked ----------------------------- */}
      {unlocked.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Unlocked</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {unlocked.map((achievement) => (
              <li key={achievement.id}>
                <Card className="h-full border-success/30 bg-success-soft/30 p-5">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-xl shadow-card"
                    >
                      {achievement.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold">{achievement.name}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-success">
                        +{achievement.xpReward} XP &middot; earned{" "}
                        {timeAgo(earnedAt.get(achievement.id)!)}
                      </p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ------------------------------ Locked ------------------------------ */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Lock className="size-4 text-muted-foreground" />
          Still to unlock
        </h2>
        {locked.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 border-dashed px-6 py-12 text-center">
            <Award className="size-6 text-success" />
            <p className="font-semibold">Every badge is yours</p>
            <p className="text-sm text-muted-foreground">
              There is nothing left to collect. Impressive.
            </p>
          </Card>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((achievement) => {
              const criteria = fromJson<Criteria | null>(achievement.criteria, null);
              const progress = criteria
                ? progressFor(criteria, stats)
                : { value: 0, target: 1, label: "" };
              const percent =
                progress.target === 0
                  ? 0
                  : Math.min(100, (progress.value / progress.target) * 100);

              return (
                <li key={achievement.id}>
                  <Card className="h-full p-5 opacity-90">
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xl grayscale"
                      >
                        {achievement.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{achievement.name}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <Progress
                        value={percent}
                        label={`${achievement.name} progress`}
                        className={cn(percent >= 100 && "[&>div]:bg-success")}
                      />
                      <p className="text-xs text-muted-foreground">
                        {progress.value} / {progress.target} {progress.label} &middot;{" "}
                        {achievement.xpReward} XP
                      </p>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Progress is recalculated whenever you complete a lesson, challenge or project. If a
        badge looks out of date, re-check with the button above.
      </p>
    </div>
  );
}

function formatXpEarned(achievements: { xpReward: number }[]): string {
  return achievements.reduce((sum, a) => sum + a.xpReward, 0).toLocaleString("en-US");
}
